import puppeteer from 'puppeteer';
import { generateHTML } from './htmlExporter.js';

export async function generatePDF(session) {
  const html = await generateHTML(session, true);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
    });
    return buffer;
  } finally {
    await browser.close();
  }
}
