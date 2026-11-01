import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const mobileDir = path.resolve(rootDir, 'apps', 'mobile');
const androidDir = path.resolve(mobileDir, 'android');

const targets = [
  {
    key: 'citizen',
    name: 'TulsiVeda',
    appId: 'com.tulsiveda.citizen',
    role: 'citizen',
    outputApk: 'TulsiVeda_Citizen.apk'
  },
  {
    key: 'asha',
    name: 'TulsiVeda ASHA',
    appId: 'com.tulsiveda.asha',
    role: 'asha',
    outputApk: 'TulsiVeda_ASHA.apk'
  },
  {
    key: 'doctor',
    name: 'TulsiVeda Doctor',
    appId: 'com.tulsiveda.doctor',
    role: 'doctor',
    outputApk: 'TulsiVeda_Doctor.apk'
  },
  {
    key: 'unified',
    name: 'TulsiVeda AI',
    appId: 'com.tulsiveda.app',
    role: '',
    outputApk: 'TulsiVeda_AI.apk'
  }
];

function updateAndroidConfig(target) {
  // 1. capacitor.config.json
  const capConfigPath = path.join(mobileDir, 'capacitor.config.json');
  const capConfig = JSON.parse(fs.readFileSync(capConfigPath, 'utf8'));
  capConfig.appId = target.appId;
  capConfig.appName = target.name;
  fs.writeFileSync(capConfigPath, JSON.stringify(capConfig, null, 2), 'utf8');

  // 2. strings.xml
  const stringsPath = path.join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
  const stringsXml = `<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">${target.name}</string>
    <string name="title_activity_main">${target.name}</string>
    <string name="package_name">${target.appId}</string>
    <string name="custom_url_scheme">${target.appId}</string>
</resources>
`;
  fs.writeFileSync(stringsPath, stringsXml, 'utf8');

  // 3. build.gradle applicationId
  const gradlePath = path.join(androidDir, 'app', 'build.gradle');
  let gradleContent = fs.readFileSync(gradlePath, 'utf8');
  gradleContent = gradleContent.replace(/applicationId\s+"[^"]+"/, `applicationId "${target.appId}"`);
  fs.writeFileSync(gradlePath, gradleContent, 'utf8');
}

async function buildTarget(target) {
  console.log(`\n======================================================`);
  console.log(`🚀 BUILDING: ${target.outputApk} (${target.name} - ${target.appId})`);
  console.log(`======================================================\n`);

  updateAndroidConfig(target);

  // 1. Vite build with env variable
  console.log(`📦 Compiling Vite web assets (VITE_APP_ROLE=${target.role})...`);
  const env = { ...process.env, VITE_APP_ROLE: target.role };
  execSync('npm run build', { cwd: mobileDir, env, stdio: 'inherit' });

  // 2. Capacitor Sync
  console.log(`🔄 Syncing Capacitor Android assets...`);
  execSync('npx cap sync android', { cwd: mobileDir, env, stdio: 'inherit' });

  // 3. Gradle build
  console.log(`🔨 Building Android APK via Gradle...`);
  const gradlewCmd = process.platform === 'win32' ? '.\\gradlew.bat assembleDebug' : './gradlew assembleDebug';
  execSync(gradlewCmd, { cwd: androidDir, env, stdio: 'inherit' });

  // 4. Copy APK to root
  const builtApkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const destApkPath = path.join(rootDir, target.outputApk);
  fs.copyFileSync(builtApkPath, destApkPath);
  const stats = fs.statSync(destApkPath);
  console.log(`\n✅ SUCCESSFULLY CREATED: ${target.outputApk} (${stats.size} bytes)\n`);
}

async function main() {
  const specificTarget = process.argv[2];
  const list = specificTarget ? targets.filter(t => t.key === specificTarget) : targets;

  if (list.length === 0) {
    console.error(`Unknown target: ${specificTarget}. Choose citizen, asha, doctor, or unified.`);
    process.exit(1);
  }

  for (const t of list) {
    await buildTarget(t);
  }

  console.log(`\n🎉 ALL REQUESTED APKS COMPILED SUCCESSFULLY!`);
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
