function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function generateHTML(session, forPDF = false) {
  const products = Object.entries(session.products || {});
  const dateStr = new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });

  const productSections = products.map(([pid, pd]) => {
    const name = esc(pid.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    const ns = pd.northStar || {};
    const rev = pd.revenue || {};
    const traf = pd.traffic || {};
    const mkt = pd.marketing || {};
    const dev = pd.productDev || {};
    const fwd = pd.lookingForward || {};

    const varColor = (v) => {
      if (!v) return '#6B7280';
      if (String(v).startsWith('+')) return '#10B981';
      if (String(v).startsWith('-')) return '#EF4444';
      return '#6B7280';
    };

    const statusBadge = (s) => {
      const map = { draft: '#9CA3AF', submitted: '#10B981', approved: '#3B82F6' };
      return `<span style="background:${map[s] || '#9CA3AF'};color:white;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:600">${esc(s) || 'draft'}</span>`;
    };

    const revBreakdown = (rev.breakdown || []).filter(r => r.label).map(r => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(r.label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;font-weight:600">${esc(r.value) || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(r.share) || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;color:${varColor(r.variation)};font-weight:600">${esc(r.variation) || '—'}</td>
      </tr>`).join('');

    const campaigns = (mkt.campaigns || []).filter(c => c.name).map(c => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(c.name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(c.type)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(c.date)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(c.result)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6">${esc(c.status)}</td>
      </tr>`).join('');

    const features = (dev.features || []).filter(f => f.title).map(f => {
      const icon = f.status === 'completed' ? '✅' : f.status === 'wip' ? '🔄' : '⚠️';
      return `<li style="margin:6px 0">${icon} <strong>${esc(f.title)}</strong>${f.description ? ` — ${esc(f.description)}` : ''}</li>`;
    }).join('');

    const initiatives = (fwd.initiatives || []).filter(i => i.title).map(init => {
      const icon = init.priority === 'high' ? '🔴' : init.priority === 'medium' ? '🟡' : '🟢';
      return `<li style="margin:6px 0">${icon} <strong>${esc(init.title)}</strong>${init.description ? ` — ${esc(init.description)}` : ''}</li>`;
    }).join('');

    return `
    <div class="product-section" style="page-break-before:always">
      <div style="background:#DF0024;color:white;padding:20px 32px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:1px">Produto</div>
          <div style="font-size:24px;font-weight:700">${name}</div>
        </div>
        <div style="text-align:right">${statusBadge(pd.status)}</div>
      </div>

      <div style="padding:24px 32px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        <div style="background:#F9FAFB;border-left:4px solid #DF0024;padding:16px;border-radius:4px">
          <div style="font-size:11px;color:#6B7280;margin-bottom:4px">${esc(ns.metric) || 'North Star'}</div>
          <div style="font-size:28px;font-weight:700;color:#111827">${esc(ns.currentValue) || '—'}</div>
          <div style="font-size:14px;font-weight:600;color:${varColor(ns.variation)}">${esc(ns.variation)}</div>
          <div style="font-size:10px;color:#9CA3AF">${esc(ns.periodLabel)}</div>
        </div>
        <div style="background:#F9FAFB;border-left:4px solid #DF0024;padding:16px;border-radius:4px">
          <div style="font-size:11px;color:#6B7280;margin-bottom:4px">Receita Total</div>
          <div style="font-size:28px;font-weight:700;color:#111827">${esc(rev.total) || '—'}</div>
          <div style="font-size:14px;font-weight:600;color:${varColor(rev.totalVariation)}">${esc(rev.totalVariation)}</div>
        </div>
        <div style="background:#F9FAFB;border-left:4px solid #DF0024;padding:16px;border-radius:4px">
          <div style="font-size:11px;color:#6B7280;margin-bottom:4px">Sessões Totais</div>
          <div style="font-size:28px;font-weight:700;color:#111827">${esc(traf.totalSessions) || '—'}</div>
          <div style="font-size:14px;font-weight:600;color:${varColor(traf.totalSessionsVariation)}">${esc(traf.totalSessionsVariation)}</div>
        </div>
      </div>

      ${ns.executiveHighlight ? `
      <div style="margin:0 32px 16px;background:#FFF5F7;border-left:4px solid #DF0024;padding:14px 18px;border-radius:4px">
        <div style="font-size:10px;font-weight:700;color:#DF0024;margin-bottom:4px">DESTAQUE EXECUTIVO</div>
        <div style="font-size:13px;color:#111827">${esc(ns.executiveHighlight)}</div>
      </div>` : ''}

      <div style="padding:0 32px 24px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
        ${revBreakdown ? `
        <div>
          <h3 style="font-size:14px;font-weight:700;color:#DF0024;margin:0 0 10px">Receita — Breakdown</h3>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead><tr style="background:#DF0024;color:white">
              <th style="padding:8px 12px;text-align:left">Linha</th>
              <th style="padding:8px 12px;text-align:left">Valor</th>
              <th style="padding:8px 12px;text-align:left">Quota</th>
              <th style="padding:8px 12px;text-align:left">Var. YoY</th>
            </tr></thead>
            <tbody>${revBreakdown}</tbody>
          </table>
        </div>` : '<div></div>'}

        <div>
          ${features ? `
          <h3 style="font-size:14px;font-weight:700;color:#DF0024;margin:0 0 10px">Realizado no Período</h3>
          <ul style="list-style:none;padding:0;margin:0 0 16px;font-size:12px">${features}</ul>` : ''}
          ${initiatives ? `
          <h3 style="font-size:14px;font-weight:700;color:#DF0024;margin:0 0 10px">Looking Forward</h3>
          <ul style="list-style:none;padding:0;margin:0;font-size:12px">${initiatives}</ul>` : ''}
        </div>
      </div>

      ${campaigns ? `
      <div style="padding:0 32px 24px">
        <h3 style="font-size:14px;font-weight:700;color:#DF0024;margin:0 0 10px">Campanhas de Marketing</h3>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead><tr style="background:#DF0024;color:white">
            <th style="padding:8px 12px;text-align:left">Campanha</th>
            <th style="padding:8px 12px;text-align:left">Tipo</th>
            <th style="padding:8px 12px;text-align:left">Data</th>
            <th style="padding:8px 12px;text-align:left">Resultado</th>
            <th style="padding:8px 12px;text-align:left">Status</th>
          </tr></thead>
          <tbody>${campaigns}</tbody>
        </table>
      </div>` : ''}
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(session.name)} — Digital 360 CTT</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; color: #111827; background: #F9FAFB; }
  @media print {
    body { background: white; }
    .product-section { page-break-before: always; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
  <!-- Cover -->
  <div style="background:#DF0024;color:white;padding:48px 64px;min-height:200px">
    <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Estado da Arte</div>
    <div style="font-size:42px;font-weight:700;line-height:1.1">${esc(session.name)}</div>
    <div style="font-size:20px;opacity:0.8;margin-top:12px">${esc(session.period)} · ${esc(session.audience)}</div>
    <div style="font-size:13px;opacity:0.6;margin-top:24px">Gerado em ${dateStr}</div>
  </div>

  <!-- Summary -->
  <div style="padding:32px 64px;background:white;border-bottom:1px solid #E5E7EB">
    <h2 style="font-size:18px;font-weight:700;color:#DF0024;margin-bottom:16px">Sumário da Sessão</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      <div style="text-align:center;padding:16px;background:#F9FAFB;border-radius:8px">
        <div style="font-size:32px;font-weight:700;color:#DF0024">${products.length}</div>
        <div style="font-size:12px;color:#6B7280">Produtos</div>
      </div>
      <div style="text-align:center;padding:16px;background:#F9FAFB;border-radius:8px">
        <div style="font-size:32px;font-weight:700;color:#10B981">${products.filter(([,p]) => p.status === 'submitted').length}</div>
        <div style="font-size:12px;color:#6B7280">Submetidos</div>
      </div>
      <div style="text-align:center;padding:16px;background:#F9FAFB;border-radius:8px">
        <div style="font-size:32px;font-weight:700;color:#F59E0B">${esc(session.status) || 'draft'}</div>
        <div style="font-size:12px;color:#6B7280">Status</div>
      </div>
    </div>
  </div>

  ${productSections}

  <div style="background:#111827;color:white;padding:32px 64px;text-align:center">
    <div style="font-size:24px;font-weight:700;color:#DF0024">CTT</div>
    <div style="font-size:12px;color:#9CA3AF;margin-top:8px">Digital 360 — ${dateStr}</div>
  </div>
</body>
</html>`;
}
