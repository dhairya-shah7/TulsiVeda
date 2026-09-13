# TulsiVeda AI — Architecture Document

**Project:** TulsiVeda AI — Community Voice & Graph-RAG Herb–Drug Safety Decision-Support Platform
**Status:** Hackathon MVP → Production-Oriented Architecture
**Scope basis:** TulsiVeda AI System Specification + finalized 6-screen demo storyboard

---

## 1. Purpose of This Document

This document translates the TulsiVeda AI specification and the finalized demo storyboard into a concrete
system architecture: components, data flow, technology choices, storage model, and safety boundaries.
It is the technical companion to `implementation.md`, which breaks the same architecture into buildable
milestones.

The architecture is built around one non-negotiable principle:

> **LLM proposes/structures → databases provide evidence → rules/graph establish relationships → clinician decides.**

The LLM never issues a verdict. It extracts, normalizes, and summarizes. Identity resolution, safety
classification, and clinical decisions are handled by deterministic components or humans.

---

## 2. Final MVP Scope (6 Screens / Workflows)

| # | Screen | Core Responsibility |
|---|--------|---------------------|
| 1 | Dashboard | Entry point — ASHA "Record Remedy", Doctor "Review Prescription", recent safety reviews, pending alerts |
| 2 | Remedy Intake (ASHA) | Voice/typed capture of vernacular remedy, language selection (Gujarati/English) |
| 3 | AI Analysis | Transcript + structured extraction with explicit "missing information" flags |
| 4 | Plant Identification | CLIP-based ranked candidate resolution, expert confirm/unresolved |
| 5 | Prescription + Safety Review | OCR + drug normalization + safety-engine interaction flag |
| 6 | Evidence + Graph Explanation + Clinician Decision | Reasoning chain, evidence citation, human decision capture |

Explicitly out of scope for the MVP: generic chatbot, full community-governance portal, blockchain,
10+ languages, full clinical database, automated clinical verdicts, speaker diarization.

---

## 3. High-Level System Architecture

```
                         ┌───────────────────────────┐
                         │        ASHA WORKER         │
                         │   Voice / Typed Remedy      │
                         └─────────────┬───────────────┘
                                       │
                         ┌─────────────┴───────────────┐
                         │        DOCTOR / CLINICIAN     │
                         │   Prescription Upload / Review│
                         └─────────────┬───────────────┘
                                       │
                                       ▼
                     ┌─────────────────────────────────────┐
                     │        FRONTEND (React / Flutter)     │
                     │   Dashboard · Intake · Analysis ·     │
                     │   Plant ID · Rx Review · Evidence     │
                     └─────────────────┬─────────────────────┘
                                       │ REST / JSON
                                       ▼
                     ┌─────────────────────────────────────┐
                     │   BACKEND API (Express + TypeScript)  │
                     │   AuthN/Z · Validation · Orchestration│
                     └───────┬───────────────┬───────────────┘
                             │               │
              ┌──────────────┘               └───────────────┐
              ▼                                                ▼
   ┌────────────────────┐                          ┌────────────────────┐
   │  REMEDY PIPELINE     │                          │ PRESCRIPTION PIPE   │
   │                      │                          │                      │
   │  ASR (IndicWhisper/  │                          │  OCR (PaddleOCR /   │
   │  IndicConformer)     │                          │  Dots.OCR / Tesseract)│
   │       │              │                          │       │              │
   │       ▼              │                          │       ▼              │
   │  LLM Extraction       │                          │  Drug Normalization  │
   │  (Qwen3/2.5-Instruct) │                          │  (brand → generic)   │
   │       │              │                          │       │              │
   │       ▼              │                          │       ▼              │
   │  Structured Remedy    │                          │  Confirmed Medicine   │
   │  JSON + Missing-Field │                          │  Entity               │
   │  Flags                │                          │                      │
   └──────────┬───────────┘                          └──────────┬───────────┘
              │                                                  │
              ▼                                                  │
   ┌────────────────────┐                                        │
   │ PLANT RESOLUTION     │                                       │
   │                      │                                       │
   │ CLIP embeddings vs.  │                                       │
   │ approved botanical   │                                       │
   │ reference set        │                                       │
   │  → Qdrant similarity │                                       │
   │  search              │                                       │
   │  → Ranked candidates │                                       │
   │  → Expert confirm /  │                                       │
   │    unresolved         │                                       │
   └──────────┬───────────┘                                       │
              │                                                   │
              └───────────────────┬───────────────────────────────┘
                                   ▼
                     ┌─────────────────────────────────┐
                     │        KNOWLEDGE GRAPH (Neo4j)     │
                     │  Plant · Constituent · Pathway ·   │
                     │  DrugIngredient · AdverseEffect ·  │
                     │  EvidenceSource                     │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     ┌─────────────────────────────────┐
                     │      SAFETY ENGINE (Deterministic) │
                     │   Graph-path traversal + rules      │
                     │   → Evidence level, confidence,     │
                     │     missing information             │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     ┌─────────────────────────────────┐
                     │   EVIDENCE LAYER (Curated PubMed/  │
                     │   PMC sources, PostgreSQL + Qdrant) │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                     ┌─────────────────────────────────┐
                     │        CLINICIAN DECISION LAYER     │
                     │  Accept for review · Insufficient   │
                     │  evidence · Request validation ·    │
                     │  Reject · Monitoring note            │
                     └─────────────────┬─────────────────┘
                                       │
                                       ▼
                              AUDIT LOG (PostgreSQL)
```

