import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/sessions.json');

const router = express.Router();

function readSessions() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeSessions(sessions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
}

// GET all sessions
router.get('/', (req, res) => {
  const sessions = readSessions();
  res.json(sessions);
});

// POST create session
router.post('/', (req, res) => {
  const sessions = readSessions();
  const now = new Date().toISOString();
  const newSession = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    products: {},
    ...req.body
  };
  sessions.push(newSession);
  writeSessions(sessions);
  res.status(201).json(newSession);
});

// GET single session
router.get('/:id', (req, res) => {
  const sessions = readSessions();
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// PUT update session
router.put('/:id', (req, res) => {
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Session not found' });
  sessions[idx] = { ...sessions[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeSessions(sessions);
  res.json(sessions[idx]);
});

// DELETE session
router.delete('/:id', (req, res) => {
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Session not found' });
  sessions.splice(idx, 1);
  writeSessions(sessions);
  res.status(204).send();
});

// GET product data
router.get('/:id/products/:productId', (req, res) => {
  const sessions = readSessions();
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const product = session.products?.[req.params.productId] || {};
  res.json(product);
});

// PUT update product data
router.put('/:id/products/:productId', (req, res) => {
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Session not found' });
  if (!sessions[idx].products) sessions[idx].products = {};
  sessions[idx].products[req.params.productId] = {
    ...sessions[idx].products[req.params.productId],
    ...req.body,
    productId: req.params.productId
  };
  sessions[idx].updatedAt = new Date().toISOString();
  writeSessions(sessions);
  res.json(sessions[idx].products[req.params.productId]);
});

// PATCH product status
router.patch('/:id/products/:productId/status', (req, res) => {
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Session not found' });
  if (!sessions[idx].products) sessions[idx].products = {};
  if (!sessions[idx].products[req.params.productId]) sessions[idx].products[req.params.productId] = {};
  sessions[idx].products[req.params.productId].status = req.body.status;
  if (req.body.status === 'submitted') {
    sessions[idx].products[req.params.productId].completedAt = new Date().toISOString();
    sessions[idx].products[req.params.productId].completedBy = req.body.completedBy || '';
  }
  sessions[idx].updatedAt = new Date().toISOString();
  writeSessions(sessions);
  res.json(sessions[idx].products[req.params.productId]);
});

export default router;
