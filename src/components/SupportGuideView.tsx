import React, { useState } from 'react';
import { 
  Download, 
  HelpCircle, 
  Laptop, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  FileText,
  MessageSquare,
  Cpu
} from 'lucide-react';

export const SupportGuideView: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const drivers = [
    { name: 'Samsung Official MTP & ADB Drivers v1.7.59', size: '32 MB', cat: 'Samsung USB' },
    { name: 'Apple Mobile Device Support 64-bit (iTunes Core)', size: '48 MB', cat: 'Apple iOS' },
    { name: 'Qualcomm HS-USB QDLoader 9008 Driver Pack', size: '12 MB', cat: 'Qualcomm EDL' },
    { name: 'MediaTek MTK VCOM Preloader Driver 2026', size: '18 MB', cat: 'MTK Chipset' },
    { name: 'Xiaomi Mi Flash Tool & Fastboot Drivers', size: '65 MB', cat: 'Xiaomi' },
    { name: 'USB Redirector Client v2.3 for Remote Engineer', size: '8 MB', cat: 'Remote USB' },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;

    setTicketSubmitted(true);
    setTicketSubject('');
    setTicketMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] mb-2 w-max">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>USB REMOTE GUIDES & TICKET DESK</span>
        </div>
        <h2 className="text-xl font-serif italic text-white tracking-wide">
          Remote USB Unlocking Setup & Official Driver Center
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Everything you need to connect your client phone to DLS Remote USB Engineers and download certified Windows drivers.
        </p>
      </div>

      {/* Grid: USB Guide & Driver Repo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remote USB Redirector Steps */}
        <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider border-b border-[#222] pb-3">
            <Laptop className="w-4 h-4 text-blue-400" />
            <span>Remote USB Redirector Setup (3 Simple Steps)</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
              <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">Step 1: Install Drivers & USB Redirector</div>
              <p className="text-slate-300 font-sans text-xs">
                Download and install the target manufacturer USB driver (Samsung / Qualcomm / MTK) and launch USB Redirector Client.
              </p>
            </div>

            <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
              <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">Step 2: Connect Server IP</div>
              <p className="text-slate-300 font-sans text-xs">
                Enter DLS Server Gateway Address <code className="text-amber-300">usb.dlsunlocker.com:3000</code> in USB Redirector.
              </p>
            </div>

            <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] space-y-1">
              <div className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">Step 3: Plug Device & Submit Order</div>
              <p className="text-slate-300 font-sans text-xs">
                Put phone in MTP/ADB or Emergency Call mode (*#0*#) and submit order. DLS Engineer will unlock phone in 2-5 minutes!
              </p>
            </div>
          </div>
        </div>

        {/* Drivers Repository */}
        <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider border-b border-[#222] pb-3">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Official GSM Driver Downloads</span>
          </div>

          <div className="space-y-2">
            {drivers.map((drv, idx) => (
              <div
                key={idx}
                className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1f1f1f] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white font-mono text-xs">{drv.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{drv.cat} • {drv.size}</div>
                </div>
                <button
                  onClick={() => alert(`Downloading ${drv.name}...`)}
                  className="bg-[#1e1e1e] hover:bg-blue-600 hover:text-white text-slate-200 border border-[#333] hover:border-blue-500 px-3 py-1.5 rounded-lg font-mono font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-all shrink-0"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Ticket Submitter */}
      <div className="bg-[#141414] border border-[#222] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider border-b border-[#222] pb-3">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Open Support Ticket to DLS Senior Engineers</span>
        </div>

        {ticketSubmitted ? (
          <div className="bg-emerald-950/80 border border-emerald-900/50 p-4 rounded-lg text-emerald-300 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Ticket submitted! DLS Support agent will reply within 15 minutes.</span>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">Ticket Subject:</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Question regarding AT&T iPhone 15 Pro status check"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">Message Description:</label>
              <textarea
                rows={3}
                required
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="Provide order number or IMEI details..."
                className="w-full bg-[#0a0a0a] border border-[#333] text-white p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