---

## 4. Component Breakdown

### 4.1 Frontend
- **Framework:** React (web) / Flutter (mobile, for ASHA field use — offline-capable).
- **Responsibilities:** render the 6 screens, capture voice/image input, display uncertainty and evidence
  clearly, never render a "safe/unsafe" verdict — only "potential interaction detected" language.
- **Key UI rule:** every AI-derived field must visually distinguish itself from human-confirmed fields
  (e.g., "unconfirmed" badge vs. "clinician confirmed" badge).

### 4.2 Backend API — Express + TypeScript
- Stateless REST API, orchestrates calls to ASR, OCR, LLM extraction, CLIP/Qdrant, Neo4j, and the
  safety-rule engine.
- Owns authentication/authorization (role-based: ASHA, Doctor/Clinician, Botanical Expert, Admin),
  consent enforcement, and audit logging.
- Never allows a client to write directly to Neo4j or Postgres — all writes go through validated service
  layers.

### 4.3 ASR — IndicWhisper / IndicConformer
- Converts Gujarati (and English) voice recordings into transcripts.
- Runs as an isolated service invoked by the backend; returns transcript + confidence.
- Original audio is retained (encrypted object storage) for audit even after transcript correction.

### 4.4 LLM Extraction — Qwen3 / Qwen2.5-Instruct
- Structured/JSON-schema-constrained extraction only. Role is limited to:
  - Remedy field extraction (vernacular name, plant part, claimed use, preparation, route, frequency,
    dose, duration) with explicit `null` for missing fields.
  - Drug-name normalization assistance (brand → generic candidate, confirmed by clinician).
  - Evidence-passage summarization (retrieval-only — it may summarize retrieved text but must not
    invent facts or edges).
- **The LLM never**: decides plant identity, never scores interaction severity, never produces a
  final safety verdict.

### 4.5 OCR — PaddleOCR / Dots.OCR / Tesseract
- Extracts text from prescription images (medicine name, strength, route, frequency where legible).
- Raw OCR output is preserved for audit alongside any manual correction.
- Feeds into brand→generic normalization, which requires clinician confirmation before the medicine
  entity becomes eligible for safety analysis.

### 4.6 Plant Identification — CLIP + Qdrant
- CLIP encodes uploaded/reference plant images into embeddings.
- Qdrant performs nearest-neighbor similarity search against an approved botanical reference image set
  (5–10 plants for MVP).
- Output is always a ranked candidate list with similarity scores — never a single forced identification.
- Botanical/clinical expert confirms, rejects, or marks "unresolved."

### 4.7 Knowledge Graph — Neo4j
- Stores the Graph-RAG structure defined in the spec:
  - **Nodes:** VernacularTerm, PlantSpecies, PlantPart, Preparation, Constituent, Enzyme, Transporter,
    DrugBrand, DrugIngredient, DrugClass, AdverseEffect, DiseaseClaim, EvidenceSource, Community,
    Contributor, ClinicalDecision.
  - **Relationships:** ALIAS_OF, LOCALLY_USED_AS, PREPARED_AS, USES_PLANT_PART,
    CONTAINS_OR_MAY_CONTAIN, INHIBITS, INDUCES, METABOLIZED_BY, INTERACTS_WITH,
    ASSOCIATED_WITH_ADVERSE_EFFECT, SUPPORTED_BY, CONTRIBUTED_BY, REVIEWED_BY, GOVERNED_BY,
    RESTRICTED_BY.
- MVP graph size: 5–10 plants + 5–10 drugs with well-populated relationships (quality over volume).

### 4.8 Safety Engine — Deterministic Graph/Rule Engine
- Traverses the required reasoning path:
  `PlantSpecies → Preparation → Constituent/BiologicalEffect → Enzyme/Transporter/Pathway →
  DrugIngredient → PotentialAdverseEffect → EvidenceSource`
- Classifies each result into one of four evidence levels: **Established**, **Suspected/Mechanistic**,
  **Unknown**, **Not Detected** (never treated as proof of safety).
- Rule engine — not the LLM — assigns evidence level, confidence, and lists missing information
  (e.g., "exact species," "dose," "preparation concentration").

### 4.9 Evidence Layer — Curated PubMed/PMC
- Curated, pre-vetted evidence sources only (not open web retrieval) for the MVP.
- Each graph edge that carries a safety implication links to an `EvidenceSource` node with
  `source_type`, `source_url`, `publication_id`, `evidence_level`, `confidence`.
- Retrieval is vector-assisted (Qdrant) for passage lookup, but severity classification stays
  rule-driven.

### 4.10 Human-in-the-Loop / Clinician Decision Layer
- Doctor reviews the full evidence chain and records one of: Accept for review, Insufficient evidence,
  Request expert validation, Reject as irrelevant, Add monitoring note.
