import { chromium } from 'playwright-core';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on('pageerror', err => errors.push({ type: 'pageerror', message: err.message, stack: err.stack }));
page.on('console', msg => {
  if (msg.type() === 'error') {
    errors.push({ type: 'console.error', text: msg.text(), args: msg.args().map(a => a.toString()) });
  }
});

await page.goto('http://localhost:3000/admin/programs/tp1/edit', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

console.log('Errors found:', errors.length);
for (const e of errors) {
  console.log(JSON.stringify(e, null, 2));
}

await browser.close();
