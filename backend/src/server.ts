import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

const app = express();

app.use(helmet()); // Blindagem básica de cabeçalhos HTTP
app.use(cors());
app.use(express.json());

// Limite global de requisições para evitar DDoS/Brute-force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // limite de 200 requisições por IP a cada 15 min
  message: { error: 'Muitas requisições deste IP, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default app;
