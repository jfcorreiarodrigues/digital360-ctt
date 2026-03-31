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
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(toSession));
  } catch (err) {
    console.error('GET /sessions error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST create session
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
    }
    const row = toDbRow(req.body);
    const { data, error } = await supabase
      .from('sessions')
      .insert({ status: 'draft', products: {}, selected_products: [], ...row })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(toSession(data));
  } catch (err) {
    console.error('POST /sessions error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET single session
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Sessão não encontrada.' });
    res.json(toSession(data));
  } catch (err) {
    console.error('GET /sessions/:id error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT update session
router.put('/:id', async (req, res) => {
  try {
    const row = toDbRow(req.body);
    const { data, error } = await supabase
      .from('sessions')
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(404).json({ error: 'Sessão não encontrada.' });
    res.json(toSession(data));
  } catch (err) {
    console.error('PUT /sessions/:id error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// DELETE session
router.delete('/:id', async (req, res) => {
  try {
    const { error, count } = await supabase
      .from('sessions')
      .delete({ count: 'exact' })
      .eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    if (count === 0) return res.status(404).json({ error: 'Sessão não encontrada.' });
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /sessions/:id error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET product data
router.get('/:id/products/:productId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('products')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Sessão não encontrada.' });
    res.json(data.products?.[req.params.productId] || {});
  } catch (err) {
    console.error('GET /sessions/:id/products/:productId error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT update product data
router.put('/:id/products/:productId', async (req, res) => {
  try {
    const { data: session, error: fetchErr } = await supabase
      .from('sessions')
      .select('products')
      .eq('id', req.params.id)
      .single();
    if (fetchErr) return res.status(404).json({ error: 'Sessão não encontrada.' });

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
  } catch (err) {
    console.error('PUT /sessions/:id/products/:productId error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PATCH product status
router.patch('/:id/products/:productId/status', async (req, res) => {
  try {
    const { status, completedBy } = req.body;
    if (!status) return res.status(400).json({ error: 'O campo "status" é obrigatório.' });

    const { data: session, error: fetchErr } = await supabase
      .from('sessions')
      .select('products')
      .eq('id', req.params.id)
      .single();
    if (fetchErr) return res.status(404).json({ error: 'Sessão não encontrada.' });

    const product = { ...(session.products?.[req.params.productId] || {}) };
    product.status = status;
    if (status === 'submitted') {
      product.completedAt = new Date().toISOString();
      product.completedBy = completedBy || '';
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
  } catch (err) {
    console.error('PATCH /sessions/:id/products/:productId/status error:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default router;
