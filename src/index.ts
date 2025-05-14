import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { repoRoutes } from './routes/repoRoutes';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middlewares
app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rotas
app.use('/api', repoRoutes);

// Rota de status para verificar se o servidor está funcionando
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Servidor está funcionando' });
});

// Tratamento de erro para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`CORS habilitado para origem: ${CORS_ORIGIN}`);
}); 