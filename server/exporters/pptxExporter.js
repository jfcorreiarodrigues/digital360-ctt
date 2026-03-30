import PptxGenJS from 'pptxgenjs';

const RED = 'DF0024';
const BLACK = '111827';
const WHITE = 'FFFFFF';
const GRAY = 'F3F4F6';
const GRAY_TEXT = '6B7280';
const GREEN = '10B981';
const RED_NEG = 'EF4444';

function variationColor(v) {
  if (!v) return GRAY_TEXT;
  const s = String(v);
  if (s.startsWith('+')) return GREEN;
  if (s.startsWith('-')) return RED_NEG;
  return GRAY_TEXT;
}

function addSlideHeader(slide, productName = '') {
  // Red top bar
  slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: RED } });
  // CTT logo placeholder (text)
  slide.addText('CTT', {
    x: 11.8, y: 0.12, w: 1.2, h: 0.5,
    fontSize: 20, bold: true, color: WHITE,
    fill: { color: RED }, align: 'center', valign: 'middle'
  });
  if (productName) {
    slide.addText(productName, {
      x: 0.3, y: 0.12, w: 9, h: 0.45,
      fontSize: 11, color: GRAY_TEXT, bold: false
    });
  }
}

function addSlideFooter(slide, sessionName, slideNum) {
  slide.addShape('line', { x: 0, y: 7.1, w: '100%', h: 0, line: { color: 'E5E7EB', width: 1 } });
  slide.addText(sessionName, { x: 0.3, y: 7.15, w: 9, h: 0.3, fontSize: 9, color: GRAY_TEXT });
  slide.addText(String(slideNum), { x: 12.8, y: 7.15, w: 0.5, h: 0.3, fontSize: 9, color: GRAY_TEXT, align: 'right' });
}

