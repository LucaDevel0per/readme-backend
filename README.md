# Backend do ReadmeMaker

Este é o backend para o aplicativo ReadmeMaker, responsável por processar as solicitações do frontend, 
interagir com a API do GitHub para obter dados dos repositórios e utilizar a API do Gemini para gerar 
READMEs profissionais.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Google Generative AI (Gemini)
- Axios

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
     ```
     PORT=3001
     CORS_ORIGIN=http://localhost:5173
     GEMINI_API_KEY=sua-chave-api-gemini-aqui
     ```
   - Substitua `sua-chave-api-gemini-aqui` pela sua chave de API do Gemini. 
     Você pode obter uma chave em https://ai.google.dev/

## Executando o Servidor

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para compilar e executar em produção:

```bash
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3001`.

## Endpoints

- `GET /status`: Verifica o status do servidor
- `POST /api/generate-readme`: Gera um README para um repositório GitHub
  - Corpo da requisição: 
    ```json
    {
      "repoUrl": "https://github.com/usuario/repositorio"
    }
    ```
  - Resposta:
    ```json
    {
      "success": true,
      "readme": "# Conteúdo do README gerado..."
    }
    ```

## Integração com Frontend

O backend foi projetado para se integrar com o frontend do ReadmeMaker. Certifique-se de que
o frontend esteja configurado para enviar solicitações para a URL correta do backend (por padrão, 
`http://localhost:3001`). 