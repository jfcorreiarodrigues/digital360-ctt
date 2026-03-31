import express from 'express';
import cors from 'cors';
import { requireApiKey } from './middleware/auth.js';
import sessionsRouter from './routes/sessions.js';
import exportsRouter from './routes/exports.js';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Proteger todos os endpoints com API key
app.use('/api', requireApiKey);

app.use('/api/sessions', sessionsRouter);
app.use('/api/export', exportsRouter);

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Only listen when run directly as a local server (not imported as a Vercel function)
if (process.env.LOCAL_SERVER === 'true') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`\n🚀 Digital 360 CTT Server running on http://localhost:${PORT}\n`);
  });
}

export default app;
