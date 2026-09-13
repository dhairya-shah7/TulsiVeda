# TulsiVeda AI — System Specification

**Version:** 1.0  
**Status:** Hackathon MVP Specification  
**Document Type:** Technical/Product Specification

## 1. Document Purpose

TulsiVeda AI is a community-governed voice and Graph-RAG decision-support platform connecting hyperlocal indigenous-remedy knowledge with modern clinical safety review.

The system documents local remedies, resolves uncertain botanical identities, retrieves evidence, and assists qualified clinicians in reviewing possible safety concerns.

> **Safety boundary:** TulsiVeda is not a digital healer, diagnostic system, autonomous prescriber, or replacement for a doctor or pharmacist.

## 2. Product Goals

- Capture indigenous/local remedy knowledge responsibly.
- Support regional-language voice-based field documentation.
- Extract structured information from unstructured descriptions.
- Resolve vernacular plant names into ranked candidate species.
- Require human confirmation for uncertain botanical identity.
- Normalize prescriptions and medicines with clinician confirmation.
- Use Graph-RAG to identify potentially relevant safety relationships.
- Combine graph facts, evidence retrieval, deterministic rules, and uncertainty.
- Give clinicians concise, actionable review information.
- Preserve community ownership, access controls, attribution, and consent.
- Make safety results auditable and reproducible.

## 3. Non-Goals and Safety Boundaries

TulsiVeda must **not** independently:

- Diagnose diseases.
- Recommend treatment.
- Change medicine dosage.
- Change or discontinue prescriptions.
- Approve a botanical identity.
- Declare a drug interaction clinically confirmed without appropriate evidence.
- Generate unsupported pharmacological facts.
- Present “not detected” as “safe.”
- Replace doctors, pharmacists, or qualified experts.
- Use community knowledge for model training without explicit permission.

## 4. Target Users

### ASHA / Field Worker
Create remedy observations, record voice, correct transcripts, capture consent, add structured information, submit records, and work offline.

### Clinician
View authorized remedy records, upload prescriptions, confirm medicine normalization, review alerts/evidence/graph paths, record clinical decisions, request expert review, and add monitoring notes.

### Botanical / Clinical Expert
Review plant candidates, confirm/reject mappings, add identification notes, attach evidence, review interaction relationships, assign evidence levels, and resolve conflicting sources.

### Community Governance Body
Manage visibility, attribution, benefit-sharing, external access requests, and model-training permissions.

### Administrator
Manage infrastructure, users, roles, and technical metadata. Administrators must not automatically receive unrestricted clinical/community content.

## 5. Core System Workflow

```text
Community Remedy Knowledge
          |
          v
Voice Capture
          |
          v
Speech-to-Text + Confidence
          |
          v
Structured Remedy Extraction
          |
          v
Vernacular Plant Candidate Resolution
          |
          v
Human / Expert Validation
          |
          v
Curated Knowledge Graph
          |
          +--------------------+
          |                    |
          v                    v
Prescription OCR        Evidence Retrieval
          |                    |
          v                    |
Medicine Normalization         |
          |                    |
          +---------+----------+
                    |
                    v
             Graph-RAG Engine
                    |
                    v
             Safety Analysis
                    |
                    v
       Human-Reviewed Clinical Output
```

## 6. Voice Capture Requirements

The mobile application shall support:

- One-tap recording.
- Pause/resume.
- Automatic audio compression.
- Recording-quality indicator.
- Background-noise warning.
- Offline recording.
- Queued synchronization.
- Interrupted-upload recovery.
- Sync status.
- Optional speaker role.
- Consent capture.

Each recording should store audio reference, timestamp, worker identifier, speaker role, consent status, recording quality, approved approximate location, language, and appropriate device/session metadata.

## 7. Offline-First Requirements

The field application must work without continuous connectivity.

It shall:

- Save records locally.
- Queue uploads.
- Retry failed uploads.
- Resume interrupted uploads.
- Display synchronization status.
- Avoid duplicate records.
- Prevent field-data loss.

Recommended local database:

```text
SQLite
```

## 8. Consent Requirements

Consent must be understandable and preferably available in simple language and audio.

Supported permissions:

- Private storage only.
- Community-only access.
- Expert-review access.
- Clinical-safety use.
- Research use.
- No model-training use.

Store:

- Consent version.
- Consent timestamp.
- Contributor.
- Scope of consent.
- Access permissions.
- Withdrawal request.
- Consent history.

