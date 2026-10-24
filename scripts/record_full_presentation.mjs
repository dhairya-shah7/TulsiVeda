import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { execSync } from 'child_process';

const PORT = 4180;
const DIST_DIR = path.resolve('apps/mobile/dist');
const VIDEO_ASSETS_DIR = path.resolve('docs/video_assets');
const STAGE_HTML_PATH = path.resolve('scripts/presentation_stage.html');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // Route 1: Main presentation stage
  if (reqPath === '/' || reqPath === '/stage') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(STAGE_HTML_PATH).pipe(res);
    return;
  }

  // Route 2: Video Assets
  if (reqPath.startsWith('/video_assets/')) {
    const filename = reqPath.replace('/video_assets/', '');
    const assetPath = path.join(VIDEO_ASSETS_DIR, filename);
    if (fs.existsSync(assetPath)) {
      const ext = path.extname(assetPath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(assetPath).pipe(res);
      return;
    }
  }

  // Route 3: Apps Mobile Dist (Static assets & index.html for iframe)
  const cleanPath = reqPath.replace(/^\/+/, '');
  let distPath = path.join(DIST_DIR, cleanPath);
  if (!fs.existsSync(distPath) || fs.statSync(distPath).isDirectory()) {
    distPath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(distPath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(distPath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`[Server] Presentation server running at http://127.0.0.1:${PORT}`);

  const rawDir = path.resolve('docs/video_assets/presentation_raw');
  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: rawDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  console.log('[Playwright] Loading presentation stage...');
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

  // ----------------------------------------------------
  // ACT 1: THE HEALTHCARE DILEMMA (Confused Girl / Kadha vs Allopathy)
  // ----------------------------------------------------
  console.log('[Act 1] 0s - 8s: The Healthcare Dilemma');
  await page.evaluate(() => window.setStage(1));
  await page.waitForTimeout(7500);

  // ----------------------------------------------------
  // ACT 2: INTRODUCING TULSIVEDA AI (Bento Canvas)
  // ----------------------------------------------------
  console.log('[Act 2] 8s - 15s: Architecture & Value Pillars');
  await page.evaluate(() => window.setStage(2));
  await page.waitForTimeout(7000);

  // ----------------------------------------------------
  // ACT 3: LIVE PROTOTYPE WALKTHROUGH
  // ----------------------------------------------------
  console.log('[Act 3] 15s - 50s: Live Working Prototype Demo');
  await page.evaluate(() => {
    window.setStage(3);
    window.setPrototypeStep(1, 'Native Vernacular Onboarding', 'Patients select their native tongue from 12 Scheduled Indian languages. Pure single-language UI without confusing English jargon.');
  });
  await page.waitForTimeout(2000);

  const iframe = page.frameLocator('#prototype-frame');

  // Step 3.1: Language selection in iframe
  try {
    const hindiOption = iframe.locator('text=हिन्दी').first();
    if (await hindiOption.isVisible({ timeout: 2000 })) {
      await hindiOption.click();
      await page.waitForTimeout(800);
      const continueBtn = iframe.locator('button:has-text("आगे बढ़ें"), button:has-text("शुरू करें"), button:has-text("जारी रखें")').first();
      if (await continueBtn.isVisible()) {
        await continueBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  } catch (e) {
    console.log('[Prototype] Onboarding skipped or already configured');
  }

  // Step 3.2: Search Symptom ("घुटनों में दर्द")
  console.log('[Act 3.2] Searching symptom in Hindi');
  await page.evaluate(() => {
    window.setPrototypeStep(2, 'Intelligent Symptom Resolution', 'ASHA worker or citizen searches in colloquial Hindi. BioMistral-7B & BKCE resolve symptoms into clinical indications.');
  });
  await page.waitForTimeout(1500);

  try {
    const kneeChip = iframe.locator('button:has-text("घुटनों में दर्द")').first();
    if (await kneeChip.isVisible()) {
      await kneeChip.click();
      await page.waitForTimeout(2500);
    } else {
      const searchInput = iframe.locator('input[placeholder*="लक्षण"], input[placeholder*="खोजें"], input[placeholder*="जैसे"]').first();
      if (await searchInput.isVisible()) {
        await searchInput.fill('घुटनों में दर्द');
        await iframe.locator('button:has-text("खोजें"), form button').first().click();
        await page.waitForTimeout(2500);
      }
    }
  } catch (err) {
    console.error('[Prototype] Symptom click error:', err);
  }

  // Step 3.3: Showcasing the 3 clean cards
  console.log('[Act 3.3] Revealing the 3 clinical cards');
  await page.evaluate(() => {
    window.setPrototypeStep(2, 'Triaged 3-Tier Clinical Advice', 'Every condition gives 3 clean cards: Jan Aushadhi generic salt (₹2.50), verified AYUSH home care, and hospital red flags.');
  });
  
  // Smooth scroll down inside iframe
  try {
    await iframe.locator('body').evaluate(el => window.scrollBy({ top: 300, behavior: 'smooth' }));
  } catch (e) {}
  await page.waitForTimeout(2500);

  try {
    await iframe.locator('body').evaluate(el => window.scrollBy({ top: 350, behavior: 'smooth' }));
  } catch (e) {}
  await page.waitForTimeout(2500);

  // Step 3.4: Herb-Drug Clash Check ("Warfarin")
  console.log('[Act 3.4] Testing Herb-Drug Clash');
  await page.evaluate(() => {
    window.setPrototypeStep(3, 'CYP450 Herb-Drug Clash Detection', 'Checking daily allopathic pills against home remedies. Bio-Kinetic engine detects CYP2C9 metabolic conflict with Warfarin and warns of bleeding hazard.');
  });

  try {
    const rxInput = iframe.locator('input[placeholder*="बीपी"], input[placeholder*="दवा"], input[placeholder*="अंग्रेजी"]').first();
    if (await rxInput.isVisible()) {
      await rxInput.click();
      await rxInput.fill('Warfarin');
      await page.waitForTimeout(800);

      const checkBtn = iframe.locator('button:has-text("जांचें"), button:has-text("Check")').first();
      if (await checkBtn.isVisible()) {
        await checkBtn.click();
        await page.waitForTimeout(3000);
      }

      // Scroll to view clash warning
      await iframe.locator('body').evaluate(el => window.scrollBy({ top: 220, behavior: 'smooth' }));
      await page.waitForTimeout(2000);

      // Click "डॉक्टर को रिपोर्ट भेजें"
      const sendDoctorBtn = iframe.locator('button:has-text("डॉक्टर को रिपोर्ट भेजें"), button:has-text("Send Report to Doctor")').first();
      if (await sendDoctorBtn.isVisible()) {
        await sendDoctorBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  } catch (err) {
    console.error('[Prototype] Clash check error:', err);
  }

  // Step 3.5: Triggering 1-Tap 108 Emergency SOS Modal
  console.log('[Act 3.5] Triggering 108 Emergency SOS Modal');
  await page.evaluate(() => {
    window.setPrototypeStep(3, 'One-Tap 108 Emergency Ambulance Triage', 'High-contrast emergency modal provides direct dialers for 108 Ambulance, 112 National Helpline, and immediate first-aid instructions.');
  });

  try {
    await iframe.locator('body').evaluate(el => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1200);

    const sosBtn = iframe.locator('button:has-text("१०८"), button:has-text("108")').first();
    if (await sosBtn.isVisible()) {
      await sosBtn.click();
      await page.waitForTimeout(3500);

      // Close emergency modal
      const closeBtn = iframe.locator('button:has-text("वापस"), button:has-text("Close"), button[aria-label="Close"], button:has-text("✕")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(1200);
      }
    }
  } catch (err) {
    console.error('[Prototype] SOS error:', err);
  }

  // ----------------------------------------------------
  // ACT 4: ASHA FIELD WORKER EMPOWERMENT
  // ----------------------------------------------------
  console.log('[Act 4] 50s - 58s: ASHA Field Worker Empowerment');
  await page.evaluate(() => window.setStage(4));
  await page.waitForTimeout(7500);

  // ----------------------------------------------------
  // ACT 5: PHC DOCTOR CLINICAL VERIFICATION
  // ----------------------------------------------------
  console.log('[Act 5] 58s - 66s: PHC Clinician-in-the-Loop');
  await page.evaluate(() => window.setStage(5));
  await page.waitForTimeout(7500);

  // ----------------------------------------------------
  // ACT 6: NATIONAL ROADMAP & CLOSING
  // ----------------------------------------------------
  console.log('[Act 6] 66s - 74s: Scalability & National Impact');
  await page.evaluate(() => window.setStage(6));
  await page.waitForTimeout(8000);

  console.log('[Playwright] Recording complete. Closing browser...');
  await page.close();
  await context.close();
  await browser.close();

  server.close(async () => {
    console.log('[Server] Presentation server stopped.');

    // Find recorded webm
    const rawFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.webm'));
    if (rawFiles.length === 0) {
      console.error('[Error] No webm video found in', rawDir);
      process.exit(1);
    }

    const recordedWebm = path.join(rawDir, rawFiles[0]);
    const finalMp4Docs = path.resolve('docs/TulsiVeda_AI_Prototype_Demo.mp4');
    const finalMp4Root = path.resolve('TulsiVeda_AI_Prototype_Demo.mp4');

    console.log(`[FFmpeg] Transcoding ${recordedWebm} to 1080p high-quality MP4...`);
    const ffmpegCmd = `ffmpeg -y -i "${recordedWebm}" -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -r 30 -movflags +faststart "${finalMp4Docs}"`;
    try {
      execSync(ffmpegCmd, { stdio: 'inherit' });
      fs.copyFileSync(finalMp4Docs, finalMp4Root);
      console.log(`[Success] Final demo video generated successfully!`);
      console.log(`  -> ${finalMp4Docs}`);
      console.log(`  -> ${finalMp4Root}`);
    } catch (err) {
      console.error('[FFmpeg Error]', err);
    }

    process.exit(0);
  });
});
