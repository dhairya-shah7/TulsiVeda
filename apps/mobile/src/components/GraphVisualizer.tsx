import React from 'react';
import { Leaf, FlaskConical, Pill, AlertTriangle, CheckCircle } from 'lucide-react';

interface GraphVisualizerProps {
  plantName?: string;
  activeCompound?: string;
  medicineName?: string;
  interactionName?: string;
  hasInteraction?: boolean;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  plantName = 'Botanical Specimen',
  activeCompound = 'Phytochemicals',
  medicineName = 'Allopathic Medicine',
  interactionName = 'Pathway Analysis',
  hasInteraction = false,
}) => {
  const displayPlant = plantName || 'Plant';
  const displayCompound = activeCompound || 'Constituent';
  const displayMedicine = medicineName || 'Medicine';

  return (
    <div className="surface-card bg-slate-50/50 border border-slate-200 py-6 px-4">
      <div className="flex flex-col items-center justify-center">
        {/* Knowledge Graph Chain Diagram */}
        <div className="w-full max-w-sm flex items-center justify-between relative py-4">
          {/* Node 1: Plant */}
          <div className="flex flex-col items-center z-10">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center text-emerald-700 shadow-sm transition-transform hover:scale-105">
              <Leaf className="w-7 h-7 stroke-[1.8]" />
            </div>
            <span className="mt-2 text-xs font-semibold text-gray-800 text-center max-w-[80px] leading-tight">
              {displayPlant.split(' ')[0] || 'Plant'}
            </span>
            <span className="text-[10px] text-gray-500">Plant</span>
          </div>

          {/* Arrow 1 */}
          <div className="flex-1 flex items-center justify-center px-1">
            <div className="w-full h-0.5 bg-gray-300 relative">
              <div className="absolute right-0 -top-1 border-solid border-l-gray-400 border-l-[6px] border-y-transparent border-y-[4px] border-r-0"></div>
            </div>
          </div>

          {/* Node 2: Active Compound */}
          <div className="flex flex-col items-center z-10">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center text-emerald-700 shadow-sm transition-transform hover:scale-105">
              <FlaskConical className="w-7 h-7 stroke-[1.8]" />
            </div>
            <span className="mt-2 text-xs font-semibold text-gray-800 text-center max-w-[85px] leading-tight truncate">
              {displayCompound}
            </span>
            <span className="text-[10px] text-gray-500">Active Compound</span>
          </div>

          {/* Arrow 2 */}
          <div className="flex-1 flex items-center justify-center px-1">
            <div className="w-full h-0.5 bg-gray-300 relative">
              <div className="absolute right-0 -top-1 border-solid border-l-gray-400 border-l-[6px] border-y-transparent border-y-[4px] border-r-0"></div>
            </div>
          </div>

          {/* Node 3: Medicine */}
          <div className="flex flex-col items-center z-10">
            <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-500 flex items-center justify-center text-slate-700 shadow-sm transition-transform hover:scale-105">
              <Pill className="w-7 h-7 stroke-[1.8]" />
            </div>
            <span className="mt-2 text-xs font-semibold text-gray-800 text-center max-w-[80px] leading-tight truncate">
              {displayMedicine.split(' ')[0] || 'Medicine'}
            </span>
            <span className="text-[10px] text-gray-500">Medicine</span>
          </div>
        </div>

        {/* Downward Connector to Potential Interaction */}
        <div className="flex flex-col items-center mt-1">
          <div className={`w-0.5 h-6 relative ${hasInteraction ? 'bg-red-300' : 'bg-gray-300'}`}>
            <div className={`absolute -bottom-1 -left-1 border-solid border-x-transparent border-x-[4px] border-b-0 ${
              hasInteraction ? 'border-t-red-400 border-t-[6px]' : 'border-t-gray-400 border-t-[6px]'
            }`}></div>
          </div>

          {/* Bottom Node: Potential Interaction */}
          <div className="mt-1 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
              hasInteraction 
                ? 'bg-red-50 border-2 border-red-500 text-red-600' 
                : 'bg-emerald-50 border-2 border-emerald-500 text-emerald-600'
            }`}>
              {hasInteraction ? (
                <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
              ) : (
                <CheckCircle className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>
            <span className={`mt-2 text-xs font-bold text-center ${hasInteraction ? 'text-red-700' : 'text-emerald-700'}`}>
              {interactionName}
            </span>
            <span className="text-[10.5px] text-gray-500">
              {hasInteraction ? 'Mechanistic Pathway Overlap' : 'No Pathway Conflict Detected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
