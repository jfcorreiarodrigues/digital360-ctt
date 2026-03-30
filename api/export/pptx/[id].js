import { getSession } from '../../lib/redis.js'
import PptxGenJS from 'pptxgenjs'

const RED = 'DF0024'
const BLACK = '111827'
const WHITE = 'FFFFFF'
const GRAY = 'F3F4F6'
const GRAY_TEXT = '6B7280'
const GREEN = '10B981'
const RED_NEG = 'EF4444'

function variationColor(v) {
  if (!v) return GRAY_TEXT
  const s = String(v)
  if (s.startsWith('+')) return GREEN
  if (s.startsWith('-')) return RED_NEG
  return GRAY_TEXT
}

function addSlideHeader(slide, productName = '') {
  slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: RED } })
  slide.addText('CTT', {
    x: 11.8, y: 0.12, w: 1.2, h: 0.5,
    fontSize: 20, bold: true, color: WHITE,
    fill: { color: RED }, align: 'center', valign: 'middle'
  })
  if (productName) {
    slide.addText(productName, {
      x: 0.3, y: 0.12, w: 9, h: 0.45,
      fontSize: 11, color: GRAY_TEXT, bold: false
    })
  }
}

function addSlideFooter(slide, sessionName, slideNum) {
  slide.addShape('line', { x: 0, y: 7.1, w: '100%', h: 0, line: { color: 'E5E7EB', width: 1 } })
  slide.addText(sessionName, { x: 0.3, y: 7.15, w: 9, h: 0.3, fontSize: 9, color: GRAY_TEXT })
  slide.addText(String(slideNum), { x: 12.8, y: 7.15, w: 0.5, h: 0.3, fontSize: 9, color: GRAY_TEXT, align: 'right' })
}

async function generatePPTX(session) {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 })

  const products = Object.entries(session.products || {})
  let slideNum = 1

  // Cover slide
  const cover = pptx.addSlide()
  cover.addShape('rect', { x: 0, y: 0, w: 6, h: 7.5, fill: { color: RED } })
  cover.addShape('rect', { x: 6, y: 0, w: 7.33, h: 7.5, fill: { color: WHITE } })
  cover.addText('DIGITAL', { x: 0.5, y: 1.8, w: 5, h: 1.2, fontSize: 52, bold: true, color: WHITE, fontFace: 'Arial' })
  cover.addText('360', { x: 0.5, y: 2.9, w: 5, h: 1.4, fontSize: 80, bold: true, color: WHITE, fontFace: 'Arial' })
  cover.addText('CTT', { x: 0.5, y: 4.2, w: 5, h: 0.8, fontSize: 36, bold: true, color: 'FF6680', fontFace: 'Arial' })
  cover.addText('Estado da Arte', { x: 6.3, y: 2.2, w: 6.5, h: 0.6, fontSize: 18, color: GRAY_TEXT, fontFace: 'Arial' })
  cover.addText(session.name || 'Digital 360', { x: 6.3, y: 2.9, w: 6.5, h: 0.9, fontSize: 28, bold: true, color: BLACK, fontFace: 'Arial' })
  cover.addText(session.period || '', { x: 6.3, y: 3.9, w: 6.5, h: 0.6, fontSize: 20, color: RED, bold: true, fontFace: 'Arial' })

  // Index slide
  const index = pptx.addSlide()
  addSlideHeader(index)
  index.addText('Agenda', { x: 0.4, y: 0.7, w: 12, h: 0.8, fontSize: 28, bold: true, color: RED, fontFace: 'Arial' })
  const productList = products.map(([pid], i) => {
    const name = pid.replace(/_/g, ' ')
    return { text: `${i + 1}. ${name}`, options: { fontSize: 13, color: BLACK, bullet: false } }
  })
  index.addText(productList, { x: 0.6, y: 1.6, w: 12, h: 5, fontSize: 13, fontFace: 'Arial', paraSpaceAfter: 6 })
  addSlideFooter(index, session.name, ++slideNum)

  // Global Revenue slide
  const globalRev = pptx.addSlide()
  addSlideHeader(globalRev)
  globalRev.addText('Receita Digital Global', { x: 0.4, y: 0.7, w: 12, h: 0.7, fontSize: 26, bold: true, color: RED, fontFace: 'Arial' })

  const tableData = [[
    { text: 'Produto', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
    { text: 'Receita Total', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
    { text: 'Variação', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
    { text: 'North Star', options: { bold: true, fill: { color: RED }, color: WHITE, fontSize: 11 } },
  ]]
  products.forEach(([pid, pd]) => {
    tableData.push([
      { text: pid.replace(/_/g, ' '), options: { fontSize: 10 } },
      { text: pd.revenue?.total || '—', options: { fontSize: 10 } },
      { text: pd.revenue?.totalVariation || '—', options: { fontSize: 10, color: variationColor(pd.revenue?.totalVariation) } },
      { text: pd.northStar?.currentValue || '—', options: { fontSize: 10 } },
    ])
  })
  if (tableData.length > 1) {
    globalRev.addTable(tableData, { x: 0.4, y: 1.6, w: 12.5, rowH: 0.4, fontFace: 'Arial', border: { color: 'E5E7EB', pt: 1 } })
  }
  addSlideFooter(globalRev, session.name, ++slideNum)

  // Per-product slides (simplified for serverless)
  for (const [productId, productData] of products) {
    const productName = productId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    // Separator
    const sep = pptx.addSlide()
    sep.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: RED } })
    sep.addText(productName, { x: 1, y: 2.5, w: 11.3, h: 1.5, fontSize: 40, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' })
    ++slideNum

    // KPIs slide
    const ns = pptx.addSlide()
    addSlideHeader(ns, productName)
    ns.addText(`KPIs Principais — ${productName}`, { x: 0.4, y: 0.7, w: 12, h: 0.65, fontSize: 22, bold: true, color: RED, fontFace: 'Arial' })
    const nsData = productData.northStar || {}
    ns.addShape('rect', { x: 0.4, y: 1.5, w: 3.8, h: 2, fill: { color: GRAY } })
    ns.addText(nsData.metric || 'North Star', { x: 0.65, y: 1.6, w: 3.4, h: 0.4, fontSize: 11, color: GRAY_TEXT, fontFace: 'Arial' })
    ns.addText(nsData.currentValue || '—', { x: 0.65, y: 2.1, w: 3.4, h: 0.7, fontSize: 24, bold: true, color: BLACK, fontFace: 'Arial' })
    addSlideFooter(ns, session.name, ++slideNum)
  }

  // Final slide
  const final = pptx.addSlide()
  final.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: RED } })
  final.addText('Obrigado a todos!', { x: 1, y: 2.8, w: 11.3, h: 1.2, fontSize: 44, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' })
  final.addText('CTT', { x: 1, y: 4.4, w: 11.3, h: 0.8, fontSize: 32, bold: true, color: 'FFB3BE', align: 'center', fontFace: 'Arial' })

  return await pptx.write({ outputType: 'nodebuffer' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const session = await getSession(id)
  if (!session) return res.status(404).json({ error: 'Session not found' })

  try {
    const buffer = await generatePPTX(session)
    const filename = `Digital360_${session.period || session.name?.replace(/[^a-z0-9]/gi, '_') || 'export'}.pptx`
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.send(buffer)
  } catch (err) {
    console.error('PPTX export error:', err)
    return res.status(500).json({ error: err.message })
  }
}
