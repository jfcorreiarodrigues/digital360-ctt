import express from 'express';
import { supabase } from '../lib/supabase.js';
import { generatePPTX } from '../exporters/pptxExporter.js';
import { generatePDF } from '../exporters/pdfExporter.js';
import { generateHTML } from '../exporters/htmlExporter.js';

const router = express.Router();

async function getSession(id) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

// POST export PPTX
router.post('/pptx/:id', async (req, res) => {
  try {
    const session = await getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const buffer = await generatePPTX(session);
    const filename = `Digital360_${session.period || session.name.replace(/[^a-z0-9]/gi, '_')}.pptx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('PPTX export error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST export PDF
router.post('/pdf/:id', async (req, res) => {
  try {
    const session = await getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const buffer = await generatePDF(session);
    const filename = `Digital360_${session.period || 'export'}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET export HTML
router.get('/html/:id', async (req, res) => {
  try {
    const session = await getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const html = await generateHTML(session);
    const filename = `Digital360_${session.period || 'dashboard'}.html`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(html);
  } catch (err) {
    console.error('HTML export error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
