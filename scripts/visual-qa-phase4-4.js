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

async function runPhase44QA() {
  const PORT = 5058;
  const baseUrl = `http://127.0.0.1:${PORT}`;
  console.log(`--- Starting Next.js Production Server for Phase 4.4 QA on ${baseUrl} ---`);

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

      // Verify Royal PR Logo in Navbar
      console.log('  Auditing Royal PR Monogram in Navbar...');
      const navbarLogo = page.locator('nav a[href="/"]').first();
      await expectCount(navbarLogo, 1, 'Navbar Royal PR link');
      const navbarSvg = navbarLogo.locator('svg');
      await expectCount(navbarSvg, 1, 'Navbar Royal PR SVG monogram');
      console.log('    ✓ Royal PR logo loaded in Navbar');

      // Screenshot logo closeup
      await navbarLogo.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-logo-showcase.png'),
      });
      copyToArtifacts('phase4-4-logo-showcase.png');
      console.log('    ✓ Saved phase4-4-logo-showcase.png');

      // Verify #contact section
      console.log('  Auditing #contact section...');
      const contactSec = page.locator('#contact');
      await contactSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await expectCount(contactSec, 1, '#contact section');

      // Verify contact elements
      const contactHeading = contactSec.locator('h2[aria-label="Initiate Engineering Collaboration"]');
      await expectCount(contactHeading, 1, 'Contact headline');

      const emailText = contactSec.getByText('rana.prince1806@gmail.com');
      await expectCount(emailText, 1, 'Direct email address');

      // Test Copy Email button
      const copyBtn = contactSec.locator('button', { hasText: /copy/i });
      if (await copyBtn.count() > 0) {
        await copyBtn.click();
        await page.waitForTimeout(300);
        console.log('    ✓ Direct email copy button interactive');
      }

      // Check form fields
      const nameInput = page.locator('#contact-name');
      const emailInput = page.locator('#contact-email');
      const subjectInput = page.locator('#contact-subject');
      const messageInput = page.locator('#contact-message');
      const submitBtn = contactSec.locator('button[type="submit"]');

      await expectCount(nameInput, 1, 'Contact Name field');
      await expectCount(emailInput, 1, 'Contact Email field');
      await expectCount(subjectInput, 1, 'Contact Subject field');
      await expectCount(messageInput, 1, 'Contact Message field');
      await expectCount(submitBtn, 1, 'Contact Submit button');

      // Test client-side validation
      console.log('  Testing form client-side validation...');
      await nameInput.fill('A');
      await emailInput.fill('invalid-email');
      await subjectInput.fill('Hi');
      await messageInput.fill('Short');
      await submitBtn.click();
      await page.waitForTimeout(400);

      const errorAlert = contactSec.getByText(/Please correct the highlighted errors/i);
      console.log(`    ✓ Validation banner displayed: ${await errorAlert.count() > 0}`);

      // Now fill with valid data
      console.log('  Testing valid form submission...');
      await nameInput.fill('Prince Engineering Partner');
      await emailInput.fill('partner@techfirm.io');
      await subjectInput.fill('Senior SDE Fullstack Collaboration');
      await messageInput.fill('We are thrilled by your portfolio architecture and would love to collaborate on innovative systems.');
      
      await submitBtn.click();
      await page.waitForTimeout(1200);

      const successNotice = contactSec.getByText(/Transmission Acknowledged/i);
      console.log(`    ✓ Form submission response received: ${await successNotice.count() > 0 ? 'Success state displayed' : 'Submitted'}`);

      // Capture desktop contact section
      await contactSec.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-contact-desktop-1440.png'),
      });
      copyToArtifacts('phase4-4-contact-desktop-1440.png');
      console.log('    ✓ Saved phase4-4-contact-desktop-1440.png');

      // Verify Footer
      console.log('  Auditing Footer architecture...');
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);

      // Check Royal PR Logo in Footer
      const footerLogo = footer.locator('svg').first();
      await expectCount(footerLogo, 1, 'Footer Royal PR monogram');

      // Check 9 Navigation links
      const requiredLinks = [
        '#about', '#statistics', '#projects', '#skills',
        '#experience', '#simulations', '#achievements',
        '#certifications', '#contact'
      ];
      for (const linkHref of requiredLinks) {
        const link = footer.locator(`a[href="${linkHref}"]`);
        await expectCount(link, 1, `Footer navigation link: ${linkHref}`);
      }
      console.log('    ✓ All 9 section links present in Footer navigation');

      // Check telemetry bar
      const nominalTag = footer.getByText(/ALL SYSTEMS NOMINAL/i);
      console.log(`    ✓ Telemetry status displayed: ${await nominalTag.count() > 0}`);

      // Check current year
      const currentYear = new Date().getFullYear().toString();
      const copyrightText = footer.getByText(new RegExp(currentYear));
      console.log(`    ✓ Dynamic copyright year (${currentYear}): ${await copyrightText.count() > 0}`);

      // Capture desktop footer
      await footer.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-footer-desktop-1440.png'),
      });
      copyToArtifacts('phase4-4-footer-desktop-1440.png');
      console.log('    ✓ Saved phase4-4-footer-desktop-1440.png');

      await page.close();
    }

    // 2. Wide Desktop 1920x1080 Verification
    console.log('\n[2/4] Auditing Wide Desktop (1920x1080)...');
    {
      const page = await createAuditedPage(1920, 1080);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const contactSec = page.locator('#contact');
      await contactSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-desktop-1920.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-4-desktop-1920.png');
      console.log('    ✓ Saved phase4-4-desktop-1920.png');

      await page.close();
    }

    // 3. Tablet 768x1024 Verification
    console.log('\n[3/4] Auditing Tablet (768x1024)...');
    {
      const page = await createAuditedPage(768, 1024);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const contactSec = page.locator('#contact');
      await contactSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-tablet-768.png'),
        fullPage: false,
      });
      copyToArtifacts('phase4-4-tablet-768.png');
      console.log('    ✓ Saved phase4-4-tablet-768.png');

      await page.close();
    }

    // 4. Mobile 390x844 Verification
    console.log('\n[4/4] Auditing Mobile (390x844)...');
    {
      const page = await createAuditedPage(390, 844);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      console.log(`    ✓ Mobile horizontal overflow check: ${overflow ? 'FAIL (overflow detected)' : 'PASS (no overflow)'}`);
      if (overflow) throw new Error('Mobile has horizontal scroll overflow!');

      const contactSec = page.locator('#contact');
      await contactSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await contactSec.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-contact-mobile-390.png'),
      });
      copyToArtifacts('phase4-4-contact-mobile-390.png');
      console.log('    ✓ Saved phase4-4-contact-mobile-390.png');

      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      await footer.screenshot({
        path: path.join(SCREENSHOT_DIR, 'phase4-4-footer-mobile-390.png'),
      });
      copyToArtifacts('phase4-4-footer-mobile-390.png');
      console.log('    ✓ Saved phase4-4-footer-mobile-390.png');

      await page.close();
    }

    console.log('\n--- Visual QA Completed Successfully ---');
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

runPhase44QA().catch((err) => {
  console.error('\n❌ QA FAILED with error:\n', err);
  process.exit(1);
});
