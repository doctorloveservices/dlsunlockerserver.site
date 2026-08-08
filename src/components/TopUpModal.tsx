import React, { useState } from 'react';
import { Wallet, PlusCircle, CheckCircle2, X, ShieldAlert, Copy, Check, Upload } from 'lucide-react';
import { UserProfile } from '../types';
import { formatUSD } from '../utils/imei';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (amount: number) => void;
  onDeductCredits?: (amount: number) => void;
  onLockCredits?: (amount: number) => void;
  onUnlockCredits?: (amount: number) => void;
  user: UserProfile;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onAddCredits,
  onDeductCredits,
  onLockCredits,
  onUnlockCredits,
  user,
}) => {
  const [amount, setAmount] = useState<number>(50);
  const [adminAction, setAdminAction] = useState<'add' | 'deduct' | 'lock' | 'unlock'>('add');
  const [txHash, setTxHash] = useState<string>('');
  const [method, setMethod] = useState<'mpesa' | 'emola' | 'binance'>('mpesa');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAdminExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (adminAction === 'add') {
        onAddCredits(amount);
        setSuccessMsg(`Added ${formatUSD(amount)} to account balance.`);
      } else if (adminAction === 'deduct' && onDeductCredits) {
        onDeductCredits(amount);
        setSuccessMsg(`Deducted ${formatUSD(amount)} from account balance.`);
      } else if (adminAction === 'lock' && onLockCredits) {
        onLockCredits(amount);
        setSuccessMsg(`Locked ${formatUSD(amount)} in account balance.`);
      } else if (adminAction === 'unlock' && onUnlockCredits) {
        onUnlockCredits(amount);
        setSuccessMsg(`Unlocked ${formatUSD(amount)} to available balance.`);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 500);
  };

  const handleCustomerClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg(`Deposit request for ${formatUSD(amount)} submitted to Administrator for verification!`);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#222] rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#222] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#008080]" />
              <span>{user.isAdmin ? 'Administrator Balance Management' : 'Account Balance & Payment Deposit'}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              dlsunlockerserver.site Official Payment Gateway
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 font-mono text-base cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Summary Pill */}
        <div className="grid grid-cols-2 gap-3 bg-[#0a0a0a] p-3 rounded-lg border border-[#222]">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Available Balance</span>
            <span className="text-sm font-bold font-mono text-emerald-400">${(user.balance || 0).toFixed(2)} USD</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Locked Balance</span>
            <span className="text-sm font-bold font-mono text-amber-400">${(user.lockedBalance || 0).toFixed(2)} USD</span>
          </div>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white font-mono">{successMsg}</h4>
          </div>
        ) : user.isAdmin ? (
          /* ADMINISTRATOR BALANCE CONTROLS */
          <form onSubmit={handleAdminExecute} className="space-y-4">
            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg text-[11px] text-amber-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Administrator Mode: You have full authority to Add, Deduct, Lock, or Unlock balance.</span>
            </div>

            {/* Action Tabs */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1.5">
                Select Admin Action
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setAdminAction('add')}
                  className={`py-2 rounded-lg font-bold transition text-center ${
                    adminAction === 'add' ? 'bg-emerald-600 text-white' : 'bg-[#0a0a0a] text-slate-400 border border-[#222]'
                  }`}
                >
                  + Add
                </button>
                <button
                  type="button"
                  onClick={() => setAdminAction('deduct')}
                  className={`py-2 rounded-lg font-bold transition text-center ${
                    adminAction === 'deduct' ? 'bg-rose-600 text-white' : 'bg-[#0a0a0a] text-slate-400 border border-[#222]'
                  }`}
                >
                  - Deduct
                </button>
                <button
                  type="button"
                  onClick={() => setAdminAction('lock')}
                  className={`py-2 rounded-lg font-bold transition text-center ${
                    adminAction === 'lock' ? 'bg-amber-600 text-white' : 'bg-[#0a0a0a] text-slate-400 border border-[#222]'
                  }`}
                >
                  🔒 Lock
                </button>
                <button
                  type="button"
                  onClick={() => setAdminAction('unlock')}
                  className={`py-2 rounded-lg font-bold transition text-center ${
                    adminAction === 'unlock' ? 'bg-blue-600 text-white' : 'bg-[#0a0a0a] text-slate-400 border border-[#222]'
                  }`}
                >
                  🔓 Unlock
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1">
                USD Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-xs">$</span>
                <input
                  type="number"
                  min={1}
                  step={0.01}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white pl-8 pr-4 py-2 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              <span>Execute {adminAction.toUpperCase()} ${amount.toFixed(2)} USD</span>
            </button>
          </form>
        ) : (
          /* CUSTOMER DEPOSIT REQUEST FORM */
          <form onSubmit={handleCustomerClaimSubmit} className="space-y-4 text-xs">
            <div className="bg-teal-950/40 border border-[#008080]/40 p-3 rounded-lg text-xs text-teal-200 space-y-1">
              <p className="font-bold text-white">Payment Methods & Deposit Instructions:</p>
              <p className="text-[11px] text-slate-300">
                Send your payment to any of our official payment accounts below. Copy the number/ID and attach proof after payment.
              </p>
            </div>

            {/* Payment Channel Selection */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1.5 font-mono">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('mpesa')}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-1 ${
                    method === 'mpesa'
                      ? 'bg-[#008080] border-[#008080] text-white shadow-md'
                      : 'bg-[#0a0a0a] border-[#222] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">🇲🇿</span>
                  <span>M-Pesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('emola')}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-1 ${
                    method === 'emola'
                      ? 'bg-[#008080] border-[#008080] text-white shadow-md'
                      : 'bg-[#0a0a0a] border-[#222] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">🇲🇿</span>
                  <span>e-Mola</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('binance')}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition cursor-pointer flex flex-col items-center gap-1 ${
                    method === 'binance'
                      ? 'bg-[#008080] border-[#008080] text-white shadow-md'
                      : 'bg-[#0a0a0a] border-[#222] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">🟡</span>
                  <span>Binance</span>
                </button>
              </div>
            </div>

            {/* Selected Method Account Details Box */}
            {method === 'mpesa' && (
              <div className="bg-[#0a0a0a] border border-emerald-500/30 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">M-Pesa Account</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Mozambique</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-[#222]">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Number</span>
                      <span className="font-mono text-white font-bold text-sm">+258 857 947 977</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('+258857947977', 'mpesa-num')}
                      className="p-1.5 bg-[#008080]/30 hover:bg-[#008080] text-white rounded-md transition flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'mpesa-num' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'mpesa-num' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Account Holder</span>
                    <span className="font-semibold text-white">Pita Chadrequi Sithole</span>
                  </div>
                </div>
              </div>
            )}

            {method === 'emola' && (
              <div className="bg-[#0a0a0a] border border-orange-500/30 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">e-Mola Account</span>
                  <span className="text-[10px] bg-orange-950 text-orange-300 px-2 py-0.5 rounded border border-orange-800">Mozambique</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-[#222]">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Number</span>
                      <span className="font-mono text-white font-bold text-sm">+258 869 726 969</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('+258869726969', 'emola-num')}
                      className="p-1.5 bg-[#008080]/30 hover:bg-[#008080] text-white rounded-md transition flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'emola-num' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'emola-num' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Account Holder</span>
                    <span className="font-semibold text-white">Pita Chadrequi Sithole</span>
                  </div>
                </div>
              </div>
            )}

            {method === 'binance' && (
              <div className="bg-[#0a0a0a] border border-yellow-500/30 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Binance (USDT)</span>
                  <span className="text-[10px] bg-yellow-950 text-yellow-300 px-2 py-0.5 rounded border border-yellow-800">Pay / USDT</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-[#222]">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-mono">Binance ID</span>
                      <span className="font-mono text-yellow-400 font-bold text-sm">1260586442</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('1260586442', 'binance-id')}
                      className="p-1.5 bg-[#008080]/30 hover:bg-[#008080] text-white rounded-md transition flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'binance-id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'binance-id' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Account Holder</span>
                    <span className="font-semibold text-white">SIPIRIO JONE AMOSSE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Deposit Amount Input */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1 font-mono">
                Deposit Amount Paid ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-xs">$</span>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white pl-8 pr-4 py-2.5 rounded-lg text-xs font-mono focus:outline-none focus:border-[#008080]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isProcessing ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              <span>Submit Payment For Verification (${amount.toFixed(2)})</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
