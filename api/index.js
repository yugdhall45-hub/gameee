import express from 'express';
import cors from 'cors';
import apiRouter from '../backend/src/routes/api.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mount API router
app.use('/api', apiRouter);

// Fallback health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusConnect API Serverless on Vercel',
    timestamp: new Date().toISOString()
  });
});

export default app;