Withdrawal must be supported subject to lawful retention obligations.

## 9. Speech and ASR Requirements

Support:

- Regional languages.
- Dialects where possible.
- Domain vocabulary.
- Speaker diarization where necessary.
- Noise-quality scoring.
- Low-confidence highlighting.
- Human transcript correction.
- Audio-to-text alignment.
- PII redaction.

Domain-specific accuracy is especially important for plant names, medicine names, chemical names, dosage units, frequencies, plant parts, preparation methods, and clinical terminology.

## 10. Structured Remedy Extraction

Example:

```json
{
  "vernacular_name": "local plant name",
  "plant_part": "bark",
  "preparation": "decoction",
  "route": "oral",
  "frequency": "twice daily",
  "claimed_use": "joint pain",
  "duration": null,
  "dose": null,
  "confidence": 0.71,
  "requires_review": true
}
```

The original audio, transcript, corrections, extracted fields, confidence, and model version must remain auditable.

## 11. Botanical Knowledge Layer

Features:

- Vernacular synonym search.
- Regional alias mapping.
- Candidate species ranking.
- Plant-part mapping.
- Preparation mapping.
- Local-use categorization.
- Expert verification.
- Botanical image attachment.
- GPS generalization.
- Sensitive-location masking.
- Source/contributor tracking.
- Duplicate detection.
- Contradictory-knowledge detection.
- Sensitive-knowledge restrictions.

Example:

```text
Candidate 1: Species A — 0.62 confidence
Candidate 2: Species B — 0.24 confidence
Candidate 3: Species C — 0.09 confidence
```

If confidence is insufficient:

```text
Plant identity unresolved.
Expert verification required.
```

The system must preserve the original vernacular name.

## 12. Claimed Use vs Clinical Evidence

The system must distinguish:

```text
Community-reported use
```

from:

```text
Clinically established therapeutic indication
```

Example:

```text
Community-reported use:
"Used locally for stomach discomfort."
```

must not become:

```text
"Proven treatment for gastritis."
```

Every claim requires provenance and evidence classification.

## 13. Prescription Pipeline

The clinician may upload a prescription image or enter a medicine manually.

Example:

```text
Ecosprin 75 mg
Dolo 650
```

Possible normalization:

```text
Ecosprin 75 mg
→ Aspirin 75 mg

Dolo 650
→ Paracetamol 650 mg
```

Clinician confirmation is required before normalized medicines participate in clinical safety analysis.

## 14. OCR Safety

OCR must never directly trigger a clinical alert.

Possible OCR errors include:

- Handwriting.
- Similar brand names.
- Incorrect dosage extraction.
- Missing route.
- Multiple strengths.
- Abbreviations.
- Poor image quality.

Required pipeline:

```text
OCR
 ↓
Normalization
 ↓
Clinician Confirmation
 ↓
Clinical Safety Analysis
```

## 15. Clinical Safety Engine

Support:

- Herb–drug interaction retrieval.
- Drug–drug interaction retrieval.
- Constituent–enzyme relationships.
- Constituent–transporter relationships.
- Pharmacokinetic reasoning.
- Pharmacodynamic reasoning.
- Adverse-effect overlap.
- Organ-toxicity overlap.
- Sedation overlap.
- Bleeding-risk overlap.
- Hypoglycemia risk.
- Hypotension risk.
- QT-prolongation risk.
- Pregnancy/lactation review prompts.
- Elderly medication-burden review.
- Preparation-specific uncertainty.
- Dose-specific uncertainty.
- Multiple-remedy combinations.

## 16. Safety Alert Classification

### Established Evidence

Supported by reliable clinical studies, regulatory communications, authoritative monographs, validated pharmacovigilance reports, or high-quality systematic reviews.

```text
Established safety concern.
Clinician review recommended.
```

### Suspected / Mechanistic Evidence

May include in-vitro or animal findings, pharmacokinetic theory, constituent-level evidence, limited case reports, or indirect pathway evidence.

```text
Possible concern based on limited or mechanistic evidence.
Confirm identity, preparation, dose and duration.
```

### Unknown

Used when plant identity, preparation, dose, or evidence is insufficient or contradictory.

```text
Insufficient evidence to determine interaction risk.
Additional verification required.
```

### Not Detected

```text
No relevant relationship found in the current knowledge base.
This is not proof of safety.
```

