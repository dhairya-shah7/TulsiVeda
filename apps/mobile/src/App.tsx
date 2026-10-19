import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { BottomNav, ScreenId } from './components/BottomNav.tsx';
import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { RemedyIntakeScreen } from './screens/RemedyIntakeScreen.tsx';
import { AiAnalysisScreen } from './screens/AiAnalysisScreen.tsx';
import { PlantIdScreen } from './screens/PlantIdScreen.tsx';
import { PrescriptionScreen } from './screens/PrescriptionScreen.tsx';
import { EvidenceDecisionScreen } from './screens/EvidenceDecisionScreen.tsx';
import { KnowledgeBookScreen } from './screens/KnowledgeBookScreen.tsx';
import { AlternativeMedicineScreen } from './screens/AlternativeMedicineScreen.tsx';
import { LanguageOnboardingScreen } from './screens/LanguageOnboardingScreen.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { LanguageSelectorModal } from './components/LanguageSelectorModal.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { IvrHotlineModal } from './components/IvrHotlineModal.tsx';
import { StorageService, StoredRecord } from './services/storageService.ts';
import { SafetyEngine } from './services/safetyEngine.ts';
import { BioKineticEngine } from './services/bioKineticEngine.ts';
import { useCurrentLanguage, setStoredLanguage } from './services/localizationService.ts';

