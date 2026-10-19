import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Pill, FileText, Check, Camera, Plus, Search, Sparkles } from 'lucide-react';
import { resolveMedicineFromText, DRUG_CATALOG } from '../services/pharmacopoeiaDatabase.ts';
import { extractMedicinesFromPrescriptionCanvas, OcrDetectedMedicine } from '../services/ocrService.ts';
import { AudioNarrator } from '../components/AudioNarrator.tsx';
import { t } from '../services/localizationService.ts';

interface PrescriptionScreenProps {
  onNext: (confirmedMedicine: {
    brandName: string;
    genericName: string;
    dose: string;
    frequency: string;
    isClinicianConfirmed: boolean;
  }) => void;
}

export const PrescriptionScreen: React.FC<PrescriptionScreenProps> = ({ onNext }) => {
  const [hasUploadedRx, setHasUploadedRx] = useState(false);
  const [rxImagePreview, setRxImagePreview] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [medicines, setMedicines] = useState<OcrDetectedMedicine[]>([]);
  const [confirmedMedicines, setConfirmedMedicines] = useState<Record<number, boolean>>({});

  // Search & Manual medicine entry
  const [searchFilter, setSearchFilter] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualBrand, setManualBrand] = useState('');
  const [manualGeneric, setManualGeneric] = useState('');
  const [manualDose, setManualDose] = useState('');
  const [manualFreq, setManualFreq] = useState('Once Daily (OD)');

  const handleBrandChange = (val: string) => {
    setManualBrand(val);
    const resolved = resolveMedicineFromText(val);
    if (resolved) {
      setManualGeneric(resolved.genericName);
      setManualDose(resolved.dose);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setRxImagePreview(previewUrl);
    setHasUploadedRx(true);
    setIsOcrProcessing(true);

    try {
      // 1. Create offscreen canvas for on-device OCR
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Run on-device OCR engine
        const ocrResults = await extractMedicinesFromPrescriptionCanvas(canvas);
        if (ocrResults.length > 0) {
          setMedicines(ocrResults);
          // Auto confirm first item
          setConfirmedMedicines({ 0: true });
        } else {
          setShowManualAdd(true);
        }
      }

      // Also try backend API if available
      try {
        const formData = new FormData();
        formData.append('prescription', file);
        const res = await fetch('/api/prescriptions/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.detectedMedicines && data.detectedMedicines.length > 0) {
            setMedicines(prev => prev.length > 0 ? prev : data.detectedMedicines);
          }
        }
      } catch (e) {
        // Safe offline fallback
      }
    } catch (err) {
      console.warn('[Prescription] OCR processing note:', err);
      setShowManualAdd(true);
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleAddManualMedicine = () => {
    if (!manualBrand && !manualGeneric) return;
    const newMed: OcrDetectedMedicine = {
      brandName: manualBrand || manualGeneric,
      genericName: manualGeneric || manualBrand,
      strength: manualDose || 'Standard Dose',
      dosageForm: 'Tablet',
      frequency: manualFreq,
      confidenceScore: 0.95,
      normalizedGeneric: manualGeneric || manualBrand
    };
    setMedicines((prev) => [...prev, newMed]);
    setConfirmedMedicines((prev) => ({ ...prev, [medicines.length]: true }));
    setManualBrand('');
    setManualGeneric('');
    setManualDose('');
    setShowManualAdd(false);
  };

  const handleToggleConfirm = (index: number) => {
    setConfirmedMedicines((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleProceed = () => {
    // Choose selected medicine or first available
    const confirmedIndex = Object.keys(confirmedMedicines).find((k) => confirmedMedicines[Number(k)]);
    const target = confirmedIndex !== undefined ? medicines[Number(confirmedIndex)] : medicines[0];

    if (!target) return;

    onNext({
      brandName: target.brandName,
      genericName: target.genericName,
      dose: target.strength || 'Standard',
      frequency: target.frequency || 'Once Daily (OD)',
      isClinicianConfirmed: true,
    });
  };

  // Filter catalog for autocomplete
  const catalogList = Object.values(DRUG_CATALOG);
  const filteredCatalog = searchFilter.trim() 
    ? catalogList.filter((d: any) => 
        d.genericName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        d.therapeuticClass.toLowerCase().includes(searchFilter.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="space-y-4 max-w-md mx-auto pb-24">
      {/* Title */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('prescription_title')}
          </h1>
          <AudioNarrator 
            textToSpeak={t('narrate_prescription')}
            label={t('listen')}
            className="p-1.5 shrink-0"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
          {t('prescription_subtitle')}
        </p>
      </div>

      {/* Prescription Upload Area */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-white rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 py-6 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-emerald-50/20 shadow-xs"
        >
          {rxImagePreview ? (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-2 shadow-sm">
                <FileText className="w-7 h-7 stroke-[2]" />
              </div>
              <p className="text-xs font-bold text-emerald-900">Prescription Slip Loaded</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {isOcrProcessing ? 'Extracting via on-device Dots.OCR...' : 'Tap to replace image'}
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Upload prescription image <span className="font-normal text-slate-500">or take photo</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Camera photo or clinic PDF slip</p>
            </>
          )}
        </div>
      </div>

      {/* Medicine Search & Fast Input */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Active Allopathic Medicines
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowManualAdd(!showManualAdd)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
          >
            <Plus className="w-3 h-3" />
            <span>Add Medicine</span>
          </button>
        </div>

        {/* Live Search Autocomplete (Zero hardcoded presets) */}
        <div className="relative">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search Indian brand or generic (e.g. Warfarin, Aspirin, Metformin)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Autocomplete Dropdown */}
        {filteredCatalog.length > 0 && (
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Select Indian Generic:
            </span>
            {filteredCatalog.map((item: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setMedicines(prev => [...prev, {
                    brandName: item.genericName,
                    genericName: item.genericName,
                    strength: item.defaultStrength || 'Standard',
                    dosageForm: item.dosageForm || 'Tablet',
                    confidenceScore: 1.0,
                    normalizedGeneric: item.genericName
                  }]);
                  setConfirmedMedicines(prev => ({ ...prev, [medicines.length]: true }));
                  setSearchFilter('');
                }}
                className="w-full text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{item.genericName}</span>
                  <span className="text-[10px] text-slate-500 ml-1.5">({item.therapeuticClass})</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  {item.defaultStrength || 'Standard'}
                </span>
              </button>
            ))}
          </div>
        )}


        {/* Manual Add Form Drawer */}
        {showManualAdd && (
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="text-xs font-bold text-slate-800">Add Allopathic Medicine</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Brand Name (e.g. Dolo)"
                value={manualBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              />
              <input
                type="text"
                placeholder="Generic Name"
                value={manualGeneric}
                onChange={(e) => setManualGeneric(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Dose (e.g. 500mg)"
                value={manualDose}
                onChange={(e) => setManualDose(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              />
              <select
                value={manualFreq}
                onChange={(e) => setManualFreq(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              >
                <option value="Once Daily (OD)">Once Daily (OD)</option>
                <option value="Twice Daily (BD)">Twice Daily (BD)</option>
                <option value="Thrice Daily (TDS)">Thrice Daily (TDS)</option>
                <option value="As Needed (SOS)">As Needed (SOS)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddManualMedicine}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            >
              {t('add_rx_medicine_btn')}
            </button>
          </div>
        )}

        {/* Extracted Medicines List */}
        {medicines.length === 0 ? (
          <div className="text-center py-6 text-slate-400 space-y-1">
            <Pill className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">{t('no_cases_recorded')}</p>
            <p className="text-[11px] text-slate-400">{t('step2_desc')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {medicines.map((med, idx) => {
              const isConfirmed = !!confirmedMedicines[idx];
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleConfirm(idx)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isConfirmed
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      isConfirmed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{med.brandName}</h4>
                      <p className="text-[10.5px] text-slate-500 font-medium">
                        Generic: <span className="text-emerald-800 font-semibold">{med.genericName}</span> ({med.strength || 'Standard'})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {med.frequency || 'OD'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {medicines.length > 0 && (
        <button
          onClick={handleProceed}
          className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <span>{t('run_clash_check')}</span>
        </button>
      )}
    </div>
  );
};
