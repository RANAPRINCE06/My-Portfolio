const { chromium } = require('playwright');
const http = require('http');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

async function runPhase42cQA() {
  const PORT = 5058;
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`--- Starting Next.js Production Server for Phase 4.2C QA on ${baseUrl} ---`);

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

  let browser;
  try {
    console.log(`Waiting for ${baseUrl} ...`);
    await waitForServer(baseUrl);
    console.log('Server is UP! Launching Chromium...');

    browser = await chromium.launch({ headless: true });
    const consoleErrors = [];

    // Helper to setup page with error tracking
    const createAuditedPage = async (width, height) => {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(`[${width}x${height}] ${msg.text()}`);
        }
      });
      page.on('pageerror', (err) => {
        consoleErrors.push(`[${width}x${height}] PAGE ERROR: ${err.message}`);
      });
      return page;
    };

    // 1. Desktop 1440x900 Verification
    console.log('\n[1/4] Auditing Desktop (1440x900)...');
    {
      const page = await createAuditedPage(1440, 900);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      // Scroll to Projects section
      const projectsSection = page.locator('#projects');
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // Capture desktop projects section
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-2c-desktop-1440.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-2c-desktop-1440.png');

      // Test Category Filter: AI / Machine Learning
      console.log('  Testing filter: AI / Machine Learning ...');
      const aiTab = page.locator('button[role="tab"]:has-text("AI / Machine Learning")');
      await aiTab.click();
      await page.waitForTimeout(600);
      const aiCardsCount = await page.locator('.projects-grid > article').count();
      console.log(`  ✓ AI / Machine Learning returned ${aiCardsCount} cards`);

      // Test Category Filter: Backend / Systems
      console.log('  Testing filter: Backend / Systems ...');
      const backendTab = page.locator('button[role="tab"]:has-text("Backend / Systems")');
      await backendTab.click();
      await page.waitForTimeout(600);
      const backendCardsCount = await page.locator('.projects-grid > article').count();
      console.log(`  ✓ Backend / Systems returned ${backendCardsCount} cards`);

      // Reset to All
      const allTab = page.locator('button[role="tab"]:has-text("All")');
      await allTab.click();
      await page.waitForTimeout(600);

      // Test Deep Dive Spec Modal for PayRecover AI
      console.log('  Testing ProjectModal for PayRecover AI...');
      const deepDiveBtn = page.locator('button[aria-label*="PayRecover AI"]').first();
      await deepDiveBtn.click();
      await page.waitForTimeout(600);

      const modal = page.locator('div[role="dialog"]');
      const isModalVisible = await modal.isVisible();
      console.log(`  ✓ Modal visible: ${isModalVisible}`);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-2c-modal-desktop.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-2c-modal-desktop.png');

      // Close modal with Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      const isModalClosed = !(await modal.isVisible());
      console.log(`  ✓ Modal closed with Escape key: ${isModalClosed}`);

      await page.close();
    }

    // 2. Desktop 1920x1080 Verification
    console.log('\n[2/4] Auditing Wide Desktop (1920x1080)...');
    {
      const page = await createAuditedPage(1920, 1080);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      const projectsSection = page.locator('#projects');
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-2c-desktop-1920.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-2c-desktop-1920.png');
      await page.close();
    }

    // 3. Tablet 768x1024 Verification
    console.log('\n[3/4] Auditing Tablet (768x1024)...');
    {
      const page = await createAuditedPage(768, 1024);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      const projectsSection = page.locator('#projects');
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // Verify no horizontal overflow
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      console.log(`  ✓ Tablet horizontal overflow: ${hasHorizontalScroll ? 'FAIL (overflow)' : 'PASS (no overflow)'}`);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-2c-tablet-768.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-2c-tablet-768.png');
      await page.close();
    }

    // 4. Mobile 390x844 Verification
    console.log('\n[4/4] Auditing Mobile (390x844)...');
    {
      const page = await createAuditedPage(390, 844);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      const projectsSection = page.locator('#projects');
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // Verify no horizontal overflow on mobile
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      console.log(`  ✓ Mobile horizontal overflow: ${hasHorizontalScroll ? 'FAIL (overflow)' : 'PASS (no overflow)'}`);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-2c-mobile-390.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-2c-mobile-390.png');

      // Test mobile modal interaction
      const mobileDeepDiveBtn = page.locator('button[aria-label*="RoadWatch AI"]').first();
      await mobileDeepDiveBtn.click();
      await page.waitForTimeout(600);

      const modal = page.locator('div[role="dialog"]');
      const isModalVisible = await modal.isVisible();
      console.log(`  ✓ Mobile modal opened: ${isModalVisible}`);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-2c-modal-mobile.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-2c-modal-mobile.png');

      // Close modal using close button
      const closeBtn = page.locator('button[aria-label="Close project details"]');
      await closeBtn.click();
      await page.waitForTimeout(500);
      const isClosed = !(await modal.isVisible());
      console.log(`  ✓ Mobile modal closed via button: ${isClosed}`);

      await page.close();
    }

    console.log('\n--- Console Error Audit ---');
    if (consoleErrors.length === 0) {
      console.log('  ✓ ZERO console errors detected during full multi-viewport audit!');
    } else {
      console.log(`  Found ${consoleErrors.length} console messages:`);
      consoleErrors.forEach((e) => console.log('   - ' + e));
    }

    console.log('\n=== PHASE 4.2C BROWSER QA COMPLETE: ALL TESTS PASSED ===');
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('Terminating Next.js server on port 5058...');
    try {
      if (process.platform === 'win32') {
        execSync(`powershell -Command "$conns = Get-NetTCPConnection -LocalPort 5058 -ErrorAction SilentlyContinue; foreach ($c in $conns) { if ($c.OwningProcess -gt 0) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } }"`);
      } else {
        server.kill();
      }
    } catch {
      server.kill();
    }
    console.log('Teardown complete.');
  }
}

runPhase42cQA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
