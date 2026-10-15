import React, { useEffect, useState } from 'react';
import { ExternalLink, BookOpen, FileCheck, ShieldAlert, ArrowRight, Sprout, Pill } from 'lucide-react';
import { GraphVisualizer } from '../components/GraphVisualizer.tsx';
import { SafetyEngine, SafetyAnalysisResult } from '../services/safetyEngine.ts';

interface EvidenceDecisionScreenProps {
  caseData: {
    plantSpecies?: string;
    medicineGeneric?: string;
    isClinicianConfirmed?: boolean;
    remedyId?: string;
  };
  onSubmitDecision: (decisionData: {
    decision: string;
    notes: string;
  }) => void;
  onNavigate?: (screenIndex: number) => void;
}

export const EvidenceDecisionScreen: React.FC<EvidenceDecisionScreenProps> = ({
  caseData,
  onSubmitDecision,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'evidence' | 'decision'>('graph');
  const [selectedDecision, setSelectedDecision] = useState('accept_for_review');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPlant = !!(caseData.plantSpecies && caseData.plantSpecies.trim());
  const hasMedicine = !!(caseData.medicineGeneric && caseData.medicineGeneric.trim());
  const hasInput = hasPlant || hasMedicine;

  const [safetyAnalysis, setSafetyAnalysis] = useState<SafetyAnalysisResult>({
    hasInteraction: false,
    interactionType: 'Evaluating pharmacological pathways...',
    evidenceLevel: 'not_detected',
    confidence: 'Moderate',
    graphPath: [],
    evidenceSummary: {
      source: 'PubMed / Biomedical Index',
      publication: 'Clinical Pharmacology',
      pmidOrId: 'Loading...',
      evidenceStrength: 'Mechanistic',
      url: 'https://pubmed.ncbi.nlm.nih.gov/',
    },
    missingInformation: [],
    humanActionRequired: true,
    alertHeadline: 'Evaluating Graph-RAG pathways...',
    ruleVersion: 'GraphRAG-SafetyEngine-v2.5',
    graphSnapshotHash: '',
    provenance: { plantTaxon: '', targetPathway: '', drugATC: '' },
  });

  useEffect(() => {
    let isMounted = true;
    async function runAnalysis() {
      try {
        const res = await SafetyEngine.analyze({
          plantSpecies: caseData.plantSpecies || '',
          drugGenericName: caseData.medicineGeneric || '',
          isClinicianConfirmed: true,
        });
        if (isMounted) {
          setSafetyAnalysis(res);
        }
      } catch (err) {
        console.warn('[SafetyScreen] Evaluation warning:', err);
      }
    }
    runAnalysis();
    return () => {
      isMounted = false;
    };
  }, [caseData.plantSpecies, caseData.medicineGeneric]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmitDecision({
      decision: selectedDecision,
      notes,
    });
  };

  const decisionOptions = [
    { id: 'accept_for_review', label: 'Accept for review', description: 'Monitor patient for additive clinical symptoms' },
    { id: 'insufficient_evidence', label: 'Insufficient evidence', description: 'Additional clinical trials required to confirm significance' },
    { id: 'request_expert_validation', label: 'Request expert validation', description: 'Escalate to botanical pharmacologist' },
    { id: 'reject_as_irrelevant', label: 'Reject as irrelevant', description: 'No clinically relevant interaction for this patient profile' },
  ];

  // If completely empty (no plant and no medicine provided yet)
  if (!hasInput) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">
            Evidence & Decision
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Graph-RAG herb–drug interaction reasoning engine
          </p>
        </div>

        <div className="surface-card border-dashed border-gray-300 py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 shadow-inner">
            <ShieldAlert className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-800">No Active Herb–Drug Pair</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              The safety reasoning engine traverses botanical pathways against confirmed prescription medicines. Please capture a remedy or upload a prescription first.
            </p>
          </div>
          {onNavigate && (
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onNavigate(2)}
                className="btn-primary text-xs py-2 px-3 rounded-lg flex items-center gap-1.5"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>+ Start Remedy Intake</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(5)}
                className="px-3 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>+ Prescription Review</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">
          Evidence & Decision
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Evaluating:{' '}
          <span className="font-bold text-emerald-800">
            {caseData.plantSpecies || 'Botanical (Unspecified)'}
          </span>{' '}
          +{' '}
          <span className="font-bold text-gray-800">
            {caseData.medicineGeneric || 'Medicine (Unspecified)'}
          </span>
        </p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('graph')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'graph'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Graph Flow
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'evidence'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Evidence
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('decision')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'decision'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Decision
        </button>
      </div>

      <div className="space-y-3">
        <GraphVisualizer
          plantName={caseData.plantSpecies || 'Botanical Specimen'}
          activeCompound={safetyAnalysis.graphPath?.[1]?.label || 'Active Phytochemical'}
          medicineName={caseData.medicineGeneric || 'Allopathic Medicine'}
          interactionName={safetyAnalysis.interactionType || 'Mechanistic Pathway'}
          hasInteraction={safetyAnalysis.hasInteraction}
        />
      </div>

      <div className="surface-card space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Curated Evidence</span>
          </h2>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
            {safetyAnalysis.evidenceSummary?.evidenceStrength || 'Mechanistic'}
          </span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-500 font-medium">Source</span>
            <span className="font-semibold text-gray-800">{safetyAnalysis.evidenceSummary?.source}</span>
          </div>
          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-500 font-medium">Publication</span>
            <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]">
              {safetyAnalysis.evidenceSummary?.publication}
            </span>
          </div>
          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-500 font-medium">PMID / Reference</span>
            <span className="font-mono text-emerald-700 font-bold">
              {safetyAnalysis.evidenceSummary?.pmidOrId}
            </span>
          </div>
        </div>

        <div className="pt-1">
          <a
            href={safetyAnalysis.evidenceSummary?.url || 'https://pubmed.ncbi.nlm.nih.gov/'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full text-xs py-2 rounded-xl text-emerald-700 border-emerald-300 hover:bg-emerald-50 flex items-center justify-center gap-1.5 font-bold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Verified PubMed Source</span>
          </a>
        </div>
      </div>

      <div className="surface-card space-y-3 shadow-sm">
        <h2 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Clinician Decision Sign-off
        </h2>

        <div className="space-y-2">
          {decisionOptions.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDecision === opt.id
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="clinicianDecision"
                value={opt.id}
                checked={selectedDecision === opt.id}
                onChange={() => setSelectedDecision(opt.id)}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <div>
                <span className="text-xs font-bold text-gray-900">{opt.label}</span>
                <p className="text-[10.5px] text-gray-500 mt-0.5">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-1">
            <label className="form-label text-xs mb-0">Clinical Audit Notes</label>
            <span className="text-[10px] text-gray-400 font-mono">{notes.length}/500</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 500))}
            placeholder="Enter patient observation, monitoring schedule, or dosage instructions..."
            rows={3}
            className="form-input text-xs resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full py-3 text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Recording in Audit Ledger...' : 'Submit Decision'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
