import React, { useState } from 'react';
import { Globe, ShoppingCart, Wrench, Flame, ArrowRight, Shield, Zap } from 'lucide-react';
import { IMEIService, UserProfile, SlideItem, Announcement } from '../types';
import { HeroSlider } from './HeroSlider';
import { IMEIServicesView } from './IMEIServicesView';
import { OfficialSellerSlider } from './OfficialSellerSlider';

interface HomeViewProps {
  user: UserProfile;
  services: IMEIService[];
  slides: SlideItem[];
  announcements: Announcement[];
  setActiveTab: (tab: string) => void;
  onSelectService: (service: IMEIService) => void;
  onOpenAuth: () => void;
  onOpenSliderManager?: () => void;
  isAdminMode?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  services,
  slides,
  announcements,
  setActiveTab,
  onSelectService,
  onOpenAuth,
  onOpenSliderManager,
  isAdminMode = false,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Hero Promotional Slider */}
      <HeroSlider
        slides={slides}
        onSelectSlideLink={(tab) => setActiveTab(tab)}
        onOpenSliderManager={onOpenSliderManager}
        isAdminMode={isAdminMode}
      />

      {/* 3. Service Categories Quick Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('imei_services')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 rounded-2xl shadow-xs transition text-left cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-[#008080] dark:text-teal-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#008080] transition">
              IMEI/SN Service
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Apple, Samsung, Xiaomi & carrierwhitelists
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('server_services')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 rounded-2xl shadow-xs transition text-left cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
              Server/Credit Service
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Server credits & automated tokens
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('tool_rent')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 rounded-2xl shadow-xs transition text-left cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
              Tool Rent
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Remote dongle & tool sharing
            </p>
          </div>
        </button>

        <a
          href="https://whatsapp.com/channel/0029VaKTKBAIN9iszzowbj1y"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-600 rounded-2xl shadow-xs transition text-left cursor-pointer group space-y-2 block"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
              Service By Group
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Official updates & VIP group
            </p>
          </div>
        </a>
      </div>

      {/* 4. Service Catalogue List with Search and Instant Filter */}
      <IMEIServicesView
        services={services}
        onSelectService={onSelectService}
        setActiveTab={setActiveTab}
        showSearch={true}
        searchPlaceholder="Search all products & services..."
      />

      {/* 5. Official Sellers Brand Slider */}
      <OfficialSellerSlider />
    </div>
  );
};