- This decision — not the AI score — is the record of clinical action, and it is what gets audited.

### 4.11 Audit & Consent Layer
- Every AI output, human confirmation/rejection, and clinical decision is logged with actor, timestamp,
  model/rule/graph version, and evidence snapshot.
- Consent metadata (purpose, access level, model-training permission, withdrawal) attached to every
  contributor record from intake onward.

---

## 5. Data Model (Storage Split)

| Store | Purpose |
|-------|---------|
| **PostgreSQL** | Transactional/relational data: users, roles, consents, audio_records, transcripts, plant_observations, candidate_species, medicine_entries, prescriptions, clinical_alerts, clinical_decisions, evidence_sources metadata, audit_events, model_versions |
| **Neo4j** | Knowledge graph — botanical, pharmacological, and evidence relationships; graph-path traversal for the safety engine |
| **Qdrant** | Vector store — CLIP plant-image embeddings for identification; text embeddings for evidence-passage retrieval |
| **Object storage (encrypted)** | Raw audio recordings, prescription images, expert-attached images |

---

## 6. Data Flow — Two Pipelines Converging on the Graph

```
VOICE PIPELINE                          PRESCRIPTION PIPELINE
Voice recording                         Prescription image
   │                                        │
   ▼                                        ▼
ASR transcript                          OCR raw text
   │                                        │
   ▼                                        ▼
LLM structured extraction               Brand → generic normalization
   │ (+ missing-field flags)                │ (clinician confirmation required)
   ▼                                        ▼
CLIP/Qdrant plant candidates            Confirmed medicine entity
   │ (+ expert confirmation)                │
   └───────────────┬────────────────────────┘
                    ▼
            NEO4J GRAPH TRAVERSAL
                    │
                    ▼
            SAFETY RULE ENGINE
        (evidence level + confidence + gaps)
                    │
                    ▼
          EVIDENCE + REASONING CHAIN
                    │
                    ▼
             CLINICIAN DECISION
                    │
                    ▼
                AUDIT LOG
```

---

## 7. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (web portal) / Flutter (mobile, offline-capable field app) |
| Backend API | Express + TypeScript |
| ASR | IndicWhisper / IndicConformer |
| OCR | PaddleOCR / Dots.OCR / Tesseract OCR |
| Plant vision | CLIP embeddings |
| LLM | Qwen3 / Qwen2.5-Instruct (structured extraction + normalization + summarization only) |
| Vector DB | Qdrant |
| Knowledge graph | Neo4j (Cypher; APOC/GDS where useful) |
| Relational DB | PostgreSQL |
| Evidence corpus | Curated PubMed / PMC sources |
| Safety logic | Deterministic graph/rule engine (not LLM-driven) |
| Object storage | Encrypted storage for audio, prescriptions, expert attachments |

---

## 8. API Surface (Conceptual)

```
POST /auth/login
POST /remedies/voice
POST /remedies/transcribe
POST /remedies/extract
POST /plants/resolve
POST /plants/{id}/review
POST /prescriptions/upload
POST /medicines/normalize
POST /safety/analyze
GET  /alerts/{id}
POST /clinical-decisions
GET  /audit/{record_id}
POST /consent
POST /access-requests
```

All clinical/safety endpoints enforce: role authorization → consent/access policy → input validation →
provenance tracking → audit logging, in that order.

---

## 9. Safety & Trust Boundaries

```
EVIDENCE (documents, graph, curated literature)
        │
        ▼
LLM (extraction / normalization / summarization ONLY)
        │
        ▼
DETERMINISTIC SAFETY ENGINE (evidence level + confidence)
        │
        ▼
HUMAN (botanical expert confirms identity; clinician confirms medicine
        and records final decision)
```

Hard boundaries enforced at the architecture level, not just the UI:
- No clinical alert can be generated from an **unconfirmed** medicine.
- No plant identity is presented as confirmed unless an expert confirmed it.
- "Not Detected" is never rendered as "Safe."
- The LLM's output never directly triggers a stored safety classification — it must pass through the
  rule engine first.

---

## 10. Security & Privacy

- TLS in transit; AES-based encryption at rest; KMS-managed keys.
- Role-based access control across ASHA / Clinician / Botanical Expert / Community Governance /
  Administrator roles.
- Pseudonymous identifiers for the hackathon build; minimize Aadhaar numbers, exact addresses, full
  names, and precise healer locations.
- Consent access levels: private, community-only, expert-review, clinical-safety, research — enforced
  before any restricted knowledge is exposed via the API layer.
- Full audit trail of record access, changes, exports, and consent events.

---

## 11. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Every safety flag must be traceable to graph relationships and evidence sources |
| NFR-02 | Document, vision, graph, and rule-engine components remain modular and independently testable |
| NFR-03 | AI outputs remain grounded in retrieved/structured evidence — no free-form claims |
| NFR-04 | High-impact decisions (identity confirmation, clinical action) remain with humans |
| NFR-05 | Same evidence + same rule/graph version → reproducible output |
| NFR-06 | System degrades to "insufficient evidence / flag for review" rather than manufacturing certainty when inputs are incomplete or conflicting |
