import { getSession, updateSession, deleteSession } from '../lib/redis.js'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const session = await getSession(id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    return res.json(session)
  }

  if (req.method === 'PUT') {
    const session = await updateSession(id, req.body)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    return res.json(session)
  }

  if (req.method === 'DELETE') {
    const deleted = await deleteSession(id)
    if (!deleted) return res.status(404).json({ error: 'Session not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed' })
}
