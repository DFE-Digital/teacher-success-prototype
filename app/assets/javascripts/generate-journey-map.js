// capture-and-map.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');



(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ devtools: true });
  const page = await context.newPage();

  const screenshotDir = './screenshots';
  const metadataPath = path.join(screenshotDir, 'metadata.json');
  let screenshotCount = 0;
  let metadata = [];
  let lastClicked = null;

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  // Track console logs from browser
  page.on('console', msg => {
    console.log(`[PAGE LOG]: ${msg.text()}`);
  });

  // Track browser close
  browser.on('disconnected', () => {
    console.log('🛑 Chromium closed, saving metadata and exiting...');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    generateJourneyMap();
    process.exit(0);
  });

  // Capture clicked links
  await page.exposeFunction('recordLinkClick', (text, href) => {
    lastClicked = { text, href };
  });

  await page.evaluateOnNewDocument(() => {
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link) {
        window.recordLinkClick(link.innerText, link.href);
      }
    });
  });

  // Capture screenshots and metadata
  page.on('framenavigated', async (frame) => {
    if (frame === page.mainFrame()) {
      await page.waitForLoadState('networkidle');

      const urlSafe = frame.url().replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
      const filename = `page-${screenshotCount}-${urlSafe}.png`;
      const filepath = path.join(screenshotDir, filename);

      await page.screenshot({ path: filepath, fullPage: true });

      const title = await page.title();

      metadata.push({ filename, title, clickedFrom: lastClicked });
      lastClicked = null; // reset
      screenshotCount++;

      console.log(`📸 Screenshot saved: ${filename}`);
    }
  });

  // Go to initial page
  await page.goto('http://localhost:3000');

  // HTML generator function
  function generateJourneyMap() {
    const htmlParts = [`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Journey Map</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; }
    .journey-map { display: flex; flex-wrap: nowrap; overflow-x: auto; align-items: center; gap: 20px; }
    .journey-step { text-align: center; max-width: 300px; }
    .journey-step img { max-width: 100%; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
    .arrow { font-size: 2rem; color: #333; align-self: center; }
    .click-info { font-size: 0.9rem; color: #666; margin: 5px 0; }
    .title { font-weight: bold; margin: 5px 0; }
  </style>
</head>
<body>
  <h1>User Journey Map</h1>
  <div class="journey-map">
`];

    metadata.forEach((step, index) => {
      htmlParts.push(`
      <div class="journey-step">
        <img src="${step.filename}" alt="Step ${index + 1}" />
        <div class="title">${step.title}</div>
        <div>Step ${index + 1}</div>
      </div>
      `);

      if (index < metadata.length - 1) {
        const clickInfo = metadata[index + 1].clickedFrom;
        if (clickInfo) {
          htmlParts.push(`<div class="click-info">Clicked: "${clickInfo.text}"</div>`);
        }
        htmlParts.push(`<div class="arrow">➡️</div>`);
      }
    });

    htmlParts.push(`
  </div>
</body>
</html>`);

    fs.writeFileSync(path.join(screenshotDir, 'index.html'), htmlParts.join('\n'), 'utf8');
    console.log('✅ Journey map generated at screenshots/index.html');
  }
})(); 
