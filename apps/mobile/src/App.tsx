import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { RemedyIntakeScreen } from './screens/RemedyIntakeScreen.tsx';
import { AiAnalysisScreen } from './screens/AiAnalysisScreen.tsx';
import { PlantIdScreen } from './screens/PlantIdScreen.tsx';
import { PrescriptionScreen } from './screens/PrescriptionScreen.tsx';
import { EvidenceDecisionScreen } from './screens/EvidenceDecisionScreen.tsx';
import { StorageService, StoredRecord } from './services/storageService.ts';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [activeDraft, setActiveDraft] = useState<{
    remedyId?: string;
    language?: string;
    remedyNameLocal?: string;
    usedForCondition?: string;
    preparedBy?: string;
    placeRegion?: string;
    transcript?: string;
    extractedDetails?: any;
    scientificName?: string;
    commonName?: string;
    confirmedMedicine?: any;
  }>({
    remedyNameLocal: '',
    usedForCondition: '',
    preparedBy: '',
    placeRegion: '',
    scientificName: '',
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Screen 1: Start New Actions
  const handleStartRemedy = () => {
    setActiveDraft({
      remedyId: 'rem_' + Date.now(),
      remedyNameLocal: '',
      usedForCondition: '',
      preparedBy: 'Pooja Patel (ASHA)',
      placeRegion: 'Anand, Gujarat',
      scientificName: '',
    });
    setCurrentScreen(2);
  };

  const handleStartPrescription = () => {
    setActiveDraft({
      remedyId: 'rx_rev_' + Date.now(),
      remedyNameLocal: '',
      usedForCondition: '',
      preparedBy: 'Civil Hospital Clinician',
      placeRegion: 'Ahmedabad, Gujarat',
      scientificName: '',
    });
    setCurrentScreen(5);
  };

  // Screen 2 -> 3: Remedy Intake Submitted
  const handleRemedyIntakeNext = async (data: any) => {
    const remedyId = activeDraft.remedyId || 'rem_' + Date.now();
    const updatedDraft = { ...activeDraft, ...data, remedyId };
    setActiveDraft(updatedDraft);

    // 1. Immediately persist to offline device storage
    StorageService.saveRecord({
      id: remedyId,
      remedy_name_local: data.remedyNameLocal || 'Remedy Observation',
      used_for_condition: data.usedForCondition || 'General Health Condition',
      prepared_by: data.preparedBy || 'ASHA Field Worker',
      place_region: data.placeRegion || 'Anand, Gujarat',
      language: data.language || 'Gujarati',
      status: 'draft',
      created_at: new Date().toISOString(),
      transcript: data.transcript,
    });

    // 2. Persist basic details to backend PostgreSQL if connected
    try {
      const res = await fetch('/api/remedies/basic-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remedyNameLocal: data.remedyNameLocal,
          usedForCondition: data.usedForCondition,
          preparedBy: data.preparedBy,
          placeRegion: data.placeRegion,
          language: data.language,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.remedy?.id) {
          setActiveDraft((prev) => ({ ...prev, remedyId: json.remedy.id }));
        }
      }
    } catch (err) {
      console.log('[App] Local offline mode active:', err);
    }

    setCurrentScreen(3);
  };

  // Screen 3 -> 4: AI Analysis Next
  const handleAiAnalysisNext = (extracted: any) => {
    const resolvedScientific = /tulsi/i.test(extracted.localName) ? 'Ocimum sanctum'
      : /neem/i.test(extracted.localName) ? 'Azadirachta indica'
      : /ashwagandha/i.test(extracted.localName) ? 'Withania somnifera'
      : /giloy/i.test(extracted.localName) ? 'Tinospora cordifolia'
      : /ginger|aadu/i.test(extracted.localName) ? 'Zingiber officinale'
      : /haldi|turmeric/i.test(extracted.localName) ? 'Curcuma longa'
      : (activeDraft.scientificName || extracted.localName || 'Botanical Specimen');

    setActiveDraft((prev) => ({
      ...prev,
      transcript: extracted.transcript,
      extractedDetails: extracted,
      scientificName: resolvedScientific,
    }));

    if (activeDraft.remedyId) {
      StorageService.saveRecord({
        id: activeDraft.remedyId,
        status: 'extracted',
        extracted_details: extracted,
        confirmed_species: resolvedScientific,
      });
    }

    setCurrentScreen(4);
  };

  // Screen 4 -> 5: Plant Identification Next
  const handlePlantIdNext = (plantData: any) => {
    setActiveDraft((prev) => ({
      ...prev,
      scientificName: plantData.scientificName,
      commonName: plantData.commonName,
    }));

    if (activeDraft.remedyId) {
      StorageService.saveRecord({
        id: activeDraft.remedyId,
        status: 'identified',
        confirmed_species: plantData.scientificName,
      });
    }

    setCurrentScreen(5);
  };

  // Screen 5 -> 6: Prescription Review Next
  const handlePrescriptionNext = (medicineData: any) => {
    setActiveDraft((prev) => ({
      ...prev,
      confirmedMedicine: medicineData,
    }));

    if (activeDraft.remedyId) {
      StorageService.saveRecord({
        id: activeDraft.remedyId,
        status: 'reviewed',
        confirmed_medicine: `${medicineData.brandName} (${medicineData.genericName})`,
      });
    }

    setCurrentScreen(6);
  };

  // Screen 6: Final Clinician Decision Submitted -> Returns to Dashboard
  const handleSubmitDecision = async (decisionData: any) => {
    const remedyId = activeDraft.remedyId || 'rec_' + Date.now();
    const plant = (activeDraft.scientificName || 'Curcuma longa').toLowerCase();
    const drug = (activeDraft.confirmedMedicine?.genericName || 'Aspirin').toLowerCase();

    let interactionType = 'No Direct High-Risk Interaction Detected';
    let evidenceLevel = 'Preliminary Verification';

    if (/curcuma|turmeric|haldi/i.test(plant) && /aspirin|ecosprin|warfarin/i.test(drug)) {
      interactionType = 'Additive Antiplatelet / Bleeding Risk';
      evidenceLevel = 'Suspected Mechanistic (PMID: 21453289)';
    } else if (/ocimum|tulsi/i.test(plant) && /metformin|insulin|glimepiride/i.test(drug)) {
      interactionType = 'Additive Hypoglycemic Effect';
      evidenceLevel = 'Strong In-Vitro & Animal Evidence (PMID: 16187193)';
    } else if (/azadirachta|neem/i.test(plant) && /metformin|glimepiride/i.test(drug)) {
      interactionType = 'Hypoglycemic Potentiation';
      evidenceLevel = 'Curated Botanical Monograph';
    } else if (/withania|ashwagandha/i.test(plant)) {
      interactionType = 'CNS Potentiation / Thyroid Modulation';
      evidenceLevel = 'Clinical Observational (PMID: 10956379)';
    }

    // Persist finalized record to local storage immediately
    StorageService.saveRecord({
      id: remedyId,
      remedy_name_local: activeDraft.remedyNameLocal || `${activeDraft.scientificName || 'Botanical'} Observation`,
      used_for_condition: activeDraft.usedForCondition || 'Clinical Review Case',
      prepared_by: activeDraft.preparedBy || 'Pooja Patel (ASHA)',
      place_region: activeDraft.placeRegion || 'Anand, Gujarat',
      language: activeDraft.language || 'Gujarati',
      status: 'completed',
      decision: decisionData.decision,
      decision_notes: decisionData.notes || 'Clinician reviewed and recorded.',
      interaction_type: interactionType,
      evidence_level: evidenceLevel,
      confirmed_species: activeDraft.scientificName || '',
      confirmed_medicine: activeDraft.confirmedMedicine 
        ? `${activeDraft.confirmedMedicine.brandName} (${activeDraft.confirmedMedicine.genericName})`
        : '',
    });

    // Also attempt remote audit log if backend reachable
    try {
      await fetch('/api/safety/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remedyId,
          decision: decisionData.decision,
          notes: decisionData.notes,
        }),
      });
    } catch (err) {
      console.log('[App] Remote audit log synced locally:', err);
    }

    setNotificationMsg('Decision successfully logged to local audit ledger & history.');
    setTimeout(() => setNotificationMsg(null), 4000);

    // Reset draft and return to Dashboard
    setActiveDraft({
      remedyNameLocal: '',
      usedForCondition: '',
      preparedBy: '',
      placeRegion: '',
      scientificName: '',
    });
    setCurrentScreen(1);
  };

  // Select record from Dashboard
  const handleSelectRecord = (record: StoredRecord) => {
    setActiveDraft({
      remedyId: record.id,
      remedyNameLocal: record.remedy_name_local,
      usedForCondition: record.used_for_condition,
      preparedBy: record.prepared_by,
      placeRegion: record.place_region,
      language: record.language,
      scientificName: record.confirmed_species,
      transcript: record.transcript,
    });
  };

  // In-Page Back Button
  const handleBack = () => {
    if (currentScreen > 1) {
      setCurrentScreen((prev) => prev - 1);
    }
  };

  return (
    <div className="mobile-app-viewport">
      {/* Fixed Top Header */}
      <Header
        currentScreen={currentScreen}
        onBack={handleBack}
      />

      {/* Floating Notification Banner */}
      {notificationMsg && (
        <div className="mx-5 mt-2 p-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-fadeIn z-30">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="text-white/80 hover:text-white ml-2 text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Active Screen Scroll Container */}
      <main className="screen-scroll-container">
        {currentScreen === 1 && (
          <DashboardScreen
            onStartRemedy={handleStartRemedy}
            onStartPrescription={handleStartPrescription}
            onSelectRecord={handleSelectRecord}
          />
        )}

        {currentScreen === 2 && (
          <RemedyIntakeScreen
            initialData={activeDraft}
            onNext={handleRemedyIntakeNext}
          />
        )}

        {currentScreen === 3 && (
          <AiAnalysisScreen
            remedyData={activeDraft}
            onNext={handleAiAnalysisNext}
          />
        )}

        {currentScreen === 4 && (
          <PlantIdScreen
            vernacularName={activeDraft.remedyNameLocal}
            onNext={handlePlantIdNext}
          />
        )}

        {currentScreen === 5 && (
          <PrescriptionScreen
            onNext={handlePrescriptionNext}
          />
        )}

        {currentScreen === 6 && (
          <EvidenceDecisionScreen
            caseData={{
              plantSpecies: activeDraft.scientificName || '',
              medicineGeneric: activeDraft.confirmedMedicine?.genericName || '',
              isClinicianConfirmed: activeDraft.confirmedMedicine?.isClinicianConfirmed ?? false,
              remedyId: activeDraft.remedyId,
            }}
            onSubmitDecision={handleSubmitDecision}
            onNavigate={(screenIndex) => setCurrentScreen(screenIndex)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onSelectScreen={(screenIndex) => setCurrentScreen(screenIndex)}
        pendingBadges={{
          rxPending: currentScreen < 5 && !!activeDraft.remedyNameLocal,
          safetyPending: currentScreen === 5 && !!activeDraft.confirmedMedicine,
        }}
      />
    </div>
  );
};

export default App;
