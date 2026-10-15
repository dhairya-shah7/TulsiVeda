import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Pill, FileText, Check, Camera, Plus, Sparkles } from 'lucide-react';
import { resolveMedicineFromText, INDIAN_BRANDS, DRUG_CATALOG } from '../services/pharmacopoeiaDatabase.ts';

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

  const [medicines, setMedicines] = useState<any[]>([]);
  const [confirmedMedicines, setConfirmedMedicines] = useState<Record<string, boolean>>({});

  // Manual medicine entry form if prescription image is not available
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

  const handleQuickAdd = (brand: string) => {
    const resolved = resolveMedicineFromText(brand);
    if (resolved) {
      const newMed = {
        brandName: resolved.brandName,
        genericName: resolved.genericName,
        type: resolved.type,
        dose: resolved.dose,
        frequency: 'Once Daily (OD)',
      };
      setMedicines((prev) => [...prev, newMed]);
      setConfirmedMedicines((prev) => ({ ...prev, [medicines.length]: true }));
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
      const formData = new FormData();
      formData.append('prescription', file);

      const res = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.detectedMedicines && data.detectedMedicines.length > 0) {
          setMedicines(data.detectedMedicines);
        } else {
          // If OCR couldn't detect text in this image, prompt manual entry
          setShowManualAdd(true);
        }
      } else {
        setShowManualAdd(true);
      }
    } catch (err) {
      console.warn('[Prescription] OCR API warning, enabling direct medicine entry:', err);
      setShowManualAdd(true);
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleAddManualMedicine = () => {
    if (!manualBrand && !manualGeneric) return;
    const newMed = {
      brandName: manualBrand || manualGeneric,
      genericName: manualGeneric || manualBrand,
      type: 'Tablet',
      dose: manualDose || 'Standard',
      frequency: manualFreq,
    };
    setMedicines((prev) => [...prev, newMed]);
    setManualBrand('');
    setManualGeneric('');
    setManualDose('');
    setShowManualAdd(false);
  };

  const handleConfirmMedicine = (index: number) => {
    setConfirmedMedicines((prev) => ({ ...prev, [index]: true }));
  };

  const isAnyConfirmed = Object.values(confirmedMedicines).some(Boolean);

  const handleNext = () => {
    if (medicines.length === 0) return;
    const selectedMed = medicines[0];

    onNext({
      brandName: selectedMed.brandName || selectedMed.genericName || 'Prescription Medicine',
      genericName: selectedMed.genericName || selectedMed.brandName || 'Unspecified Medicine',
      dose: selectedMed.dose || 'Standard',
      frequency: selectedMed.frequency || 'Once Daily (OD)',
      isClinicianConfirmed: isAnyConfirmed,
    });
  };

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">
          Prescription & Safety Review
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Upload prescription to check allopathic medicines and potential interactions.
        </p>
      </div>

      {/* Upload Prescription Dropzone - Raw Input COMPLETELY Hidden */}
      <div>
        <label className="form-label text-xs">Prescription Image or Document</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="surface-card border-2 border-dashed border-emerald-300 hover:border-emerald-500 py-6 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group bg-emerald-50/20"
        >
          {rxImagePreview ? (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-2 shadow-sm">
                <FileText className="w-7 h-7 stroke-[2]" />
              </div>
              <p className="text-xs font-bold text-emerald-900">Prescription Document Uploaded</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {isOcrProcessing ? 'Running Dots.OCR & Tesseract extraction...' : 'Tap to replace image'}
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="text-xs font-semibold text-gray-800">
                Upload prescription image <span className="font-normal text-gray-500">or take camera photo</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Clear photo of doctor prescription</p>
            </>
          )}
        </div>
      </div>

      {/* Detected Medicines Table */}
      <div className="surface-card space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Pill className="w-4 h-4 stroke-[2]" />
            </div>
            <h2 className="font-heading font-bold text-sm text-gray-900">
              Detected Medicines
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowManualAdd(!showManualAdd)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Medicine</span>
          </button>
        </div>

        {/* Quick Prescription Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-gray-500 font-medium self-center mr-1">Quick Select:</span>
          {['Ecosprin 75', 'Glycomet 500', 'Warf 5', 'Alprax 0.25', 'Dolo 650', 'Lanoxin'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleQuickAdd(preset)}
              className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 transition-colors"
            >
              + {preset}
            </button>
          ))}
        </div>

        {/* Manual Add Medicine Drawer */}
        {showManualAdd && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 animate-fadeIn">
            <div className="text-xs font-bold text-gray-800">Add Allopathic Medicine (Auto-Normalizes)</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Brand Name (e.g. Ecosprin, Pan-40)"
                value={manualBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="form-input text-xs"
              />
              <input
                type="text"
                placeholder="Generic Name (e.g. Aspirin, Pantoprazole)"
                value={manualGeneric}
                onChange={(e) => setManualGeneric(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Dose (e.g. 75 mg, 500 mg)"
                value={manualDose}
                onChange={(e) => setManualDose(e.target.value)}
                className="form-input text-xs"
              />
              <input
                type="text"
                placeholder="Frequency (e.g. Once Daily)"
                value={manualFreq}
                onChange={(e) => setManualFreq(e.target.value)}
                className="form-input text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowManualAdd(false)}
                className="px-3 py-1 text-xs text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddManualMedicine}
                className="btn-primary px-4 py-1 text-xs rounded-lg"
              >
                Add to List
              </button>
            </div>
          </div>
        )}

        {medicines.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">
            No medicines detected yet. Upload prescription above or tap "Add Medicine".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10.5px]">
                  <th className="pb-2 font-semibold">Brand</th>
                  <th className="pb-2 font-semibold">Generic</th>
                  <th className="pb-2 font-semibold">Dose</th>
                  <th className="pb-2 font-semibold">Frequency</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicines.map((med, idx) => {
                  const isConfirmed = !!confirmedMedicines[idx];

                  return (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 font-bold text-gray-900">{med.brandName}</td>
                      <td className="py-2.5 text-emerald-800 font-semibold">{med.genericName}</td>
                      <td className="py-2.5 text-gray-700 font-mono text-[11px]">{med.dose || '—'}</td>
                      <td className="py-2.5 text-gray-600 text-[11px]">{med.frequency || 'Once Daily'}</td>
                      <td className="py-2.5 text-right">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[2.5]" /> Confirmed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleConfirmMedicine(idx)}
                            className="text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg shadow-sm transition-transform active:scale-95"
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Safety Review Section */}
      <div className="surface-card space-y-2 shadow-sm">
        <h2 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
          Safety Review Pre-Check
        </h2>

        {!isAnyConfirmed ? (
          <div className="py-3 text-center text-xs text-gray-400">
            {medicines.length > 0 
              ? 'Please tap "Confirm" on the detected medicine above to unlock safety analysis.' 
              : 'Upload prescription or add medicine to view safety review.'}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 shadow-sm animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Clinician Confirmation Unlocked
              </h4>
              <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                Active ingredient verified. The deterministic Knowledge Graph is ready to evaluate multi-hop pharmacological pathways.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action: Next */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleNext}
          disabled={medicines.length === 0}
          className="btn-primary px-8 text-sm py-2.5 rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
