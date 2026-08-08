import React from 'react';

interface FooterProps {
  setActiveTab?: (tab: string) => void;
}

export function Footer({}: FooterProps) {
  return (
    <footer className="bg-[#001717] text-slate-200 w-full py-8 px-4 border-t border-teal-900/60 font-sans text-center">
      <div className="max-w-7xl mx-auto space-y-1">
        <p className="text-sm font-semibold text-slate-200">
          Powered by Dlsunlockerserver.site
        </p>
        <p className="text-xs text-slate-400 font-medium">
          2026
        </p>
      </div>
    </footer>
  );
}
