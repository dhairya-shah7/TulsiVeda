import React, { useState } from 'react';
import { 
  BarChart3, ShieldAlert, Users, TrendingUp, AlertTriangle, 
  CheckCircle2, Plus, RefreshCw, Upload, Eye, Check, X, FileText 
} from 'lucide-react';
import { AudioNarrator } from '../components/AudioNarrator';
import { t, useCurrentLanguage } from '../services/localizationService';

interface AdminDashboardScreenProps {
  onBackToApp?: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onBackToApp
}) => {
  useCurrentLanguage();
  const [activeTab, setActiveTab] = useState<'surveillance' | 'adr' | 'ota' | 'signoff'>('surveillance');
  const [otaSuccess, setOtaSuccess] = useState(false);
  const [signOffItems, setSignOffItems] = useState([
    { id: 'so-1', title: 'Giloy High-Dose in Hepatic Impairment', reporter: 'Dr. V. Joshi (Pune Civil)', status: 'Pending Review' },
    { id: 'so-2', title: 'Sarpagandha + Amlodipine Synergy Protocol', reporter: 'Dr. S. Roy (AIIMS Delhi)', status: 'Pending Review' }
  ]);

  const handlePublishOta = () => {
    setOtaSuccess(true);
    setTimeout(() => setOtaSuccess(false), 2000);
  };

  const handleApprove = (id: string) => {
    setSignOffItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24 bg-slate-50 min-h-screen">
      {/* Light-themed Admin Header */}
      {/* Light-themed Admin Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {t('admin_portal_title')}
          </h1>
          <AudioNarrator 
            textToNarrate={`राष्ट्रीय स्वास्थ्य नियंत्रण केंद्र। वास्तविक समय रोग निगरानी, औषधि सुरक्षा सतर्कता तथा ज्ञानकोष प्रबंधन।`}
            label={t('listen')}
            className="p-1.5 shrink-0"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
          Surveillance Command Center: Real-time syndromic outbreak telemetry, adverse clash heatmaps, and OTA clinical rule dispatch.
        </p>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 text-center">
            <span className="text-lg font-black text-slate-900 block leading-tight">14,290</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Daily Intakes</span>
          </div>
          <div className="bg-red-50 p-2.5 rounded-2xl border border-red-200 text-center">
            <span className="text-lg font-black text-red-700 block leading-tight">32</span>
            <span className="text-[10px] text-red-600 font-semibold uppercase">ADR Clusters</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200 text-center">
            <span className="text-lg font-black text-emerald-700 block leading-tight">99.8%</span>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase">Causal Precision</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'surveillance', label: 'Surveillance' },
          { id: 'adr', label: 'ADR Feed' },
          { id: 'ota', label: 'OTA Rules' },
          { id: 'signoff', label: 'Sign-Off' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Surveillance & Outbreak Heatmap */}
      {activeTab === 'surveillance' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Syndromic Outbreak Telemetry (Top Clusters)
              </h3>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                2 Hotspots Detected
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { state: 'Maharashtra (Thane, Raigad)', symptom: 'Viral Fever & Thrombocytopenia', count: '1,420 cases', severity: 'High Alert', color: 'bg-red-500' },
                { state: 'Uttar Pradesh (Varanasi, Sitapur)', symptom: 'Respiratory Wheezing / Bronchial', count: '980 cases', severity: 'Elevated', color: 'bg-amber-500' },
                { state: 'Tamil Nadu (Madurai, Salem)', symptom: 'Joint Pain & Chikungunya Sequelae', count: '640 cases', severity: 'Moderate', color: 'bg-blue-500' }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="font-bold text-xs text-slate-900">{item.state}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{item.symptom}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 block">{item.count}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pharmacovigilance ADR Feed */}
      {activeTab === 'adr' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Herb-Drug Adverse Interactions (Pharmacovigilance)
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  pair: 'Ashwagandha + Warfarin',
                  reportedBy: 'Civil Hospital Pune',
                  risk: 'CYP2C9 clearance inhibition $\\to$ elevated INR & bleeding risk',
                  time: '12m ago',
                  status: 'Auto-Flagged'
                },
                {
                  pair: 'Tulsi (Holy Basil) + Aspirin 75mg',
                  reportedBy: 'Kolkata District Health',
                  risk: 'Synergistic TXA2 platelet aggregation inhibition',
                  time: '1h ago',
                  status: 'Mitigated'
                },
                {
                  pair: 'Karela (Bitter Gourd) + Glimepiride',
                  reportedBy: 'Ahmedabad Urban PHC',
                  risk: 'Additive hypoglycemic shock risk ($\text{Glu} < 60\,\text{mg/dL}$)',
                  time: '3h ago',
                  status: 'Notified'
                }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.pair}</span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{item.risk}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Source: {item.reportedBy}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: OTA Knowledge Publisher */}
      {activeTab === 'ota' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Over-The-Air (OTA) Causal Rule Dispatcher
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Push new verified botanical pathways and interaction rules to all 500,000+ field devices without app store updates.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Monograph Target</label>
              <input 
                type="text" 
                defaultValue="Kalmegh (Andrographis paniculata) CYP3A4 Pathway v2.4"
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Pharmacological JSON Payload</label>
              <textarea 
                rows={4}
                defaultValue={`{\n  "pathway": "CYP3A4",\n  "inhibitionKi_uM": 4.2,\n  "pmidEvidence": "31298451",\n  "contraindicatedDrugs": ["Atorvastatin", "Simvastatin"]\n}`}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              />
            </div>

            <button
              onClick={handlePublishOta}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              {otaSuccess ? 'Dispatched to National Grid!' : 'Broadcast OTA Rule'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Clinician Sign-Off Queue */}
      {activeTab === 'signoff' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Clinician Peer-Review Sign-Off Queue
            </h3>
            <p className="text-xs text-slate-500">
              Double-blind review protocol before newly contributed experiential remedies become nationwide guidelines.
            </p>

            {signOffItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700">All submissions approved</p>
              </div>
            ) : (
              signOffItems.map(item => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Contributor: {item.reporter}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
