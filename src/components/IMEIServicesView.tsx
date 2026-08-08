import React, { useState } from 'react';
import { Info, Search, X } from 'lucide-react';
import { IMEIService, UserProfile } from '../types';
import { ProductLogo } from './ProductLogo';
import { formatServicePrice } from '../utils/priceUtils';

interface IMEIServicesViewProps {
  services: IMEIService[];
  user?: UserProfile;
  onSelectService: (service: IMEIService) => void;
  setActiveTab: (tab: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const IMEIServicesView: React.FC<IMEIServicesViewProps> = ({
  services,
  user,
  onSelectService,
  setActiveTab,
  showSearch = false,
  searchPlaceholder = 'Search Products...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const query = searchTerm.toLowerCase().trim();
  const filteredServices = services.filter((service) => {
    if (!query) return true;
    return (
      service.name.toLowerCase().includes(query) ||
      (service.description && service.description.toLowerCase().includes(query)) ||
      (service.brand && service.brand.toLowerCase().includes(query)) ||
      (service.serviceTypeGroup && service.serviceTypeGroup.toLowerCase().includes(query))
    );
  });

  if (services.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 max-w-lg mx-auto my-8 shadow-xs animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/80 text-[#008080] dark:text-teal-400 flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          No products available yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Products for this service are coming soon. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Category Search Input (Only shown for IMEI/SN and Tool Rent categories) */}
      {showSearch && (
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* No matching products found state */}
      {showSearch && filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-500 dark:text-slate-400 space-y-3 shadow-xs my-4">
          <Search className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            No products found.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No products match "{searchTerm}". Try searching for another product name or brand.
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer transition"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Products List */
        <div className="grid grid-cols-1 gap-3.5">
          {filteredServices.map((service) => {
            const isOutOfStock = service.status === 'maintenance' || service.status === 'Offline';
            const priceDisplay = formatServicePrice(service, user);

            return (
              <div
                key={service.id}
                onClick={() => {
                  onSelectService(service);
                  setActiveTab('place_order');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
              >
                {/* Product Image Box */}
                <div className="w-28 sm:w-36 h-24 sm:h-28 bg-[#f5f8f7] dark:bg-slate-800 rounded-xl p-2.5 flex shrink-0 items-center justify-center overflow-hidden border border-slate-200/80 dark:border-slate-700/60">
                  <ProductLogo
                    logoUrl={service.logoUrl}
                    imageUrl={service.imageUrl}
                    brand={service.brand}
                    serviceName={service.name}
                    size="full"
                    className="w-full h-full border-0 bg-transparent shadow-none p-0"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-[#008080] dark:group-hover:text-teal-400 transition-colors">
                    {service.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center bg-teal-100/80 dark:bg-teal-950/90 text-[#006666] dark:text-teal-300 font-extrabold font-mono px-3 py-1 rounded-md text-xs sm:text-sm">
                      {priceDisplay}
                    </span>

                    <span className="inline-flex items-center bg-amber-100/80 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 font-extrabold font-mono px-3 py-1 rounded-md text-xs sm:text-sm uppercase">
                      {service.deliveryTime || 'INSTANT'}
                    </span>

                    {isOutOfStock && (
                      <span className="inline-flex items-center bg-rose-100/80 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 font-extrabold font-mono px-3 py-1 rounded-md text-xs sm:text-sm uppercase">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
