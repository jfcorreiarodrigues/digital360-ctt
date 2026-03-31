import { useState } from 'react';
import { fetchSessionById } from '../api/sessions';
import PptxGenJS from 'pptxgenjs';

export function useExport() {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  async function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const exportPPTX = async (sessionId, sessionName) => {
    setLoading(prev => ({ ...prev, pptx: true }));
    setError(null);
    try {
      const session = await fetchSessionById(sessionId);
      if (!session) throw new Error('Sessão não encontrada');

      const pptx = new PptxGenJS();
      pptx.defineLayout({ name: 'CTT', width: 13.33, height: 7.5 });
      pptx.layout = 'CTT';
      pptx.title = session.name || 'Digital 360';
      pptx.author = 'CTT Digital';

      // Cover slide
      const cover = pptx.addSlide();
      cover.addText('Digital 360', { x: 0.5, y: 2.5, w: 12, h: 1, fontSize: 48, bold: true, color: 'E30613' });
      cover.addText(session.name || '', { x: 0.5, y: 3.5, w: 12, h: 0.5, fontSize: 24, color: '333333' });
      cover.addText(session.period || '', { x: 0.5, y: 4.2, w: 12, h: 0.5, fontSize: 18, color: '666666' });

      // Product slides
      const products = session.selectedProducts || Object.keys(session.products || {});
      products.forEach((productId, index) => {
        const productData = session.productData?.[productId] || {};
        const slide = pptx.addSlide();
        
        slide.addText(productId.replace(/_/g, ' ').toUpperCase(), { 
          x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 28, bold: true, color: 'E30613' 
        });

        if (productData.northStar?.executiveHighlight) {
          slide.addText('Executive Highlight', { x: 0.5, y: 1.2, w: 3, h: 0.3, fontSize: 12, bold: true, color: '333333' });
          slide.addText(productData.northStar.executiveHighlight, { x: 0.5, y: 1.5, w: 12, h: 1, fontSize: 14, color: '666666' });
        }

        if (productData.revenue?.total) {
          slide.addText('Receita Total', { x: 0.5, y: 3, w: 3, h: 0.3, fontSize: 12, bold: true, color: '333333' });
          slide.addText(`€${productData.revenue.total.toLocaleString()}`, { x: 0.5, y: 3.3, w: 3, h: 0.5, fontSize: 24, bold: true, color: 'E30613' });
        }

        slide.addText(`Slide ${index + 2}`, { x: 12, y: 7, w: 1, h: 0.3, fontSize: 10, color: '999999', align: 'right' });
      });

      await pptx.writeFile({ fileName: `Digital360_${sessionName || sessionId}.pptx` });
    } catch (e) {
      setError('Erro ao gerar PPTX: ' + e.message);
    } finally {
      setLoading(prev => ({ ...prev, pptx: false }));
    }
  };

  const exportPDF = async (sessionId, sessionName) => {
    setLoading(prev => ({ ...prev, pdf: true }));
    setError(null);
    try {
      // PDF export requires server-side rendering, show message
      setError('Export PDF não disponível no preview. Use PPTX ou HTML.');
    } finally {
      setLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  const exportHTML = async (sessionId, sessionName) => {
    setLoading(prev => ({ ...prev, html: true }));
    setError(null);
    try {
      const session = await fetchSessionById(sessionId);
      if (!session) throw new Error('Sessão não encontrada');

      const products = session.selectedProducts || Object.keys(session.products || {});
      
      const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital 360 - ${session.name || ''}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f8f8; color: #333; }
    .header { background: #E30613; color: white; padding: 3rem 2rem; }
    .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.8; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .product { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .product h2 { color: #E30613; margin-bottom: 1rem; font-size: 1.5rem; }
    .metric { display: inline-block; margin-right: 2rem; margin-bottom: 1rem; }
    .metric-value { font-size: 2rem; font-weight: bold; color: #E30613; }
    .metric-label { font-size: 0.875rem; color: #666; }
    .highlight { background: #fef2f2; padding: 1rem; border-radius: 8px; border-left: 4px solid #E30613; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Digital 360</h1>
    <p>${session.name || ''} | ${session.period || ''}</p>
  </div>
  <div class="container">
    ${products.map(productId => {
      const data = session.productData?.[productId] || {};
      return `
    <div class="product">
      <h2>${productId.replace(/_/g, ' ').toUpperCase()}</h2>
      ${data.revenue?.total ? `<div class="metric"><div class="metric-value">€${data.revenue.total.toLocaleString()}</div><div class="metric-label">Receita Total</div></div>` : ''}
      ${data.northStar?.currentValue ? `<div class="metric"><div class="metric-value">${data.northStar.currentValue}</div><div class="metric-label">North Star</div></div>` : ''}
      ${data.northStar?.executiveHighlight ? `<div class="highlight">${data.northStar.executiveHighlight}</div>` : ''}
    </div>`;
    }).join('')}
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      await downloadBlob(blob, `Digital360_${sessionName || sessionId}.html`);
    } catch (e) {
      setError('Erro ao gerar HTML: ' + e.message);
    } finally {
      setLoading(prev => ({ ...prev, html: false }));
    }
  };

  return { loading, error, exportPPTX, exportPDF, exportHTML };
}
