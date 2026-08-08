import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  Settings, 
  PlusCircle,
  LayoutDashboard,
  ShoppingBag,
  FileText,
  FileCheck,
  ChevronDown,
  Globe,
  CreditCard,
  Wrench,
  Layers,
  LogOut,
  Shield,
  Search,
  ArrowLeft
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatUSD } from '../utils/imei';

interface HeaderProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTopUp: () => void;
  onOpenAdmin: () => void;
  onOpenAIDiagnostic: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isAdminMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenTopUp,
  onOpenAdmin,
  onOpenAIDiagnostic,
  onOpenAuth,
  onLogout,
  isAdminMode,
}) => {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const navTabs = [
    { id: 'home', label: 'Home', icon: Globe },
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'imei_services', label: 'IMEI/SN Service', icon: Globe },
    { id: 'server_services', label: 'Server/Credit Service', icon: CreditCard },
    { id: 'tool_rent', label: 'Tool Rent', icon: Wrench },
    { id: 'service_group', label: 'Service By Group', icon: Layers },
    { id: 'checker', label: 'IMEI Checker', icon: Search },
    { id: 'api_docs', label: 'Reseller API', icon: Shield },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'service_group') {
      window.open('https://whatsapp.com/channel/0029VaKTKBAIN9iszzowbj1y', '_blank', 'noopener,noreferrer');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Main Signature Teal Header Bar - Clean header with ONLY logo, branding & hamburger menu */}
      <div className="bg-[#008080] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        {/* Left Side: Hamburger Drawer Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuDrawerOpen(!menuDrawerOpen)}
            className="p-1.5 hover:bg-teal-800/60 rounded-lg transition text-white cursor-pointer"
            title="Toggle Navigation Menu"
            id="toggle-menu-drawer"
          >
            {menuDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-white text-teal-800 font-black flex items-center justify-center text-xl shadow-md border border-teal-200">
              D
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none">
                DLS UNLOCKER
              </h1>
              <p className="text-[10px] uppercase font-semibold text-teal-100 tracking-wider">
                SERVER PORTAL • dlsunlockerserver.site
              </p>
            </div>
          </div>
        </div>

        {/* Right side permanently clean without top-right balance/avatar buttons */}
        <div className="flex items-center gap-2">
          {/* Top right buttons permanently removed as requested */}
        </div>
      </div>

      {/* Primary Category Bar Navigation */}
      <nav className="bg-teal-900 text-white border-b border-teal-800 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1 py-1 overflow-x-auto">
            {navTabs
              .filter((tab) => user.isLoggedIn || ['imei_services', 'server_services', 'tool_rent', 'service_group'].includes(tab.id))
              .filter((tab) => tab.id !== 'api_docs' || user.isAdmin)
              .slice(0, 8)
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-teal-700 text-white font-bold shadow-inner'
                        : 'text-teal-100 hover:bg-teal-800/80 hover:text-white'
                    }`}
                    id={`nav-tab-${tab.id}`}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-90" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
          </div>

          <button
            onClick={onOpenAuth}
            className="text-teal-200 hover:text-white text-xs font-medium underline py-1 cursor-pointer"
          >
            {user.isLoggedIn ? `Role: ${user.vipTier}` : 'Login / Create Account'}
          </button>
        </div>
      </nav>

      {/* Account & Service Side Drawer Overlay */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-80 max-w-[85vw] h-full shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="bg-[#008080] text-white p-5 border-b border-teal-800">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white text-teal-900 font-bold flex items-center justify-center">
                    D
                  </div>
                  <div>
                    <span className="font-extrabold text-lg block leading-none">DLS UNLOCKER</span>
                    <span className="text-[10px] text-teal-100 font-medium">dlsunlockerserver.site</span>
                  </div>
                </div>
                <button
                  onClick={() => setMenuDrawerOpen(false)}
                  className="text-teal-100 hover:text-white p-1 rounded-lg cursor-pointer"
                  id="close-drawer-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {user.isLoggedIn && (
                <div className="bg-teal-900/80 p-3 rounded-lg border border-teal-600/40">
                  <p className="font-bold text-sm text-white truncate">
                    {user.fullName || user.username}
                  </p>
                  <div className="flex items-center justify-between text-xs mt-1 text-teal-200">
                    <span className="bg-teal-800 px-2 py-0.5 rounded font-mono font-semibold text-[11px]">
                      ({user.vipTier})
                    </span>
                    <span className="font-mono font-bold text-emerald-300">
                      ${user.balance.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Navigation Links */}
            <div className="p-4 space-y-6 flex-1 text-slate-800 dark:text-slate-200">
              
              {/* MY ACCOUNT Section - ONLY visible when user is LOGGED IN */}
              {user.isLoggedIn && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    MY ACCOUNT
                  </p>
                  <div className="space-y-1">
                    {[
                      { id: 'home', label: 'Home', icon: Globe },
                      { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMenuDrawerOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition text-left cursor-pointer ${
                            activeTab === item.id
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          id={`drawer-link-${item.id}`}
                        >
                          <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setMenuDrawerOpen(false);
                        onOpenTopUp();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition text-left cursor-pointer"
                      id="drawer-add-balance"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-500" />
                      <span>Add Balance</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SERVICE LIST Section */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  SERVICE LIST
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('imei_services');
                      setMenuDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition text-left cursor-pointer ${
                      activeTab === 'imei_services'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    id="drawer-service-imei_services"
                  >
                    <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>IMEI/SN Service</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('server_services');
                      setMenuDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition text-left cursor-pointer ${
                      activeTab === 'server_services'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    id="drawer-service-server_services"
                  >
                    <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Server/Credit Service</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('tool_rent');
                      setMenuDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition text-left cursor-pointer ${
                      activeTab === 'tool_rent'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    id="drawer-service-tool_rent"
                  >
                    <Wrench className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Tool Rent</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      window.open('https://whatsapp.com/channel/0029VaKTKBAIN9iszzowbj1y', '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    id="drawer-service-service_group"
                  >
                    <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Service By Group</span>
                  </button>
                </div>
              </div>

              {/* Admin Tools for Admin users */}
              {user.isLoggedIn && user.isAdmin && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    ADMINISTRATOR
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setMenuDrawerOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition text-left cursor-pointer"
                      id="drawer-admin-panel"
                    >
                      <Settings className="w-4 h-4 text-amber-500" />
                      <span>Admin Control Panel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Guest Options: Show ONLY Login and Create Account buttons */}
              {!user.isLoggedIn && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold rounded-lg text-sm shadow transition text-center cursor-pointer"
                    id="drawer-guest-login"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMenuDrawerOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-sm transition text-center cursor-pointer border border-slate-300 dark:border-slate-700"
                    id="drawer-guest-create-account"
                  >
                    Create Account
                  </button>
                </div>
              )}

            </div>

            {/* Footer Logout Button for Logged-In User */}
            {user.isLoggedIn && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={() => {
                    onLogout();
                    setMenuDrawerOpen(false);
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
                  id="drawer-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

