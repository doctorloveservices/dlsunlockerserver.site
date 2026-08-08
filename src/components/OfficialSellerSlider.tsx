import React, { useState } from 'react';
import { ShieldCheck, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export const OFFICIAL_SELLER_ITEMS = [
  {
    id: 'seller-1',
    name: 'Cheetah Tool Pro',
    role: 'Official Authorized Distributor',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    tag: 'VERIFIED DISTRIBUTOR',
  },
  {
    id: 'seller-2',
    name: 'UnlockTool.net',
    role: 'Official Direct Server Partner',
    imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
    tag: 'AUTHORIZED AGENT',
  },
  {
    id: 'seller-3',
    name: 'ChimeraTool Pro',
    role: 'Global License Reseller',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    tag: 'OFFICIAL SELLER',
  },
  {
    id: 'seller-4',
    name: 'HFZ Activator & iRemoval',
    role: 'Apple Bypass Direct API Server',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    tag: 'PREMIUM PARTNER',
  },
  {
    id: 'seller-5',
    name: 'Pandora & Octoplus Box',
    role: 'Digital Credits & Activations',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    tag: 'OFFICIAL AGENT',
  },
];

export const OfficialSellerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? OFFICIAL_SELLER_ITEMS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % OFFICIAL_SELLER_ITEMS.length);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 my-6">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>We Are Official Seller</span>
              <Award className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Authorized direct reseller for top unlocking tools & server licenses
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hidden sm:inline-block">
          100% Genuine Direct API
        </span>
      </div>

      {/* Rotating Auto Slider Container */}
      <div className="relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 min-h-[180px] sm:min-h-[220px]">
        {OFFICIAL_SELLER_ITEMS.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-between p-6 ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Dark Gradient Overlay */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30 blur-[2px] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-0" />

              {/* Content Overlay */}
              <div className="relative z-10 max-w-lg space-y-2">
                <span className="inline-block text-[10px] font-black uppercase font-mono px-2.5 py-0.5 rounded bg-teal-500 text-slate-950 tracking-wider">
                  {item.tag}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-teal-200/90 font-medium">
                  {item.role}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-teal-500/30 backdrop-blur-md shadow-xl text-center shrink-0">
                <div className="space-y-1 px-3">
                  <div className="text-xs font-mono font-bold text-teal-400">INSTANT DISPATCH</div>
                  <div className="text-[10px] text-slate-300 font-medium">Verified Gateway</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Manual Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-teal-600 text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Progress Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {OFFICIAL_SELLER_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-teal-400' : 'w-1.5 bg-slate-600/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
