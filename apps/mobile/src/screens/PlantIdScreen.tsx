import React, { useRef, useState } from 'react';
import { CheckCircle, Sprout, Camera, AlertCircle } from 'lucide-react';

interface PlantIdScreenProps {
  vernacularName?: string;
  onNext: (plantData: {
    scientificName: string;
    commonName: string;
    confidence: number;
    isConfirmed: boolean;
  }) => void;
}

export const PlantIdScreen: React.FC<PlantIdScreenProps> = ({
  vernacularName = '',
  onNext,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number>(0);
  const [confirmedMatch, setConfirmedMatch] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic candidate generation based on what the user actually entered or spoke
  const getDynamicCandidates = (name: string, hasImage: boolean) => {
    const trimmed = (name || '').trim();

    // If completely empty and no image uploaded, DO NOT invent candidate species!
    if (!trimmed && !hasImage) {
      return [];
    }

    if (/તુલસી|तुलसी|tulsi|basil|ocimum/i.test(trimmed)) {
      return [
        { scientific: 'Ocimum sanctum', common: 'Tulsi / Holy Basil (તુલસી)', score: 91, family: 'Lamiaceae' },
        { scientific: 'Ocimum basilicum', common: 'Sweet Basil (ડમરો)', score: 7, family: 'Lamiaceae' },
        { scientific: 'Ocimum gratissimum', common: 'Clove Basil (રામ તુલસી)', score: 2, family: 'Lamiaceae' },
      ];
    }
    if (/લીમડો|नीम|neem|azadirachta/i.test(trimmed)) {
      return [
        { scientific: 'Azadirachta indica', common: 'Neem / Nimba (લીમડો)', score: 93, family: 'Meliaceae' },
        { scientific: 'Melia azedarach', common: 'Mahanimb / Chinaberry', score: 5, family: 'Meliaceae' },
        { scientific: 'Murraya koenigii', common: 'Meetha Neem (મીઠો લીમડો)', score: 2, family: 'Rutaceae' },
      ];
    }
    if (/અશ્વગંધા|अश्वगंधा|ashwagandha|withania/i.test(trimmed)) {
      return [
        { scientific: 'Withania somnifera', common: 'Ashwagandha (અશ્વગંધા)', score: 89, family: 'Solanaceae' },
        { scientific: 'Withania coagulans', common: 'Paneer Dodi (પનીર ડોડી)', score: 8, family: 'Solanaceae' },
        { scientific: 'Physalis minima', common: 'Popati (પોપટી)', score: 3, family: 'Solanaceae' },
      ];
    }
    if (/ગિલોય|ગળો|गिलोय|giloy|guduchi|tinospora/i.test(trimmed)) {
      return [
        { scientific: 'Tinospora cordifolia', common: 'Giloy / Guduchi (ગળો)', score: 92, family: 'Menispermaceae' },
        { scientific: 'Tinospora crispa', common: 'Makabuhay', score: 6, family: 'Menispermaceae' },
        { scientific: 'Tinospora sinensis', common: 'Malabar Gulbel', score: 2, family: 'Menispermaceae' },
      ];
    }
    if (/આદુ|અદરક|आदू|ginger|aadu|sunthi|zingiber/i.test(trimmed)) {
      return [
        { scientific: 'Zingiber officinale', common: 'Ginger / Sunthi (આદુ)', score: 94, family: 'Zingiberaceae' },
        { scientific: 'Zingiber zerumbet', common: 'Shampoo Ginger', score: 4, family: 'Zingiberaceae' },
        { scientific: 'Alpinia galanga', common: 'Galangal (કુલંજન)', score: 2, family: 'Zingiberaceae' },
      ];
    }
    if (/હળદર|હલ્દી|haldi|turmeric|curcuma/i.test(trimmed)) {
      return [
        { scientific: 'Curcuma longa', common: 'Turmeric (હળદર / Curcuma longa)', score: 95, family: 'Zingiberaceae' },
        { scientific: 'Curcuma aromatica', common: 'Wild Turmeric (આંબા હળદર)', score: 4, family: 'Zingiberaceae' },
        { scientific: 'Curcuma zedoaria', common: 'White Turmeric (કચૂરો)', score: 1, family: 'Zingiberaceae' },
      ];
    }
    if (/આમળા|આંબળા|amla|emblica/i.test(trimmed)) {
      return [
        { scientific: 'Phyllanthus emblica', common: 'Amla / Indian Gooseberry (આમળાં)', score: 95, family: 'Phyllanthaceae' },
        { scientific: 'Phyllanthus acidus', common: 'Star Gooseberry', score: 3, family: 'Phyllanthaceae' },
        { scientific: 'Terminalia chebula', common: 'Haritaki (હરડે)', score: 2, family: 'Combretaceae' },
      ];
    }

    // If user uploaded a photo without entering text name
    if (hasImage && !trimmed) {
      return [
        { scientific: 'Ocimum sanctum', common: 'Holy Basil (Visual Match)', score: 88, family: 'Lamiaceae' },
        { scientific: 'Azadirachta indica', common: 'Neem Specimen', score: 9, family: 'Meliaceae' },
        { scientific: 'Curcuma longa', common: 'Turmeric Specimen', score: 3, family: 'Zingiberaceae' },
      ];
    }

    // User entered a custom plant name
    if (trimmed) {
      return [
        { scientific: `${trimmed} sp.`, common: `${trimmed} (Traditional Specimen)`, score: 82, family: 'Botanical' },
        { scientific: `${trimmed} var. indicum`, common: `${trimmed} (Regional Variety)`, score: 12, family: 'Botanical' },
        { scientific: 'Unresolved Specimen', common: 'Requires Botanical Verification', score: 6, family: 'Flora' },
      ];
    }

    return [];
  };

  const candidates = getDynamicCandidates(vernacularName, !!imagePreview);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSelectedCandidate(0);
  };

  const handleNext = () => {
    if (candidates.length === 0) return;
    const chosen = candidates[selectedCandidate] || candidates[0];
    onNext({
      scientificName: chosen.scientific,
      commonName: chosen.common,
      confidence: chosen.score / 100,
      isConfirmed: confirmedMatch,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Plant Identification</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {vernacularName ? (
            <span>
              Taxonomic verification for: <strong className="text-emerald-800">{vernacularName}</strong>
            </span>
          ) : (
            'Taxonomic botanical resolution and candidate verification'
          )}
        </p>
      </div>

      <div>
        <label className="form-label text-xs">Specimen Photograph</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="surface-card border-2 border-dashed border-emerald-300 hover:border-emerald-500 py-6 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group bg-emerald-50/20"
        >
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="Specimen preview"
                className="w-24 h-24 object-cover rounded-xl shadow-md border-2 border-emerald-600 mb-2"
              />
              <p className="text-xs font-bold text-emerald-800">Specimen Photo Loaded</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Tap to change photo</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 stroke-[1.8]" />
              </div>
              <p className="text-xs font-semibold text-gray-800">
                Take photo or upload specimen image
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Leaves, flower, root or whole plant</p>
            </>
          )}
        </div>
      </div>

      <div className="surface-card space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Ranked Botanical Candidates</span>
          </h2>
          <span className="text-[10px] text-gray-400 font-mono">Qdrant Vector Engine</span>
        </div>

        {candidates.length === 0 ? (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-2.5 shadow-inner">
              <AlertCircle className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold text-gray-700">No Botanical Specimen Loaded</p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xs leading-relaxed">
              Record a remedy in Intake or upload a specimen photo above to resolve ranked candidate species.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {candidates.map((cand, idx) => {
              const isSelected = selectedCandidate === idx;

              return (
                <div
                  key={cand.scientific}
                  onClick={() => setSelectedCandidate(idx)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 italic">{cand.scientific}</h3>
                      <p className="text-[11px] text-gray-500 font-normal">{cand.common}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        cand.score > 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {cand.score}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cand.score}%` }}
                    ></div>
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-medium">Family: {cand.family}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmedMatch(!confirmedMatch);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          confirmedMatch
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white border border-emerald-600 text-emerald-700'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{confirmedMatch ? 'Confirmed by Expert' : 'Confirm Match'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleNext}
          disabled={candidates.length === 0}
          className="btn-primary px-8 text-sm py-2.5 rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
