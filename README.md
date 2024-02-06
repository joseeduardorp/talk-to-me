# Projeto de Cadastro de Heróis

Este projeto foi desenvolvido durante a terceira edição do evento Semana do Herói, apresentado pela [Alexia Kattah](https://github.com/alexiakattah). Neste projeto, implementamos um sistema de comunicação em tempo real, semelhante ao Google Meet, permitindo aos participantes trocar mensagens de texto, áudio e vídeo.

## Tecnologias Utilizadas

### Front-end

- **Next.js**
- **Tailwind CSS**
- **Typescript**

### Back-end

- **Node.js**
- **Express**
- **Socket.io**
- **Typescript**

## Funcionalidades

- Envio de mensagens de texto em tempo real.
- Comunicação de áudio e vídeo entre os participantes.
- Interface amigável e responsiva.

## Como Executar

1. Clone este repositório.
2. Instale as dependências do back-end e do front-end:
   ```
   cd backend
   npm install
   ```
   ```
   cd frontend
   npm install
   ```
3. Configure as variáveis de ambiente:

   - crie o arquivo `.env.local` na raiz da pasta frontend
   - adicione o seguinte conteúdo ao arquivo:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3333
   ```

4. Inicie o servidor back-end:
   ```
   cd backend
   npm run dev
   ```
5. Inicie o servidor front-end:
   ```
   cd frontend
   npm run dev
   ```
6. Acesse o aplicativo em seu navegador: `http://localhost:3000`
