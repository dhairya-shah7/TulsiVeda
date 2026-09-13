# TulsiVeda AI — Implementation Plan

**Companion to:** `architecture.md`
**Goal:** Build the 6-screen MVP demonstrating vernacular remedy → structured knowledge → plant
resolution → prescription normalization → herb–drug safety reasoning → evidence → clinician decision.

---

## 1. Guiding Build Principle

Build the pipeline **evidence-first, screen-last**. Each screen is a thin UI layer over a pipeline stage
that must independently produce correct, inspectable output before it's wired into the demo flow.
Never let the LLM's output reach a screen without passing through its designated validation step
(schema check, rule engine, or human confirmation).

---

## 2. Repository Structure

```
tulsiveda/
├── apps/
│   ├── web/                     # React web portal (Doctor / Expert / Admin)
│   └── mobile/                  # Flutter app (ASHA field worker, offline-capable)
├── services/
│   ├── api/                     # Express + TypeScript backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   │   ├── asr/
│   │   │   │   ├── ocr/
│   │   │   │   ├── extraction/       # LLM structured extraction
│   │   │   │   ├── plant-resolution/ # CLIP + Qdrant
│   │   │   │   ├── normalization/    # brand -> generic
│   │   │   │   ├── safety-engine/    # deterministic rules + graph traversal
│   │   │   │   └── audit/
│   │   │   ├── middleware/       # auth, consent, validation, audit logging
│   │   │   ├── models/           # PostgreSQL schema/ORM models
│   │   │   └── graph/            # Neo4j Cypher queries
│   │   └── package.json
│   ├── asr-worker/              # IndicWhisper/IndicConformer inference service
│   ├── ocr-worker/              # PaddleOCR/Dots.OCR/Tesseract service
│   └── vision-worker/           # CLIP embedding service
├── data/
│   ├── botanical-reference/     # 5-10 plant reference images + metadata
│   ├── evidence-corpus/         # curated PubMed/PMC extracts
│   └── seed-graph/              # Neo4j seed Cypher scripts
├── infra/
│   ├── docker-compose.yml       # Postgres, Neo4j, Qdrant, services
│   └── env/
└── docs/
    ├── architecture.md
    └── implementation.md
```

---

## 3. Phased Delivery Plan

### Phase 0 — Environment & Data Foundation
- Stand up PostgreSQL, Neo4j, and Qdrant via docker-compose.
- Define PostgreSQL schema: `users, roles, communities, contributors, consents, audio_records,
  transcripts, plant_observations, candidate_species, medicine_entries, prescriptions,
  clinical_alerts, clinical_decisions, evidence_sources, access_requests,
  benefit_sharing_terms, audit_events, model_versions`.
- Curate the MVP dataset:
  - 5–10 plants with vernacular aliases, reference images, and known constituents.
  - 5–10 common medicines with generic mappings.
  - Curated PubMed/PMC evidence snippets tied to specific plant–drug relationships.
- Seed Neo4j with the graph schema from `architecture.md` §4.7 and the curated dataset.

**Exit criteria:** a Cypher query can traverse
`PlantSpecies → Constituent → Pathway → DrugIngredient → AdverseEffect → EvidenceSource`
for at least 2 real example chains (e.g., turmeric/curcumin → aspirin).

---

### Phase 1 — Remedy Intake & Extraction Pipeline (Screens 2 & 3)
1. **Voice capture (Flutter):** one-tap record, pause/resume, offline queue, "Type Instead" fallback,
   language selector (Gujarati/English).
2. **ASR service:** wrap IndicWhisper/IndicConformer behind an internal API; return transcript +
   per-segment confidence; persist original audio in encrypted object storage.
3. **LLM extraction service (Qwen3/2.5-Instruct):**
   - Prompt constrained to a fixed JSON schema (see §5.1).
   - Explicitly emit `null` for unknown fields — never guess a plausible-sounding value.
   - Output `requires_review: true` whenever confidence is below threshold or any core field is null.
4. **AI Analysis screen:** render transcript + extracted table side by side; visually flag
   "⚠️ Missing information" for null fields.

**Exit criteria:** Given a sample Gujarati recording, the pipeline returns a structured JSON object
matching schema, with correct missing-field flags, in under the demo's acceptable latency.

---

### Phase 2 — Plant Identification (Screen 4)
1. **Vision worker:** CLIP encodes an uploaded/reference plant photo into an embedding.
2. **Qdrant search:** nearest-neighbor lookup against the pre-embedded botanical reference set;
   return top-3 candidates with similarity scores.
