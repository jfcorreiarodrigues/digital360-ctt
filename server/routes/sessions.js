import express from 'express';
import { supabase, toSession } from '../lib/supabase.js';

const router = express.Router();

// Map camelCase request body to snake_case DB columns
function toDbRow(body) {
  const { sessionDate, selectedProducts, createdAt, updatedAt, ...rest } = body;
  const row = { ...rest };
  if (sessionDate !== undefined) row.session_date = sessionDate;
  if (selectedProducts !== undefined) row.selected_products = selectedProducts;
  return row;
}

// GET all sessions
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(toSession));
});

// POST create session
router.post('/', async (req, res) => {
  const row = toDbRow(req.body);
  const { data, error } = await supabase
    .from('sessions')
    .insert({ status: 'draft', products: {}, selected_products: [], ...row })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(toSession(data));
});

// GET single session
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Session not found' });
  res.json(toSession(data));
});

// PUT update session
router.put('/:id', async (req, res) => {
  const row = toDbRow(req.body);
  const { data, error } = await supabase
    .from('sessions')
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(404).json({ error: 'Session not found' });
  res.json(toSession(data));
});

// DELETE session
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('sessions').delete().eq('id', req.params.id);
  if (error) return res.status(404).json({ error: 'Session not found' });
  res.status(204).send();
});

// GET product data
router.get('/:id/products/:productId', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('products')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Session not found' });
  res.json(data.products?.[req.params.productId] || {});
});

// PUT update product data
router.put('/:id/products/:productId', async (req, res) => {
  const { data: session, error: fetchErr } = await supabase
    .from('sessions')
    .select('products')
    .eq('id', req.params.id)
    .single();
  if (fetchErr) return res.status(404).json({ error: 'Session not found' });

  const updatedProducts = {
    ...session.products,
    [req.params.productId]: {
      ...session.products?.[req.params.productId],
      ...req.body,
      productId: req.params.productId
    }
  };

  const { data, error } = await supabase
    .from('sessions')
    .update({ products: updatedProducts, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select('products')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.products[req.params.productId]);
});

// PATCH product status
router.patch('/:id/products/:productId/status', async (req, res) => {
  const { data: session, error: fetchErr } = await supabase
    .from('sessions')
    .select('products')
    .eq('id', req.params.id)
    .single();
  if (fetchErr) return res.status(404).json({ error: 'Session not found' });

  const product = { ...(session.products?.[req.params.productId] || {}) };
  product.status = req.body.status;
  if (req.body.status === 'submitted') {
    product.completedAt = new Date().toISOString();
    product.completedBy = req.body.completedBy || '';
  }

  const updatedProducts = { ...session.products, [req.params.productId]: product };

  const { data, error } = await supabase
    .from('sessions')
    .update({ products: updatedProducts, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select('products')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.products[req.params.productId]);
});

export default router;
