import { getSession } from '../../lib/redis.js'

function generateHTML(session) {
  const products = Object.entries(session.products || {})
  const dateStr = new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })

  const varColor = (v) => {
    if (!v) return '#6B7280'
    if (String(v).startsWith('+')) return '#10B981'
    if (String(v).startsWith('-')) return '#EF4444'
    return '#6B7280'
  }

  const productSections = products.map(([pid, pd]) => {
    const name = pid.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const ns = pd.northStar || {}
    const rev = pd.revenue || {}
    const traf = pd.traffic || {}

    return `
    <div style="page-break-before:always;margin-top:32px">
      <div style="background:#DF0024;color:white;padding:20px 32px">
        <div style="font-size:24px;font-weight:700">${name}</div>
      </div>
      <div style="padding:24px 32px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        <div style="background:#F9FAFB;border-left:4px solid #DF0024;padding:16px">
          <div style="font-size:11px;color:#6B7280">${ns.metric || 'North Star'}</div>
          <div style="font-size:28px;font-weight:700">${ns.currentValue || '—'}</div>
          <div style="color:${varColor(ns.variation)};font-weight:600">${ns.variation || ''}</div>
        </div>
        <div style="background:#F9FAFB;border-left:4px solid #DF0024;padding:16px">
          <div style="font-size:11px;color:#6B7280">Receita Total</div>
          <div style="font-size:28px;font-weight:700">${rev.total || '—'}</div>
          <div style="color:${varColor(rev.totalVariation)};font-weight:600">${rev.totalVariation || ''}</div>
        </div>
        <div style="background:#F9FAFB;border-left:4px solid #DF0024;padding:16px">
          <div style="font-size:11px;color:#6B7280">Sessões Totais</div>
          <div style="font-size:28px;font-weight:700">${traf.totalSessions || '—'}</div>
          <div style="color:${varColor(traf.totalSessionsVariation)};font-weight:600">${traf.totalSessionsVariation || ''}</div>
        </div>
      </div>
    </div>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<title>${session.name} — Digital 360 CTT</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #111827; background: #F9FAFB; }
</style>
</head>
<body>
  <div style="background:#DF0024;color:white;padding:48px 64px">
    <div style="font-size:42px;font-weight:700">${session.name}</div>
    <div style="font-size:20px;opacity:0.8;margin-top:12px">${session.period || ''}</div>
    <div style="font-size:13px;opacity:0.6;margin-top:24px">Gerado em ${dateStr}</div>
  </div>
  ${productSections}
  <div style="background:#111827;color:white;padding:32px 64px;text-align:center">
    <div style="font-size:24px;font-weight:700;color:#DF0024">CTT</div>
  </div>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const session = await getSession(id)
  if (!session) return res.status(404).json({ error: 'Session not found' })

  try {
    const html = generateHTML(session)
    const filename = `Digital360_${session.period || 'dashboard'}.html`
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.send(html)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
