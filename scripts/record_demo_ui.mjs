import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PORT = 4173;
const DIST_DIR = path.resolve('apps/mobile/dist');

// Simple static file server for apps/mobile/dist
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  const filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback
    const indexPath = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`[StaticServer] Serving ${DIST_DIR} at http://127.0.0.1:${PORT}`);

  const rawDir = path.resolve('docs/video_assets/raw_recording');
  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
    recordVideo: {
      dir: rawDir,
      size: { width: 860, height: 1864 }
    }
  });

  // Pre-seed initial state to skip onboarding or we can show onboarding briefly
  await context.addInitScript(() => {
    // Clear storage first so we can briefly show language onboarding, then select Hindi
    localStorage.clear();
  });

  const page = await context.newPage();
  console.log('[Playwright] Navigating to http://127.0.0.1:' + PORT);
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle' });

  // 1. Language Onboarding Screen (show 2.5s)
  console.log('[Playwright] Step 1: Language selection onboarding');
  await page.waitForTimeout(1500);
  
  // Click Hindi language option if present
  const hindiOption = page.locator('text=हिन्दी').first();
  if (await hindiOption.isVisible()) {
    await hindiOption.click();
    await page.waitForTimeout(800);
  }

  // Click continue / start button
  const continueBtn = page.locator('button:has-text("आगे बढ़ें"), button:has-text("शुरू करें"), button:has-text("जारी रखें"), button:has-text("Continue")').first();
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
    await page.waitForTimeout(1200);
  }

  // Now on Dashboard
  console.log('[Playwright] Step 2: Dashboard loaded');
  await page.waitForTimeout(2000);

  // Smooth scroll down to show clean interface
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1000);

  // Click quick symptom chip: "घुटनों में दर्द" or "तुलसी + खांसी"
  console.log('[Playwright] Step 3: Searching symptom');
  const kneeChip = page.locator('button:has-text("घुटनों में दर्द")').first();
  if (await kneeChip.isVisible()) {
    await kneeChip.click();
    await page.waitForTimeout(2500);
  } else {
    // Fallback: type into search box
    const searchInput = page.locator('input[placeholder*="लक्षण"], input[placeholder*="खोजें"], input[placeholder*="जैसे"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('घुटनों में दर्द');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
    }
  }

  // Now 3 clean cards are visible!
  // Scroll down to showcase:
  // Card 1: 💊 सरकारी सस्ती दवा (Jan Aushadhi)
  // Card 2: 🌿 घरेलू व आयुर्वेदिक नुस्खा
  // Card 3: 🚨 तुरंत अस्पताल जाएं यदि
  console.log('[Playwright] Step 4: Showcasing the 3 clean cards');
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(2500);

  // Step 5: Herb-Drug Clash Detection
  console.log('[Playwright] Step 5: Prescription clash checker');
  const rxInput = page.locator('input[placeholder*="बीपी"], input[placeholder*="दवा"], input[placeholder*="अंग्रेजी"]').first();
  if (await rxInput.isVisible()) {
    await rxInput.click();
    await page.waitForTimeout(500);
    await rxInput.type('Warfarin', { delay: 100 });
    await page.waitForTimeout(800);

    const checkBtn = page.locator('button:has-text("जांचें"), button:has-text("Check")').first();
    if (await checkBtn.isVisible()) {
      await checkBtn.click();
      await page.waitForTimeout(2500);
    }

    // Scroll to see clash details
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(2000);

    // Click "डॉक्टर को रिपोर्ट भेजें"
    const sendDoctorBtn = page.locator('button:has-text("डॉक्टर को रिपोर्ट भेजें"), button:has-text("Send Report to Doctor")').first();
    if (await sendDoctorBtn.isVisible()) {
      await sendDoctorBtn.click();
      await page.waitForTimeout(1500);
    }
  }

  // Step 6: Scroll back up and click Emergency SOS (108) button
  console.log('[Playwright] Step 6: Triggering Emergency 108 SOS modal');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1200);

  const sosBtn = page.locator('button:has-text("१०८"), button:has-text("108")').first();
  if (await sosBtn.isVisible()) {
    await sosBtn.click();
    await page.waitForTimeout(3000);

    // Scroll slightly inside modal to show first-aid guidance
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(2000);

    // Close emergency modal
    const closeBtn = page.locator('button:has-text("वापस"), button:has-text("Close"), button[aria-label="Close"], button:has-text("✕")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(1200);
    }
  }

  // Final hold on clean dashboard
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  console.log('[Playwright] Closing page & saving video...');
  await page.close();
  await context.close();
  await browser.close();

  server.close(() => {
    console.log('[StaticServer] Server stopped. Recording completed successfully.');
    process.exit(0);
  });
});