## 17. Graph-RAG Specification

### Graph Nodes

```text
VernacularTerm
PlantSpecies
PlantPart
Preparation
Constituent
Enzyme
Transporter
DrugBrand
DrugIngredient
DrugClass
AdverseEffect
DiseaseClaim
EvidenceSource
Community
Contributor
ClinicalDecision
```

### Graph Relationships

```text
ALIAS_OF
LOCALLY_USED_AS
PREPARED_AS
USES_PLANT_PART
CONTAINS_OR_MAY_CONTAIN
INHIBITS
INDUCES
METABOLIZED_BY
INTERACTS_WITH
ASSOCIATED_WITH_ADVERSE_EFFECT
SUPPORTED_BY
CONTRIBUTED_BY
REVIEWED_BY
GOVERNED_BY
RESTRICTED_BY
```

### Graph Properties

```text
evidence_level
source_type
source_url
publication_id
review_status
confidence
region
language
preparation
dose
route
date_reviewed
reviewer
consent_status
access_level
```

## 18. Required Graph Reasoning Path

```text
Plant Species
     ↓
Preparation
     ↓
Constituent / Biological Effect
     ↓
Enzyme / Transporter / Physiological Pathway
     ↓
Drug Ingredient
     ↓
Potential Adverse Effect
     ↓
Evidence Source
```

The LLM may summarize retrieved graph facts but must not invent relationships absent from the graph or evidence sources.

## 19. Retrieval Architecture

### Vector Retrieval

Use for:

- Clinical references.
- Pharmacology literature.
- Safety monographs.
- Approved botanical references.
- Community-approved documents.

Potential technologies:

```text
pgvector
Qdrant
OpenSearch
Weaviate
```

### Graph Retrieval

Use for structured multi-hop relationships:

```text
Plant
→ Constituent
→ Enzyme
→ Drug
→ Adverse Effect
```

### Final Reasoning

```text
Graph facts
+
Retrieved evidence
+
Deterministic rules
+
Explicit uncertainty
```

## 20. LLM Requirements

The LLM may be used for:

- Structured extraction.
- Informal-language normalization.
- Follow-up question generation.
- Graph evidence summarization.
- Missing-information detection.
- Claim-vs-evidence classification.
- Clinician-readable explanations.

The LLM must not independently:

- Confirm botanical identity.
- Establish drug interactions.
- Modify prescriptions.
- Assign definitive clinical risk without rule/evidence support.
- Create unsupported pharmacological relationships.
- Write directly to the trusted knowledge graph without human review.

Controls:

- JSON-schema constrained output.
- Function calling.
- Retrieval-only prompts.
- Source citation requirements.
- Input/output validation.
- Prompt-injection filtering.
- PII redaction.
- Human approval for knowledge updates.

## 21. Technical Architecture

```text
┌─────────────────────────────────────────────────────┐
│                 Frontend Applications                │
│ ASHA Mobile App | Clinician Portal | Expert Console │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                  API & Security Layer                │
│ FastAPI | OAuth2 | RBAC | Consent | Audit Logging   │
└───────────────┬─────────────────────┬───────────────┘
                │                     │
                ▼                     ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Community Input Pipeline│ │ Prescription Pipeline   │
│ ASR | Diarization | QC  │ │ OCR | Brand Parser      │
└──────────────┬──────────┘ └──────────────┬──────────┘
               │                           │
               ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Botanical NLP Layer     │ │ Medicine Data Layer     │
│ Entity Extraction       │ │ Ingredients             │
│ Alias Search            │ │ Strength / Route        │
│ Candidate Species       │ │ Drug Classes            │
└──────────────┬──────────┘ └──────────────┬──────────┘
               └──────────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │ Curated Knowledge Layer│
                  │ PostgreSQL + Neo4j     │
                  │ Evidence + Provenance  │
                  └────────────┬───────────┘
                               ▼
                  ┌────────────────────────┐
                  │ Graph-RAG Safety Engine│
                  │ Cypher + Rules + RAG   │
                  └────────────┬───────────┘
                               ▼
                  ┌────────────────────────┐
                  │ Human-Reviewed Output  │
                  │ Alerts | Evidence      │
                  │ Questions | Actions    │
                  └────────────────────────┘
```

## 22. Recommended Technology Stack

