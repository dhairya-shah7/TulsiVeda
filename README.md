# 🌿 TulsiVeda AI

> **Community-Governed Voice & Graph-RAG Herb–Drug Safety Platform**  
> Bridging indigenous vernacular remedy knowledge with modern allopathic clinical safety review.

---

## 📱 Quick Install (Android APK)

For immediate testing on an Android device or emulator without setting up the full build pipeline:
* **Debug APK:** [`TulsiVeda_AI.apk`](./TulsiVeda_AI.apk) (Ready to sideload via `adb install TulsiVeda_AI.apk` or direct file transfer)
* **Release APK:** [`TulsiVeda_AI_Release.apk`](./TulsiVeda_AI_Release.apk)

---

## 📂 Repository Structure

```text
Tulsi/
├── apps/
│   └── mobile/                  # React 18 + TypeScript + Tailwind + Capacitor 6 Mobile App
│       ├── src/
│       │   ├── screens/         # 6 Core screens (Dashboard, Intake, AI Analysis, Plant ID, Prescription, Decision)
│       │   ├── components/      # Header, BottomNav, GraphVisualizer, AudioWaveform
│       │   └── services/        # Offline-first StorageService & persistence
│       └── android/             # Native Android project with Gradle wrapper
├── services/
│   └── api/                     # Node.js/Express + TypeScript backend API
│       ├── src/
│       │   ├── routes/          # Dashboard, remedy, plant, prescription, and safety endpoints
│       │   ├── services/        # ASR, OCR, LLM extraction, safety engine, audit
│       │   └── db/              # PostgreSQL, Neo4j, Qdrant connection pools
├── infra/                       # Infrastructure & database initialization
│   ├── docker-compose.yml       # Postgres, Neo4j, Qdrant multi-container setup
│   └── postgres/init.sql        # Relational schema and seed catalogues
└── TulsiVeda_AI.apk             # Compiled Android APK ready for testing
```

---

## 🚀 Teammate Setup Guide

### 1. Prerequisites
* **Node.js** (v18 or v20+)
* **Git**
* *(Optional for native Android build)*: **Java 17+** & **Android SDK / Android Studio**
* *(Optional for backend)*: **Docker Desktop**

---

### 2. Running the Mobile App (Web Dev Mode)

The mobile app is built with **React**, **Vite**, and **Capacitor**. It features offline-first local storage so you can run and test the complete 6-screen workflow in your browser right away:

```bash
# Navigate to mobile app
cd apps/mobile

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser. (Tip: open DevTools and toggle Device Toolbar for mobile viewport).

---

### 3. Building the Android APK from Source

To compile a new native Android APK:

```bash
cd apps/mobile

# 1. Build Vite web bundle
npm run build

# 2. Sync web assets into Android native project
npx cap copy android

# 3. Assemble Android APK using Gradle wrapper
cd android
# On Windows PowerShell:
.\gradlew.bat assembleDebug

# On macOS/Linux:
./gradlew assembleDebug
```

The output APK will be generated at:  
`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

---

### 4. Running the Backend & Databases (Optional)

If running the live graph and vector database infrastructure locally:

```bash
# 1. Start Postgres, Neo4j, and Qdrant
docker compose up -d

# 2. Start the Express API
cd services/api
npm install
npm run dev
```

The API service runs on `http://localhost:3001`.

---

## 🛡️ Key System Workflow

```text
[Dashboard: Screen 1]
         │
         ▼
[Remedy Intake: Screen 2] ──► Vernacular voice/notes captured (Gujarati/Hindi)
         │
         ▼
[AI Analysis: Screen 3]   ──► Constrained 9-field NLP extraction (Qwen 2.5)
         │
         ▼
[Plant ID: Screen 4]      ──► Qdrant vector botanical resolution + Expert confirmation
         │
         ▼
[Prescription: Screen 5]  ──► OCR prescription scan + Clinician confirmation gate
         │
         ▼
[Decision: Screen 6]      ──► Deterministic Neo4j Graph-RAG herb-drug interaction check + Evidence
         │
         ▼
[Dashboard Ledger]        ──► Immutable tamper-evident audit ledger record
```

---

## 👥 Contributors & Team
* Built for **UnleashLLM Hackathon**
* **Repository Owner:** @dhairya-shah7
