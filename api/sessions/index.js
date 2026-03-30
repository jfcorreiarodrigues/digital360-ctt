import { getSessions, createSession } from '../lib/redis.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const sessions = await getSessions()
    return res.json(sessions)
  }

  if (req.method === 'POST') {
    const session = await createSession(req.body)
    return res.status(201).json(session)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}