| Layer | Technology |
|---|---|
| Mobile | Flutter |
| Web | React + TypeScript |
| Offline DB | SQLite |
| Backend | FastAPI / Python |
| Transactional DB | PostgreSQL |
| Knowledge Graph | Neo4j |
| Graph Query | Cypher |
| Graph Extensions | APOC / GDS where appropriate |
| Speech | Multilingual/domain-adapted ASR |
| OCR | Prescription OCR |
| AI | LLM + NLP + embeddings |
| Vector Retrieval | pgvector / Qdrant / OpenSearch / Weaviate |
| Object Storage | Encrypted object storage |

## 23. Database Specification

### PostgreSQL Tables

```text
users
roles
communities
contributors
consents
audio_records
transcripts
plant_observations
candidate_species
medicine_entries
prescriptions
clinical_alerts
clinical_decisions
evidence_sources
access_requests
benefit_sharing_terms
audit_events
model_versions
```

### Object Storage

Store:

- Audio files.
- Prescription images.
- Plant images.
- Expert attachments.
- Consent recordings.
- Generated reports.

Sensitive objects must be encrypted and access-controlled.

## 24. API Specification

```text
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

Every clinical/safety endpoint must enforce authentication, role authorization, consent policy, access-control policy, input validation, provenance tracking, and audit logging.

## 25. Security Requirements

### Authentication

- Strong authentication.
- Role-based access control.
- Optional MFA.
- Device binding for frontline devices.
- Session timeout.
- Token rotation.

### Encryption

- TLS in transit.
- AES-based encryption at rest.
- KMS-managed keys.
- Encrypted audio storage.
- Encrypted prescription storage.
- Separate keys for sensitive data domains.

### Authorization

```text
ASHA
→ Assigned community records

Clinician
→ Authorized patient-linked safety records

Expert
→ Records requiring validation

Governance Body
→ Community access policies

Administrator
→ Technical metadata
```

## 26. Data Minimization

Avoid collecting unnecessary:

- Aadhaar numbers.
- Exact home addresses.
- Full names.
- Precise healer locations.
- Sensitive ecological coordinates.
- Sensitive community information.
- Unnecessary patient identifiers.

Use pseudonymous identifiers for the hackathon.

## 27. Audit Requirements

Record:

- Record creation.
- Record modification.
- Transcript correction.
- Plant confirmation/rejection.
- Evidence addition and changes.
- Alert generation.
- Alert acknowledgement.
- Clinical decision.
- Restricted-record access.
- Consent changes.
- Data exports.
- Withdrawal/deletion requests.
- Model version.
- Rule version.
- Knowledge-base version.

## 28. Community Governance

TulsiVeda follows a **Community-in-the-Loop** model.

Before recording, explain:

1. Why the knowledge is being recorded.
2. Who may access it.
3. Possible future uses.
4. Research use.
5. Model-training implications.
6. Benefit-sharing.
7. Attribution.
8. Withdrawal options.

The contributor/community should be able to review, correct, restrict, withdraw, define permitted uses, control model-training permission, review access requests, receive attribution, and participate in benefit-sharing decisions.

## 29. Expert Review Workflow

```text
Submitted
   ↓
Under Review
   ↓
Needs Clarification
   ↓
Approved
   ↓
Deprecated
```

Experts can:

- Compare candidate species.
- Verify local names.
- Add preparation details.
- Attach evidence.
- Approve/reject interaction edges.
- Assign evidence levels.
- Add limitations.
- Record source conflicts.
- Version knowledge records.

## 30. Clinician Portal Requirements

The portal should provide:

- Patient remedy history.
- Prescription upload.
- Medicine normalization.
- Safety alerts.
- Evidence cards.
- Graph explanation.
- Uncertainty display.
- Follow-up questions.
- Clinical action documentation.
- Pharmacist referral.
- Exportable report.
- Alert history.
- Manual override.

The UI should remain concise. Clinicians should not need to read a long LLM response during consultation.

## 31. Community Governance Dashboard

Dashboard components:

- Contributors.
- Records by visibility.
- Pending consent.
- Withdrawn records.
- External access requests.
- Benefit-sharing status.
- Attribution requirements.
- Data-use agreements.
- Audit history.
- Dataset coverage.
- Excluded dialects/communities.
- Model-training permissions.

## 32. Hackathon MVP

Do **not** attempt to build a national-scale clinical system during the hackathon.

### MVP Scope

- One regional language + English.
- 5–10 curated remedies.
- 5–10 common medicines.
- Synthetic or consented voice samples.
- ASR transcription.
- Structured extraction.
- Vernacular candidate matching.
- Expert confirmation workflow.
- Prescription OCR.
- Brand-to-generic normalization.
- Small Neo4j graph.
- Evidence-linked safety alerts.
- Three evidence levels.
- "Not Detected" classification.
- Clinician decision logging.
- Consent demonstration.
- Access-control demonstration.
- Audit logging.

## 33. Recommended Demo Case

### Input

```text
"This local bark is boiled and given twice daily for joint pain."
```

### Extraction

```text
Local term: captured
Plant part: bark
Preparation: decoction
Route: oral
Frequency: twice daily
Plant identity: uncertain
Expert review: required
```

### Prescription

```text
Ecosprin 75 mg
```

### Normalization

```text
Active ingredient: Aspirin
Strength: 75 mg
Status: Clinician confirmed
```

### Graph Result

```text
Potential overlap: bleeding risk
Evidence: limited / mechanistic
Confidence: moderate
Required action: clinician review

