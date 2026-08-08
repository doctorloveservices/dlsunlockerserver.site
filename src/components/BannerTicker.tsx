import React from 'react';
import { Megaphone, Flame, ShieldCheck, Zap } from 'lucide-react';
import { Announcement } from '../types';

interface BannerTickerProps {
  announcements: Announcement[];
}

export const BannerTicker: React.FC<BannerTickerProps> = ({ announcements }) => {
  return (
    <div className="bg-[#0f0f0f] border-b border-[#1f1f1f] py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-blue-400 font-bold shrink-0 font-mono">
          <span className="p-1 bg-[#181818] rounded border border-[#2a2a2a] flex items-center">
            <Megaphone className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          </span>
          <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-slate-400">Server Broadcast</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap text-slate-300 font-medium relative w-full">
          <div className="inline-flex gap-8 animate-marquee text-xs">
            {announcements.map((ann) => (
              <span key={ann.id} className="inline-flex items-center gap-2 text-slate-300">
                {ann.type === 'urgent' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {ann.type === 'success' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                {ann.type === 'info' && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                <strong className="text-white font-mono">{ann.title}:</strong>
                <span className="text-slate-300">{ann.message}</span>
                <span className="text-slate-500 font-mono text-[10px]">({ann.date})</span>
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-400 shrink-0 font-mono text-[11px]">
          <span className="px-2.5 py-0.5 rounded bg-[#161616] border border-[#262626] text-slate-400 text-[10px] uppercase tracking-wider">
            Auto-API Online
          </span>
        </div>
      </div>
    </div>
  );
};
