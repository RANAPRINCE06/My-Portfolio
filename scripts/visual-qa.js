const { chromium } = require('playwright');
const http = require('http');
const net = require('net');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1366x768', width: 1366, height: 768 },
  { name: 'laptop-1280x800', width: 1280, height: 800 },
  { name: 'laptop-1024x768', width: 1024, height: 768 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-430x932', width: 430, height: 932 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-375x812', width: 375, height: 812 },
];

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 500) resolve();
          else reject(new Error('Status: ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(8000, () => req.destroy());
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw new Error('Server timed out waiting for ' + url);
}

async function runVisualQA() {
  const PORT = 5050;
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`--- Starting Next.js Production Server for Visual QA on ${baseUrl} ---`);
  const server = spawn('npm.cmd', ['run', 'start', '--', '-H', '127.0.0.1', '-p', String(PORT)], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    const s = d.toString().trim();
    if (s) console.log(`[Next] ${s}`);
  });
  server.stderr.on('data', (d) => {
    const s = d.toString().trim();
    if (s) console.error(`[Next Error] ${s}`);
  });

  try {
    console.log(`Waiting for ${baseUrl} ...`);
    await waitForServer(baseUrl);
    console.log('Server is UP! Launching Chromium...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    console.log(`Navigating to ${baseUrl} ...`);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const auditResults = [];

    for (const vp of VIEWPORTS) {
      console.log(`Evaluating viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(600);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          hasOverflow: docWidth > winWidth,
          docWidth,
          winWidth,
        };
      });

      // Check section element visibility & scroll offset
      const sectionChecks = await page.evaluate(() => {
        const check = (selector) => {
          const el = document.querySelector(selector);
          if (!el) return { exists: false };
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          return {
            exists: true,
            visible: rect.width > 0 && rect.height > 0,
            scrollMarginTop: computed.scrollMarginTop,
          };
        };
        return {
          hero: check('#hero'),
          about: check('#about'),
          statistics: check('#statistics'),
          projects: check('#projects'),
          skills: check('#skills'),
          achievements: check('#achievements'),
          contact: check('#contact'),
        };
      });

      // Save screenshot
      const shotPath = path.join(SCREENSHOT_DIR, `${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      auditResults.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        hasHorizontalOverflow: overflow.hasOverflow,
        docWidth: overflow.docWidth,
        winWidth: overflow.winWidth,
        sections: sectionChecks,
        screenshot: shotPath,
      });

      console.log(`  -> Overflow: ${overflow.hasOverflow}, Sections: about=${sectionChecks.about.exists}, achievements=${sectionChecks.achievements.exists}`);
    }

    // Interactive element testing
    console.log('\n--- Testing Interactive Elements ---');
    // Test Category filter tabs
    const categories = ['AI & Machine Learning', 'Full-Stack Web', 'Distributed Systems & Backend', 'All'];
    for (const cat of categories) {
      const btn = page.locator(`button[role="tab"]:has-text("${cat}")`).first();
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
        console.log(`  ✓ Clicked category tab: "${cat}"`);
      }
    }

    // Test expandable project details
    const detailBtn = page.locator('button:has-text("Architecture")').first();
    if (await detailBtn.isVisible()) {
      await detailBtn.click();
      await page.waitForTimeout(300);
      console.log('  ✓ Clicked ProjectCard "Architecture" detail toggle');
      await detailBtn.click();
    }

    // Test email copy button
    const copyBtn = page.locator('button[aria-label="Copy email address"]');
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
      await page.waitForTimeout(300);
      console.log('  ✓ Clicked Copy Email button');
    }

    await browser.close();

    const summaryPath = path.join(SCREENSHOT_DIR, 'audit-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify({
      consoleErrors,
      auditResults,
    }, null, 2));

    console.log(`\nVisual QA completed successfully! Summary written to ${summaryPath}`);
  } finally {
    console.log('Shutting down Next.js server...');
    if (server.pid) {
      try {
        spawn('taskkill.exe', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' });
      } catch {
        server.kill();
      }
    }
  }
}

runVisualQA().catch((err) => {
  console.error('Visual QA run failed:', err);
  process.exit(1);
});