Missing:
- Exact species
- Dose
- Preparation concentration
- Duration
```

### Clinician Actions

```text
[ ] Accept for review
[ ] Reject
[ ] Insufficient evidence
[ ] Request expert validation
[ ] Add monitoring note
```

## 34. Acceptance Criteria

- [ ] Field worker can record a remedy offline.
- [ ] Record synchronizes when connectivity returns.
- [ ] ASR produces a reviewable transcript.
- [ ] Low-confidence domain terms are highlighted.
- [ ] Structured remedy fields are extracted.
- [ ] Vernacular name produces ranked candidates.
- [ ] System can abstain from botanical identification.
- [ ] Expert can confirm/reject a candidate.
- [ ] Prescription can be OCR processed.
- [ ] Clinician can correct OCR output.
- [ ] Medicine can be normalized to an active ingredient.
- [ ] Clinician confirmation is required before clinical analysis.
- [ ] Graph performs a multi-hop safety search.
- [ ] Every alert displays evidence level.
- [ ] Every alert displays provenance.
- [ ] Every alert displays uncertainty/confidence.
- [ ] Missing information is explicitly displayed.
- [ ] "Not detected" is not presented as "safe."
- [ ] Clinician can record a decision.
- [ ] Consent restrictions are enforced.
- [ ] Audit history records important actions.
- [ ] Model/rule/knowledge versions are associated with alerts.
- [ ] System has a safe abstention path.

## 35. Example End-to-End Result

```text
REMEDY
Local bark preparation

IDENTITY
Probable candidate:
Species A
Confidence:
0.62

Status:
Expert verification required

PREPARATION
Bark
Decoction
Oral
Twice daily

PRESCRIPTION
Ecosprin 75 mg

NORMALIZATION
Aspirin 75 mg
Clinician confirmed

SAFETY REVIEW
Potential bleeding-risk overlap

EVIDENCE
Limited / mechanistic

CONFIDENCE
Moderate

MISSING INFORMATION
Exact species
Dose
Preparation concentration
Duration

RECOMMENDED ACTION
Confirm botanical identity and preparation.
Review bleeding history and concurrent medicines.

STATUS
Human clinical review required.
```

## 36. Definition of Done

The implementation is ready for hackathon demonstration when:

1. The complete vertical workflow works end-to-end.
2. Offline field capture works.
3. ASR produces reviewable transcripts.
4. Structured extraction works.
5. Botanical candidate resolution works.
6. Human expert validation works.
7. Prescription OCR works.
8. Medicine normalization works.
9. Graph-RAG produces traceable safety paths.
10. Evidence levels are enforced.
11. Uncertainty is visible.
12. Unsupported claims are blocked.
13. Consent controls work.
14. Role-based access works.
15. Audit logs work.
16. Clinician can record a decision.
17. System can abstain safely.
18. Demonstration clearly separates community knowledge from clinical evidence.

---

## 37. Safety Disclaimer

TulsiVeda AI is a decision-support and knowledge-preservation prototype.

Real-world clinical deployment requires appropriate:

- Clinical validation.
- Regulatory review.
- Privacy and security review.
- Qualified expert governance.
- Validated evidence sources.
- Institutional approvals.
- Pharmacovigilance processes.
- Community consent and governance.

The system should prefer **transparent uncertainty and human review over confident unsupported conclusions**.
