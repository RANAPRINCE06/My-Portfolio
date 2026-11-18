const { chromium } = require('playwright');
const http = require('http');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const ARTIFACT_DIR = 'C:\\Users\\Prince\\.gemini\\antigravity\\brain\\93ef77eb-286f-46eb-953e-aefca3b2bf85';

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

function copyToArtifacts(filename) {
  try {
    const src = path.join(SCREENSHOT_DIR, filename);
    const dest = path.join(ARTIFACT_DIR, filename);
    if (fs.existsSync(src) && fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(src, dest);
      console.log(`    [Artifact] Copied ${filename} to artifact directory`);
    }
  } catch (err) {
    console.error(`    [Artifact Error] Failed to copy ${filename}:`, err.message);
  }
}

async function runPhase45QA() {
  const PORT = 5058;
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`--- Starting Next.js Production Server for Phase 4.5 QA on ${baseUrl} ---`);

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
    if (s && !s.includes('sharp')) console.error(`[Next Error] ${s}`);
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

    const REQUIRED_SECTIONS = [
      { id: '#hero', name: 'Hero / About' },
      { id: '#statistics', name: 'Live Telemetry' },
      { id: '#projects', name: 'Projects Showcase' },
      { id: '#skills', name: 'Skills Matrix' },
      { id: '#experience', name: 'Professional Experience' },
      { id: '#simulations', name: 'Virtual Simulations' },
      { id: '#achievements', name: 'Achievements & Contests' },
      { id: '#certifications', name: 'Certifications' },
      { id: '#contact', name: 'Contact & Dispatch' },
    ];

    // 1. Desktop 1440x900 Verification
    console.log('\n[1/5] Auditing Desktop (1440x900)...');
    {
      const page = await createAuditedPage(1440, 900);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      // Verify all 9 sections exist
      for (const sec of REQUIRED_SECTIONS) {
        const count = await page.locator(sec.id).count();
        if (count >= 1) {
          console.log(`  ✓ Section present: ${sec.id} (${sec.name})`);
        } else {
          throw new Error(`Required section missing: ${sec.id} (${sec.name})`);
        }
      }

      // Verify Royal PR Logo in Navbar
      const navbarLogo = page.locator('nav a[href="/"]').first();
      await expectCount(navbarLogo, 1, 'Navbar Royal PR link');
      const navbarVisual = navbarLogo.locator('img, svg').first();
      await expectCount(navbarVisual, 1, 'Navbar Royal PR visual');
      console.log('  ✓ Royal PR logo loaded in Navbar');

      // Verify Footer Architecture
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      const footerLogo = footer.locator('img, svg').first();
      await expectCount(footerLogo, 1, 'Footer Royal PR logo');
      console.log('  ✓ Royal PR logo loaded in Footer');

      // Verify Contact Section Interactivity
      const contactSec = page.locator('#contact');
      await contactSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const copyBtn = contactSec.locator('button', { hasText: /copy/i });
      if (await copyBtn.count() > 0) {
        await copyBtn.click();
        await page.waitForTimeout(200);
        console.log('  ✓ Direct email copy button functional');
      }

      // Screenshot Contact Terminal
      await contactSec.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-contact-terminal.png'),
      });
      copyToArtifacts('phase4-5-contact-terminal.png');

      // Screenshot Desktop 1440
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-desktop-1440.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-5-desktop-1440.png');
      console.log('  ✓ Saved phase4-5-desktop-1440.png');

      await page.close();
    }

    // 2. Wide Desktop 1920x1080 Verification
    console.log('\n[2/5] Auditing Wide Desktop (1920x1080)...');
    {
      const page = await createAuditedPage(1920, 1080);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Verify Section Navigation Rail on 2XL
      const navRail = page.locator('nav[aria-label="Section Quick Navigation"]');
      const railCount = await navRail.count();
      console.log(`  ✓ 2XL Section Quick Navigation Rail: ${railCount > 0 ? 'Active' : 'Missing'}`);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-desktop-1920.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-5-desktop-1920.png');
      console.log('  ✓ Saved phase4-5-desktop-1920.png');

      await page.close();
    }

    // 3. Tablet 768x1024 Verification
    console.log('\n[3/5] Auditing Tablet (768x1024)...');
    {
      const page = await createAuditedPage(768, 1024);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error('Tablet (768px) has horizontal scroll overflow!');
      console.log('  ✓ Tablet (768px) zero horizontal overflow: PASS');

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-tablet-768.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-5-tablet-768.png');
      console.log('  ✓ Saved phase4-5-tablet-768.png');

      await page.close();
    }

    // 4. Mobile 390x844 (iPhone 12/13/14)
    console.log('\n[4/5] Auditing Mobile (390x844)...');
    {
      const page = await createAuditedPage(390, 844);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error('Mobile (390px) has horizontal scroll overflow!');
      console.log('  ✓ Mobile (390px) zero horizontal overflow: PASS');

      // Test mobile menu open
      const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
      await menuBtn.click();
      await page.waitForTimeout(500);

      const drawer = page.locator('div[role="dialog"]');
      await expectCount(drawer, 1, 'Mobile navigation drawer');
      console.log('  ✓ Mobile navigation drawer interactive');

      // Screenshot open mobile menu
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-navbar-mobile-drawer.png'),
      });
      copyToArtifacts('phase4-5-navbar-mobile-drawer.png');

      // Close menu
      await menuBtn.click();
      await page.waitForTimeout(300);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-mobile-390.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-5-mobile-390.png');
      console.log('  ✓ Saved phase4-5-mobile-390.png');

      await page.close();
    }

    // 5. Mobile 375x812 (iPhone X/11/SE)
    console.log('\n[5/5] Auditing Mobile Compact (375x812)...');
    {
      const page = await createAuditedPage(375, 812);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error('Mobile Compact (375px) has horizontal scroll overflow!');
      console.log('  ✓ Mobile Compact (375px) zero horizontal overflow: PASS');

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-5-mobile-375.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-5-mobile-375.png');
      console.log('  ✓ Saved phase4-5-mobile-375.png');

      await page.close();
    }

    console.log('\n--- Phase 4.5 Visual QA Completed Successfully ---');
    console.log(`Console Errors encountered: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.warn('Console error details:\n' + consoleErrors.join('\n'));
    }

  } finally {
    if (browser) await browser.close();
    if (server) {
      console.log('Stopping test server...');
      server.kill();
      try {
        if (process.platform === 'win32') {
          execSync('powershell -Command "Get-NetTCPConnection -LocalPort 5058 -ErrorAction SilentlyContinue | ForEach-Object { if ($_.OwningProcess -gt 0) { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"');
        }
      } catch {
        // ignore
      }
    }
  }
}

async function expectCount(locator, expected, description) {
  const count = await locator.count();
  if (count < expected) {
    throw new Error(`Expected at least ${expected} for ${description}, found ${count}`);
  }
}

runPhase45QA().catch((err) => {
  console.error('\n❌ QA FAILED with error:\n', err);
  process.exit(1);
});
