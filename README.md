# CONTROLE DE CORTES E FARDOS V6

Projeto pronto para Render Web Service, sem senha/login.

## Recursos
- Estoque por tamanho 38/40/42/44/46/48
- Grade x pares com cálculo automático
- Peças por fardo editável
- Saída bloqueada quando falta estoque por tamanho
- Pedidos e conferência
- Fardos rastreáveis por corte/tamanho
- Estorno de movimentações
- Alertas visuais de estoque
- Relatórios e exportação CSV
- PostgreSQL compartilhado quando `DATABASE_URL` estiver configurada

## Render
Se usar o `render.yaml`, o Render pode criar o Web Service e o PostgreSQL juntos.
Se configurar manualmente:
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variable: `DATABASE_URL` = connection string do PostgreSQL

Sem `DATABASE_URL`, o sistema usa um armazenamento temporário em memória; para produção, configure o PostgreSQL.