export const App: React.FC = () => {
  const currentLang = useCurrentLanguage();

  // Check if first-time onboarding completed
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('tulsiveda_onboarding_done') === 'true';
  });

  // Active Screen: 'home' | 'knowledge' | 'intake' | 'alternatives' | 'decision' | 'admin' | 'plant_id' | 'ai_analysis' | 'prescription'
  const [currentScreen, setCurrentScreen] = useState<string>('home');

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isIvrOpen, setIsIvrOpen] = useState(false);

  // User state
  const [userRole, setUserRole] = useState<'citizen' | 'asha' | 'doctor'>(() => {
    const saved = localStorage.getItem('tulsiveda_user_role');
    if (saved === 'asha' || saved === 'doctor') return saved;
    return 'citizen';
  });
  const [envMode, setEnvMode] = useState<'village' | 'city'>(() => {
    return (localStorage.getItem('tulsiveda_env_mode') as any) || 'village';
  });

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

  // If first time, display native language selection onboarding
  if (!hasCompletedOnboarding) {
    return (
      <LanguageOnboardingScreen 
        onComplete={() => setHasCompletedOnboarding(true)} 
      />
    );
  }

  // Navigation handlers
  const handleStartRemedy = () => {
    setActiveDraft(prev => ({
      ...prev,
      remedyId: 'rem_' + Date.now(),
      remedyNameLocal: '',
      usedForCondition: '',
      preparedBy: userRole === 'asha' ? 'ASHA Field Worker' : 'Citizen / Patient',
      placeRegion: 'India',
      scientificName: '',
    }));
    setCurrentScreen('intake');
  };

  const handleStartPrescription = () => {
    setCurrentScreen('prescription');
  };

  const handleRemedyIntakeNext = async (data: any) => {
    const remedyId = activeDraft.remedyId || 'rem_' + Date.now();
    const updatedDraft = { ...activeDraft, ...data, remedyId };
    setActiveDraft(updatedDraft);

    StorageService.saveRecord({
      id: remedyId,
      remedy_name_local: data.remedyNameLocal || 'Botanical Remedy',
      used_for_condition: data.usedForCondition || 'General Health Condition',
      prepared_by: data.preparedBy || 'Field Intake',
      place_region: data.placeRegion || 'India',
      language: data.language || 'Hindi',
      status: 'draft',
      created_at: new Date().toISOString(),
      transcript: data.transcript,
    });

    // Auto navigate to Plant Verification Screen
    setCurrentScreen('plant_id');
  };

  const handlePlantIdNext = (plantData: { scientificName: string; commonName: string; confidence: number; isConfirmed: boolean }) => {
    setActiveDraft(prev => ({
      ...prev,
      scientificName: plantData.scientificName,
      commonName: plantData.commonName,
    }));
    // Next step: Check if user already has medicine; if not, go to Prescription intake or Decision
    if (activeDraft.confirmedMedicine) {
      setCurrentScreen('decision');
    } else {
      setCurrentScreen('prescription');
    }
  };

  const handlePrescriptionNext = (confirmedMed: any) => {
    setActiveDraft(prev => ({
      ...prev,
      confirmedMedicine: confirmedMed,
    }));
    // Jump straight to Bio-Kinetic safety decision
    setCurrentScreen('decision');
  };

  const handleSubmitDecision = async (decisionData: { decision: string; notes: string }) => {
    const remedyId = activeDraft.remedyId || 'rem_' + Date.now();

    StorageService.saveRecord({
      id: remedyId,
      remedy_name_local: activeDraft.remedyNameLocal || 'Botanical Intake',
      used_for_condition: activeDraft.usedForCondition || 'Health Condition',
      prepared_by: activeDraft.preparedBy || 'Citizen',
      place_region: activeDraft.placeRegion || 'India',
      language: activeDraft.language || 'Hindi',
      status: 'completed',
      decision: decisionData.decision,
      decision_notes: decisionData.notes || 'Clinician reviewed and recorded.',
      interaction_type: 'Bio-Kinetic Causal Evaluation',
      evidence_level: 'Mechanistic',
      confirmed_species: activeDraft.scientificName || '',
      confirmed_medicine: activeDraft.confirmedMedicine 
        ? `${activeDraft.confirmedMedicine.brandName} (${activeDraft.confirmedMedicine.genericName})`
        : '',
    });

    setNotificationMsg('Case logged to National Audit Ledger & Safety Records.');
    setTimeout(() => setNotificationMsg(null), 3500);

    // Return to dashboard
    setCurrentScreen('home');
  };

  const handleSubmitReviewRequest = () => {
    if (!activeDraft.remedyNameLocal && !activeDraft.scientificName) return;

    const remedyId = activeDraft.remedyId || 'req_' + Date.now();
    StorageService.saveRecord({
      id: remedyId,
      patient_name: 'You (Citizen Self-Intake)',
      remedy_name_local: activeDraft.remedyNameLocal || 'Botanical Remedy',
      confirmed_species: activeDraft.scientificName || activeDraft.remedyNameLocal || '',
      confirmed_medicine: activeDraft.confirmedMedicine 
        ? `${activeDraft.confirmedMedicine.brandName || ''} (${activeDraft.confirmedMedicine.genericName || ''})`
        : 'Awaiting Prescription',
      used_for_condition: activeDraft.usedForCondition || 'General Wellness',
      prepared_by: 'Citizen Self-Intake',
      place_region: envMode === 'village' ? 'Local Village' : 'City Ward',
      language: currentLang,
      status: 'pending_review',
      created_at: new Date().toISOString(),
      submitted_by_role: 'citizen',
    });

    setActiveDraft({});
    setNotificationMsg('✅ Case sent to local ASHA Worker & Doctor for review!');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleSelectRecord = (record: StoredRecord) => {
    setActiveDraft({
      remedyId: record.id,
      remedyNameLocal: record.remedy_name_local,
      usedForCondition: record.used_for_condition,
      preparedBy: record.prepared_by,
      placeRegion: record.place_region,
      language: record.language,
      scientificName: record.confirmed_species || record.remedy_name_local,
      transcript: record.transcript,
      confirmedMedicine: record.confirmed_medicine ? { 
        genericName: record.confirmed_medicine.replace(/\(.*?\)/g, '').trim(),
        brandName: record.confirmed_medicine,
        isClinicianConfirmed: true
      } : undefined
    });
    setCurrentScreen('decision');
  };

  return (
    <div key={currentLang} className="min-h-screen bg-slate-100 flex flex-col justify-between max-w-md mx-auto shadow-2xl relative font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onBack={() => setCurrentScreen('home')}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenIvr={() => setIsIvrOpen(true)}
      />

      {/* Floating Alert Banner */}
      {notificationMsg && (
        <div className="mx-4 mt-2 p-3 bg-emerald-800 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between z-30 animate-in fade-in duration-200">
          <span>{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="text-white/80 hover:text-white ml-2 text-sm font-black">
            ✕
          </button>
        </div>
      )}

      {/* Active Screen View */}
      <main className="flex-1 overflow-y-auto">
        {currentScreen === 'home' && (
          <DashboardScreen
            onStartRemedy={handleStartRemedy}
            onStartPrescription={handleStartPrescription}
            onOpenKnowledge={() => setCurrentScreen('knowledge')}
            onOpenAlternatives={() => setCurrentScreen('alternatives')}
            onOpenIvr={() => setIsIvrOpen(true)}
            onSelectRecord={handleSelectRecord}
            currentMode={envMode}
            currentRole={userRole}
            activeDraft={activeDraft}
            onSubmitReviewRequest={handleSubmitReviewRequest}
          />
        )}

        {currentScreen === 'knowledge' && (
          <KnowledgeBookScreen
            onSelectPlantForIntake={(plantName) => {
              setActiveDraft(prev => ({
                ...prev,
                remedyNameLocal: plantName,
                scientificName: plantName.split('/')[0].trim()
              }));
              setCurrentScreen('prescription');
            }}
          />
        )}

        {currentScreen === 'intake' && (
          <RemedyIntakeScreen
            initialData={activeDraft}
            onNext={handleRemedyIntakeNext}
          />
        )}

        {currentScreen === 'plant_id' && (
          <PlantIdScreen
            vernacularName={activeDraft.remedyNameLocal}
            onNext={handlePlantIdNext}
          />
        )}

        {currentScreen === 'prescription' && (
          <PrescriptionScreen
            onNext={handlePrescriptionNext}
          />
        )}

        {currentScreen === 'alternatives' && (
          <AlternativeMedicineScreen
            onCheckSafety={(substance) => {
              setActiveDraft(prev => ({
                ...prev,
                remedyNameLocal: substance,
                scientificName: substance
              }));
              setCurrentScreen('prescription');
            }}
          />
        )}

        {currentScreen === 'decision' && (
          <EvidenceDecisionScreen
            caseData={{
              plantSpecies: activeDraft.scientificName || activeDraft.remedyNameLocal || '',
              medicineGeneric: activeDraft.confirmedMedicine?.genericName || '',
              isClinicianConfirmed: activeDraft.confirmedMedicine?.isClinicianConfirmed ?? true,
              remedyId: activeDraft.remedyId,
            }}
            onSubmitDecision={handleSubmitDecision}
            onNavigate={(screenId) => setCurrentScreen(screenId as string)}
            userRole={userRole}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen as ScreenId}
        onSelectScreen={(screenId) => setCurrentScreen(screenId)}
        pendingBadges={{
          rxPending: !!activeDraft.remedyNameLocal && !activeDraft.confirmedMedicine,
          safetyPending: !!activeDraft.remedyNameLocal && !!activeDraft.confirmedMedicine,
        }}
        userRole={userRole}
      />

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentRole={userRole}
        onRoleChange={setUserRole}
        currentMode={envMode}
        onModeChange={setEnvMode}
        onLanguageChange={(newLang) => setStoredLanguage(newLang)}
      />

      <LanguageSelectorModal
        isOpen={isLanguagePickerOpen}
        onClose={() => setIsLanguagePickerOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      <IvrHotlineModal
        isOpen={isIvrOpen}
        onClose={() => setIsIvrOpen(false)}
      />
    </div>
  );
};

export default App;
