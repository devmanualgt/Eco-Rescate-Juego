import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas (ejemplo)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;
