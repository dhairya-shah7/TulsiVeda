import React, { useState } from 'react';
import { 
  Search, Pill, ShieldCheck, AlertCircle, Sparkles, 
  Leaf, Home as HomeIcon, CheckCircle2, ArrowRight, Info, RefreshCw 
} from 'lucide-react';
import { 
  resolveAlternative, 
  getAllConditions, 
  AlternativeBundle 
} from '../services/alternativeMedicineEngine';
import { AudioNarrator } from '../components/AudioNarrator';
import { t, useCurrentLanguage, LocalizationService } from '../services/localizationService';

interface AlternativeMedicineScreenProps {
  onCheckSafety?: (substanceName: string) => void;
}

export const AlternativeMedicineScreen: React.FC<AlternativeMedicineScreenProps> = ({
  onCheckSafety
}) => {
  const lang = useCurrentLanguage();
  const [searchTerm, setSearchTerm] = useState('Paracetamol');
  const [selectedResult, setSelectedResult] = useState<AlternativeBundle | null>(() => 
    resolveAlternative('Paracetamol', LocalizationService.getLanguage())
  );
  const [activeTier, setActiveTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');

  React.useEffect(() => {
    setSelectedResult(resolveAlternative(searchTerm, lang));
  }, [searchTerm, lang]);

  const availableConditions = getAllConditions();

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    const bundle = resolveAlternative(query, lang);
    setSelectedResult(bundle);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-800 to-emerald-950 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {t('alternatives_title')}
          </h1>
          <AudioNarrator 
            textToNarrate={t('narrate_alternatives')}
            label={t('listen')}
            className="bg-white/15 border-white/20 text-white shrink-0"
          />
        </div>
        <p className="text-xs text-teal-100/90 mt-1 font-medium leading-relaxed">
          {t('offline_reference_desc')}
        </p>

        {/* Search */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
      </div>


      {/* Results View */}
      {selectedResult ? (
        <div className="space-y-4">
          {/* Context Badge */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{t('identified_condition')}</span>
              <span className="text-sm font-extrabold text-slate-800">{selectedResult.condition}</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {t('safe_alternatives_ready')}
            </span>
          </div>

          {/* Tier Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'tier1', label: '1', sub: 'Jan Aushadhi', icon: Pill },
              { id: 'tier2', label: '2', sub: 'AYUSH', icon: Leaf },
              { id: 'tier3', label: '3', sub: 'Kitchen', icon: HomeIcon }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTier === tab.id;
              const titleMap: Record<string, string> = {
                tier1: t('tier1_title').split('•')[0].trim(),
                tier2: t('tier2_title').split('•')[0].trim(),
                tier3: t('tier3_title').split('•')[0].trim()
              };
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTier(tab.id as any)}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    isActive
                      ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold border-2 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold leading-tight">{titleMap[tab.id] || tab.sub}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{tab.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Active Tier Detailed Card */}
          {activeTier === 'tier1' && (
            <div className="bg-white rounded-3xl border border-blue-200 p-5 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                    {t('tier1_title')}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {selectedResult.tier1JanAushadhi.genericName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {t('standard_strength')}: {selectedResult.tier1JanAushadhi.strength}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 block">
                    {selectedResult.tier1JanAushadhi.estimatedGovtPrice}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{t('govt_subsidized')}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-950 space-y-1">
                <p><strong>{t('mechanism_label')}:</strong> {selectedResult.tier1JanAushadhi.mechanism}</p>
                <p><strong>Bio-Equivalence:</strong> 100% CDSCO / PMBJP standard.</p>
              </div>

              {onCheckSafety && (
                <button
                  onClick={() => onCheckSafety(selectedResult.tier1JanAushadhi.genericName)}
                  className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {t('run_clash_check')}
                </button>
              )}
            </div>
          )}

          {activeTier === 'tier2' && (
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    {t('tier2_title')}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {selectedResult.tier2AyushHerb.botanicalName}
                  </h3>
                  <p className="text-xs font-serif italic text-slate-500">
                    {selectedResult.tier2AyushHerb.scientificName}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  AYUSH Monograph
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
                <p><strong>{t('active_chemical_label')}:</strong> {selectedResult.tier2AyushHerb.activeConstituent}</p>
                <p><strong>{t('preparation_label')}:</strong> {selectedResult.tier2AyushHerb.formulation}</p>
                <p><strong>{t('standard_strength')}:</strong> {selectedResult.tier2AyushHerb.dosage}</p>
              </div>

              {onCheckSafety && (
                <button
                  onClick={() => onCheckSafety(selectedResult.tier2AyushHerb.botanicalName)}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {t('run_clash_check')}
                </button>
              )}
            </div>
          )}

          {activeTier === 'tier3' && (
            <div className="bg-white rounded-3xl border border-amber-200 p-5 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    {t('tier3_title')}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {selectedResult.tier3KitchenRemedy.kitchenItem}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    100% Kitchen First-Aid
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Safe Home Relief
                </span>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100 text-xs text-amber-950 space-y-1.5">
                <p><strong>{t('preparation_label')}:</strong> {selectedResult.tier3KitchenRemedy.preparationMethod}</p>
                <p><strong>{t('dosage_frequency_label')}:</strong> {selectedResult.tier3KitchenRemedy.frequency}</p>
                <p className="text-red-700 font-semibold">⚠️ <strong>{t('limit_label')}:</strong> {selectedResult.tier3KitchenRemedy.contraindications}</p>
              </div>

              {onCheckSafety && (
                <button
                  onClick={() => onCheckSafety(selectedResult.tier3KitchenRemedy.kitchenItem)}
                  className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {t('run_clash_check')}
                </button>
              )}
            </div>
          )}

          {/* Clinical Escalation Criteria */}
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{t('when_to_rush_hospital')}</span>
            </div>
            <p className="pl-5.5 leading-relaxed font-medium">
              {selectedResult.escalationCriteria}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
          <Pill className="w-10 h-10 mx-auto text-slate-300" />
          <h4 className="text-sm font-bold text-slate-700">No Direct Match Found</h4>
          <p className="text-xs text-slate-500">
            Try searching for common conditions like "Fever", "Cough", "Diabetes", "Acidity", or "Hypertension".
          </p>
        </div>
      )}
    </div>
  );
};
