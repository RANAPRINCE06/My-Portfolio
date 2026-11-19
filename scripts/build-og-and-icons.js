const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function buildOgAndIcons() {
  console.log('--- Generating High-Fidelity Open Graph & Optimized Icon Assets ---');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const srcLogoPath = path.resolve(__dirname, '..', 'public', 'images', 'royal-pr-monogram.png');
  const srcBase64 = fs.readFileSync(srcLogoPath).toString('base64');
  const logoDataUri = 'data:image/png;base64,' + srcBase64;

  // 1. Build 1200x630 Open Graph Image
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          width: 1200px;
          height: 630px;
          background: #030712;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #F8FAFC;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 60px 80px;
        }

        /* Ambient Cybernetic Lighting */
        .ambient-glow-1 {
          position: absolute;
          width: 700px;
          height: 700px;
          top: -200px;
          left: -150px;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(138, 43, 226, 0.08) 50%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }
        
        .ambient-glow-2 {
          position: absolute;
          width: 600px;
          height: 600px;
          bottom: -200px;
          right: -100px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }

        /* Subtle Cyber Grid */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
          pointer-events: none;
        }

        .border-glow {
          position: absolute;
          inset: 20px;
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 20px;
          box-shadow: inset 0 0 40px rgba(0, 240, 255, 0.04);
          pointer-events: none;
        }

        .corner-accent {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #00F0FF;
          border-style: solid;
        }
        .corner-tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

        .content-left {
          position: relative;
          z-index: 10;
          max-width: 680px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.3);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #00F0FF;
          margin-bottom: 24px;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00F0FF;
          box-shadow: 0 0 8px #00F0FF;
        }

        h1.title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 64px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin-bottom: 14px;
          color: #FFFFFF;
        }

        h2.subtitle {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 26px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #00F0FF 0%, #38BDF8 40%, #818CF8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p.description {
          font-size: 16px;
          line-height: 1.6;
          color: #94A3B8;
          margin-bottom: 32px;
          max-width: 600px;
        }

        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tag {
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #CBD5E1;
        }

        .tag.accent {
          border-color: rgba(0, 240, 255, 0.25);
          color: #67E8F9;
        }

        .content-right {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .logo-aura {
          position: relative;
          width: 320px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-aura::before {
          content: '';
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(138, 43, 226, 0.15) 50%, transparent 75%);
          filter: blur(24px);
        }

        .logo-img {
          position: relative;
          width: 300px;
          height: 300px;
          object-fit: contain;
          border-radius: 50%;
          filter: drop-shadow(0 0 30px rgba(0, 240, 255, 0.45));
        }

        .watermark {
          position: absolute;
          bottom: 34px;
          right: 50px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(148, 163, 184, 0.6);
          display: flex;
          align-items: center;
          gap: 8px;
        }
      </style>
    </head>
    <body>
      <div class="ambient-glow-1"></div>
      <div class="ambient-glow-2"></div>
      <div class="grid-overlay"></div>
      <div class="border-glow"></div>
      <div class="corner-accent corner-tl"></div>
      <div class="corner-accent corner-tr"></div>
      <div class="corner-accent corner-bl"></div>
      <div class="corner-accent corner-br"></div>

      <div class="content-left">
        <div class="badge-pill">
          <div class="pulse-dot"></div>
          <span>Royal PR &bull; SDE &bull; AI Portfolio</span>
        </div>
        <h1 class="title">Prince Rana</h1>
        <h2 class="subtitle">Software Development &amp; Artificial Intelligence</h2>
        <p class="description">
          High-performance full-stack architecture, algorithmic problem solving (LeetCode Knight, Codeforces Specialist), and intelligent AI systems.
        </p>
        <div class="tags-row">
          <div class="tag accent">Next.js 14 &bull; TypeScript</div>
          <div class="tag accent">Three.js &bull; Shaders</div>
          <div class="tag">Distributed Systems</div>
          <div class="tag">AI &amp; NLP Agents</div>
          <div class="tag">1,100+ Problems Solved</div>
        </div>
      </div>

      <div class="content-right">
        <div class="logo-aura">
          <img class="logo-img" src="${logoDataUri}" alt="Prince Rana Royal PR Monogram" />
        </div>
      </div>

      <div class="watermark">
        <span>RANAPRINCE.DEV</span>
        <span>&bull;</span>
        <span>OFFICIAL VERIFIED PORTFOLIO</span>
      </div>
    </body>
    </html>
  `);

  // Wait for Google fonts and image to load
  await page.waitForTimeout(1000);

  const ogBuffer = await page.screenshot({ type: 'png' });
  const ogPath1 = path.resolve(__dirname, '..', 'public', 'images', 'og-image.png');
  const ogPath2 = path.resolve(__dirname, '..', 'app', 'opengraph-image.png');
  fs.writeFileSync(ogPath1, ogBuffer);
  fs.writeFileSync(ogPath2, ogBuffer);
  console.log('✓ Generated public/images/og-image.png (1200x630):', (ogBuffer.length / 1024).toFixed(1), 'KB');
  console.log('✓ Generated app/opengraph-image.png (1200x630):', (ogBuffer.length / 1024).toFixed(1), 'KB');

  // 2. Generate Optimized Favicons and App Icons
  // A clean 128x128 / 180x180 canvas rendering from monogram
  await page.setViewportSize({ width: 256, height: 256 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:transparent; display:flex; align-items:center; justify-content:center; width:256px; height:256px;">
        <img id="iconImg" src="${logoDataUri}" style="width:256px; height:256px; object-fit:contain; border-radius:50%;" />
      </body>
    </html>
  `);

  const iconBuffer = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'icon.png'), iconBuffer);
  fs.writeFileSync(path.resolve(__dirname, '..', 'app', 'icon.png'), iconBuffer);
  fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'apple-icon.png'), iconBuffer);
  fs.writeFileSync(path.resolve(__dirname, '..', 'app', 'apple-icon.png'), iconBuffer);
  console.log('✓ Generated optimized app/icon.png & public/icon.png (256x256):', (iconBuffer.length / 1024).toFixed(1), 'KB');

  // Copy to Brain Artifact directory for presentation
  const artifactDir = 'C:\\Users\\Prince\\.gemini\\antigravity\\brain\\93ef77eb-286f-46eb-953e-aefca3b2bf85';
  if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'phase5-og-image.png'), ogBuffer);
    console.log('✓ Copied phase5-og-image.png to brain artifact directory');
  }

  await browser.close();
  console.log('--- Social Sharing & Icon Generation Complete ---');
}

buildOgAndIcons().catch((err) => {
  console.error('Error generating OG and icon assets:', err);
  process.exit(1);
});
