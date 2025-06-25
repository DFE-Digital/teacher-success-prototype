const fs = require('fs');
const path = require('path');

const screenshotDir = './screenshots';
const outputFile = path.join(screenshotDir, 'index.html');

const files = fs.readdirSync(screenshotDir)
  .filter(file => file.endsWith('.png'))
  .sort(); // assumes filenames like page-0-*.png, page-1-*.png, etc.

const htmlParts = [
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>User Journey Map</title>
    <style>
      body {
        font-family: sans-serif;
        padding: 2rem;
        background: #f9f9f9;
      }
      .journey-map {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        align-items: center;
        gap: 20px;
      }
      .journey-step {
        text-align: center;
      }
      .journey-step img {
        max-width: 300px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      .arrow {
        font-size: 2rem;
        color: #333;
      }
    </style>
  </head>
  <body>
    <h1>User Journey Map</h1>
    <div class="journey-map">`
];

// Add each screenshot with arrow
files.forEach((file, index) => {
  htmlParts.push(`
    <div class="journey-step">
      <img src="${file}" alt="Step ${index + 1}" />
      <div>Step ${index + 1}</div>
    </div>
  `);

  // Add arrow if not last step
  if (index < files.length - 1) {
    htmlParts.push(`<div class="arrow">➡️</div>`);
  }
});

htmlParts.push(`
    </div>
  </body>
</html>`);

fs.writeFileSync(outputFile, htmlParts.join('\n'), 'utf8');
console.log(`✅ Journey map saved to ${outputFile}`);
