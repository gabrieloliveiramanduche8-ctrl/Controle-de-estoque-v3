# CONTROLE DE CORTES E FARDOS V3

Projeto pronto para publicar no Render como **Web Service**.

## Configuração no Render

- **Environment:** Node
- **Root Directory:** deixe vazio
- **Build Command:** `npm install`
- **Start Command:** `npm start`

O servidor usa automaticamente a variável `PORT` fornecida pelo Render.

## Importante

A versão atual usa `localStorage` no navegador para guardar os dados. Isso significa que os dados ficam salvos no dispositivo/navegador usado e não são compartilhados automaticamente entre celulares ou computadores. Para banco de dados compartilhado será necessário adicionar um backend/banco de dados.