3. **UI:** ranked candidate list ("82% / 11% / 4%"), never a single forced answer.
4. **Expert review action:** Confirm species / Mark unresolved — writes to `candidate_species` and
   updates the graph's `PlantSpecies` linkage only on confirmation.

**Exit criteria:** Uploading a known reference photo returns the correct top candidate; an
intentionally ambiguous photo correctly surfaces multiple close candidates instead of a false-confident
single answer.

---

### Phase 3 — Prescription Pipeline & Safety Engine (Screens 5 & 6)
1. **OCR service:** PaddleOCR/Dots.OCR/Tesseract extracts medicine name, strength, frequency from an
   uploaded prescription image.
2. **Normalization service:** brand → generic mapping (e.g., "Ecosprin" → "Aspirin 75 mg"); result is
   held as **unconfirmed** until the clinician explicitly confirms it.
3. **Safety engine (deterministic):**
   - Input: confirmed medicine (generic/ingredient) + confirmed or candidate plant species.
   - Traverse Neo4j reasoning path; classify into Established / Suspected-Mechanistic / Unknown /
     Not Detected per `architecture.md` §4.8.
   - Output object includes: interaction type, evidence level, confidence, missing information, and
     the full graph path used.
   - **Hard rule:** if the medicine is not clinician-confirmed, the safety engine must refuse to run
     and the API returns a validation error — this is enforced in code, not just UI copy.
4. **Evidence + Reasoning screen:** render the graph path as a visual chain (Plant → Constituent →
   Pathway → Drug → Effect), attach evidence source metadata (type, source, strength, publication ID).
5. **Clinician decision capture:** buttons for Accept for review / Insufficient evidence / Request
   expert validation / Reject as irrelevant / Add monitoring note → writes to `clinical_decisions` and
   `audit_events`.

**Exit criteria:** End-to-end run of the demonstration scenario in the spec (turmeric/curcumin +
aspirin → bleeding-risk flag with mechanistic evidence and required clinician review) works from
prescription upload through decision logging.

---

### Phase 4 — Dashboard, Consent, and Audit (Screen 1 + cross-cutting)
1. **Dashboard:** two primary actions (ASHA → Record Remedy, Doctor → Review Prescription), plus
   "Recent Safety Reviews" and "Pending Reviews/Alerts" lists sourced from `clinical_alerts`.
2. **Consent capture:** simple-language (and optionally audio) consent flow at first ASHA use, storing
   purpose, access level, model-training permission, and withdrawal option in `consents`.
3. **Audit log:** every write path (transcript correction, candidate confirmation, medicine
   confirmation, alert generation, clinical decision, restricted-record access) logs actor, timestamp,
   and the model/rule/graph version in effect — implemented as middleware, not per-route boilerplate.

**Exit criteria:** any record in the system can be traced back through `audit_events` to who did what,
when, and with which model/rule/graph version.

---

### Phase 5 — Hardening & Demo Polish
- Load-test the two pipelines with the full 5–10 plant / 5–10 medicine dataset.
- Verify all four "Non-Goals" boundaries hold under adversarial input (e.g., try to force a definitive
  species ID, try to bypass clinician confirmation, try to get the LLM to state a verdict).
- Rehearse the demonstration scenario end-to-end (§6 below) for timing and clarity.

---

## 4. Role-Based Access Control (Implementation Detail)

| Role | Can Do |
|------|--------|
| ASHA / Field Worker | Create/edit own observations, record consent, submit for review |
| Clinician | View patient-linked safety records, confirm medicines, review alerts, log decisions |
| Botanical/Clinical Expert | Validate plant candidates, evidence, and interaction relationships |
| Community Governance Body | Manage visibility, access, attribution, consent, benefit-sharing |
| Administrator | Infrastructure/technical metadata only — no unrestricted clinical/community content access |

Implement as Express middleware: `requireRole([...])` → `enforceConsent(recordId)` →
`validateInput(schema)` → route handler → `auditLog(event)`. Every clinical/safety route must include
all four.

---

## 5. Key Data Contracts

### 5.1 Structured Remedy Extraction (LLM output schema)
```json
{
  "vernacular_name": "string",
  "plant_part": "string",
  "preparation": "string",
  "route": "string",
  "frequency": "string",
  "claimed_use": "string",
  "duration": "string | null",
  "dose": "string | null",
  "confidence": 0.0,
  "requires_review": true
}
```
Original transcript and vernacular term are stored immutably alongside this record even if a human
later corrects normalized fields.

