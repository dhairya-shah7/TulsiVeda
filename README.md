# 🌿 TulsiVeda AI: Community-Governed Herb–Drug Safety Platform

> **Powered by Open-Weight LLMs (BioMistral-7B & Meta LLaMA-3) & Bio-Kinetic Causal Engine (BKCE)**  
> *Bridging indigenous traditional knowledge across 12 Indian languages with modern allopathic pharmacology and ASHA/Doctor clinical safety review.*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![BioMistral-7B](https://img.shields.io/badge/Open--Weight%20LLM-BioMistral--7B-blue.svg)](https://huggingface.co/BioMistral/BioMistral-7B)
[![LLaMA-3-8B](https://img.shields.io/badge/Open--Weight%20LLM-Meta%20LLaMA--3--8B-purple.svg)](https://llama.meta.com/)
[![Pan-India 12 Languages](https://img.shields.io/badge/Localization-12%20Indian%20Languages-orange.svg)](#-pan-india-localization-12-languages)
[![Offline First](https://img.shields.io/badge/Edge%20Architecture-100%25%20Offline%20First-success.svg)](#-offline-first-edge-architecture)

---

## 🏆 Hackathon Alignment & Open-Weight LLM Role

This platform satisfies all open-source & open-weight LLM mandates with **BioMistral-7B** and **Meta LLaMA-3-8B** playing core clinical roles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TULSIVEDA AI ARCHITECTURE                       │
│                                                                        │
│   [ Citizen / ASHA Worker ] ──── Multi-Modal Voice / Notes Intake       │
│                                              │                         │
│                                              ▼                         │
│                         ┌───────────────────────────────┐              │
│                         │        BioMistral-7B          │              │
│                         │   Open-Weight Medical LLM    │              │
│                         │  • Clinical NER Extraction    │              │
│                         │  • Vernacular Patient Advisory│              │
│                         │  • Structured SOAP Synthesis  │              │
│                         └──────────────┬────────────────┘              │
│                                        │                               │
│                         ┌──────────────▼────────────────┐              │
│                         │  Bio-Kinetic Causal Engine    │              │
│                         │            (BKCE)             │              │
│                         │  • CYP450 Enzyme Pathways     │              │
│                         │  • P-gp Clearance Inhibition  │              │
│                         │  • Organ Toxicity Thresholds  │              │
│                         └──────────────┬────────────────┘              │
│                                        │                               │
│                         ┌──────────────▼────────────────┐              │
│                         │ Clinical Governance & RBAC    │              │
│                         │ • Citizen: Safe Advisory View │              │
│                         │ • ASHA: Field Verification    │              │
│                         │ • Doctor: Clinical Approval   │              │
│                         └───────────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Clinical Named-Entity Recognition (NER):**  
   BioMistral-7B parses vernacular, informal spoken patient audio and transcripts into structured botanical taxonomies (scientific binomials, plant parts used, preparation mediums, dosages, and targeted clinical indications).
2. **Vernacular Patient Advisory Generation:**  
   Translates complex pharmacokinetic drug interactions (e.g., CYP3A4 / CYP2C9 competitive clearance inhibition) into plain, reassuring vernacular advisories for rural citizens and illiterate patients.
3. **Clinical SOAP Note Synthesis:**  
   Generates standardized **Subjective, Objective, Assessment, and Plan (SOAP)** clinical documentation for Primary Health Centre (PHC) Doctors and ASHA community health workers.

---

## 📱 Quick Install & Test (Android APK)

For immediate testing on an Android device or emulator without running the local build chain:
* **Release APK:** [`TulsiVeda_AI_Release.apk`](./TulsiVeda_AI_Release.apk)
* Sideload via ADB:
  ```bash
  adb install TulsiVeda_AI_Release.apk
  ```

---

## 🌟 Key Capabilities

### 1. Multi-Modal Remedy Intake with Zero Hardware Blocks
* **Voice Recording:** Live audio capture with native audio note persistence for ASHA and clinical playback.
* **1-Tap Fast Botanical Selector:** Instant intake across 12 languages (ਤੁਲਸੀ, ਗਿਲੋਏ, ਹਲਦੀ, ਅਦਰਕ, ਅਸ਼ਵਗੰਧਾ, ਆਂਵਲਾ) designed specifically for low-literacy field usage.
* **Open-Weight LLM Extraction Telemetry:** Displays real-time BioMistral-7B entity extraction, confidence scoring, and model signature badges.

### 2. Bio-Kinetic Causal Engine (BKCE)
* Evaluates 50+ indigenous medicinal plants against standard allopathic pharmacotherapy.
* Models Cytochrome P450 competitive inhibition (`CYP3A4`, `CYP2C9`, `CYP2D6`, `CYP1A2`), P-glycoprotein transport clearance, and synergistic organ clearance pathways.
* Replaces black-box speculation with verifiable causal pharmacological mechanisms.

### 3. Pan-India Localization (12 Languages)
Full end-to-end localization across UI, voice advisories, audio narration, and botanical databases:
* 🇮🇳 **Punjabi (ਪੰਜਾਬੀ)**
* 🇮🇳 **Hindi (हिन्दी)**
* 🇮🇳 **Gujarati (ગુજરાતી)**
* 🇮🇳 **Marathi (मराठी)**
* 🇮🇳 **Tamil (தமிழ்)**
* 🇮🇳 **Telugu (తెలుగు)**
* 🇮🇳 **Kannada (ಕನ್ನಡ)**
* 🇮🇳 **Malayalam (മലയാളം)**
* 🇮🇳 **Bengali (বাংলা)**
* 🇮🇳 **Odia (ଓଡ଼ିଆ)**
* 🇮🇳 **Assamese (অসমীয়া)**
* 🌐 **Indian English**

### 4. Role-Based Access Control (RBAC) & Clinical Governance
* **Citizen / Village & City Users:** Streamlined, easy-to-understand 3-step walkthrough with plain vernacular voice narration.
* **ASHA Community Worker:** Field review portal with voice-note playback, patient vitals logging, and verification workflows.
* **Medical Doctor:** Full clinical dashboard with BioMistral-7B SOAP notes, pharmacokinetic mechanism trees, laboratory monitoring plans, and final sign-off.

### 5. Multi-Channel IVR Hotline (1800-TULSI-VEDA)
* Integrated IVR simulation with interactive voice prompts and keypad-based telephone navigation (`DTMF 1/2/3`) for remote rural citizens without smartphones or internet connectivity.

---

## 📂 Repository Structure

```text
Tulsi/
├── apps/
│   ├── mobile/                  # React 18 + TypeScript + Vite + Tailwind + Capacitor 6
│   │   ├── src/
│   │   │   ├── components/      # AudioWaveform, AudioNarrator, IvrHotlineModal, GraphVisualizer
│   │   │   ├── screens/         # Dashboard, RemedyIntake, EvidenceDecision, PlantID, AlternativeMedicine
│   │   │   └── services/        # llmService (BioMistral), bioKineticEngine, localizationService, botanicalDatabase
│   │   └── android/             # Native Android project with Gradle wrapper
│   └── admin-web/               # ASHA & Doctor governance analytics portal
├── services/
│   └── api/                     # Node.js/Express + TypeScript backend service
│       ├── src/
│       │   ├── routes/          # Remedy, plant, prescription, and audit endpoints
│       │   └── services/        # ASR, OCR, BioMistral LLM extraction, audit ledger
├── infra/                       # Docker Compose definitions (Postgres, Neo4j, Qdrant)
└── TulsiVeda_AI_Release.apk     # Standalone Android APK ready for testing
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** (v18 or v20+)
* **Git**
* *(Optional for native Android compilation)*: Java 17+ and Android SDK

### 2. Running Mobile App in Browser Dev Mode
```bash
# Navigate to mobile project
cd apps/mobile

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser. Use the top-left language switcher to toggle any of the 12 Indian languages.

### 3. Building Native Android APK
```bash
cd apps/mobile

# Compile Vite web build
npm run build

# Sync web assets to Android
npx cap copy android

# Assemble Android APK using Gradle
cd android
# On Windows:
.\gradlew.bat assembleDebug
# On Linux/macOS:
./gradlew assembleDebug
```
The output APK will be placed at:  
`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🧪 Open-Weight LLM Verification & Testing

To inspect the BioMistral-7B inference schemas and clinical prompt templates:
* **Service:** `apps/mobile/src/services/llmService.ts`
* **NER & Advisory Extraction:** `LLMService.extractRemedyEntities()`
* **Clinical SOAP Synthesis:** `LLMService.generateSoapNote()`
* **Patient Plain Vernacular Advisory:** `LLMService.generatePatientExplanation()`

---

## 👥 Contributors
* **Team:** TulsiVeda AI Team
* **Hackathon:** Built with open-source and open-weight AI for community healthcare empowerment.
