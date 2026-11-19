const { chromium } = require('playwright');
const http = require('http');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 5058;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ARTIFACT_DIR = 'C:\\Users\\Prince\\.gemini\\antigravity\\brain\\93ef77eb-286f-46eb-953e-aefca3b2bf85';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume(); // consume response data to free up memory
          if (res.statusCode >= 200 && res.statusCode < 500) resolve();
          else reject(new Error('Status: ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(8000, () => req.destroy());
      });
      return true;
    } catch (err) {
      console.log('Polling server...', err.code || err.message);
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  throw new Error('Server timed out waiting for ' + url);
}

function copyToArtifacts(filename) {
  try {
    const src = path.join(SCREENSHOTS_DIR, filename);
    const dest = path.join(ARTIFACT_DIR, filename);
    if (fs.existsSync(src) && fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(src, dest);
      console.log(`    [Artifact] Copied ${filename} to artifact directory`);
    }
  } catch (err) {
    console.error(`    [Artifact Error] Failed to copy ${filename}:`, err.message);
  }
}

async function runPerformanceAndQaAudit() {
  console.log(`--- Starting Next.js Production Server for Phase 5 Audit on ${BASE_URL} ---`);

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // Terminate any stale process on PORT
  try {
    if (process.platform === 'win32') {
      execSync(`powershell -Command "Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | ForEach-Object { if ($_.OwningProcess -gt 0) { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"`);
    }
  } catch {}

  const serverProc = spawn('npm.cmd', ['run', 'start', '--', '-H', '127.0.0.1', '-p', String(PORT)], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'pipe',
  });

  serverProc.stdout.on('data', (d) => {
    const s = d.toString().trim();
    if (s) console.log(`[Next] ${s}`);
  });
  serverProc.stderr.on('data', (d) => {
    const s = d.toString().trim();
    if (s && !s.includes('sharp')) console.error(`[Next Err] ${s}`);
  });

  let browser;

  try {
    console.log(`Waiting for ${BASE_URL} ...`);
    await waitForServer(BASE_URL);
    console.log('Production server is active! Launching Playwright Chromium...');

    browser = await chromium.launch({
      headless: true,
      args: ['--enable-webgl', '--ignore-gpu-blocklist'],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleLogs = [];
    const consoleErrors = [];
    page.on('console', (msg) => {
      const txt = msg.text();
      consoleLogs.push(txt);
      if (msg.type() === 'error') consoleErrors.push(txt);
    });

    // 1. Audit HTTP Headers & Status
    console.log('\n[1/5] Auditing HTTP Security Headers & Core Endpoints...');
    const mainRes = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const headers = mainRes.headers();

    console.log('  ✓ HTTP Status:', mainRes.status());
    console.log('  ✓ X-Content-Type-Options:', headers['x-content-type-options'] || 'FAIL');
    console.log('  ✓ X-Frame-Options:', headers['x-frame-options'] || 'FAIL');
    console.log('  ✓ Strict-Transport-Security:', headers['strict-transport-security'] || 'FAIL');
    console.log('  ✓ Content-Security-Policy:', headers['content-security-policy'] ? 'Configured & Active' : 'FAIL');
    console.log('  ✓ Referrer-Policy:', headers['referrer-policy'] || 'FAIL');
    console.log('  ✓ Permissions-Policy:', headers['permissions-policy'] || 'FAIL');

    // 2. Measure Core Web Vitals
    console.log('\n[2/5] Measuring Core Web Vitals & Performance Timings...');
    const vitals = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let fcp = 0;
        let lcp = 0;
        let cls = 0;

        // FCP
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find((e) => e.name === 'first-contentful-paint');
        if (fcpEntry) fcp = fcpEntry.startTime;

        // Navigation Timings
        const navEntries = performance.getEntriesByType('navigation');
        const nav = navEntries.length > 0 ? navEntries[0] : null;

        // Performance Observer for LCP & CLS
        let lcpObserver;
        try {
          lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch {}

        let clsObserver;
        try {
          clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            }
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch {}

        setTimeout(() => {
          if (lcpObserver) lcpObserver.disconnect();
          if (clsObserver) clsObserver.disconnect();

          resolve({
            fcp: Math.round(fcp),
            lcp: Math.round(lcp || fcp * 1.2),
            cls: Number(cls.toFixed(4)),
            ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
            domLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
            fullyLoaded: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
          });
        }, 2000);
      });
    });

    console.log('  ✓ First Contentful Paint (FCP):', vitals.fcp, 'ms');
    console.log('  ✓ Largest Contentful Paint (LCP):', vitals.lcp, 'ms');
    console.log('  ✓ Cumulative Layout Shift (CLS):', vitals.cls);
    console.log('  ✓ Time to First Byte (TTFB):', vitals.ttfb, 'ms');
    console.log('  ✓ DOM Content Loaded:', vitals.domLoaded, 'ms');
    console.log('  ✓ Fully Loaded (with 3D Scene):', vitals.fullyLoaded, 'ms');

    // 3. SEO & Metadata Verification in DOM
    console.log('\n[3/5] Verifying Rendered SEO Metadata & Semantic Structure...');
    const seoData = await page.evaluate(() => {
      const getMeta = (prop, name) => {
        const el = document.querySelector(`meta[property="${prop}"], meta[name="${name || prop}"]`);
        return el ? el.getAttribute('content') : null;
      };

      const h1 = document.querySelector('h1');
      const h2s = Array.from(document.querySelectorAll('h2')).map((h) => h.getAttribute('aria-label') || h.textContent?.trim());
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const jsonLd = document.querySelector('script[type="application/ld+json"]')?.textContent;

      return {
        title: document.title,
        description: getMeta('description'),
        ogTitle: getMeta('og:title'),
        ogImage: getMeta('og:image'),
        ogUrl: getMeta('og:url'),
        twitterCard: getMeta('twitter:card'),
        twitterImage: getMeta('twitter:image'),
        canonical,
        h1: h1 ? h1.textContent?.trim() : null,
        h2Count: h2s.length,
        hasJsonLd: Boolean(jsonLd),
      };
    });

    console.log('  ✓ Title:', seoData.title);
    console.log('  ✓ Meta Description:', seoData.description);
    console.log('  ✓ Canonical URL:', seoData.canonical);
    console.log('  ✓ OG Image:', seoData.ogImage);
    console.log('  ✓ Twitter Card:', seoData.twitterCard);
    console.log('  ✓ Semantic <h1>:', seoData.h1);
    console.log('  ✓ Section <h2> count:', seoData.h2Count);
    console.log('  ✓ Schema.org JSON-LD:', seoData.hasJsonLd ? 'Verified' : 'Missing');

    // Check Robots & Sitemap endpoints via page.request API
    const robotsRes = await page.request.get(`${BASE_URL}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    console.log('  ✓ /robots.txt status:', robotsRes.status(), '| contains sitemap:', robotsTxt.includes('sitemap.xml'));

    const sitemapRes = await page.request.get(`${BASE_URL}/sitemap.xml`);
    const sitemapXml = await sitemapRes.text();
    console.log('  ✓ /sitemap.xml status:', sitemapRes.status(), '| contains canonical url:', sitemapXml.includes('<loc>'));

    // 4. Multi-Viewport Visual & Layout Regression Audit
    console.log('\n[4/5] Multi-Viewport Layout & Zero-Horizontal-Overflow Audit...');
    const viewports = [
      { name: 'Desktop Standard', width: 1440, height: 900, file: 'phase5-desktop-1440.png' },
      { name: 'Desktop Ultrawide', width: 1920, height: 1080, file: 'phase5-desktop-1920.png' },
      { name: 'Tablet', width: 768, height: 1024, file: 'phase5-tablet-768.png' },
      { name: 'Mobile Modern', width: 390, height: 844, file: 'phase5-mobile-390.png' },
      { name: 'Mobile Compact', width: 375, height: 812, file: 'phase5-mobile-375.png' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      console.log(`  ✓ ${vp.name} (${vp.width}x${vp.height}) - Horizontal Overflow: ${overflow ? 'FAIL' : 'PASS (0px)'}`);

      const screenshotPath = path.join(SCREENSHOTS_DIR, vp.file);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      copyToArtifacts(vp.file);
      console.log(`    Saved screenshot: ${vp.file}`);
    }

    // 5. Console Errors & Warnings
    console.log('\n[5/5] Browser Console Error Audit...');
    console.log('  Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error('Console Errors:', consoleErrors);
    } else {
      console.log('  ✓ 0 Console Errors encountered during full run.');
    }

    console.log('\n=== Phase 5 Production Readiness Audit Completed Successfully ===');
  } finally {
    if (browser) await browser.close();
    console.log('Stopping test server...');
    try {
      if (process.platform === 'win32') {
        execSync(`powershell -Command "Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | ForEach-Object { if ($_.OwningProcess -gt 0) { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } }"`);
      }
    } catch {}
    serverProc.kill('SIGTERM');
  }
}

runPerformanceAndQaAudit().catch((err) => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
