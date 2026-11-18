const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function buildRoyalLogoAssets() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const srcPath = path.resolve(__dirname, '..', 'public', 'images', 'royal-pr-logo.jpg');
  const srcBase64 = fs.readFileSync(srcPath).toString('base64');
  const dataUri = 'data:image/jpeg;base64,' + srcBase64;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <canvas id="cvsMonogram" width="512" height="512"></canvas>
        <canvas id="cvsBadge" width="700" height="700"></canvas>
      </body>
    </html>
  `);

  const results = await page.evaluate(async (uri) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // --- 1. Monogram (Square Emblem with Crown & Intertwined PR) ---
        // Center of emblem is X = 502, Y = 253.
        // Size = 520 px (X: 242 to 762, Y: 0 to 520)
        const c1 = document.getElementById('cvsMonogram');
        const ctx1 = c1.getContext('2d');

        // Draw source into 512x512
        const srcX = 242;
        const srcY = 0;
        const srcSize = 520;
        ctx1.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 512, 512);

        // Smooth radial fade at corners beyond the circular neon orbit (radius ~ 246)
        // This ensures zero hard square edges when placed on dark glass surfaces
        const grad = ctx1.createRadialGradient(256, 256, 230, 256, 256, 256);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx1.fillStyle = grad;
        ctx1.fillRect(0, 0, 512, 512);

        const monogramPng = c1.toDataURL('image/png');

        // --- 2. Full Badge (Emblem + PRINCE RANA + </>) ---
        const c2 = document.getElementById('cvsBadge');
        const ctx2 = c2.getContext('2d');
        // Width ~ 720, height ~ 640, centered around X = 512, Y = 320
        const bSrcX = 152;
        const bSrcY = 0;
        const bSrcW = 720;
        const bSrcH = 640;
        ctx2.drawImage(img, bSrcX, bSrcY, bSrcW, bSrcH, 0, 30, 700, 640);
        const badgePng = c2.toDataURL('image/png');

        resolve({ monogramPng, badgePng });
      };
      img.src = uri;
    });
  }, dataUri);

  const cleanB64 = (dataUrl) => dataUrl.replace(/^data:image\/png;base64,/, '');

  const monogramBuf = Buffer.from(cleanB64(results.monogramPng), 'base64');
  const badgeBuf = Buffer.from(cleanB64(results.badgePng), 'base64');

  // 1. Save to public/images/
  const imgDir = path.resolve(__dirname, '..', 'public', 'images');
  fs.writeFileSync(path.join(imgDir, 'royal-pr-monogram.png'), monogramBuf);
  fs.writeFileSync(path.join(imgDir, 'royal-pr-badge.png'), badgeBuf);

  // 2. Save icon files
  fs.writeFileSync(path.resolve(__dirname, '..', 'app', 'icon.png'), monogramBuf);
  fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'icon.png'), monogramBuf);

  // 3. Save to Brain artifacts directory for inspection
  const artifactDir = 'C:\\Users\\Prince\\.gemini\\antigravity\\brain\\93ef77eb-286f-46eb-953e-aefca3b2bf85';
  fs.writeFileSync(path.join(artifactDir, 'royal-pr-monogram.png'), monogramBuf);
  fs.writeFileSync(path.join(artifactDir, 'royal-pr-badge.png'), badgeBuf);

  // 4. Generate app/icon.svg with embedded high-DPI base64 image
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#05070D" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="1"/>
    </radialGradient>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="256"/>
    </clipPath>
  </defs>
  <rect width="512" height="512" fill="url(#bgGlow)" rx="96"/>
  <image href="data:image/png;base64,${cleanB64(results.monogramPng)}" width="512" height="512" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

  fs.writeFileSync(path.resolve(__dirname, '..', 'app', 'icon.svg'), svgContent, 'utf8');

  console.log('✓ All Royal PR Logo assets generated cleanly:');
  console.log('  - public/images/royal-pr-monogram.png (512x512)');
  console.log('  - public/images/royal-pr-badge.png (700x700)');
  console.log('  - app/icon.png');
  console.log('  - public/icon.png');
  console.log('  - app/icon.svg');

  await browser.close();
}

buildRoyalLogoAssets().catch((err) => {
  console.error('Build assets failed:', err);
  process.exit(1);
});
