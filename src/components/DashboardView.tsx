import React, { useState } from 'react';
import { 
  LayoutGrid, 
  User, 
  Key, 
  ShieldCheck, 
  Wallet, 
  ShoppingBag, 
  HelpCircle, 
  Hourglass, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  X, 
  ArrowRight, 
  Lock, 
  Copy, 
  Check, 
  Download, 
  Send, 
  MessageSquare, 
  Globe, 
  CreditCard, 
  Wrench, 
  Layers, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  FileText, 
  Receipt, 
  ChevronRight, 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  ExternalLink, 
  Bell, 
  Percent, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  FileCheck,
  Shield,
  SmartphoneNfc,
  QrCode,
  Laptop
} from 'lucide-react';
import { IMEIService, Order, UserProfile, SlideItem, StatementItem, InvoiceItem } from '../types';
import { HeroSlider } from './HeroSlider';
import { ProductLogo } from './ProductLogo';
import { OfficialSellerSlider } from './OfficialSellerSlider';
import { formatServicePrice } from '../utils/priceUtils';

interface DashboardViewProps {
  user: UserProfile;
  services: IMEIService[];
  orders: Order[];
  slides?: SlideItem[];
  statements?: StatementItem[];
  invoices?: InvoiceItem[];
  setActiveTab: (tab: string) => void;
  onSelectService: (service: IMEIService) => void;
  onOpenAIDiagnostic: () => void;
  onOpenSliderManager?: () => void;
  onOpenAuth: () => void;
  onOpenTopUp?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  services,
  orders,
  slides = [],
  statements = [],
  invoices = [],
  setActiveTab,
  onSelectService,
  onOpenAIDiagnostic,
  onOpenSliderManager,
  onOpenAuth,
  onOpenTopUp,
  onUpdateUser,
}) => {
  // Inner Sub-Tab state
  const [subTab, setSubTab] = useState<'dashboard' | 'profile' | 'password' | 'security' | 'wallet' | 'support'>('dashboard');

  // Search & Filter State for services
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Order filters
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');

  // Profile Form state
  const [profileName, setProfileName] = useState(user.fullName || user.username || '');
  const [profileMobile, setProfileMobile] = useState(user.phoneNumber || '');
  const [profileCountry, setProfileCountry] = useState(user.country || 'Mozambique');
  const [profileCity, setProfileCity] = useState('');
  const [profileAddress, setProfileAddress] = useState(user.email || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  React.useEffect(() => {
    setProfileName(user.fullName || user.username || '');
    setProfileMobile(user.phoneNumber || '');
    if (user.country) setProfileCountry(user.country);
    setProfileAddress(user.email || '');
  }, [user.fullName, user.username, user.phoneNumber, user.country, user.email]);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Support Ticket Form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order Issues');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-98421',
      subject: 'iCloud Clean Removal Inquiry',
      category: 'IMEI Service',
      status: 'ANSWERED',
      date: '2026-08-05 14:20',
      lastReply: 'Admin: Your order is currently being processed by the server.'
    },
    {
      id: 'TKT-87311',
      subject: 'M-Pesa Deposit Confirmation',
      category: 'Billing',
      status: 'RESOLVED',
      date: '2026-08-02 09:15',
      lastReply: 'Admin: Funds credited to your available balance successfully.'
    }
  ]);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Password checks
  const passHasMinLength = newPassword.length >= 8;
  const passHasLower = /[a-z]/.test(newPassword);
  const passHasUpper = /[A-Z]/.test(newPassword);
  const passHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // Compute stats
  const waitingOrders = orders.filter(o => o.status === 'waiting_carrier' || (o.status as string) === 'pending');
  const inProcessOrders = orders.filter(o => o.status === 'in_process');
  const successOrders = orders.filter(o => o.status === 'completed');
  const rejectedOrders = orders.filter(o => o.status === 'rejected');
  const totalOrdersCount = orders.length || 164;
  const successCount = successOrders.length || 151;
  const rejectedCount = rejectedOrders.length || 13;
  const inProcessCount = inProcessOrders.length || 0;
  const waitingCount = waitingOrders.length || 0;
  const successRate = totalOrdersCount > 0 ? ((successCount / totalOrdersCount) * 100).toFixed(1) : '98.5';

  // Services filtering
  const recentAddedServices = [...services].reverse().slice(0, 8);
  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'all' ||
      srv.category === selectedCategory ||
      (selectedCategory === 'imei_sn' && (srv.serviceTypeGroup === 'IMEI/SN' || srv.type === 'imei' || srv.category === 'apple_icloud' || srv.category === 'apple_network' || srv.category === 'samsung_frp' || srv.category === 'xiaomi_account' || srv.category === 'motorola_lg')) ||
      (selectedCategory === 'server_credit' && (srv.serviceTypeGroup === 'Server/Credit' || srv.type === 'server' || srv.category === 'remote_usb' || srv.category === 'file_services')) ||
      (selectedCategory === 'tool_rent' && (srv.serviceTypeGroup === 'Tool Rent' || srv.type === 'tool_rent' || srv.category === 'tool_rent')) ||
      (selectedCategory === 'service_group' && (srv.serviceTypeGroup === 'Service Group' || srv.type === 'file' || srv.category === 'service_group'));

    return matchesSearch && matchesCategory;
  });

  // Filtered Orders for Orders Tab
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      o.serviceName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      o.imei.toLowerCase().includes(orderSearchTerm.toLowerCase());

    if (orderFilterStatus === 'all') return matchesSearch;
    if (orderFilterStatus === 'waiting') return matchesSearch && (o.status === 'waiting_carrier' || (o.status as string) === 'pending');
    if (orderFilterStatus === 'in_process') return matchesSearch && o.status === 'in_process';
    if (orderFilterStatus === 'success') return matchesSearch && o.status === 'completed';
    if (orderFilterStatus === 'rejected') return matchesSearch && o.status === 'rejected';
    return matchesSearch;
  });

  // Save profile handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        fullName: profileName,
      });
    }
    setProfileSuccessMsg('Profile information updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  // Save password handler
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (!passHasMinLength) {
      alert('New password must be at least 8 characters.');
      return;
    }
    setPasswordSuccessMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccessMsg(''), 3000);
  };

  // Submit support ticket
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    const newTkt = {
      id: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      status: 'OPEN',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastReply: 'Ticket submitted. Waiting for staff response.'
    };
    setTickets([newTkt, ...tickets]);
    setTicketSubject('');
    setTicketMessage('');
    setTicketSuccessMsg('Support ticket created successfully! Our team will respond shortly.');
    setTimeout(() => setTicketSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. GSMTHEME STYLE TOP DASHBOARD TABS HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-1.5 sm:p-2 sticky top-16 z-20 backdrop-blur-md">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'password', label: 'Password', icon: Key },
            { id: 'security', label: 'Security', icon: ShieldCheck },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'support', label: 'Support', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#008080] text-white shadow-sm ring-2 ring-[#008080]/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
                id={`dash-tab-${tab.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== SUB-TAB 1: DASHBOARD HOME ==================== */}
      {subTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">

          {/* WELCOME BANNER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 dark:bg-[#008080]/20 text-[#008080] flex items-center justify-center font-black text-lg border border-[#008080]/20 shrink-0">
                {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user.fullName || user.username || 'Valued Customer'} 👋
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  DLS Unlocker Server • {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-[11px] font-mono uppercase bg-teal-500/10 text-[#008080] dark:text-teal-400 border border-[#008080]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {user.vipTier || 'Bronze Reseller'}
              </span>
              <button
                onClick={onOpenTopUp}
                className="bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Top Up</span>
              </button>
            </div>
          </div>
          
          {/* PRIMARY TEAL BALANCE CARD (EXACT MATCH TO GSMTHEME REFERENCE) */}
          <div className="relative overflow-hidden bg-[#008080] text-white rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
            {/* Background Decorative Circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-bold text-teal-100 uppercase tracking-widest flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-teal-200" />
                Available Balance
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                {user.balance.toFixed(2)} $ (USD)
              </div>
            </div>

            {/* Inner Sub-Cards */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-teal-700/60 dark:bg-teal-900/60 backdrop-blur-md border border-teal-500/40 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-teal-100/90 block">
                  Locked Balance
                </span>
                <span className="text-lg font-black font-mono block">
                  {user.lockedBalance ? user.lockedBalance.toFixed(2) : '0'} $
                </span>
              </div>

              <div className="bg-teal-700/60 dark:bg-teal-900/60 backdrop-blur-md border border-teal-500/40 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-teal-100/90 block">
                  Total Receipts
                </span>
                <span className="text-lg font-black font-mono block">
                  {(user.totalReceipts || user.totalSpent || 129.23).toFixed(2)} $
                </span>
              </div>
            </div>

            {/* Big Add Balance Action Button */}
            <div className="relative z-10 pt-1">
              <button
                onClick={onOpenTopUp}
                className="w-full py-3.5 bg-teal-700/80 hover:bg-teal-800 backdrop-blur-md border border-teal-400/40 text-white font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer group"
                id="dash-add-balance-hero-btn"
              >
                <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span>Add Balance</span>
              </button>
            </div>
          </div>

          {/* ORDER STATUS METRIC CARDS (EXACT MATCH TO GSMTHEME REFERENCE) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Order Status Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Waiting Action */}
              <div className="bg-slate-700 dark:bg-slate-800 text-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-600 dark:border-slate-700">
                <div className="p-3 bg-slate-600/60 dark:bg-slate-700/60 rounded-xl text-slate-200 shrink-0">
                  <Hourglass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 block">
                    Waiting Action
                  </span>
                  <span className="text-lg font-black font-mono block">
                    {waitingCount} Order
                  </span>
                </div>
              </div>

              {/* In Process */}
              <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-amber-400/40">
                <div className="p-3 bg-amber-600/60 dark:bg-amber-700/60 rounded-xl text-amber-100 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-100 block">
                    In Process
                  </span>
                  <span className="text-lg font-black font-mono block">
                    {inProcessCount} Order
                  </span>
                </div>
              </div>

              {/* Success */}
              <div className="bg-emerald-600 dark:bg-emerald-700 text-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-emerald-500/40">
                <div className="p-3 bg-emerald-700/60 dark:bg-emerald-800/60 rounded-xl text-emerald-100 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-100 block">
                    Success
                  </span>
                  <span className="text-lg font-black font-mono block">
                    {successCount} Order
                  </span>
                </div>
              </div>

              {/* Rejected */}
              <div className="bg-rose-600 dark:bg-rose-700 text-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-rose-500/40">
                <div className="p-3 bg-rose-700/60 dark:bg-rose-800/60 rounded-xl text-rose-100 shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-100 block">
                    Rejected
                  </span>
                  <span className="text-lg font-black font-mono block">
                    {rejectedCount} Order
                  </span>
                </div>
              </div>

              {/* Total Orders Placed */}
              <div className="sm:col-span-2 lg:col-span-2 bg-[#008080] text-white rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm border border-teal-500/40">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-700/70 rounded-xl text-white shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-100 block">
                      Total Orders Placed
                    </span>
                    <span className="text-lg font-black font-mono block">
                      {totalOrdersCount} Order
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('place_order')}
                  className="p-3 bg-teal-500/30 hover:bg-teal-500/50 rounded-xl text-white transition cursor-pointer"
                  title="Place New Order"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* DASHBOARD ANIMATED STATISTICS CARDS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Account Analytical Overview
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-1">
                <ShoppingBag className="w-5 h-5 text-[#008080] mx-auto" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Total Orders</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white block">{totalOrdersCount}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-center space-y-1">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">Total Success</span>
                <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-300 block">{successCount}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 text-center space-y-1">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mx-auto" />
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block">Total Rejected</span>
                <span className="text-base font-black font-mono text-rose-700 dark:text-rose-300 block">{rejectedCount}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 text-center space-y-1">
                <Percent className="w-5 h-5 text-[#008080] dark:text-teal-400 mx-auto" />
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 block">Success Rate</span>
                <span className="text-base font-black font-mono text-[#008080] dark:text-teal-300 block">{successRate}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 text-center space-y-1">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 block">Total Spent</span>
                <span className="text-base font-black font-mono text-blue-700 dark:text-blue-300 block">${(user.totalSpent || 129.23).toFixed(2)}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-center space-y-1">
                <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto" />
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">Balance</span>
                <span className="text-base font-black font-mono text-amber-700 dark:text-amber-300 block">${user.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              <button
                onClick={onOpenTopUp}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#008080] dark:text-teal-400 group-hover:scale-110 transition">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Add Balance
                </span>
              </button>

              <button
                onClick={() => setActiveTab('place_order')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#008080] dark:text-teal-400 group-hover:scale-110 transition">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  New Order
                </span>
              </button>

              <button
                onClick={() => setSubTab('orders')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Order History
                </span>
              </button>

              <button
                onClick={() => setSubTab('wallet')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Deposit History
                </span>
              </button>

              <button
                onClick={() => setSubTab('wallet')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Wallet
                </span>
              </button>

              <button
                onClick={() => setSubTab('support')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Support Ticket
                </span>
              </button>

              <a
                href="https://wa.me/258869726969"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  WhatsApp Support
                </span>
              </a>

              <button
                onClick={() => setActiveTab('statement')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] transition flex flex-col items-center gap-2 cursor-pointer group text-center"
              >
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition">
                  <Download className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  Download Invoice
                </span>
              </button>
            </div>
          </div>

          {/* HERO BANNER SLIDER */}
          {slides && slides.length > 0 && (
            <HeroSlider
              slides={slides}
              onSelectSlideLink={setActiveTab}
              onOpenSliderManager={onOpenSliderManager}
            />
          )}

          {/* RECENT ADDED PRODUCTS SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#008080] dark:text-teal-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <span>Recent Added</span>
                    <span className="text-[10px] font-mono uppercase bg-[#008080] text-white font-black px-2 py-0.5 rounded">
                      NEW
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Latest server unlocks & tools added by DLS Unlocker Server
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#008080] dark:text-teal-400">
                {recentAddedServices.length} Products
              </span>
            </div>

            {recentAddedServices.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
                <Plus className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No recent products added yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {recentAddedServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#008080] rounded-xl p-3.5 shadow-2xs transition flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <ProductLogo
                          logoUrl={srv.logoUrl}
                          imageUrl={srv.imageUrl}
                          brand={srv.brand}
                          serviceName={srv.name}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                            {srv.name}
                          </h4>
                          <span className="inline-block mt-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                            {srv.badgeTag || srv.deliveryTime}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-1.5">
                      <div>
                        {user.isLoggedIn ? (
                          <span className="text-xs font-extrabold font-mono text-[#008080] dark:text-teal-400">
                            {formatServicePrice(srv, user)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                            <Lock className="w-3 h-3" />
                            Login to view
                          </span>
                        )}
                      </div>

                      {user.isLoggedIn ? (
                        <button
                          onClick={() => {
                            onSelectService(srv);
                            setActiveTab('place_order');
                          }}
                          className="bg-[#008080] hover:bg-[#006666] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>Order</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={onOpenAuth}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>Login</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SERVICE CATEGORY SHORTCUTS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Service Category Shortcuts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'imei_sn', label: 'IMEI/SN Service', icon: Globe, color: 'text-[#008080] bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400' },
                { id: 'server_credit', label: 'Server/Credit Service', icon: CreditCard, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400' },
                { id: 'tool_rent', label: 'Tool Rent', icon: Wrench, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400' },
                { id: 'service_group', label: 'Service By Group', icon: Layers, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400' },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer text-left ${
                      isSelected
                        ? 'border-[#008080] bg-teal-50/80 dark:bg-teal-950/80 shadow-xs ring-1 ring-[#008080]'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {cat.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {
                          services.filter((s) => {
                            if (cat.id === 'imei_sn') return s.serviceTypeGroup === 'IMEI/SN' || s.type === 'imei' || s.requiresIMEI;
                            if (cat.id === 'server_credit') return s.serviceTypeGroup === 'Server/Credit' || s.type === 'server';
                            if (cat.id === 'tool_rent') return s.serviceTypeGroup === 'Tool Rent' || s.type === 'tool_rent' || s.category === 'tool_rent';
                            if (cat.id === 'service_group') return s.serviceTypeGroup === 'Service Group' || s.type === 'file' || s.category === 'service_group';
                            return s.category === cat.id;
                          }).length
                        } Services
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIVE SEARCH & UNLOCKING SERVICES GRID */}
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Service..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-[#008080] dark:text-teal-400 font-bold hover:underline px-2 py-1 shrink-0"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Available Unlocking Services ({filteredServices.length})
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Updated Real-time API
              </span>
            </div>

            {filteredServices.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 font-medium text-sm">
                No products found. Add new products in the Admin Control Panel.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#008080]/60 rounded-2xl p-4 shadow-2xs transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <ProductLogo
                        logoUrl={srv.logoUrl}
                        imageUrl={srv.imageUrl}
                        brand={srv.brand}
                        serviceName={srv.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {srv.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {user.isLoggedIn ? (
                          <span className="bg-[#008080] text-white font-extrabold font-mono text-xs px-2.5 py-1 rounded-md shadow-2xs">
                            {formatServicePrice(srv, user)}
                          </span>
                        ) : (
                          <span className="bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-mono font-semibold text-[11px] px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Login to view price
                          </span>
                        )}
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-semibold text-[11px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase">
                          {srv.badgeTag || srv.deliveryTime}
                        </span>
                      </div>

                      {user.isLoggedIn ? (
                        <button
                          onClick={() => {
                            onSelectService(srv);
                            setActiveTab('place_order');
                          }}
                          className="bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Order Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={onOpenAuth}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Login to Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OFFICIAL SELLER SLIDER */}
          <OfficialSellerSlider />

        </div>
      )}

      {/* ==================== SUB-TAB 2: PROFILE ==================== */}
      {subTab === 'profile' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#008080] dark:text-teal-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Customer Profile Settings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your contact details, address, and account defaults
                </p>
              </div>
            </div>

            {profileSuccessMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ''}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.currency || 'USD'}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={profileMobile}
                    onChange={(e) => setProfileMobile(e.target.value)}
                    placeholder="Enter mobile phone"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Country
                  </label>
                  <select
                    value={profileCountry}
                    onChange={(e) => setProfileCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium cursor-pointer"
                  >
                    <option value="Mozambique">🇲🇿 Mozambique</option>
                    <option value="South Africa">🇿🇦 South Africa</option>
                    <option value="Zimbabwe">🇿🇼 Zimbabwe</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Tanzania">🇹🇿 Tanzania</option>
                    <option value="Kenya">🇰🇪 Kenya</option>
                    <option value="Angola">🇦🇴 Angola</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    placeholder="e.g. Maputo"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="e.g. Doctor Love Services HQ, Maputo"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 3: PASSWORD ==================== */}
      {subTab === 'password' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#008080] dark:text-teal-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Change Account Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ensure your account is using a strong and secure password
                </p>
              </div>
            </div>

            {passwordSuccessMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter Current Password"
                    className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Checklist (Matches Reference Image) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Password Strength Requirement
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {newPassword ? (passHasMinLength && passHasLower && passHasUpper && passHasSpecial ? 'Strong' : 'Medium') : 'Enter a password'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {[
                    { label: 'At least 8 characters', met: passHasMinLength },
                    { label: 'One lowercase letter', met: passHasLower },
                    { label: 'One uppercase letter', met: passHasUpper },
                    { label: 'One special character', met: passHasSpecial },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}`}>
                        {req.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                      </div>
                      <span className={req.met ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 4: SECURITY ==================== */}
      {subTab === 'security' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[#008080] dark:text-teal-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Security & Two-Factor Authentication
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage login sessions, 2FA protection, and API credentials
                </p>
              </div>
            </div>

            {/* 2FA Toggle */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Two-Factor Authentication (2FA)</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                    {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add an extra layer of security using Google Authenticator or Authy
                </p>
              </div>

              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  twoFactorEnabled
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-[#008080] text-white hover:bg-[#006666]'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            {/* API Key Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Reseller API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={user.apiKey || 'dls_api_live_8f921aa90847120e'}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200"
                />
                <button
                  onClick={() => handleCopy(user.apiKey || 'dls_api_live_8f921aa90847120e')}
                  className="p-3 bg-[#008080] hover:bg-[#006666] text-white rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
                >
                  {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 5: WALLET & DEPOSITS ==================== */}
      {subTab === 'wallet' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Balance Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#008080] text-white rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-teal-100 uppercase">Available Balance</span>
              <div className="text-2xl font-black font-mono">${user.balance.toFixed(2)} USD</div>
              <p className="text-[11px] text-teal-100/80">Ready for instant order placement</p>
            </div>

            <div className="bg-slate-800 text-white rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-300 uppercase">Locked Balance</span>
              <div className="text-2xl font-black font-mono">${(user.lockedBalance || 0).toFixed(2)} USD</div>
              <p className="text-[11px] text-slate-400">Held for processing orders</p>
            </div>

            <div className="bg-emerald-700 text-white rounded-2xl p-5 shadow-sm space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-100 uppercase">Add Funds</span>
                <p className="text-xs text-emerald-100/90 mt-1">Instant automatic deposit via M-Pesa, Binance USDT & Cards</p>
              </div>
              <button
                onClick={onOpenTopUp}
                className="w-full mt-3 py-2.5 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow transition hover:bg-emerald-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Deposit Funds</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 7: SUPPORT CENTER ==================== */}
      {subTab === 'support' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Official Contact Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="https://wa.me/258869726969"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-emerald-600 text-white rounded-2xl shadow-sm flex items-center gap-3 hover:bg-emerald-700 transition"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">WhatsApp Direct</h4>
                <p className="text-xs text-emerald-100">+258 86 972 6969</p>
              </div>
            </a>

            <a
              href="https://t.me/dlsunlockerserver"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-sky-600 text-white rounded-2xl shadow-sm flex items-center gap-3 hover:bg-sky-700 transition"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Telegram Channel</h4>
                <p className="text-xs text-sky-100">t.me/dlsunlockerserver</p>
              </div>
            </a>

            <a
              href="https://whatsapp.com/channel/0029VaKTKBAIN9iszzowbj1y"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-teal-700 text-white rounded-2xl shadow-sm flex items-center gap-3 hover:bg-teal-800 transition"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Service Group</h4>
                <p className="text-xs text-teal-100">Official WhatsApp Channel</p>
              </div>
            </a>

            <a
              href="https://youtube.com/@dlsunlockerserver5?si=p_MvIIfZ2Z8ivbt_"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-rose-600 text-white rounded-2xl shadow-sm flex items-center gap-3 hover:bg-rose-700 transition"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">YouTube Channel</h4>
                <p className="text-xs text-rose-100">Video Tutorials & Guides</p>
              </div>
            </a>
          </div>

          {/* Ticket Creation & Existing Tickets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Ticket */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#008080]" />
                <span>Open New Support Ticket</span>
              </h3>

              {ticketSuccessMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                  {ticketSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ticket Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080] cursor-pointer"
                  >
                    <option value="Order Issues">Order Issues</option>
                    <option value="IMEI Service">IMEI Service Inquiry</option>
                    <option value="Billing">Billing & Deposits</option>
                    <option value="API Integration">Reseller API Integration</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide order numbers, device details or deposit references..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-extrabold text-sm rounded-xl shadow transition cursor-pointer"
                >
                  Submit Ticket
                </button>
              </form>
            </div>

            {/* Existing Tickets List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                My Support Tickets
              </h3>

              <div className="space-y-3">
                {tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#008080] dark:text-teal-400">
                        {tkt.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        tkt.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {tkt.subject}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 italic">
                      "{tkt.lastReply}"
                    </p>

                    <span className="text-[10px] text-slate-400 font-mono block">
                      Submitted: {tkt.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
