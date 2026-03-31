import { generateHTML } from './htmlExporter.js';

async function getBrowser() {
  // Vercel / serverless: use @sparticuz/chromium-min com puppeteer-core
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const remoteExecPath = process.env.CHROMIUM_REMOTE_EXEC_PATH;
    if (!remoteExecPath) {
      throw new Error('CHROMIUM_REMOTE_EXEC_PATH não está definido. Necessário em ambiente serverless.');
    }
    const chromium = (await import('@sparticuz/chromium-min')).default;
    const puppeteer = (await import('puppeteer-core')).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecPath),
      headless: chromium.headless,
    });
  }

  // Desenvolvimento local: usar puppeteer-core com Chrome do sistema
  // Definir CHROMIUM_PATH no .env, ex:
  //   macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
  //   Linux: /usr/bin/chromium-browser
  const puppeteer = (await import('puppeteer-core')).default;
  const executablePath = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser';
  return puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

export async function generatePDF(session) {
  const html = await generateHTML(session, true);
  const browser = await getBrowser();
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
