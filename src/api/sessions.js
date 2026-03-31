// Client-side session storage using localStorage for preview
// In production, this will be replaced by Vercel serverless functions with Redis

const STORAGE_KEY = 'digital360_sessions';

function getSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    console.log('[v0] getSessions - raw data:', data);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('[v0] getSessions error:', e);
    return [];
  }
}

function saveSessions(sessions) {
  try {
    console.log('[v0] saveSessions - saving:', sessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('[v0] saveSessions error:', e);
  }
}

export async function fetchAllSessions() {
  console.log('[v0] fetchAllSessions called');
  const sessions = getSessions();
  console.log('[v0] fetchAllSessions returning:', sessions);
  return sessions;
}

export async function fetchSessionById(id) {
  const sessions = getSessions();
  return sessions.find(s => s.id === id) || null;
}

export async function createNewSession(data) {
  console.log('[v0] createNewSession called with:', data);
  const sessions = getSessions();
  const newSession = {
    id: crypto.randomUUID(),
    ...data,
    products: data.products || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  console.log('[v0] createNewSession - new session:', newSession);
  sessions.push(newSession);
  saveSessions(sessions);
  console.log('[v0] createNewSession - session created successfully');
  return newSession;
}

export async function updateExistingSession(id, data) {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  sessions[index] = {
    ...sessions[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveSessions(sessions);
  return sessions[index];
}

export async function deleteExistingSession(id) {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  saveSessions(filtered);
  return true;
}

export async function saveProductDataToSession(sessionId, productId, productData) {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return null;
  
  if (!session.productData) session.productData = {};
  session.productData[productId] = productData;
  session.updatedAt = new Date().toISOString();
  
  saveSessions(sessions);
  return session;
}

export async function updateProductStatusInSession(sessionId, productId, status, completedBy = '') {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return null;
  
  if (!session.productStatus) session.productStatus = {};
  session.productStatus[productId] = { status, completedBy, updatedAt: new Date().toISOString() };
  session.updatedAt = new Date().toISOString();
  
  saveSessions(sessions);
  return session;
}
