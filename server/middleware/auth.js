// Middleware de autenticação por API key.
// O cliente envia o header: x-api-key: <valor de API_SECRET>
export function requireApiKey(req, res, next) {
  const secret = process.env.API_SECRET;
  if (!secret) {
    console.error('API_SECRET não está definido. Acesso bloqueado por segurança.');
    return res.status(503).json({ error: 'Servidor mal configurado.' });
  }

  const key = req.headers['x-api-key'];
  if (!key || key !== secret) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  next();
}
