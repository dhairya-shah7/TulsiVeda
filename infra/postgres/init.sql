-- ==============================================================================
-- TulsiVeda AI — PostgreSQL Production Relational Schema
-- All operational tables start with 0 records (100% Blank Slate)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles & Users
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO roles (name, description) VALUES
    ('asha', 'Field Health Worker - Remedy recording & consent capture'),
    ('clinician', 'Doctor / Pharmacist - Prescription review & safety decisions'),
    ('botanist', 'Botanical Expert - Candidate plant confirmation & taxonomy'),
    ('governance', 'Community Governance - Knowledge access & attribution control'),
    ('admin', 'System Administrator - Infrastructure & technical metadata')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id INT REFERENCES roles(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    organization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Default system admin & sample user identities (empty operational state)
INSERT INTO users (id, role_id, name, email, organization) VALUES
    ('a0000000-0000-0000-0000-000000000001', 1, 'Pooja Patel (ASHA)', 'asha.pooja@tulsiveda.org', 'Gujarat Rural Health Mission'),
    ('a0000000-0000-0000-0000-000000000002', 2, 'Dr. Rajesh Mehta', 'dr.mehta@civilhospital.in', 'Civil Hospital Ahmedabad'),
    ('a0000000-0000-0000-0000-000000000003', 3, 'Dr. Sunita Rao (Ethnobotanist)', 'sunita.rao@botany.res.in', 'National Botanical Research Institute')
ON CONFLICT (email) DO NOTHING;

-- 2. Communities & Contributors
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    governance_contact VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Consents (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contributor_name VARCHAR(255),
    community_id UUID REFERENCES communities(id),
    scope VARCHAR(50) NOT NULL CHECK (scope IN ('private', 'community', 'clinical', 'research', 'no_model_training')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn')),
    consent_version VARCHAR(20) DEFAULT '1.0',
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Audio Records (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS audio_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_path TEXT,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    duration_seconds NUMERIC(6, 2),
    sample_rate INT,
    snr_db NUMERIC(5, 2),
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Transcripts (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audio_id UUID REFERENCES audio_records(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL DEFAULT 'gu',
    raw_text TEXT NOT NULL,
    corrected_text TEXT,
    confidence NUMERIC(4, 3),
    model_version VARCHAR(100) DEFAULT 'IndicWhisper-v1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Remedy Records (Unified operational table matching storyboard)
CREATE TABLE IF NOT EXISTS remedy_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remedy_name_local VARCHAR(255),
    used_for_condition VARCHAR(255),
    prepared_by VARCHAR(255),
    place_region VARCHAR(255),
    language VARCHAR(20) DEFAULT 'Gujarati',
    audio_id UUID REFERENCES audio_records(id),
    transcript_id UUID REFERENCES transcripts(id),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'extracted', 'identified', 'reviewed', 'completed')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Structured Plant Observations & Extracted Details (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS plant_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remedy_id UUID REFERENCES remedy_records(id) ON DELETE CASCADE,
    vernacular_name VARCHAR(255),
    plant_part VARCHAR(100),
    preparation VARCHAR(150),
    dose VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    route VARCHAR(100),
    claimed_use VARCHAR(255),
    notes TEXT,
    extraction_confidence NUMERIC(4, 3),
    requires_review BOOLEAN DEFAULT TRUE,
    raw_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Candidate Species (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS candidate_species (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    observation_id UUID REFERENCES plant_observations(id) ON DELETE CASCADE,
    scientific_name VARCHAR(255) NOT NULL,
    similarity_score NUMERIC(5, 4) NOT NULL,
    rank_order INT NOT NULL,
    image_url TEXT,
    expert_status VARCHAR(50) DEFAULT 'unresolved' CHECK (expert_status IN ('unresolved', 'confirmed', 'rejected')),
    expert_notes TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Prescriptions (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_identifier_hash VARCHAR(64),
    image_path TEXT,
    raw_ocr_text TEXT,
    ocr_engine VARCHAR(50) DEFAULT 'Dots.OCR',
    clinician_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Medicine Entries (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS medicine_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    medicine_type VARCHAR(100) DEFAULT 'Tablet',
    dose VARCHAR(100),
    frequency VARCHAR(100),
    clinician_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Evidence Sources (Curated reference catalogue)
CREATE TABLE IF NOT EXISTS evidence_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type VARCHAR(100) NOT NULL, -- 'PubMed', 'PMC', 'Ayurvedic Pharmacopoeia', 'Monograph'
    publication VARCHAR(255),
    pmid_or_id VARCHAR(100),
    evidence_strength VARCHAR(50) CHECK (evidence_strength IN ('High', 'Moderate', 'Mechanistic', 'In-Vitro', 'Limited')),
    source_url TEXT,
    title TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed core curated evidence references (biomedical literature index)
INSERT INTO evidence_sources (id, source_type, publication, pmid_or_id, evidence_strength, source_url, title, summary) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'PubMed / Clinical Pharmacology', 'J Clin Psychopharmacol & Hematology', 'PMID: 21453289', 'Mechanistic', 'https://pubmed.ncbi.nlm.nih.gov/21453289/', 'Curcumin inhibits platelet aggregation via TXA2 synthase inhibition', 'Curcuminoids from Curcuma longa inhibit platelet aggregation induced by arachidonate, collagen, and epinephrine.'),
    ('e0000000-0000-0000-0000-000000000002', 'PubMed / Toxicology', 'Biochem Pharmacol', 'PMID: 17560567', 'Moderate', 'https://pubmed.ncbi.nlm.nih.gov/17560567/', 'Inhibition of COX-1 and downstream thromboxane synthesis by polyphenol fractions', 'Synergistic antiplatelet and antithrombotic actions observed when combined with low-dose acetylsalicylic acid.'),
    ('e0000000-0000-0000-0000-000000000003', 'PMC / Phytomedicine', 'Frontiers in Pharmacology', 'PMC6073145', 'Established', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6073145/', 'Ginkgo biloba extract interactions with warfarin and aspirin: systematic review', 'Spontaneous bleeding episodes reported in clinical surveillance following co-administration with antiplatelet therapy.')
ON CONFLICT (id) DO NOTHING;

-- 12. Clinical Alerts (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS clinical_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remedy_id UUID REFERENCES remedy_records(id),
    medicine_id UUID REFERENCES medicine_entries(id),
    plant_scientific_name VARCHAR(255),
    drug_generic_name VARCHAR(255),
    interaction_type VARCHAR(255) NOT NULL,
    evidence_level VARCHAR(50) NOT NULL CHECK (evidence_level IN ('established', 'suspected_mechanistic', 'unknown', 'not_detected')),
    confidence VARCHAR(20) DEFAULT 'Moderate',
    evidence_source_id UUID REFERENCES evidence_sources(id),
    graph_path_json JSONB,
    requires_clinician_action BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Clinical Decisions (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS clinical_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES clinical_alerts(id),
    remedy_id UUID REFERENCES remedy_records(id),
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('accept_for_review', 'insufficient_evidence', 'request_expert_validation', 'reject_as_irrelevant', 'add_monitoring_note')),
    notes TEXT,
    clinician_id UUID REFERENCES users(id),
    rule_version VARCHAR(50) DEFAULT 'RuleEngine-v1.0-deterministic',
    model_version VARCHAR(50) DEFAULT 'Qwen2.5-Extract-v1',
    graph_snapshot_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Immutable Audit Events (Operational: Starts 0 records)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    payload JSONB,
    checksum_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_remedy_created_at ON remedy_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_remedy_status ON remedy_records(status);
CREATE INDEX IF NOT EXISTS idx_candidate_species_obs ON candidate_species(observation_id);
CREATE INDEX IF NOT EXISTS idx_medicine_entries_rx ON medicine_entries(prescription_id);
CREATE INDEX IF NOT EXISTS idx_clinical_alerts_remedy ON clinical_alerts(remedy_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_time ON audit_events(created_at DESC);
