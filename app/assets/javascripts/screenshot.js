process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

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

  page.on('console', msg => {
    console.log(`[PAGE LOG]: ${msg.text()}`);
  });

  browser.on('disconnected', async () => {
    console.log('🛑 Chromium closed, saving metadata and generating HTML map...');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    await generateHTMLMap();
    console.log('✅ Done.');
    process.exit(0);
  });

  await page.exposeFunction('recordLinkClick', (text, href) => {
    lastClicked = { text, href };
  });

  await page.addInitScript(() => {
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link) {
        window.recordLinkClick(link.innerText, link.href);
      }
    });
  });

  page.on('framenavigated', async (frame) => {
  if (frame === page.mainFrame()) {
    await page.waitForLoadState('networkidle');

    const urlSafe = frame.url().replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    const filename = `page-${screenshotCount}-${urlSafe}.png`;
    const filepath = path.join(screenshotDir, filename);

    await page.screenshot({ path: filepath, fullPage: true });

    const title = await page.title();

    // ✅ NEW: Log screenshot info to terminal
    console.log(`📸 Captured ${filename} | Title: "${title}"`);

    metadata.push({
      filename,
      title,
      clickedFrom: lastClicked,
    });

    lastClicked = null;
    screenshotCount++;
  }
});


  await page.goto('https://www.gov.uk/');

  // Generate basic HTML map
  async function generateHTMLMap() {
    const htmlParts = [
      `<html><head><title>Journey Map</title><style>
        body { font-family: sans-serif; padding: 2em; }
        .step { margin-bottom: 2em; border-bottom: 1px solid #ccc; padding-bottom: 2em; }
        img { max-width: 100%; border: 1px solid #ccc; margin-top: 0.5em; }
        .link-note { color: #555; font-size: 0.9em; margin-top: 0.3em; }
      </style></head><body><h1>Journey Map</h1>`
    ];

    metadata.forEach((step, i) => {
      htmlParts.push(`
        <div class="step">
          <h2>Step ${i + 1}: ${step.title}</h2>
          ${step.clickedFrom ? `<div class="link-note">Clicked from: "${step.clickedFrom.text}"</div>` : ''}
          <img src="${step.filename}" alt="Screenshot of ${step.title}" />
        </div>
      `);
    });

    htmlParts.push(`</body></html>`);

    fs.writeFileSync(path.join(screenshotDir, 'journey-map.html'), htmlParts.join('\n'), 'utf8');
    console.log('🗺️  journey-map.html created');
  }
})();