export async function generatePPTX(session) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });

  const products = Object.entries(session.products || {});
  let slideNum = 1;

  // ── SLIDE 0: Cover ──────────────────────────────────────────────
  const cover = pptx.addSlide();
  cover.addShape('rect', { x: 0, y: 0, w: 6, h: 7.5, fill: { color: RED } });
  cover.addShape('rect', { x: 6, y: 0, w: 7.33, h: 7.5, fill: { color: WHITE } });
  cover.addText('DIGITAL', { x: 0.5, y: 1.8, w: 5, h: 1.2, fontSize: 52, bold: true, color: WHITE, fontFace: 'Arial' });
  cover.addText('360', { x: 0.5, y: 2.9, w: 5, h: 1.4, fontSize: 80, bold: true, color: WHITE, fontFace: 'Arial' });
  cover.addText('CTT', { x: 0.5, y: 4.2, w: 5, h: 0.8, fontSize: 36, bold: true, color: 'FF6680', fontFace: 'Arial' });
  cover.addText('Estado da Arte', { x: 6.3, y: 2.2, w: 6.5, h: 0.6, fontSize: 18, color: GRAY_TEXT, fontFace: 'Arial' });
  cover.addText(session.name || 'Digital 360', { x: 6.3, y: 2.9, w: 6.5, h: 0.9, fontSize: 28, bold: true, color: BLACK, fontFace: 'Arial' });
  cover.addText(session.period || '', { x: 6.3, y: 3.9, w: 6.5, h: 0.6, fontSize: 20, color: RED, bold: true, fontFace: 'Arial' });
  const dateStr = new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' });
  cover.addText(dateStr, { x: 0.5, y: 6.8, w: 5, h: 0.4, fontSize: 11, color: 'FFB3BE', fontFace: 'Arial' });

  // ── SLIDE 1: Index ──────────────────────────────────────────────
  const index = pptx.addSlide();
  addSlideHeader(index);
  index.addText('Agenda', { x: 0.4, y: 0.7, w: 12, h: 0.8, fontSize: 28, bold: true, color: RED, fontFace: 'Arial' });
  const productList = products.map(([pid, pd], i) => {
    const name = pid.replace(/_/g, ' ');
    return { text: `${i + 1}. ${name}`, options: { fontSize: 13, color: BLACK, bullet: false } };
  });
  index.addText(productList, { x: 0.6, y: 1.6, w: 12, h: 5, fontSize: 13, fontFace: 'Arial', paraSpaceAfter: 6 });
  addSlideFooter(index, session.name, ++slideNum);

  // ── SLIDE 2: Global Revenue ──────────────────────────────────────
  const globalRev = pptx.addSlide();
  addSlideHeader(globalRev);
  globalRev.addText('Receita Digital Global', { x: 0.4, y: 0.7, w: 12, h: 0.7, fontSize: 26, bold: true, color: RED, fontFace: 'Arial' });

  const tableData = [
    [
      { text: 'Produto', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
      { text: 'Receita Total', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
      { text: 'Variação', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
      { text: 'North Star', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
    ]
  ];
  products.forEach(([pid, pd]) => {
    tableData.push([
      { text: pid.replace(/_/g, ' '), options: { fontSize: 10 } },
      { text: pd.revenue?.total || '—', options: { fontSize: 10 } },
      { text: pd.revenue?.totalVariation || '—', options: { fontSize: 10, color: variationColor(pd.revenue?.totalVariation) } },
      { text: pd.northStar?.currentValue || '—', options: { fontSize: 10 } },
    ]);
  });
  if (tableData.length > 1) {
    globalRev.addTable(tableData, { x: 0.4, y: 1.6, w: 12.5, rowH: 0.4, fontFace: 'Arial', border: { color: 'E5E7EB', pt: 1 } });
  }
  addSlideFooter(globalRev, session.name, ++slideNum);

  // ── Per-product slides ───────────────────────────────────────────
  for (const [productId, productData] of products) {
    const productName = productId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Separator slide
    const sep = pptx.addSlide();
    sep.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: RED } });
    sep.addText(productName, { x: 1, y: 2.5, w: 11.3, h: 1.5, fontSize: 40, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
    if (productData.productDev?.owner) {
      sep.addText(productData.productDev.owner, { x: 1, y: 4.1, w: 11.3, h: 0.6, fontSize: 18, color: 'FFB3BE', align: 'center', fontFace: 'Arial' });
    }
    ++slideNum;

    // North Star slide
    const ns = pptx.addSlide();
    addSlideHeader(ns, productName);
    ns.addText(`KPIs Principais — ${productName}`, { x: 0.4, y: 0.7, w: 12, h: 0.65, fontSize: 22, bold: true, color: RED, fontFace: 'Arial' });
    const nsData = productData.northStar || {};
    ns.addShape('rect', { x: 0.4, y: 1.5, w: 3.8, h: 2, fill: { color: GRAY } });
    ns.addShape('rect', { x: 0.4, y: 1.5, w: 0.12, h: 2, fill: { color: RED } });
    ns.addText(nsData.metric || 'North Star', { x: 0.65, y: 1.6, w: 3.4, h: 0.4, fontSize: 11, color: GRAY_TEXT, fontFace: 'Arial' });
    ns.addText(nsData.currentValue || '—', { x: 0.65, y: 2.1, w: 3.4, h: 0.7, fontSize: 24, bold: true, color: BLACK, fontFace: 'Arial' });
    ns.addText(nsData.variation || '', { x: 0.65, y: 2.85, w: 3.4, h: 0.4, fontSize: 14, bold: true, color: variationColor(nsData.variation), fontFace: 'Arial' });
    ns.addText(nsData.periodLabel || '', { x: 0.65, y: 3.25, w: 3.4, h: 0.2, fontSize: 9, color: GRAY_TEXT, fontFace: 'Arial' });
    if (nsData.executiveHighlight) {
      ns.addShape('rect', { x: 0.4, y: 3.8, w: 12.5, h: 1.2, fill: { color: 'FFF5F7' } });
      ns.addShape('rect', { x: 0.4, y: 3.8, w: 0.12, h: 1.2, fill: { color: RED } });
      ns.addText('Destaque executivo', { x: 0.65, y: 3.88, w: 12, h: 0.3, fontSize: 9, bold: true, color: RED, fontFace: 'Arial' });
      ns.addText(nsData.executiveHighlight, { x: 0.65, y: 4.18, w: 12, h: 0.7, fontSize: 11, color: BLACK, fontFace: 'Arial' });
    }
    addSlideFooter(ns, session.name, ++slideNum);

    // Revenue slide
    const rev = pptx.addSlide();
    addSlideHeader(rev, productName);
    rev.addText('Receita', { x: 0.4, y: 0.7, w: 12, h: 0.65, fontSize: 22, bold: true, color: RED, fontFace: 'Arial' });
    const revData = productData.revenue || {};
    rev.addText(`Total: ${revData.total || '—'}`, { x: 0.4, y: 1.5, w: 8, h: 0.5, fontSize: 18, bold: true, color: BLACK, fontFace: 'Arial' });
    rev.addText(revData.totalVariation || '', { x: 8.5, y: 1.5, w: 4, h: 0.5, fontSize: 16, bold: true, color: variationColor(revData.totalVariation), align: 'right', fontFace: 'Arial' });
    if (revData.breakdown?.length) {
      const bkRows = [
        [
          { text: 'Linha de Negócio', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Valor', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Quota %', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Variação YoY', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
        ],
        ...revData.breakdown.filter(r => r.label).map(row => ([
          { text: row.label || '', options: { fontSize: 10 } },
          { text: row.value || '—', options: { fontSize: 10 } },
          { text: row.share || '—', options: { fontSize: 10 } },
          { text: row.variation || '—', options: { fontSize: 10, color: variationColor(row.variation) } },
        ]))
      ];
      rev.addTable(bkRows, { x: 0.4, y: 2.2, w: 12.5, rowH: 0.38, fontFace: 'Arial', border: { color: 'E5E7EB', pt: 1 } });
    }
    if (revData.notes) {
      rev.addText(revData.notes, { x: 0.4, y: 6.3, w: 12.5, h: 0.5, fontSize: 9, color: GRAY_TEXT, italic: true, fontFace: 'Arial' });
    }
    addSlideFooter(rev, session.name, ++slideNum);

    // Traffic slide
    const traf = pptx.addSlide();
    addSlideHeader(traf, productName);
    traf.addText('Tráfego & Utilizadores', { x: 0.4, y: 0.7, w: 12, h: 0.65, fontSize: 22, bold: true, color: RED, fontFace: 'Arial' });
    const trafData = productData.traffic || {};
    const metrics = [
      { label: 'Total Sessões', value: trafData.totalSessions, variation: trafData.totalSessionsVariation },
      { label: 'Utilizadores Únicos', value: trafData.totalUsers, variation: trafData.totalUsersVariation },
    ];
    metrics.forEach((m, i) => {
      const x = 0.4 + i * 6.4;
      traf.addShape('rect', { x, y: 1.5, w: 6, h: 1.6, fill: { color: GRAY } });
      traf.addShape('rect', { x, y: 1.5, w: 0.1, h: 1.6, fill: { color: RED } });
      traf.addText(m.label, { x: x + 0.25, y: 1.6, w: 5.5, h: 0.35, fontSize: 10, color: GRAY_TEXT, fontFace: 'Arial' });
      traf.addText(m.value || '—', { x: x + 0.25, y: 1.95, w: 5.5, h: 0.6, fontSize: 22, bold: true, color: BLACK, fontFace: 'Arial' });
      traf.addText(m.variation || '', { x: x + 0.25, y: 2.6, w: 5.5, h: 0.35, fontSize: 13, bold: true, color: variationColor(m.variation), fontFace: 'Arial' });
    });
    addSlideFooter(traf, session.name, ++slideNum);

    // Product Dev slide
    const dev = pptx.addSlide();
    addSlideHeader(dev, productName);
    dev.addText('Desenvolvimento de Produto', { x: 0.4, y: 0.7, w: 12, h: 0.65, fontSize: 22, bold: true, color: RED, fontFace: 'Arial' });
    const devData = productData.productDev || {};
    const fwdData = productData.lookingForward || {};
    dev.addText(`Realizado — ${session.period || ''}`, { x: 0.4, y: 1.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: BLACK, fontFace: 'Arial' });
    dev.addText(`Looking Forward`, { x: 6.8, y: 1.5, w: 6, h: 0.4, fontSize: 13, bold: true, color: BLACK, fontFace: 'Arial' });
    dev.addShape('line', { x: 6.5, y: 1.5, w: 0, h: 5.5, line: { color: 'E5E7EB', width: 1 } });
    const features = (devData.features || []).slice(0, 6);
    features.forEach((f, i) => {
      const icon = f.status === 'completed' ? '✅' : f.status === 'wip' ? '🔄' : '⚠️';
      dev.addText(`${icon} ${f.title || ''}`, { x: 0.4, y: 2.05 + i * 0.62, w: 5.8, h: 0.3, fontSize: 11, bold: true, color: BLACK, fontFace: 'Arial' });
      if (f.description) dev.addText(f.description, { x: 0.4, y: 2.37 + i * 0.62, w: 5.8, h: 0.25, fontSize: 9, color: GRAY_TEXT, fontFace: 'Arial' });
    });
    const initiatives = (fwdData.initiatives || []).slice(0, 6);
    initiatives.forEach((init, i) => {
      const icon = init.priority === 'high' ? '🔴' : init.priority === 'medium' ? '🟡' : '🟢';
      dev.addText(`${icon} ${init.title || ''}`, { x: 6.8, y: 2.05 + i * 0.62, w: 6, h: 0.3, fontSize: 11, bold: true, color: BLACK, fontFace: 'Arial' });
      if (init.description) dev.addText(init.description, { x: 6.8, y: 2.37 + i * 0.62, w: 6, h: 0.25, fontSize: 9, color: GRAY_TEXT, fontFace: 'Arial' });
    });
    addSlideFooter(dev, session.name, ++slideNum);

    // Marketing slide
    const mkt = pptx.addSlide();
    addSlideHeader(mkt, productName);
    mkt.addText('Marketing & Dinamização', { x: 0.4, y: 0.7, w: 12, h: 0.65, fontSize: 22, bold: true, color: RED, fontFace: 'Arial' });
    const mktData = productData.marketing || {};
    if (mktData.googleAlwaysOnInvestment) {
      mkt.addText(`Google Always On: ${mktData.googleAlwaysOnInvestment}€ (${mktData.googleAlwaysOnPercentOfTotal || '—'}% do total)`, {
        x: 0.4, y: 1.5, w: 12.5, h: 0.4, fontSize: 13, bold: true, color: BLACK, fontFace: 'Arial'
      });
    }
    const campaigns = (mktData.campaigns || []).filter(c => c.name).slice(0, 5);
    if (campaigns.length) {
      const campRows = [
        [
          { text: 'Campanha', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Tipo', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Data', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Resultado', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
          { text: 'Status', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 10 } },
        ],
        ...campaigns.map(c => ([
          { text: c.name, options: { fontSize: 10 } },
          { text: c.type || '', options: { fontSize: 10 } },
          { text: c.date || '', options: { fontSize: 10 } },
          { text: c.result || '', options: { fontSize: 10 } },
          { text: c.status || '', options: { fontSize: 10 } },
        ]))
      ];
      mkt.addTable(campRows, { x: 0.4, y: 2.0, w: 12.5, rowH: 0.4, fontFace: 'Arial', border: { color: 'E5E7EB', pt: 1 } });
    }
    if (mktData.highlights) {
      mkt.addText('Highlights:', { x: 0.4, y: 5.5, w: 12.5, h: 0.35, fontSize: 11, bold: true, color: BLACK, fontFace: 'Arial' });
      mkt.addText(mktData.highlights, { x: 0.4, y: 5.9, w: 12.5, h: 0.8, fontSize: 10, color: GRAY_TEXT, fontFace: 'Arial' });
    }
    addSlideFooter(mkt, session.name, ++slideNum);
  }

  // ── Final slide ──────────────────────────────────────────────────
  const final = pptx.addSlide();
  final.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: RED } });
  final.addText('Obrigado a todos!', { x: 1, y: 2.8, w: 11.3, h: 1.2, fontSize: 44, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  final.addText('CTT', { x: 1, y: 4.4, w: 11.3, h: 0.8, fontSize: 32, bold: true, color: 'FFB3BE', align: 'center', fontFace: 'Arial' });

  return await pptx.write({ outputType: 'nodebuffer' });
}
