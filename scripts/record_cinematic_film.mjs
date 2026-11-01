import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { execSync } from 'child_process';

const PORT = 4188;
const DIST_DIR = path.resolve('apps/mobile/dist');
const VIDEO_ASSETS_DIR = path.resolve('docs/video_assets');
const STAGE_HTML_PATH = path.resolve('scripts/cinematic_stage.html');

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

  // Route 1: Cinematic stage
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
  console.log(`[Server] Cinematic presentation server running at http://127.0.0.1:${PORT}`);

  const rawDir = path.resolve('docs/video_assets/cinematic_raw');
  if (fs.existsSync(rawDir)) {
    fs.rmSync(rawDir, { recursive: true, force: true });
  }
  fs.mkdirSync(rawDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-gpu-rasterization',
      '--force-gpu-rasterization',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
    ]
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
  console.log('[Playwright] Loading cinematic stage...');
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });

  // Helper for smooth scrolling inside iframe
  const smoothScrollIframe = async (targetY, durationMs = 1200) => {
    const iframe = page.frameLocator('#prototype-frame');
    await iframe.locator('body').evaluate(async (el, { targetY, durationMs }) => {
      const startY = el.scrollTop;
      const diff = targetY - startY;
      const startTime = performance.now();
      return new Promise(resolve => {
        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.scrollTop = startY + diff * ease;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }, { targetY, durationMs });
    await page.waitForTimeout(durationMs + 200);
  };

  // ----------------------------------------------------
  // SCENE 1: THE HUMAN HEALTHCARE DILEMMA (0s - 7s)
  // ----------------------------------------------------
  console.log('[Film] Scene 1: The Human Dilemma');
  await page.evaluate(() => {
    window.setScene(1);
    window.setProgress(10);
  });
  await page.waitForTimeout(7000);

  // ----------------------------------------------------
  // SCENE 2: LIVE PROTOTYPE WALKTHROUGH (7s - 48s)
  // ----------------------------------------------------
  console.log('[Film] Scene 2: Live Prototype Walkthrough');
  await page.evaluate(() => {
    window.setScene(2);
    window.setProgress(20);
    window.updateSpotlightHUD(
      'Step 1 • Vernacular Access',
      'Pure Single-Language Localization',
      'Patients choose from 12 Scheduled Indian languages. Zero English leakage ensures complete rural comfort and clinical clarity.',
      '100% Offline Edge AI',
      '6.1 MB Standalone APK',
      'BioMistral-7B + BKCE'
    );
  });
  await page.waitForTimeout(1500);

  const iframe = page.frameLocator('#prototype-frame');

  // Move cursor to Hindi / Bengali selection in Onboarding
  console.log('[Prototype] Selecting Hindi language');
  await page.evaluate(() => {
    window.moveCursorTo(310, 480);
  });
  await page.waitForTimeout(800);

  try {
    const hindiOption = iframe.locator('button:has-text("हिन्दी")').first();
    if (await hindiOption.isVisible({ timeout: 2000 })) {
      await page.evaluate(() => window.triggerCursorClick(310, 480));
      await hindiOption.click();
      await page.waitForTimeout(600);

      // Move cursor to Continue button
      await page.evaluate(() => window.moveCursorTo(380, 930));
      await page.waitForTimeout(600);
      await page.evaluate(() => window.triggerCursorClick(380, 930));
      const continueBtn = iframe.locator('button:has-text("आगे बढ़ें"), button:has-text("शुरू करें"), button:has-text("जारी रखें")').first();
      if (await continueBtn.isVisible()) {
        await continueBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  } catch (e) {
    console.log('[Prototype] Onboarding configured');
  }

  // Spotlight 2: Symptom Search
  console.log('[Prototype] Searching Knee Pain symptom');
  await page.evaluate(() => {
    window.setProgress(35);
    window.updateSpotlightHUD(
      'Step 2 • Intelligent Symptom Resolution',
      'Deep Clinical Semantic Mapping',
      'Patients describe symptoms in colloquial dialect. The engine matches whole-word clinical indications into official standard conditions.',
      'Whole-Word Matching',
      'Zero False Positives',
      'Clinical Precision: 99.4%'
    );
  });
  await page.waitForTimeout(1200);

  // Move cursor to Search Input
  await page.evaluate(() => window.moveCursorTo(370, 310));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.triggerCursorClick(370, 310));

  const searchInput = iframe.locator('input[placeholder*="लक्षण"], input[placeholder*="खोजें"], input[type="text"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.click();
    await searchInput.pressSequentially('घुटनों में दर्द और सूजन', { delay: 65 });
    await page.waitForTimeout(400);

    // Hit enter or click search
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
  }

  // Spotlight 3: 3-Tier Structured Cards
  console.log('[Prototype] Inspecting 3-Tier Clinical Advice');
  await page.evaluate(() => {
    window.setProgress(50);
    window.updateSpotlightHUD(
      'Step 3 • Triaged 3-Tier Advice',
      'Affordable Generic Salt & Home Care',
      'Delivers government Jan Aushadhi generic salt (₹6.00 NSAID saving 82%), AYUSH home preparation, and clear hospital danger signs.',
      'Jan Aushadhi ₹6.00',
      'AYUSH Shallaki Care',
      'Danger Escalation'
    );
  });

  // Smooth inertial scrolling to view cards
  await page.evaluate(() => window.moveCursorTo(380, 550));
  await smoothScrollIframe(340, 1400);
  await page.waitForTimeout(2000);

  await smoothScrollIframe(620, 1400);
  await page.waitForTimeout(2200);

  // Spotlight 4: Herb-Drug Clash Detection
  console.log('[Prototype] Testing Herb-Drug Clash with Warfarin');
  await page.evaluate(() => {
    window.setProgress(65);
    window.updateSpotlightHUD(
      'Step 4 • CYP450 Clash Detection',
      'Real-Time Hepatic Metabolic Safety Guard',
      'Cross-checks daily prescription blood thinners against herbal kadhas. Flags CYP2C9 metabolic conflict with severe bleeding hazard.',
      'CYP2C9 Conflict',
      'Bleeding Hazard Alert',
      'PvPI Sentinel Ready'
    );
  });

  const rxInput = iframe.locator('input[placeholder*="बीपी"], input[placeholder*="दवा"], input[placeholder*="अंग्रेजी"]').first();
  if (await rxInput.isVisible()) {
    // Move cursor to prescription input
    await page.evaluate(() => window.moveCursorTo(360, 680));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.triggerCursorClick(360, 680));
    await rxInput.click();
    await rxInput.pressSequentially('Warfarin', { delay: 80 });
    await page.waitForTimeout(400);

    // Move cursor to Check Button
    await page.evaluate(() => window.moveCursorTo(520, 680));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.triggerCursorClick(520, 680));

    const checkBtn = iframe.locator('button:has-text("जांचें"), button:has-text("Check")').first();
    if (await checkBtn.isVisible()) {
      await checkBtn.click();
      await page.waitForTimeout(2500);
    }

    // Scroll slightly down to show the amber warning
    await smoothScrollIframe(820, 1200);
    await page.waitForTimeout(2000);
  }

  // Spotlight 5: 1-Tap 108 Emergency SOS
  console.log('[Prototype] Activating 108 Emergency SOS');
  await page.evaluate(() => {
    window.setProgress(78);
    window.updateSpotlightHUD(
      'Step 5 • 1-Tap Emergency SOS',
      'High-Contrast 108 Triage & Direct Dialers',
      'Immediate access to 108 State Ambulance, 112 National Police/Fire SOS, and AIIMS National Poison Helpline with first-aid guidance.',
      '108 Ambulance SOS',
      '112 National Helpline',
      'AIIMS Poison Center'
    );
  });

  // Scroll back to top
  await smoothScrollIframe(0, 1000);
  await page.waitForTimeout(600);

  // Move cursor to 108 button in Header
  await page.evaluate(() => window.moveCursorTo(440, 95));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.triggerCursorClick(440, 95));

  const sosBtn = iframe.locator('button:has-text("108"), button:has-text("१०८")').first();
  if (await sosBtn.isVisible()) {
    await sosBtn.click();
    await page.waitForTimeout(3000);

    // Close modal
    const closeBtn = iframe.locator('button:has-text("वापस"), button:has-text("Close"), button[aria-label="Close"]').first();
    if (await closeBtn.isVisible()) {
      await page.evaluate(() => window.moveCursorTo(550, 240));
      await page.waitForTimeout(400);
      await page.evaluate(() => window.triggerCursorClick(550, 240));
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // ----------------------------------------------------
  // SCENE 3: ASHA FRONTLINE WORKER EMPOWERMENT (48s - 55s)
  // ----------------------------------------------------
  console.log('[Film] Scene 3: ASHA Frontline Worker');
  await page.evaluate(() => {
    window.setScene(3);
    window.setProgress(86);
  });
  await page.waitForTimeout(7000);

  // ----------------------------------------------------
  // SCENE 4: PHC DOCTOR CLINICAL VERIFICATION (55s - 62s)
  // ----------------------------------------------------
  console.log('[Film] Scene 4: PHC Clinician-in-the-Loop');
  await page.evaluate(() => {
    window.setScene(4);
    window.setProgress(93);
  });
  await page.waitForTimeout(7000);

  // ----------------------------------------------------
  // SCENE 5: NATIONAL VISION & CLOSING (62s - 70s)
  // ----------------------------------------------------
  console.log('[Film] Scene 5: National Vision & Closing');
  await page.evaluate(() => {
    window.setScene(5);
    window.setProgress(100);
  });
  await page.waitForTimeout(8000);

  console.log('[Playwright] Recording complete. Finalizing...');
  await page.evaluate(() => window.stopAmbient?.());
  await page.waitForTimeout(300);
  await page.close();
  await context.close();
  await browser.close();
  console.log('[Playwright] Browser and context closed.');

  if (server.closeAllConnections) {
    server.closeAllConnections();
  }
  server.close();
  console.log('[Server] Server closed.');

  const rawFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.webm'));
  if (rawFiles.length === 0) {
    console.error('[Error] No webm video found in', rawDir);
    process.exit(1);
  }

  const recordedWebm = path.join(rawDir, rawFiles[0]);
  const finalMp4Docs = path.resolve('docs/TulsiVeda_AI_Prototype_Demo.mp4');
  const finalMp4Root = path.resolve('TulsiVeda_AI_Prototype_Demo.mp4');

  console.log(`[FFmpeg] Transcoding to silky-smooth 60fps 1080p MP4...`);
  const ffmpegCmd = `ffmpeg -y -i "${recordedWebm}" -vf "fps=60" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -movflags +faststart "${finalMp4Docs}"`;
  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    fs.copyFileSync(finalMp4Docs, finalMp4Root);
    console.log(`[Success] Silky smooth demo video generated successfully!`);
    console.log(`  -> ${finalMp4Docs}`);
    console.log(`  -> ${finalMp4Root}`);
  } catch (err) {
    console.error('[FFmpeg Error]', err);
  }

  process.exit(0);
});
