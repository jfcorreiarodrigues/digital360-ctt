import { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.post(`/api/export/pptx/${sessionId}`, {}, { responseType: 'blob' });
      await downloadBlob(res.data, `Digital360_${sessionName || sessionId}.pptx`);
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
      const res = await axios.post(`/api/export/pdf/${sessionId}`, {}, { responseType: 'blob' });
      await downloadBlob(res.data, `Digital360_${sessionName || sessionId}.pdf`);
    } catch (e) {
      setError('Erro ao gerar PDF: ' + e.message);
    } finally {
      setLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  const exportHTML = async (sessionId, sessionName) => {
    setLoading(prev => ({ ...prev, html: true }));
    setError(null);
    try {
      const res = await axios.get(`/api/export/html/${sessionId}`, { responseType: 'blob' });
      await downloadBlob(res.data, `Digital360_${sessionName || sessionId}.html`);
    } catch (e) {
      setError('Erro ao gerar HTML: ' + e.message);
    } finally {
      setLoading(prev => ({ ...prev, html: false }));
    }
  };

  return { loading, error, exportPPTX, exportPDF, exportHTML };
}
