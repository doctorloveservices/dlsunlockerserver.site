import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight,
  Bot,
  Zap,
  Globe
} from 'lucide-react';
import { isValidIMEI, parseTAC, formatUSD } from '../utils/imei';
import { IMEIService, UserProfile } from '../types';
import { formatServicePrice } from '../utils/priceUtils';

interface IMEICheckerViewProps {
  services: IMEIService[];
  user?: UserProfile;
  onSelectService: (service: IMEIService) => void;
  setActiveTab: (tab: string) => void;
  onOpenAIDiagnostic: () => void;
}

export const IMEICheckerView: React.FC<IMEICheckerViewProps> = ({
  services,
  user,
  onSelectService,
  setActiveTab,
  onOpenAIDiagnostic,
}) => {
  const [imeiInput, setImeiInput] = useState('352843110294812');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<any>({
    imei: '352843110294812',
    validLuhn: true,
    brand: 'Apple',
    model: 'iPhone 14 Pro Max 256GB Gold',
    manufacturer: 'Apple Inc.',
    icloudStatus: 'CLEAN',
    carrierLock: 'LOCKED',
    carrierName: 'AT&T Mobility USA',
    blacklistStatus: 'CLEAN',
    warrantyStatus: 'Expired (Coverage Ended)',
    purchaseCountry: 'United States',
    estimatedUnlockCost: 8.50,
    recommendedServiceId: 'srv-103',
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imeiInput.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const valid = isValidIMEI(imeiInput);
      const tac = parseTAC(imeiInput);

      const brand = tac?.brand || 'Apple';
      const model = tac?.model || 'iPhone / Galaxy Smartphone';

      // Smart mock scan logic
      const lastDigit = parseInt(imeiInput.slice(-1) || '0', 10);
      const isLost = lastDigit % 4 === 3;
      const isUnlocked = lastDigit % 5 === 0;

      setResult({
        imei: imeiInput,
        validLuhn: valid,
        brand: brand,
        model: `${model} (256GB)`,
        manufacturer: tac?.manufacturer || 'Global Electronics OEM',
        icloudStatus: isLost ? 'LOST/STOLEN' : 'CLEAN',
        carrierLock: isUnlocked ? 'UNLOCKED' : 'LOCKED',
        carrierName: isUnlocked ? 'Factory Unlocked (Global)' : (brand === 'Apple' ? 'AT&T Mobility USA' : 'T-Mobile USA'),
        blacklistStatus: isLost ? 'BLACKLISTED' : 'CLEAN',
        warrantyStatus: valid ? 'Active Warranty' : 'Expired',
        purchaseCountry: 'United States',
        estimatedUnlockCost: brand === 'Apple' ? 8.50 : 6.50,
        recommendedServiceId: brand === 'Apple' ? 'srv-103' : 'srv-201',
      });
      setLoading(false);
    }, 700);
  };

  const recommendedService = services.find((s) => s.id === result?.recommendedServiceId) || services[0];

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `
=== DLS UNLOCKER SERVER - GSX DIAGNOSTIC REPORT ===
IMEI: ${result.imei}
Luhn Check: ${result.validLuhn ? 'VALID' : 'INVALID'}
Device: ${result.brand} ${result.model}
iCloud / FMI: ${result.icloudStatus}
Carrier Lock: ${result.carrierLock} (${result.carrierName})
GSMA Blacklist: ${result.blacklistStatus}
Warranty: ${result.warrantyStatus}
Timestamp: ${new Date().toISOString()}
===================================================
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>DIRECT GSX & TAC ANALYZER</span>
            </div>
            <h2 className="text-xl font-serif italic text-white tracking-wide">
              Instant IMEI Validator & GSX Status Scan
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Test any 15-digit IMEI to verify Luhn MOD-10 validity, exact model specs, iCloud status, carrier lock, and GSMA blacklists.
            </p>
          </div>

          <button
            onClick={onOpenAIDiagnostic}
            className="bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 border border-blue-800/40 font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Need AI Deep Diagnosis?</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScan} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={imeiInput}
              onChange={(e) => setImeiInput(e.target.value)}
              placeholder="Enter 15-Digit IMEI number..."
              maxLength={15}
              className="w-full bg-[#0a0a0a] border border-[#333] focus:border-blue-500 text-white rounded-lg px-4 py-3 text-xs font-mono tracking-widest focus:outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Scan Server Database</span>
          </button>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Phone Status Card (2 Columns) */}
          <div className="lg:col-span-2 bg-[#141414] border border-[#222] rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-center border-b border-[#222] pb-4 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-blue-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{result.brand} {result.model}</h3>
                  <div className="text-xs font-mono text-slate-500">
                    IMEI: <span className="text-blue-400 font-bold">{result.imei}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="bg-[#0a0a0a] hover:bg-[#1f1f1f] text-slate-300 border border-[#222] px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Report' : 'Copy GSX Report'}</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Luhn Algorithm Check</div>
                <div className="flex items-center gap-2 pt-1">
                  {result.validLuhn ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 font-mono">VALID MOD-10</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-xs font-bold text-red-400 font-mono">INVALID CHECKSUM</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">iCloud / Find My Status</div>
                <div className="flex items-center gap-2 pt-1">
                  {result.icloudStatus === 'CLEAN' ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 font-mono">iCloud: CLEAN</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400 font-mono">iCloud: LOST/STOLEN</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Carrier & Lock Status</div>
                <div className="flex items-center gap-2 pt-1">
                  {result.carrierLock === 'UNLOCKED' ? (
                    <>
                      <Unlock className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 font-mono">FACTORY UNLOCKED</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        LOCKED ({result.carrierName})
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">GSMA Blacklist Status</div>
                <div className="flex items-center gap-2 pt-1">
                  {result.blacklistStatus === 'CLEAN' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 font-mono">CLEAN WORLDWIDE</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-xs font-bold text-red-400 font-mono">REPORTED BLACKLISTED</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* GSX Raw Payload Box */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live GSX Server Response Log</div>
              <pre className="bg-[#0a0a0a] border border-[#222] p-4 rounded-lg text-[11px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
{`{
  "imei": "${result.imei}",
  "luhn_valid": ${result.validLuhn},
  "manufacturer": "${result.manufacturer}",
  "model_name": "${result.model}",
  "fmi_status": "${result.icloudStatus}",
  "carrier_lock": "${result.carrierLock}",
  "registered_carrier": "${result.carrierName}",
  "gsma_blacklist": "${result.blacklistStatus}",
  "warranty_coverage": "${result.warrantyStatus}",
  "country_purchased": "${result.purchaseCountry}"
}`}
              </pre>
            </div>
          </div>

          {/* Recommended Solution Card (1 Column) */}
          <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Recommended Unlock Solution</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{recommendedService.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{recommendedService.description}</p>
              </div>

              <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1f1f1f] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Speed:</span>
                  <span className="text-white">{recommendedService.deliveryTime}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Success Rate:</span>
                  <span className="text-emerald-400">{recommendedService.successRate}%</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Cost:</span>
                  <span className="text-emerald-400 font-bold">{formatServicePrice(recommendedService, user)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#1f1f1f]">
              <button
                onClick={() => {
                  onSelectService(recommendedService);
                  setActiveTab('place_order');
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order Unlock for this IMEI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
