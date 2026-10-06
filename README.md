# Controle de Cortes e Fardos V5

Projeto pronto para Render como Web Service.

## Render
- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: vazio

## Recursos V5
- Estoque por tamanho (38, 40, 42, 44, 46, 48)
- Bloqueio de saída acima do estoque do tamanho
- Fardos individuais com quantidade própria
- Status de fardos: cheio, parcial e vazio
- Pedidos agrupados
- Histórico com estorno
- Backup e restauração em JSON
- Controle de entradas e saídas

Os dados desta versão são salvos no navegador (localStorage). O Render hospeda o site, mas não transforma o localStorage em banco compartilhado.
