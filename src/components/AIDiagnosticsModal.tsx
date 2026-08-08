import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  X, 
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { IMEIService, AIUnlockAnalysis } from '../types';
import { formatUSD } from '../utils/imei';

interface AIDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: IMEIService[];
  onSelectService: (service: IMEIService) => void;
  setActiveTab: (tab: string) => void;
}

export const AIDiagnosticsModal: React.FC<AIDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  services,
  onSelectService,
  setActiveTab,
}) => {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 14 Pro');
  const [carrier, setCarrier] = useState('AT&T USA');
  const [issue, setIssue] = useState('Device is SIM locked to AT&T USA. Customer needs factory unlock.');
  const [imei, setImei] = useState('352843110294812');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIUnlockAnalysis | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/analyze-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, model, carrier, issue, imei }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('AI Diagnostic Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-[#222] rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8 animate-fadeIn">
        <div className="flex justify-between items-center border-b border-[#222] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>AI Lock Diagnostic Assistant</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">
                  Gemini AI
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Analyze tough unlock scenarios, calculate success rates, and recommend optimal server keys.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg text-lg font-mono cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2.5 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="Apple">Apple iPhone</option>
                <option value="Samsung">Samsung Galaxy</option>
                <option value="Xiaomi">Xiaomi / Poco</option>
                <option value="Motorola">Motorola Moto</option>
                <option value="Google">Google Pixel</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1">Model Name</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. S23 Ultra, iPhone 15 Pro"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2.5 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1">Carrier / Region</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. AT&T, T-Mobile, UK Vodafone"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2.5 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block">
              Describe Lock Symptom or Problem
            </label>
            <textarea
              rows={3}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Phone says 'SIM Not Supported'. Was on unpaid bill with AT&T. Need clean unlock."
              className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 leading-relaxed"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <Sparkles className="w-4 h-4 fill-white" />
            )}
            <span>{loading ? 'Consulting Gemini AI Engineer...' : 'Run AI Lock Diagnosis'}</span>
          </button>
        </form>

        {/* AI Analysis Result */}
        {analysis && (
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-5 space-y-4 font-mono text-xs animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#222] pb-3">
              <div>
                <span className="text-slate-500 text-[10px] uppercase tracking-wider">Target Device:</span>{' '}
                <strong className="text-white text-xs">{analysis.deviceModel}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider">Feasibility:</span>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2.5 py-0.5 rounded text-xs font-bold">
                  {analysis.feasibilityScore}%
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {analysis.summary}
            </p>

            {/* Recommended Services */}
            <div className="space-y-2">
              <span className="text-blue-400 font-bold uppercase text-[10px] tracking-wider block">
                Recommended DLS Server Key
              </span>
              {analysis.recommendedServices?.map((rec, idx) => {
                const actualService = services.find((s) => s.id === rec.serviceId) || services[0];
                return (
                  <div
                    key={idx}
                    className="bg-[#141414] border border-[#222] p-3 rounded-lg flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{rec.serviceName}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{rec.reason}</div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectService(actualService);
                        onClose();
                        setActiveTab('place_order');
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <span>Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Steps */}
            {analysis.stepByStepGuide && (
              <div className="space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Action Steps:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px] font-sans">
                  {analysis.stepByStepGuide.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
