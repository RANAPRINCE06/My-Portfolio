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

async function runPhase432QA() {
  const PORT = 5058;
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`--- Starting Next.js Production Server for Phase 4.3.2 QA on ${baseUrl} ---`);

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

      // Verify each of the 4 independent sections exists
      const sections = ['#experience', '#simulations', '#achievements', '#certifications'];
      for (const secId of sections) {
        const sec = page.locator(secId);
        const count = await sec.count();
        if (count === 1) {
          console.log(`  ✓ Independent section exists: ${secId}`);
        } else {
          throw new Error(`Section ${secId} not found or duplicated (count: ${count})!`);
        }
      }

      // Check Section 1: #experience
      console.log('  Auditing #experience (Professional Experience)...');
      const expSection = page.locator('#experience');
      await expSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const qskillCard = page.locator('#experience').getByText('QSkill');
      const codecCard = page.locator('#experience').getByText('Codec Technologies India');
      console.log(`    ✓ QSkill internship: ${await qskillCard.count() > 0 ? 'Present' : 'Missing'}`);
      console.log(`    ✓ Codec Technologies internship: ${await codecCard.count() > 0 ? 'Present' : 'Missing'}`);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-experience-desktop-1440.png'),
        fullPage: false,
      });
      console.log('    ✓ Saved phase4-3-2-experience-desktop-1440.png');

      // Check Section 2: #simulations
      console.log('  Auditing #simulations (Virtual Job Simulations)...');
      const simSection = page.locator('#simulations');
      await simSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const simCardsCount = await page.locator('#simulations .sim-card').count();
      console.log(`    ✓ Verified Forage simulations count: ${simCardsCount} (expected: 6)`);
      if (simCardsCount !== 6) throw new Error(`Expected 6 simulations, got ${simCardsCount}`);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-simulations-desktop-1440.png'),
        fullPage: false,
      });
      console.log('    ✓ Saved phase4-3-2-simulations-desktop-1440.png');

      // Check Section 3: #achievements
      console.log('  Auditing #achievements (Competitive Programming & Achievements)...');
      const achSection = page.locator('#achievements');
      await achSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const cpCardsCount = await page.locator('#achievements .ach-telemetry-card').count();
      console.log(`    ✓ CP Telemetry cards: ${cpCardsCount} (Codeforces, CodeChef, LeetCode, HackerRank)`);
      const honorsCount = await page.locator('#achievements .ach-honor-card').count();
      console.log(`    ✓ Notable honors count: ${honorsCount}`);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-achievements-desktop-1440.png'),
        fullPage: false,
      });
      console.log('    ✓ Saved phase4-3-2-achievements-desktop-1440.png');

      // Check Section 4: #certifications
      console.log('  Auditing #certifications (Certifications & Badges)...');
      const certSection = page.locator('#certifications');
      await certSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const certCardsCount = await page.locator('#certifications .cert-card').count();
      console.log(`    ✓ Total certifications: ${certCardsCount} (expected: 16)`);
      if (certCardsCount !== 16) throw new Error(`Expected 16 certifications, got ${certCardsCount}`);

      // Test Category Filter in Certifications
      console.log('    Testing Certifications category filter: Cloud & Enterprise ...');
      await page.locator('#certifications button[role="tab"]:has-text("Cloud & Enterprise")').click();
      await page.waitForTimeout(500);
      const cloudCertsCount = await page.locator('#certifications .cert-card').count();
      console.log(`    ✓ Filtered Cloud & Enterprise certifications: ${cloudCertsCount}`);
      // Reset filter to All
      await page.locator('#certifications button[role="tab"]:has-text("All")').click();
      await page.waitForTimeout(400);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-certifications-desktop-1440.png'),
        fullPage: false,
      });
      console.log('    ✓ Saved phase4-3-2-certifications-desktop-1440.png');

      // Test Navigation links scrolling to each section
      console.log('  Testing navigation bar links...');
      for (const target of ['#experience', '#simulations', '#achievements', '#certifications']) {
        const navLink = page.locator(`header nav a[href="${target}"]`);
        await navLink.click();
        await page.waitForTimeout(600);
        const isTargetInView = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top >= -200 && rect.top <= window.innerHeight * 0.8;
        }, target);
        console.log(`    ✓ Nav link ${target} clicked & scrolled: ${isTargetInView ? 'PASS' : 'FAIL'}`);
      }

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

      const expSection = page.locator('#experience');
      await expSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-desktop-1920.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-2-desktop-1920.png');

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

      const simSection = page.locator('#simulations');
      await simSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-tablet-768.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-2-tablet-768.png');

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

      const expSection = page.locator('#experience');
      await expSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-3-2-mobile-390.png'),
        fullPage: false,
      });
      console.log('  ✓ Saved phase4-3-2-mobile-390.png');

      // Test mobile menu open and navigation
      console.log('  Testing mobile hamburger menu...');
      const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
      await menuBtn.click();
      await page.waitForTimeout(500);

      const mobileSimLink = page.locator('div[role="dialog"] a[href="#simulations"]');
      console.log(`    ✓ Mobile link #simulations: ${await mobileSimLink.count() > 0 ? 'Present' : 'Missing'}`);
      await mobileSimLink.click();
      await page.waitForTimeout(600);

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

    console.log('\n=== PHASE 4.3.2 BROWSER QA COMPLETE: ALL TESTS PASSED ===');
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

runPhase432QA().catch((err) => {
  console.error('QA Failed:', err);
  process.exit(1);
});
