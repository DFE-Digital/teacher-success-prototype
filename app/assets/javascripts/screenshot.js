const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ devtools: true });
  const page = await context.newPage();

  let capturing = true;
  let screenshotCount = 0;
  const screenshotDir = './screenshots';

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  page.on('console', msg => {
    console.log(`[PAGE LOG]: ${msg.text()}`);
  });

  // Listen for the browser window close event
  browser.on('disconnected', () => {
    console.log('🛑 Chromium closed, exiting script...');
    process.exit(0);
  });

  await page.goto('http://localhost:3000/emailb');

  // Take the very first screenshot here (after initial load)
  await page.waitForLoadState('networkidle');
  const initialUrlSafe = page.url().replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
  const initialFilename = `page-${screenshotCount}-${initialUrlSafe}.png`;
  await page.screenshot({
    path: path.join(screenshotDir, initialFilename),
    fullPage: true
  });
  console.log(`📸 Screenshot saved: ${initialFilename}`);
  screenshotCount++;

  // Then continue capturing screenshots on future navigations
  page.on('framenavigated', async (frame) => {
    if (capturing && frame === page.mainFrame()) {
      await page.waitForLoadState('networkidle');

      const urlSafe = frame.url().replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
      const filename = `page-${screenshotCount}-${urlSafe}.png`;
      await page.screenshot({
        path: path.join(screenshotDir, filename),
        fullPage: true
      });
      console.log(`📸 Screenshot saved: ${filename}`);
      screenshotCount++;
    }
  });
})();
