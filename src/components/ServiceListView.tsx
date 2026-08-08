import React from 'react';
import { ChevronRight, Globe, ShoppingCart, Wrench, Flame, User, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface ServiceListViewProps {
  user: UserProfile;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const ServiceListView: React.FC<ServiceListViewProps> = ({
  user,
  setActiveTab,
  onOpenAuth,
}) => {
  const serviceCategories = [
    {
      id: 'imei_services',
      name: 'IMEI/SN Service',
      icon: <Globe className="w-5 h-5 text-sky-500" />,
    },
    {
      id: 'server_services',
      name: 'Server/Credit Service',
      icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'tool_rent',
      name: 'Tool Rent',
      icon: <Wrench className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'service_group',
      name: 'Service By Group',
      icon: <Flame className="w-5 h-5 text-orange-500" />,
    },
  ];

  const handleSelectCategory = (tabId: string) => {
    if (!user.isLoggedIn) {
      onOpenAuth();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden my-4">
      {/* Header bar matching GSM Cheap screenshot */}
      <div className="bg-[#008080] text-white px-4 py-3.5 flex items-center gap-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="p-1 hover:bg-teal-700/60 rounded-lg transition text-white"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 font-black text-lg tracking-tight">
          <span className="text-amber-300">G</span>
          <span>DLS Unlocker</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            SERVICE LIST
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="w-full py-4 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group text-left"
                id={`service-list-item-${cat.id}`}
              >
                <div className="flex items-center gap-3 font-semibold text-sm text-slate-800 dark:text-slate-100">
                  <span>{cat.icon}</span>
                  <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                    {cat.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Login / Register Button as shown in screenshot */}
        {!user.isLoggedIn ? (
          <button
            onClick={onOpenAuth}
            className="w-full py-3 px-4 bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-sm rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer"
            id="service-list-login-btn"
          >
            <User className="w-4 h-4 text-teal-200" />
            <span>Login | Register</span>
          </button>
        ) : (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg flex items-center justify-between text-xs text-teal-800 dark:text-teal-200 font-medium">
            <span>Logged in as: <strong>{user.fullName || user.username}</strong></span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
            >
              Go to Dashboard &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