### 5.2 Vision Evidence (Plant Candidate)
```json
{
  "observation_id": "string",
  "candidates": [
    { "species": "string", "similarity": 0.0, "reasoning": ["alias", "region", "plant_part"] }
  ],
  "expert_status": "unresolved | confirmed | rejected"
}
```

### 5.3 Safety Engine Output
```json
{
  "interaction_type": "string",
  "evidence_level": "established | suspected_mechanistic | unknown | not_detected",
  "confidence": "low | moderate | high",
  "graph_path": ["PlantSpecies", "Constituent", "Pathway", "DrugIngredient", "AdverseEffect"],
  "evidence_sources": [
    { "source_type": "string", "source_url": "string", "publication_id": "string" }
  ],
  "missing_information": ["exact species", "dose", "preparation concentration"],
  "human_action_required": true
}
```

### 5.4 Clinical Decision
```json
{
  "alert_id": "string",
  "decision": "accept_for_review | insufficient_evidence | request_expert_validation | reject_as_irrelevant | add_monitoring_note",
  "note": "string | null",
  "clinician_id": "string",
  "timestamp": "ISO-8601",
  "model_version": "string",
  "rule_version": "string",
  "graph_snapshot_id": "string"
}
```

---

## 6. Demonstration Script (for Judging / Review)

1. **Dashboard →** ASHA taps "Record Remedy."
2. **Remedy Intake →** selects Gujarati, records: *"આ હળદરનો ઉપયોગ સાંધાના દુખાવા માટે થાય છે..."*
   (turmeric used for joint pain), or types it.
3. **AI Analysis →** shows transcript + extracted fields; Dose and Duration flagged as missing.
4. **Plant Identification →** photo of the plant part yields ranked candidates: Curcuma longa (82%),
   Curcuma aromatica (11%), Curcuma zedoaria (4%). Expert confirms Curcuma longa.
5. **Prescription + Safety Review →** Doctor uploads a prescription image containing "Ecosprin 75 mg."
   OCR + normalization resolve it to Aspirin 75 mg; Doctor confirms. Safety engine flags a
   **potential additive bleeding risk** (Curcumin → platelet/coagulation pathway → Aspirin),
   evidence level Mechanistic/Limited, confidence Moderate, explicitly labeled
   **"Not a clinical verdict — clinician review required."**
6. **Evidence + Graph Explanation →** reasoning chain rendered visually (Turmeric → Curcumin →
   Pathway → Platelet/Coagulation → Aspirin → Bleeding risk) with cited evidence (source type,
   PubMed/PMC ID, strength).
7. **Clinician Decision →** Doctor selects "Accept for review," adds a monitoring note, submits.
   Action is written to `clinical_decisions` and `audit_events`.

---

## 7. Acceptance Criteria Checklist (from Specification)

- [ ] A field worker can record a remedy offline and synchronize it later.
- [ ] The system produces a transcript with confidence information.
- [ ] A local plant name produces ranked candidates, never an unsupported definitive species.
- [ ] An expert can confirm or reject candidates.
- [ ] A prescription can be OCRed and manually confirmed.
- [ ] A confirmed medicine can participate in graph safety analysis (and only a confirmed one).
- [ ] Every alert displays evidence level, provenance, confidence, and missing information.
- [ ] The system can abstain ("Unknown"/"Not Detected") when evidence or identity is insufficient.
- [ ] A clinician can record a decision, and it is logged.
- [ ] Audit history identifies the relevant user, model/rule version, and evidence for every alert.
- [ ] Consent restrictions are enforced before restricted knowledge is exposed.
- [ ] No autonomous diagnosis, treatment recommendation, dosage change, or prescription change is
      ever produced by the system.

---

## 8. Definition of Done

- All acceptance criteria above pass on the curated MVP dataset.
- No clinical alert can be generated from an unconfirmed medicine (enforced in the safety-engine
  service layer, verified with a negative test).
- Uncertain botanical mappings remain explicitly uncertain in both data and UI.
- No safety claim is ever shown without an attached evidence source.
- The UI visibly distinguishes community-reported claims from clinician-confirmed / evidence-backed
  facts at every screen.
- Every generated alert is reproducible from its recorded graph snapshot, rule version, and model
  version.
- The system has a working, tested abstention path for missing or contradictory information.

**Safety reminder carried from the specification:** this is a decision-support prototype. Real-world
clinical deployment requires clinical validation, regulatory/privacy review, qualified expert
governance, validated evidence sources, and appropriate institutional approvals.
