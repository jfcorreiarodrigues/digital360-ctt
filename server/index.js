import express from 'express';
import cors from 'cors';
import sessionsRouter from './routes/sessions.js';
import exportsRouter from './routes/exports.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
