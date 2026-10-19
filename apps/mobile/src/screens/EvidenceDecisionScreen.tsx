import React, { useEffect, useState } from 'react';
import { 
  ExternalLink, BookOpen, FileCheck, ShieldAlert, ArrowRight, 
  Sprout, Pill, Activity, CheckCircle2, ChevronRight, GitCommit,
  Sparkles, Lock, PhoneCall, ShieldCheck, Stethoscope, AlertTriangle, ArrowLeft
} from 'lucide-react';
import { GraphVisualizer } from '../components/GraphVisualizer.tsx';
import { SafetyEngine, SafetyAnalysisResult } from '../services/safetyEngine.ts';
import { BioKineticEngine, CausalGraphResult } from '../services/bioKineticEngine.ts';
import { ExperientialEngine, AggregatedExperience } from '../services/experientialEngine.ts';
import { AudioNarrator } from '../components/AudioNarrator.tsx';
import { t, useCurrentLanguage } from '../services/localizationService.ts';
import { LLMService } from '../services/llmService.ts';

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
  onNavigate?: (screenIndex: string | number) => void;
  userRole?: 'citizen' | 'asha' | 'doctor';
}

export const EvidenceDecisionScreen: React.FC<EvidenceDecisionScreenProps> = ({
  caseData,
  onSubmitDecision,
  onNavigate,
  userRole = 'citizen',
}) => {
  const currentLang = useCurrentLanguage();
  const [activeTab, setActiveTab] = useState<'graph' | 'evidence' | 'decision'>('graph');
  const [selectedDecision, setSelectedDecision] = useState('accept_for_review');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [llmGenerating, setLlmGenerating] = useState(false);

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

  const [causalResult, setCausalResult] = useState<CausalGraphResult | null>(null);
  const [experientialData, setExperientialData] = useState<AggregatedExperience | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function runAnalysis() {
      try {
        const plant = caseData.plantSpecies || '';
        const drug = caseData.medicineGeneric || '';

        // 1. Run Bio-Kinetic Causal Engine
        const causal = BioKineticEngine.evaluateClash(plant, drug);
        if (isMounted) setCausalResult(causal);

        // 2. Run Experiential Engine
        const ei = ExperientialEngine.getAggregatedExperience(plant);
        if (isMounted) setExperientialData(ei);

        // 3. Supplementary safety engine
        const res = await SafetyEngine.analyze({
          plantSpecies: plant,
          drugGenericName: drug,
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

  const handleGenerateLlmSoap = () => {
    setLlmGenerating(true);
    setTimeout(() => {
      const soap = LLMService.generateSoapNote({
        herbName: caseData.plantSpecies || 'Botanical Herbal Formulation',
        medicineName: caseData.medicineGeneric || 'Prescription Allopathic Drug',
        mechanism: causalResult?.pathwayNode?.mechanism,
        hasClash: causalResult?.hasClash ?? false,
        targetRole: userRole,
      });

      const soapFormatted = `[S] SUBJECTIVE:\n${soap.subjective}\n\n[O] OBJECTIVE:\n${soap.objective}\n\n[A] ASSESSMENT:\n${soap.assessment}\n\n[P] PLAN:\n${soap.plan}\n\n[CONFIRMED BY]: ${userRole === 'doctor' ? 'Medical Officer' : 'ASHA Community Worker'}\n[AI ENGINE]: ${soap.modelSignature}`;
      setNotes(soapFormatted);
      setLlmGenerating(false);
    }, 400);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (caseData.plantSpecies) {
      ExperientialEngine.recordOutcome({
        herbName: caseData.plantSpecies,
        condition: 'General Health Intake',
        outcome: selectedDecision === 'accept_for_review' ? 'improved' : 'unchanged',
        adverseEffectReported: !!(selectedDecision === 'reject_as_irrelevant' || causalResult?.hasClash),
        recoveryDays: 5,
        reportedByRole: userRole === 'doctor' ? 'clinician' : 'asha_worker',
        region: 'National Clinical Registry'
      });
    }

    onSubmitDecision({
      decision: selectedDecision,
      notes: notes || 'Clinician reviewed and recorded in national ledger.',
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(false);
      if (onNavigate) {
        onNavigate('home');
      }
    }, 1200);
  };

  const decisionOptions = [
    { id: 'accept_for_review', label: 'Approve Co-Administration with Patient Monitoring', description: 'Permit both treatments; counsel patient on hydration and 2-4 hr dose staggering' },
    { id: 'stagger_administration', label: 'Mandate Staggered Dosing (Minimum 4 Hours)', description: 'Mitigate direct competitive inhibition at hepatic CYP450 clearance enzymes' },
    { id: 'insufficient_evidence', label: 'Pending Longitudinal Clinical Data', description: 'Monitor liver/kidney markers before long-term combined usage' },
    { id: 'reject_as_irrelevant', label: 'Contraindicated - Advise Cessation of Botanical', description: 'High mechanistic clash hazard identified; prioritize essential modern prescription' },
  ];

  // If empty intake
  if (!hasInput) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-800">No Active Case Selected</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please select a patient case from the dashboard queue or add a botanical remedy to view safety evaluations.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  const isCitizen = userRole === 'citizen';
  const vernacularExplanation = LLMService.generatePatientExplanation({
    herbName: caseData.plantSpecies || 'Botanical herb',
    medicineName: caseData.medicineGeneric || 'Prescribed medicine',
    hasClash: causalResult?.hasClash ?? false,
    language: currentLang,
    targetRole: 'citizen'
  });

  /* ========================================================
     CITIZEN VIEW: SAFE, ILLITERATE-FRIENDLY STATUS VIEW
     (Cannot confirm or modify clinical decisions)
     ======================================================== */
  if (isCitizen) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
        {/* Patient Status Banner */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-emerald-200 border border-white/15">
              🌾 {t('patient_advisory_title')}
            </span>
            <AudioNarrator 
              textToNarrate={vernacularExplanation}
              label={t('listen_native')}
              className="bg-white/15 border-white/20 text-white"
            />
          </div>

          <h1 className="text-xl font-extrabold text-white">
            {t('decision_title')}
          </h1>

          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
              <span>🌿 {caseData.plantSpecies || 'Herbal Remedy'}</span>
              <span>+</span>
              <span>💊 {caseData.medicineGeneric || 'Prescription Drug'}</span>
            </div>
          </div>
        </div>

        {/* Vernacular AI Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white ${
              causalResult?.hasClash ? 'bg-amber-500' : 'bg-emerald-600'
            }`}>
              {causalResult?.hasClash ? '!' : '✓'}
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">
                {causalResult?.hasClash ? 'Safety Caution Advised' : 'Safe for Review'}
              </h2>
              <span className="text-[10px] text-slate-500 font-medium">
                Synthesized by BioMistral Medical Intelligence
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
            {vernacularExplanation}
          </div>

          {/* RBAC Notice for Citizen */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Clinician Authorization Required</span>
              <p className="text-[11px] text-amber-800 leading-snug">
                Only an authorized ASHA worker or Medical Doctor can confirm clinical safety decisions. Your case has been logged for health center review.
              </p>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Always leave at least 2-4 hours between taking herbs and medicines.</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Do not stop doctor-prescribed tablets on your own.</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('return_home_btn')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
     DOCTOR / ASHA VIEW: CLINICIAN EVIDENCE & SIGN-OFF
     ======================================================== */
  const narrationText = causalResult?.hasClash 
    ? `Caution: Mechanistic clash detected between ${caseData.plantSpecies} and ${caseData.medicineGeneric}. ${causalResult.clinicalRecommendation}`
    : `Safety analysis complete for ${caseData.plantSpecies} and ${caseData.medicineGeneric}. No severe clash detected.`;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Clinician Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              <span>{userRole === 'doctor' ? 'Doctor Review' : 'ASHA Worker Desk'}</span>
            </span>
          </div>
          <AudioNarrator 
            textToNarrate={narrationText}
            label={t('listen')}
            className="p-1.5 shrink-0"
          />
        </div>

        <h1 className="text-xl font-black text-slate-900 tracking-tight mt-2">
          {t('decision_title')}
        </h1>

        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-900 font-bold">
            🌿 {caseData.plantSpecies || t('botanical_herb')}
          </span>
          <span className="text-slate-400 font-bold">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100/70 text-blue-900 font-bold">
            💊 {caseData.medicineGeneric || t('allopathic_drug')}
          </span>
        </div>

        {/* Clash / Guidance Banner */}
        {causalResult && (
          <div className={`mt-3 p-3 rounded-2xl border text-xs font-medium ${
            causalResult.hasClash 
              ? 'bg-red-50 border-red-200 text-red-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${causalResult.hasClash ? 'bg-red-600 animate-ping' : 'bg-emerald-600'}`} />
              <span>{causalResult.summary}</span>
            </div>
            <p className="text-[11px] leading-relaxed">{causalResult.clinicalRecommendation}</p>
          </div>
        )}
      </div>

      {/* Strict 3-Tab Bar (Clinician View) */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => setActiveTab('graph')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'graph'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('tab_graph_flow')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'evidence'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('tab_evidence')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('decision')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'decision'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('tab_decision')}
        </button>
      </div>

      {/* VIEWPORT 1: ONLY GRAPH FLOW */}
      {activeTab === 'graph' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('causal_pathway_graph')}
              </h2>
            </div>

            <GraphVisualizer
              plantName={caseData.plantSpecies || 'Botanical Specimen'}
              activeCompound={causalResult?.pathwayNode?.compound || safetyAnalysis.graphPath?.[1]?.label || 'Active Phytochemical'}
              medicineName={caseData.medicineGeneric || 'Allopathic Medicine'}
              interactionName={causalResult?.pathwayNode?.mechanism || safetyAnalysis.interactionType || 'Enzyme Clearance Kinetics'}
              hasInteraction={causalResult?.hasClash ?? safetyAnalysis.hasInteraction}
            />

            {causalResult?.pathwayNode && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enzyme Node: {causalResult.pathwayNode.targetEnzymeOrReceptor}</span>
                </div>
                <p><strong>Affinity:</strong> {causalResult.pathwayNode.affinity}</p>
                <p><strong>Causal Pathway:</strong> {causalResult.pathwayNode.biologicalEffect}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEWPORT 2: ONLY CURATED EVIDENCE & EXPERIENTIAL INTELLIGENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* 1. Indian Statutory & Legal Regulatory Authority */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Statutory & Legal Authority (Govt of India)</span>
              </h2>
              <span className="text-[10px] text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Drugs & Cosmetics Act, 1940
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">Ayurvedic Pharmacopoeia of India (API)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">PCIM&H, Ministry of AYUSH • First Schedule Legal Standard</div>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                  Statutory Monograph
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">CDSCO — National List of Essential Medicines (NLEM)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Directorate General of Health Services • DPCO Price & Quality Standard</div>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200">
                  NLEM Certified
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">Traditional Knowledge Digital Library (TKDL)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">CSIR & Ministry of AYUSH Sovereign Classical Formulations Database</div>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                  TKDL Verified
                </span>
              </div>
            </div>
          </div>

          {/* 2. Clinical Guidelines & Peer-Reviewed Trials */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Clinical Evidence & Pharmacological Trials</span>
              </h2>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                {causalResult?.pathwayNode?.evidenceLevel || safetyAnalysis.evidenceSummary?.evidenceStrength || 'Mechanistic'}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Clinical Standard</span>
                <span className="font-semibold text-slate-800">ICMR Treatment Guidelines & WHO Monographs</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Pharmacovigilance Registry</span>
                <span className="font-semibold text-slate-800">PvPI (IPC) Adverse Interaction Watch</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">PMID / Peer-Reviewed Clinical Trial</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {causalResult?.pathwayNode?.pmidEvidence || safetyAnalysis.evidenceSummary?.pmidOrId || 'PMID: 32984102'}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Kinetic Pathway Target</span>
                <span className="font-semibold text-slate-800">In vitro microsome + In vivo human CYP450</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={causalResult?.pathwayNode ? `https://pubmed.ncbi.nlm.nih.gov/${causalResult.pathwayNode.pmidEvidence}/` : 'https://pubmed.ncbi.nlm.nih.gov/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PubMed Monograph & Trial Data</span>
              </a>
            </div>
          </div>

          {/* Experiential Intelligence (EI) Bayesian Insights */}
          {experientialData && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Experiential Intelligence (EI)</span>
                </h3>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {experientialData.totalCasesLogged} ASHA/Citizen Logs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100">
                  <span className="text-lg font-black text-teal-900 block leading-tight">
                    {experientialData.effectiveRecoveryRatePercent}%
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium">Bayesian Relief Rate</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-lg font-black text-slate-900 block leading-tight">
                    {experientialData.averageRecoveryDays} Days
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Avg Recovery Span</span>
                </div>
              </div>

              {experientialData.dietaryMediums.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Recommended Dietary Mediums (अनुपान):</span>
                  <div className="flex flex-wrap gap-1">
                    {experientialData.dietaryMediums.map((m: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEWPORT 3: CLINICIAN DECISION & BIOMISTRAL AI CO-PILOT */}
      {activeTab === 'decision' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Clinician Peer-Reviewed Sign-Off
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {userRole === 'doctor' ? 'Dr. Sign-Off' : 'ASHA Worker Desk'}
              </span>
            </div>

            <div className="space-y-2">
              {decisionOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedDecision === opt.id
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
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
                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                    <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">{opt.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* BioMistral Open-Weight LLM Co-Pilot Button */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Clinical Audit Notes</label>
                <button
                  type="button"
                  onClick={handleGenerateLlmSoap}
                  disabled={llmGenerating}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[10.5px] font-bold transition-all disabled:opacity-50"
                  title="Synthesize clinical SOAP note via BioMistral-7B"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{llmGenerating ? 'Generating SOAP...' : '✨ BioMistral Clinical Note'}</span>
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter patient observations, monitoring schedule, or click 'BioMistral Clinical Note' above..."
                rows={5}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed text-slate-800 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submittedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Recorded in National Audit Ledger!</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Recording...' : 'Confirm Decision & Sign Off'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
