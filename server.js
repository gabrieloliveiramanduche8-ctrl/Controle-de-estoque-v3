const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 10000;
const ROOT = __dirname;
const fallback = { cortes: [], movimentos: [] };
let pool = null;
let dbReady = false;

async function initDb() {
  if (!process.env.DATABASE_URL) return;
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
  await pool.query(`CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  const r = await pool.query('SELECT data FROM app_state WHERE id=1');
  if (!r.rowCount) await pool.query('INSERT INTO app_state (id,data) VALUES (1,$1)', [fallback]);
  dbReady = true;
}
async function getDb() {
  if (!dbReady) return fallback;
  const r = await pool.query('SELECT data FROM app_state WHERE id=1');
  return r.rows[0]?.data || fallback;
}
async function putDb(data) {
  if (!dbReady) { fallback.cortes = data.cortes || []; fallback.movimentos = data.movimentos || []; return; }
  await pool.query('UPDATE app_state SET data=$1, updated_at=NOW() WHERE id=1', [data]);
}
function send(res, code, body, type='application/json; charset=utf-8') {
  res.writeHead(code, {'Content-Type': type, 'Cache-Control':'no-store'});
  if (Buffer.isBuffer(body)) return res.end(body);
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
function readBody(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>{b+=c;if(b.length>10_000_000)reject(Error('payload'));});req.on('end',()=>{try{resolve(JSON.parse(b||'{}'))}catch(e){reject(e)}});req.on('error',reject)})}

const server = http.createServer(async (req,res)=>{
  try {
    const u = new URL(req.url, `http://${req.headers.host||'localhost'}`);
    if (u.pathname === '/api/db' && req.method === 'GET') return send(res,200,await getDb());
    if (u.pathname === '/api/db' && req.method === 'PUT') {
      const data=await readBody(req);
      if(!Array.isArray(data.cortes)||!Array.isArray(data.movimentos)) return send(res,400,{error:'Dados inválidos'});
      await putDb(data); return send(res,200,{ok:true});
    }
    let requestPath = decodeURIComponent(u.pathname); if(requestPath==='/'||requestPath==='')requestPath='/index.html';
    const filePath=path.resolve(ROOT,'.'+requestPath);
    if(!filePath.startsWith(path.resolve(ROOT))) return send(res,403,'Acesso negado','text/plain; charset=utf-8');
    fs.readFile(filePath,(err,data)=>{if(err)return send(res,404,'Página não encontrada','text/plain; charset=utf-8');const ext=path.extname(filePath).toLowerCase();const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};send(res,200,data,types[ext]||'application/octet-stream')});
  } catch(e) { console.error(e); send(res,500,{error:'Erro interno'}); }
});

initDb().then(()=>server.listen(PORT,'0.0.0.0',()=>console.log(`V6 rodando na porta ${PORT}; banco=${dbReady?'PostgreSQL':'fallback local'}`))).catch(e=>{console.error('Falha ao iniciar banco:',e);server.listen(PORT,'0.0.0.0',()=>console.log(`V6 rodando na porta ${PORT}; banco indisponível`));});
