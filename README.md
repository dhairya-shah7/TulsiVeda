# 🌿 TulsiVeda AI: Community-Governed Herb–Drug Safety Platform

> **Powered by Open-Weight LLMs (BioMistral-7B & Meta LLaMA-3), Experiential Intelligence (EI), & Bio-Kinetic Causal Engine (BKCE)**  
> *Bridging indigenous traditional knowledge across 12 Indian languages with modern allopathic pharmacology, real-time dynamic medical research, and ASHA/Doctor clinical safety review.*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![BioMistral-7B](https://img.shields.io/badge/Open--Weight%20LLM-BioMistral--7B-blue.svg)](https://huggingface.co/BioMistral/BioMistral-7B)
[![LLaMA-3-8B](https://img.shields.io/badge/Open--Weight%20LLM-Meta%20LLaMA--3--8B-purple.svg)](https://llama.meta.com/)
[![Experiential Intelligence](https://img.shields.io/badge/Crowd%20Healer%20Intelligence-EI%20Bayesian%20Engine-teal.svg)](#-experiential-intelligence-ei-engine)
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
│                         │  • Dynamic Medical Research   │              │
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
│                         │ Experiential Intelligence(EI) │              │
│                         │  • Bayesian Outcome Updates   │              │
│                         │  • ASHA / Healer Field Wisdom │              │
│                         │  • Recovery Timeline Tracking │              │
│                         └──────────────┬────────────────┘              │
│                                        │                               │
│                         ┌──────────────▼────────────────┐              │
│                         │ Clinical Governance & RBAC    │              │
│                         │ • Citizen: Clean Local Advice │              │
│                         │ • ASHA: Field Verification    │              │
│                         │ • Doctor: Clinical Approval   │              │
│                         └───────────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Clinical Named-Entity Recognition (NER):**  
   BioMistral-7B parses vernacular, informal spoken patient audio and transcripts into structured botanical taxonomies (scientific binomials, plant parts used, preparation mediums, dosages, and targeted clinical indications).
2. **Dynamic Medical Research (No Static Database Limits):**  
   Unlike static database health apps that fail on rare or uncatalogued symptoms, TulsiVeda AI dynamically synthesizes evidence-based clinical protocols on the fly using BioMistral medical heuristics, citing verified literature and auto-caching locally.
3. **Vernacular Patient Advisory Generation:**  
   Translates complex pharmacokinetic drug interactions (e.g., CYP3A4 / CYP2C9 competitive clearance inhibition) into plain, reassuring single-language advisories for rural citizens and illiterate patients without confusing medical jargon.
4. **Clinical SOAP Note Synthesis:**  
   Generates standardized **Subjective, Objective, Assessment, and Plan (SOAP)** clinical documentation for Primary Health Centre (PHC) Doctors and ASHA community health workers.

---

## 📱 Quick Install & Test (Android APK)

For immediate testing on an Android device or emulator without running the local build chain:
* **Release APK:** [`TulsiVeda_AI_Release.apk`](./TulsiVeda_AI_Release.apk)
* **Debug APK:** [`TulsiVeda_AI_Debug.apk`](./TulsiVeda_AI_Debug.apk)
* Sideload via ADB:
  ```bash
  adb install TulsiVeda_AI_Release.apk
  ```

---

## 🌟 Key Capabilities

### 1. Pure Single-Language UI (Zero English Leakage)
* **Strict Monolingual Guarantee:** When any language (Hindi, Gujarati, Punjabi, Tamil, Telugu, Bengali, Marathi, etc.) is selected, the **entire application renders 100% in that native script**.
* **Zero Dual-Language Clutter:** Eliminates mixed parentheses like `Back Pain (कमर दर्द)`. Instead, it dynamically displays only `कमर दर्द` in Hindi, `કમરનો દુખાવો` in Gujarati, or `Back Pain` in English.
* **No Bureaucratic Jargon:** Removed confusing labels like `Tier 1`, `Tier 2`, `Tier 3`, `Vice-Versa Discovery`, and `Protocol Not in Ledger`.

### 2. Clean 3-Card Clinical Layout
For any symptom or condition, the user receives clean, essential guidance:
* 💊 **Government Generic Medicine (सरकारी सस्ती दवा):** Subsidized Jan Aushadhi generic salts, prices in INR (₹), and how to take.
* 🌿 **Herbal & Ayurvedic Care (घरेलू व आयुर्वेदिक नुस्खा):** Verified classical preparation, active botanicals, and safe kitchen remedies.
* 🚨 **When to Visit Hospital (तुरंत अस्पताल जाएं यदि):** Crucial red-flag symptoms requiring emergency intervention.

### 3. Experiential Intelligence (EI) Engine
TulsiVeda AI incorporates a decentralized **Experiential Intelligence (EI)** system (`experientialEngine.ts`) that elevates grassroots community healthcare:
* **Bayesian Outcome Aggregation:** Continuously computes real-world efficacy rates (e.g., 91.4% recovery rate) and average days to relief based on field reports submitted by citizens and ASHA workers.
* **Dietary Vehicle (Anupana) Optimization:** Identifies which preparation medium (warm milk, warm water, honey, decoction) maximizes therapeutic absorption while preventing adverse gastric irritation.
* **Folk Healer & ASHA Field Notes:** Captures oral indigenous medical wisdom and routes community-reported adverse events to the Doctor review desk before incorporation into regional guidelines.

### 4. Emergency Red-Flag Triage & 1-Tap SOS Subsystem
* Real-time triage scans for life-threatening emergencies (heart attack symptoms, snakebites, poison ingestion, anaphylaxis).
* High-contrast modal takeover with 1-tap dialers for:
  * **108** (National Ambulance Service)
  * **112** (All-in-One Emergency)
  * **1800-116-117** (National Poison Information Centre - AIIMS New Delhi)
* Spoken first-aid instructions tailored to the specific emergency.

### 5. Bio-Kinetic Causal Engine (BKCE)
* Evaluates indigenous medicinal plants against standard allopathic pharmacotherapy.
* Models Cytochrome P450 competitive inhibition (`CYP3A4`, `CYP2C9`, `CYP2D6`, `CYP1A2`), P-glycoprotein transport clearance, and synergistic organ clearance pathways.
* Replaces black-box speculation with verifiable causal pharmacological mechanisms.

### 6. Pan-India Localization (12 Languages)
Full end-to-end localization across UI, voice advisories, audio narration, and botanical databases:
* 🇮🇳 **Hindi (हिन्दी)**
* 🇮🇳 **Gujarati (ગુજરાતી)**
* 🇮🇳 **Punjabi (ਪੰਜਾਬੀ)**
* 🇮🇳 **Marathi (मराठी)**
* 🇮🇳 **Tamil (தமிழ்)**
* 🇮🇳 **Telugu (తెలుగు)**
* 🇮🇳 **Kannada (ಕನ್ನಡ)**
* 🇮🇳 **Malayalam (മലയാളം)**
* 🇮🇳 **Bengali (বাংলা)**
* 🇮🇳 **Odia (ଓଡ଼ିଆ)**
* 🇮🇳 **Assamese (অসমীয়া)**
* 🌐 **Indian English**

### 7. Multi-Channel IVR Helpline (1800-TULSI-VEDA)
* Integrated IVR simulation with interactive voice prompts and keypad-based telephone navigation (`DTMF 1/2/3`) for remote rural citizens without smartphones or internet connectivity.

---

## 📂 Repository Structure

```text
Tulsi/
├── apps/
│   ├── mobile/                  # React 18 + TypeScript + Vite + Tailwind + Capacitor 6
│   │   ├── src/
│   │   │   ├── components/      # AudioWaveform, AudioNarrator, EmergencySosModal, Header
│   │   │   ├── screens/         # Dashboard, RemedyIntake, EvidenceDecision, KnowledgeBook
│   │   │   └── services/        # dynamicResearchService, experientialEngine, llmService, safetyEngine
│   │   └── android/             # Native Android project with Gradle wrapper
│   └── admin-web/               # ASHA & Doctor governance analytics portal
├── docs/                        # Presentation Pitch, System Architecture & Competitive Analysis
└── TulsiVeda_AI_Release.apk     # Standalone Android APK ready for installation
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
Open `http://localhost:5173` in your browser. Use the top language selector to switch between any of the 12 Indian languages.

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
The output APK is copied to the repository root as [`TulsiVeda_AI.apk`](./TulsiVeda_AI.apk).

---

## 👥 Contributors
* **Team:** TulsiVeda AI Team
* **Hackathon:** Built with open-source and open-weight AI for community healthcare empowerment.
