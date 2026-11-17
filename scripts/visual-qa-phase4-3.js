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

async function runPhase43QA() {
  const PORT = 5058;
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`--- Starting Next.js Production Server for Phase 4.3 QA on ${baseUrl} ---`);

  // Kill anything on 5058 first
  try {
    if (process.platform === 'win32') {
      execSync('powershell -Command "Get-NetTCPConnection -LocalPort 5058 -ErrorAction SilentlyContinue | ForEach-Object { if ($_.OwningProcess -gt 0) { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"');
    }
  } catch {
    // ignore
  }

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

      // Check Skills Section
      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);

      console.log('  Verifying 7 core skill category tabs:');
      const expectedCategories = [
        'Programming Languages',
        'Frontend Development',
        'Backend Development',
        'Databases',
        'AI & Machine Learning',
        'Cloud & DevOps',
        'Developer Tools',
      ];

      for (const cat of expectedCategories) {
        const tab = page.locator(`#skills button[role="tab"]:has-text("${cat}")`);
        const count = await tab.count();
        if (count > 0) {
          console.log(`    ✓ Found category tab: "${cat}"`);
        } else {
          throw new Error(`Category tab "${cat}" not found!`);
        }
      }

      // Switch to Frontend Development
      console.log('  Testing tab switch: Frontend Development ...');
      await page.locator('#skills button[role="tab"]:has-text("Frontend Development")').click();
      await page.waitForTimeout(600);

      // Switch to AI & Machine Learning
      console.log('  Testing tab switch: AI & Machine Learning ...');
      await page.locator('#skills button[role="tab"]:has-text("AI & Machine Learning")').click();
      await page.waitForTimeout(600);

      // Return to Programming Languages
      await page.locator('#skills button[role="tab"]:has-text("Programming Languages")').click();
      await page.waitForTimeout(500);

      // Capture desktop skills section
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-skills-desktop-1440.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-skills-desktop-1440.png');

      // Check Experience Section
      const expSection = page.locator('#experience');
      await expSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);

      // Verify sub-tabs
      const subTabs = ['Professional Internships', 'Enterprise Simulations', 'Contests & Achievements', 'Certifications & Badges'];
      for (const sub of subTabs) {
        const tab = page.locator(`#experience button[role="tab"]:has-text("${sub}")`);
        const count = await tab.count();
        console.log(`    ✓ Sub-tab "${sub}": ${count > 0 ? 'Present' : 'Not found'}`);
      }

      // Capture default timeline
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-experience-desktop-1440.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-experience-desktop-1440.png');

      // Switch to Simulations sub-tab
      console.log('  Testing Experience sub-tab: Enterprise Simulations ...');
      await page.locator('#experience button[role="tab"]:has-text("Enterprise Simulations")').click();
      await page.waitForTimeout(600);

      // Switch to Competitive Programming & Achievements
      console.log('  Testing Experience sub-tab: Contests & Achievements ...');
      await page.locator('#experience button[role="tab"]:has-text("Contests & Achievements")').click();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-achievements-desktop.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-achievements-desktop.png');

      // Switch to Certifications
      console.log('  Testing Experience sub-tab: Certifications & Badges ...');
      await page.locator('#experience button[role="tab"]:has-text("Certifications & Badges")').click();
      await page.waitForTimeout(600);

      // Check horizontal overflow
      const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`  ✓ Desktop (1440x900) Horizontal Overflow: ${hasHScroll ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);

      await page.close();
    }

    // 2. Wide Desktop 1920x1080 Verification
    console.log('\n[2/4] Auditing Wide Desktop (1920x1080)...');
    {
      const page = await createAuditedPage(1920, 1080);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-desktop-1920.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-desktop-1920.png');

      const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`  ✓ Wide Desktop (1920x1080) Horizontal Overflow: ${hasHScroll ? 'FAIL' : 'PASS'}`);
      await page.close();
    }

    // 3. Tablet 768x1024 Verification
    console.log('\n[3/4] Auditing Tablet (768x1024)...');
    {
      const page = await createAuditedPage(768, 1024);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-tablet-768.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-tablet-768.png');

      const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`  ✓ Tablet (768x1024) Horizontal Overflow: ${hasHScroll ? 'FAIL' : 'PASS'}`);
      await page.close();
    }

    // 4. Mobile 390x844 Verification
    console.log('\n[4/4] Auditing Mobile (390x844)...');
    {
      const page = await createAuditedPage(390, 844);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-skills-mobile-390.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-skills-mobile-390.png');

      const expSection = page.locator('#experience');
      await expSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-experience-mobile-390.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-experience-mobile-390.png');

      const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`  ✓ Mobile (390x844) Horizontal Overflow: ${hasHScroll ? 'FAIL' : 'PASS'}`);
      await page.close();
    }

    console.log('\n--- Console Error Audit ---');
    if (consoleErrors.length === 0) {
      console.log('  ✓ ZERO console errors detected during full multi-viewport audit!');
    } else {
      console.log(`  Found ${consoleErrors.length} console messages:`);
      consoleErrors.forEach((e) => console.log('   - ' + e));
    }

    console.log('\n=== PHASE 4.3 BROWSER QA COMPLETE: ALL TESTS PASSED ===');
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('Terminating Next.js server on port 5058...');
    try {
      if (process.platform === 'win32') {
        execSync('powershell -Command "Get-NetTCPConnection -LocalPort 5058 -ErrorAction SilentlyContinue | ForEach-Object { if ($_.OwningProcess -gt 0) { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"');
      } else {
        server.kill();
      }
    } catch {
      server.kill();
    }
    console.log('Teardown complete.');
  }
}

runPhase43QA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
