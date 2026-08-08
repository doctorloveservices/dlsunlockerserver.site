import React, { useState } from 'react';
import { Wrench, ShieldAlert, Lock, ArrowRight, MessageCircle, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface MaintenanceViewProps {
  onAdminLogin: (user: Partial<UserProfile>) => void;
  adminWhatsAppNumber?: string;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  onAdminLogin,
  adminWhatsAppNumber = '258869726969',
}) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const isAdminAttempt =
      cleanInput === 'admin' ||
      cleanInput === 'admin@dlsunlockerserver.site' ||
      cleanInput.includes('doctorlove');

    if (isAdminAttempt && (cleanPass === '869726969,Pe' || cleanPass === 'admin')) {
      setLoginSuccess(true);
      setTimeout(() => {
        onAdminLogin({
          username: 'Admin',
          fullName: 'Administrator',
          email: 'admin@dlsunlockerserver.site',
          balance: 10000.0,
          lockedBalance: 0.0,
          vipTier: 'Distributor',
          isLoggedIn: true,
          isAdmin: true,
          role: 'admin',
        });
      }, 800);
    } else {
      setLoginError('Invalid Administrator credentials. Normal users are blocked during maintenance.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl w-full bg-[#0d1527] border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 text-center space-y-8 animate-fadeIn">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg mb-2">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Maintenance Mode Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight pt-2">
            Website is Maintenance — Coming Soon
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed pt-1">
            Our system is currently undergoing scheduled maintenance, server upgrades, and database optimizations. Access to products, customer logins, and order submission is temporarily paused.
          </p>
        </div>

        {/* Feature Notice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="bg-[#121c35] p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Customer Portal Locked</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Normal user logins and registration are temporarily disabled.
              </p>
            </div>
          </div>

          <div className="bg-[#121c35] p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Direct WhatsApp Support</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Need urgent assistance? Contact Administrator via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent('Hello Admin, I am inquiring about Website Maintenance status.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1faa52] text-slate-950 font-black px-6 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Contact Admin on WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setShowAdminLogin(!showAdminLogin);
              setUsername('');
              setPassword('');
              setLoginError(null);
            }}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-teal-400" />
            <span>Admin Portal Login</span>
          </button>
        </div>

        {/* Admin Login Modal / Form Toggle */}
        {showAdminLogin && (
          <div className="bg-[#090e1a] border border-slate-700/80 rounded-2xl p-5 sm:p-6 text-left space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Administrator Authentication</span>
              </div>
              <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-mono">Bypass Mode</span>
            </div>

            {loginSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Admin Authenticated! Unlocking Management Portal...</span>
              </div>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-3" autoComplete="off">
                {loginError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    ADMIN USERNAME / EMAIL
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    autoComplete="off"
                    className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    ADMIN PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    autoComplete="new-password"
                    className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#008080] hover:bg-[#006666] text-white font-black py-3 rounded-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Authenticate Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4 space-y-0.5">
          <div>Powered by Dlsunlockerserver.site</div>
          <div>2026</div>
        </div>
      </div>
    </div>
  );
};
