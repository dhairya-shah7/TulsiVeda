import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Sparkles, Filter, Leaf, ShieldAlert, 
  ExternalLink, ChevronRight, Info, CheckCircle2, Bookmark,
  Building2, AlertTriangle, Pill, Volume2
} from 'lucide-react';
import { BOTANICAL_DATABASE, BotanicalSpecies, getLocalizedBotanicalName } from '../services/botanicalDatabase';
import { NATIONAL_CLINICAL_RECORDS, ClinicalConditionRecord, NationalClinicalKnowledgeEngine } from '../services/nationalClinicalKnowledge';
import { AudioNarrator } from '../components/AudioNarrator';
import { t, useCurrentLanguage } from '../services/localizationService';

interface KnowledgeBookScreenProps {
  onSelectPlantForIntake?: (plantName: string) => void;
}

export const KnowledgeBookScreen: React.FC<KnowledgeBookScreenProps> = ({
  onSelectPlantForIntake
}) => {
  const [activeCatalog, setActiveCatalog] = useState<'clinical_records' | 'botanical_plants'>('clinical_records');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'respiratory' | 'digestive' | 'pain' | 'metabolic'>('all');
  const [activeSpecies, setActiveSpecies] = useState<BotanicalSpecies | null>(BOTANICAL_DATABASE[0] || null);
  const [activeRecord, setActiveRecord] = useState<ClinicalConditionRecord | null>(NATIONAL_CLINICAL_RECORDS[0] || null);

  const lang = useCurrentLanguage();

  // Clinical records search
  const filteredClinicalRecords = useMemo(() => {
    return NationalClinicalKnowledgeEngine.searchBySymptomOrCondition(searchQuery, lang);
  }, [searchQuery, lang]);

  // Botanical plants search
  const filteredPlants = useMemo(() => {
    let list = BOTANICAL_DATABASE;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.scientificName.toLowerCase().includes(q) ||
        p.commonName.toLowerCase().includes(q) ||
        p.vernacularAliases.some(alias => alias.toLowerCase().includes(q)) ||
        p.activeConstituents.some(c => c.toLowerCase().includes(q)) ||
        p.traditionalUses.some(u => u.toLowerCase().includes(q))
      );
    }

    if (selectedFilter !== 'all') {
      const filterTerms: Record<string, string[]> = {
        respiratory: ['cough', 'cold', 'asthma', 'respiratory', 'bronchial', 'throat', 'fever'],
        digestive: ['digestive', 'colic', 'liver', 'flatulence', 'constipation', 'gut', 'acidity'],
        pain: ['pain', 'arthritis', 'joint', 'wound', 'bruises', 'swelling', 'inflammation'],
        metabolic: ['diabetes', 'sugar', 'blood pressure', 'hypertension', 'stress', 'sleep']
      };
      const terms = filterTerms[selectedFilter] || [];
      list = list.filter(p => 
        p.traditionalUses.some(use => terms.some(t => use.toLowerCase().includes(t)))
      );
    }

    return list;
  }, [searchQuery, selectedFilter]);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Title & Introduction */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl" />
        
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {t('knowledge_book_title')}
          </h1>
          <AudioNarrator 
            textToSpeak={t('narrate_knowledge')}
            label={t('listen')}
            className="bg-white/15 border-white/20 text-white shrink-0"
          />
        </div>
        <p className="text-xs text-emerald-100/90 mt-1 font-medium leading-relaxed">
          {t('offline_reference_desc')}
        </p>

        {/* Search Input */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Catalog Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/80">
        <button
          onClick={() => setActiveCatalog('clinical_records')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCatalog === 'clinical_records'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span>{t('govt_disease_guide')}</span>
        </button>

        <button
          onClick={() => setActiveCatalog('botanical_plants')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCatalog === 'botanical_plants'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-700" />
          <span>{t('medicinal_botanicals')}</span>
        </button>
      </div>

      {/* VIEW 1: OFFICIAL GOVERNMENT CLINICAL RECORDS (SYMPTOMS -> REMEDIES & MEDICINES) */}
      {activeCatalog === 'clinical_records' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Official Clinical Protocols ({filteredClinicalRecords.length} Conditions)</span>
            <span className="text-emerald-700 font-bold">100% Offline Capable</span>
          </div>

          {filteredClinicalRecords.map((item) => {
            const isSelected = activeRecord?.id === item.id;
            const title = item.conditionName;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all ${
                  isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' 
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                {/* Header Card */}
                <div
                  onClick={() => setActiveRecord(isSelected ? null : item)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {item.conditionName} • <span className="font-semibold text-emerald-800">{item.bodySystem}</span>
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.typicalSymptoms.slice(0, 2).map((sym, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <AudioNarrator 
                      textToSpeak={`${title}. Jan Aushadhi generic: ${item.officialGeneric.medicineName}. Classical AYUSH remedy: ${item.ayushClassicalFormulation.formulationName}. Kitchen remedy: ${item.verifiedHomeRemedy.kitchenItem}.`}
                      label=""
                      className="p-1.5"
                    />
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-emerald-600' : ''}`} />
                  </div>
                </div>

                {/* Expanded 3-Tier Clinical Dossier */}
                {isSelected && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/60 rounded-b-3xl">
                    {/* Tier 1: Jan Aushadhi Generic */}
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 uppercase tracking-wide text-[10.5px] flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-blue-700" />
                          {t('tier1_title')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                          {item.officialGeneric.pmbjpPriceINR.split('(')[0]}
                        </span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-xs mt-1">{item.officialGeneric.medicineName}</p>
                      <p className="text-slate-600 text-[11px]">{item.officialGeneric.standardDosageSchedule}</p>
                    </div>

                    {/* Tier 2: AYUSH Classical Formulation */}
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 uppercase tracking-wide text-[10.5px] flex items-center gap-1">
                          <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                          {t('tier2_title')}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                          {item.ayushClassicalFormulation.classicalReference.split(',')[0]}
                        </span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-xs mt-1">{item.ayushClassicalFormulation.formulationName}</p>
                      <p className="text-slate-600 text-[11px]">
                        <strong>{t('dose_and_medium')}:</strong> {item.ayushClassicalFormulation.ayushDosage} ({item.ayushClassicalFormulation.anupanaDietaryMedium})
                      </p>
                    </div>

                    {/* Tier 3: Verified Kitchen Home Remedy */}
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-amber-900 uppercase tracking-wide text-[10.5px] block">
                        {t('tier3_title')}
                      </span>
                      <p className="font-extrabold text-slate-900 text-xs mt-0.5">{item.verifiedHomeRemedy.kitchenItem}</p>
                      <p className="text-slate-600 text-[11px]"><strong>{t('preparation_label')}:</strong> {item.verifiedHomeRemedy.preparationMethod}</p>
                      <p className="text-red-700 font-semibold text-[10.5px]">⚠️ <strong>{t('limit_label')}:</strong> {item.verifiedHomeRemedy.contraindicationWarning}</p>
                    </div>

                    {/* Danger Protocol */}
                    <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-red-900 text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        {t('when_to_rush_hospital')}
                      </span>
                      <p className="text-red-800 text-[11px] leading-relaxed">
                        {item.escalationProtocol.dangerSigns.join(' • ')} (Max: {item.escalationProtocol.maxWaitHoursBeforeHospital}h)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: BOTANICAL HERBS & PHYTOCHEMICAL MONOGRAPHS */}
      {activeCatalog === 'botanical_plants' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Found {filteredPlants.length} Pharmacopeial Botanicals</span>
            <span className="text-[11px] text-emerald-700 font-bold">100% Deterministic AYUSH Data</span>
          </div>

          {filteredPlants.map((plant) => {
            const isSelected = activeSpecies?.scientificName === plant.scientificName;
            
            return (
              <div 
                key={plant.scientificName}
                className={`bg-white rounded-2xl border transition-all ${
                  isSelected 
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' 
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div 
                  onClick={() => setActiveSpecies(isSelected ? null : plant)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {getLocalizedBotanicalName(plant, lang)}
                      </h3>
                      <p className="text-xs font-serif italic text-slate-500 mt-0.5">
                        {plant.scientificName} ({plant.family})
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {plant.traditionalUses.slice(0, 2).map((use, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <AudioNarrator 
                      textToSpeak={`${getLocalizedBotanicalName(plant, lang)}. Scientific name ${plant.scientificName}. Active constituents: ${plant.activeConstituents.join(', ')}. Used traditionally for ${plant.traditionalUses.join(', ')}.`}
                      label=""
                      className="p-1.5"
                    />
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-emerald-600' : ''}`} />
                  </div>
                </div>

                {isSelected && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3.5 bg-slate-50/50 rounded-b-2xl">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-emerald-800 block uppercase tracking-wider mb-1">
                        Active Phyto-Chemical Constituents
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {plant.activeConstituents.map((c, i) => (
                          <span key={i} className="text-xs font-semibold text-emerald-950 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            ⚗️ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-900 block uppercase tracking-wider mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                        CYP450 & Receptor Modulation
                      </span>
                      <ul className="text-xs text-amber-950 space-y-1 font-medium list-disc list-inside">
                        {plant.metabolicEnzymes.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      <strong className="text-slate-800 font-semibold block mb-0.5">Pharmacological Note:</strong>
                      {plant.diagnosticReasoning}
                    </div>

                    {onSelectPlantForIntake && (
                      <button
                        onClick={() => onSelectPlantForIntake(plant.commonName)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        Check Clash & Safety for {getLocalizedBotanicalName(plant, lang).split('/')[0]}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
