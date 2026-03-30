import { updateProductStatus } from '../../../../lib/redis.js'

export default async function handler(req, res) {
  const { id, productId } = req.query

  if (req.method === 'PATCH') {
    const { status, completedBy } = req.body
    const product = await updateProductStatus(id, productId, status, completedBy)
    if (!product) return res.status(404).json({ error: 'Session not found' })
    return res.json(product)
  }

  res.setHeader('Allow', ['PATCH'])
  return res.status(405).json({ error: 'Method not allowed' })
}
