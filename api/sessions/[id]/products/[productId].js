import { getSession, updateProductData } from '../../../lib/redis.js'

export default async function handler(req, res) {
  const { id, productId } = req.query

  if (req.method === 'GET') {
    const session = await getSession(id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    const product = session.products?.[productId] || {}
    return res.json(product)
  }

  if (req.method === 'PUT') {
    const product = await updateProductData(id, productId, req.body)
    if (!product) return res.status(404).json({ error: 'Session not found' })
    return res.json(product)
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).json({ error: 'Method not allowed' })
}
