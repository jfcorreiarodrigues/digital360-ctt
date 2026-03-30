import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const SESSIONS_KEY = 'digital360:sessions'

export async function getSessions() {
  const sessions = await redis.get(SESSIONS_KEY)
  return sessions || []
}

export async function saveSessions(sessions) {
  await redis.set(SESSIONS_KEY, sessions)
}

export async function getSession(id) {
  const sessions = await getSessions()
  return sessions.find(s => s.id === id)
}

export async function createSession(data) {
  const sessions = await getSessions()
  const now = new Date().toISOString()
  const newSession = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    products: {},
    ...data
  }
  sessions.push(newSession)
  await saveSessions(sessions)
  return newSession
}

export async function updateSession(id, data) {
  const sessions = await getSessions()
  const idx = sessions.findIndex(s => s.id === id)
  if (idx === -1) return null
  sessions[idx] = { ...sessions[idx], ...data, updatedAt: new Date().toISOString() }
  await saveSessions(sessions)
  return sessions[idx]
}

export async function deleteSession(id) {
  const sessions = await getSessions()
  const idx = sessions.findIndex(s => s.id === id)
  if (idx === -1) return false
  sessions.splice(idx, 1)
  await saveSessions(sessions)
  return true
}

export async function updateProductData(sessionId, productId, data) {
  const sessions = await getSessions()
  const idx = sessions.findIndex(s => s.id === sessionId)
  if (idx === -1) return null
  if (!sessions[idx].products) sessions[idx].products = {}
  sessions[idx].products[productId] = {
    ...sessions[idx].products[productId],
    ...data,
    productId
  }
  sessions[idx].updatedAt = new Date().toISOString()
  await saveSessions(sessions)
  return sessions[idx].products[productId]
}

export async function updateProductStatus(sessionId, productId, status, completedBy = '') {
  const sessions = await getSessions()
  const idx = sessions.findIndex(s => s.id === sessionId)
  if (idx === -1) return null
  if (!sessions[idx].products) sessions[idx].products = {}
  if (!sessions[idx].products[productId]) sessions[idx].products[productId] = {}
  sessions[idx].products[productId].status = status
  if (status === 'submitted') {
    sessions[idx].products[productId].completedAt = new Date().toISOString()
    sessions[idx].products[productId].completedBy = completedBy
  }
  sessions[idx].updatedAt = new Date().toISOString()
  await saveSessions(sessions)
  return sessions[idx].products[productId]
}
