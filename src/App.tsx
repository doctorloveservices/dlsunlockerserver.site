import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { HomeView } from './components/HomeView';
import { IMEIServicesView } from './components/IMEIServicesView';
import { ServerServicesView } from './components/ServerServicesView';
import { IMEICheckerView } from './components/IMEICheckerView';
import { OrderFormView } from './components/OrderFormView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { ResellerAPIView } from './components/ResellerAPIView';
import { SupportGuideView } from './components/SupportGuideView';
import { StatementView } from './components/StatementView';
import { InvoiceView } from './components/InvoiceView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AIDiagnosticsModal } from './components/AIDiagnosticsModal';
import { TopUpModal } from './components/TopUpModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { MaintenanceView } from './components/MaintenanceView';

import { 
  ALL_SERVICES, 
  INITIAL_ORDERS, 
  INITIAL_USER, 
  ANNOUNCEMENTS,
  INITIAL_STATEMENTS,
  INITIAL_INVOICES,
  INITIAL_SLIDES
} from './data/servicesData';
import { IMEIService, Order, UserProfile, Announcement, StatementItem, InvoiceItem, SlideItem, NotificationLogItem } from './types';
import { sendOrderEmailNotification, sendNewOrderNotification } from './utils/notificationService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Migration hook to restore products and data from localStorage
  React.useEffect(() => {
    const migrateData = async () => {
      let needsRestore = false;
      const dbUpdate: any = {};
      
      try {
        const savedServices = localStorage.getItem('dls_services');
        if (savedServices) {
          const parsed = JSON.parse(savedServices);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.services = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      try {
        const savedOrders = localStorage.getItem('dls_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.orders = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      try {
        const savedUsers = localStorage.getItem('dls_users_list');
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.users = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      try {
        const savedAnnouncements = localStorage.getItem('dls_announcements');
        if (savedAnnouncements) {
          const parsed = JSON.parse(savedAnnouncements);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dbUpdate.announcements = parsed;
            needsRestore = true;
          }
        }
      } catch (e) {}

      if (needsRestore) {
        try {
          const res = await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbUpdate)
          });
          if (res.ok) {
            // Remove them so we don't overwrite newer data on next reload
            localStorage.removeItem('dls_services');
            localStorage.removeItem('dls_orders');
            localStorage.removeItem('dls_users_list');
            localStorage.removeItem('dls_announcements');
            
            // Re-sync UI state
            if (dbUpdate.services) setServices(dbUpdate.services);
            if (dbUpdate.orders) setOrders(dbUpdate.orders);
            if (dbUpdate.announcements) setAnnouncements(dbUpdate.announcements);
          }
        } catch (err) {
          console.error("Migration failed", err);
        }
      }
    };

    migrateData();
  }, []);

  
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('dls_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [services, setServices] = useState<IMEIService[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [statements, setStatements] = useState<StatementItem[]>(INITIAL_STATEMENTS);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);

  const [slides, setSlides] = useState<SlideItem[]>([]);

  const [notificationLogs, setNotificationLogs] = useState<NotificationLogItem[]>([
    {
      id: 'notif-init-1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recipientEmail: 'admin@dlsunlockerserver.site',
      subject: 'Mock Email Dispatcher System Initialized',
      body: 'Email notification service online. Order status updates and completions will log directly to browser console and notification ledger.',
      status: 'sent',
    }
  ]);
  const [selectedService, setSelectedService] = useState<IMEIService | null>(null);

  // Website Maintenance Mode State
  const [websiteLive, setWebsiteLive] = useState<boolean>(true);

  // Sync website live status with backend globally across all devices
  React.useEffect(() => {
    const syncMaintenance = () => {
      fetch('/api/settings/maintenance')
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.websiteLive === 'boolean') {
              setWebsiteLive(data.websiteLive);
            }
            if (Array.isArray(data.orders)) {
              setOrders(data.orders);
            }
            if (Array.isArray(data.announcements)) {
              setAnnouncements(data.announcements);
            }
        })
        .catch(() => {});
    };

    syncMaintenance();
    const timer = setInterval(syncMaintenance, 3000);
    return () => clearInterval(timer);
  }, []);

  // Sync global services database with backend across all devices (Desktop & Mobile)
  React.useEffect(() => {
    const syncServices = () => {
      fetch('/api/db')
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            const data = resData.data;
            if (Array.isArray(data.services) && data.services.length > 0) {
              setServices(data.services);
            }
            if (typeof data.websiteLive === 'boolean') {
              setWebsiteLive(data.websiteLive);
            }
            if (Array.isArray(data.orders)) {
              setOrders(data.orders);
            }
            if (Array.isArray(data.announcements)) {
              setAnnouncements(data.announcements);
            }
          }
        })
        .catch(() => {});
    };

    syncServices();
    const timer = setInterval(syncServices, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMaintenanceMode = (newLive: boolean) => {
    setWebsiteLive(newLive);
    
    fetch('/api/settings/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteLive: newLive }),
    }).catch(() => {});
  };

  // Modals
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Page Navigation with Browser Back Button Support
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);

  const navigateToTab = (newTab: string) => {
    if (newTab !== activeTab) {
      window.history.pushState({ tab: newTab }, '', '');
      setTabHistory((prev) => [...prev, newTab]);
      setActiveTab(newTab);
    }
  };

  React.useEffect(() => {
    window.history.replaceState({ tab: 'home' }, '', '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setTabHistory((prev) => {
          if (prev.length > 1) {
            const updated = [...prev];
            updated.pop();
            const prevTab = updated[updated.length - 1];
            setActiveTab(prevTab);
            return updated;
          }
          return prev;
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-persist state changes to localStorage
  React.useEffect(() => {
    try {
      
    } catch (e) {
      console.error('Failed to save services to localStorage', e);
    }
  }, [services]);

  React.useEffect(() => {
    try {
      
    } catch (e) {
      console.error('Failed to save slides to localStorage', e);
    }
  }, [slides]);

  React.useEffect(() => {
    try {
      
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  React.useEffect(() => {
    try {
      
    } catch (e) {
      console.error('Failed to save announcements to localStorage', e);
    }
  }, [announcements]);

  React.useEffect(() => {
    try {
      
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  const handleSaveAllChanges = (updatedServices?: IMEIService[], updatedSlides?: SlideItem[]) => {
    // Individual endpoints are used for saving changes now to prevent stale state overwrites.
    // This is kept for compatibility with components expecting it.
  };

  const handleAddCredits = (amount: number) => {
    const newBalance = user.balance + amount;
    setUser((prev) => ({
      ...prev,
      balance: newBalance,
    }));

    // Add Statement Ledger Entry
    const newStatement: StatementItem = {
      id: `stmt-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'deposit',
      description: `Automated Account Balance Top-Up`,
      amount: amount,
      balanceAfter: newBalance,
      referenceId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setStatements((prev) => [newStatement, ...prev]);

    // Add Invoice Entry
    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().substring(0, 10),
      userEmail: user.email,
      userName: user.fullName || user.username,
      serviceName: `Account Balance Top-up ${amount} USD`,
      amount: amount,
      status: 'PAID',
      paymentMethod: 'Instant Crypto/Gateway',
      txHash: newStatement.referenceId,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const handleSubmitOrder = (newOrders: Order[]) => {
    setOrders((prev) => [...newOrders, ...prev]);

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newOrders }),
    }).catch(() => {});

    // Calculate total cost
    const totalCost = newOrders.reduce((sum, o) => sum + o.cost, 0);
    const newBalance = Math.max(0, user.balance - totalCost);

    setUser((prev) => ({
      ...prev,
      balance: newBalance,
      totalOrders: prev.totalOrders + newOrders.length,
      completedOrders: prev.completedOrders + newOrders.filter(o => o.status === 'completed').length,
      totalSpent: prev.totalSpent + totalCost,
    }));

    // Add Statement & Invoice & Notification for each submitted order
    newOrders.forEach((o) => {
      const stmt: StatementItem = {
        id: `stmt-${o.id}`,
        date: o.submittedAt,
        type: 'order_charge',
        description: `Order #${o.orderNumber}: ${o.serviceName}`,
        amount: -o.cost,
        balanceAfter: newBalance,
        referenceId: o.orderNumber,
      };

      const inv: InvoiceItem = {
        id: `inv-${o.id}`,
        invoiceNumber: `INV-2026-${o.orderNumber.replace('DLS-', '')}`,
        date: o.submittedAt.substring(0, 10),
        userEmail: user.email,
        userName: user.fullName || user.username,
        serviceName: o.serviceName,
        amount: o.cost,
        status: 'PAID',
        paymentMethod: 'Account Credits',
        txHash: o.orderNumber,
      };

      setStatements((prev) => [stmt, ...prev]);
      setInvoices((prev) => [inv, ...prev]);

      // Mock Email Notification
      const notifLog = sendNewOrderNotification(o, user.email || 'customer@dlsunlockerserver.site');
      setNotificationLogs((prev) => [notifLog, ...prev]);
    });
  };

  const handleAddService = (newService: IMEIService) => {
    setServices((prev) => [newService, ...prev]);
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: newService }),
    }).catch(() => {});
  };

  const handleUpdateService = (updatedService: IMEIService) => {
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: updatedService }),
    }).catch(() => {});
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', serviceId }),
    }).catch(() => {});
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], code?: string) => {
    let updatedOrder: Order | null = null;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          updatedOrder = {
            ...o,
            status,
            code: code || o.code,
            completedAt: status === 'completed' ? new Date().toISOString().substring(0, 19) : o.completedAt,
          };
          
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: updatedOrder }),
          }).catch(() => {});

          return updatedOrder;
        }
        return o;
      })
    );

    // Mock Email Notification Trigger & Console Log
    setTimeout(() => {
      const target = updatedOrder || orders.find((o) => o.id === orderId);
      if (target) {
        const notifLog = sendOrderEmailNotification(
          target,
          user.email || 'customer@dlsunlockerserver.site',
          status,
          code
        );
        setNotificationLogs((prev) => [notifLog, ...prev]);
      }
    }, 50);
  };

  const handleClearNotificationLogs = () => {
    setNotificationLogs([]);
  };

  const handleSendCustomNotification = (email: string, subject: string, body: string) => {
    console.log(
      `%c[EMAIL NOTIFICATION SERVICE]%c Outbound Manual Dispatch -> %c${email}%c\nSubject: "${subject}"\nBody:\n${body}`,
      'background: #0d9488; color: #ffffff; font-weight: bold; padding: 2px 6px; rounded: 4px;',
      'color: #94a3b8;',
      'color: #38bdf8; font-weight: bold;',
      'color: #e2e8f0;'
    );
    const newLog: NotificationLogItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recipientEmail: email,
      subject,
      body,
      status: 'sent',
    };
    setNotificationLogs((prev) => [newLog, ...prev]);
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
    fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcement: newAnn }),
    }).catch(() => {});
  };

  const handleUpdateUserBalance = (newBalance: number) => {
    setUser((prev) => ({ ...prev, balance: newBalance }));
  };

  const handleDeductCredits = (amount: number) => {
    const newBalance = Math.max(0, user.balance - amount);
    setUser((prev) => ({ ...prev, balance: newBalance }));
    const stmt: StatementItem = {
      id: `stmt-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'order_charge',
      description: `[ADMIN DEDUCTION] Administrator Balance Adjustment`,
      amount: -amount,
      balanceAfter: newBalance,
      referenceId: `ADMIN-DEDUCT-${Date.now().toString().slice(-6)}`,
    };
    setStatements((prev) => [stmt, ...prev]);
  };

  const handleLockCredits = (amount: number) => {
    const lockAmt = Math.min(user.balance, amount);
    const newBalance = Math.max(0, user.balance - lockAmt);
    const newLocked = (user.lockedBalance || 0) + lockAmt;
    setUser((prev) => ({ ...prev, balance: newBalance, lockedBalance: newLocked }));
    const stmt: StatementItem = {
      id: `stmt-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'order_charge',
      description: `[ADMIN LOCK] Locked ${lockAmt.toFixed(2)} USD from Available Balance`,
      amount: -lockAmt,
      balanceAfter: newBalance,
      referenceId: `ADMIN-LOCK-${Date.now().toString().slice(-6)}`,
    };
    setStatements((prev) => [stmt, ...prev]);
  };

  const handleUnlockCredits = (amount: number) => {
    const unlockAmt = Math.min(user.lockedBalance || 0, amount);
    const newLocked = Math.max(0, (user.lockedBalance || 0) - unlockAmt);
    const newBalance = user.balance + unlockAmt;
    setUser((prev) => ({ ...prev, balance: newBalance, lockedBalance: newLocked }));
    const stmt: StatementItem = {
      id: `stmt-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'deposit',
      description: `[ADMIN UNLOCK] Unlocked ${unlockAmt.toFixed(2)} USD to Available Balance`,
      amount: unlockAmt,
      balanceAfter: newBalance,
      referenceId: `ADMIN-UNLOCK-${Date.now().toString().slice(-6)}`,
    };
    setStatements((prev) => [stmt, ...prev]);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    if (user && user.email.toLowerCase() === updatedUser.email.toLowerCase()) {
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
        userLevel: updatedUser.userLevel || 'customer',
        role: updatedUser.userLevel || updatedUser.role || 'customer',
        vipTier: updatedUser.vipTier || 'Customer',
      }));
    }
  };

  const handleLoginUser = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
      userLevel: updatedUser.userLevel || 'customer',
      role: updatedUser.userLevel || 'customer',
      vipTier: updatedUser.vipTier || 'Customer',
      isLoggedIn: true,
    }));

    if (updatedUser.isAdmin) {
      setIsAdminMode(true);
    }
  };

  const handleLogoutUser = () => {
    setUser(INITIAL_USER);
    setIsAdminMode(false);
    try {
      
    } catch (e) {
      console.error(e);
    }
  };

  // Enforce Maintenance Mode for normal users
  if (!websiteLive && !(user.isLoggedIn && user.isAdmin)) {
    return (
      <MaintenanceView
        onAdminLogin={(adminUserData) => {
          handleLoginUser(adminUserData as UserProfile);
        }}
        adminWhatsAppNumber="258869726969"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors">
      {/* Sticky Maintenance Notice Banner for Admin */}
      {!websiteLive && user.isLoggedIn && user.isAdmin && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between gap-2 shadow-md z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping shrink-0" />
            <span>⚠️ MAINTENANCE MODE ACTIVE — Website is locked for normal users ("Website is Maintenance — Coming Soon"). You are browsing with Administrator access.</span>
          </div>
          <button
            onClick={() => handleToggleMaintenanceMode(true)}
            className="bg-slate-950 text-amber-400 hover:bg-slate-900 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition shrink-0"
          >
            Turn Normal Operation ON
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          setIsAdminMode(true);
        }}
        onOpenAIDiagnostic={() => setIsAIOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogoutUser}
        isAdminMode={isAdminMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(activeTab === 'home' || !activeTab) && (
          <HomeView
            user={user}
            services={services}
            slides={slides}
            announcements={announcements}
            setActiveTab={navigateToTab}
            onSelectService={(srv) => {
              setSelectedService(srv);
              if (!user.isLoggedIn) {
                setIsAuthOpen(true);
              } else {
                navigateToTab('place_order');
              }
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSliderManager={() => setIsAdminOpen(true)}
            isAdminMode={isAdminMode}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            services={services}
            orders={orders}
            slides={slides}
            statements={statements}
            invoices={invoices}
            setActiveTab={navigateToTab}
            onSelectService={(srv) => setSelectedService(srv)}
            onOpenAIDiagnostic={() => setIsAIOpen(true)}
            onOpenSliderManager={() => setIsAdminOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          />
        )}

        {(activeTab === 'imei_services' || activeTab === 'tool_rent' || activeTab === 'service_group') && (
          <IMEIServicesView
            services={
              activeTab === 'tool_rent'
                ? services.filter((s) => s.category === 'tool_rent' || s.serviceTypeGroup === 'Tool Rent' || s.type === 'tool_rent' || s.serviceTypeGroup === '🔰 Tool Rent')
                : activeTab === 'service_group'
                ? services.filter((s) => s.category === 'service_group' || s.serviceTypeGroup === 'Service Group' || s.type === 'file' || s.serviceTypeGroup === '💥 Service By Group')
                : services.filter((s) => s.type === 'imei' || s.category === 'imei_sn' || s.category === 'imei' || s.serviceTypeGroup === 'IMEI/SN' || s.serviceTypeGroup === '🌐 IMEI/SN Service' || (!s.type && s.category !== 'server' && s.category !== 'tool_rent' && s.category !== 'service_group'))
            }
            user={user}
            showSearch={true}
            searchPlaceholder={
              activeTab === 'tool_rent' ? 'Search Tool Rent products...' : activeTab === 'service_group' ? 'Search Service By Group products...' : 'Search IMEI/SN Service products...'
            }
            onSelectService={(srv) => {
              setSelectedService(srv);
              if (!user.isLoggedIn) {
                setIsAuthOpen(true);
              } else {
                navigateToTab('place_order');
              }
            }}
            setActiveTab={navigateToTab}
          />
        )}

        {activeTab === 'server_services' && (
          <ServerServicesView
            services={services}
            user={user}
            onSelectService={(srv) => {
              setSelectedService(srv);
              if (!user.isLoggedIn) {
                setIsAuthOpen(true);
              } else {
                navigateToTab('place_order');
              }
            }}
            setActiveTab={navigateToTab}
          />
        )}

        {activeTab === 'checker' && (
          <IMEICheckerView
            services={services}
            user={user}
            onSelectService={(srv) => {
              setSelectedService(srv);
              if (!user.isLoggedIn) {
                setIsAuthOpen(true);
              } else {
                navigateToTab('place_order');
              }
            }}
            setActiveTab={navigateToTab}
            onOpenAIDiagnostic={() => setIsAIOpen(true)}
          />
        )}

        {activeTab === 'place_order' && (
          !user.isLoggedIn ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto my-12 shadow-md">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Account Login Required
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please log in or create an account to place server unlock orders and manage transactions.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow transition cursor-pointer"
              >
                Login / Create Account
              </button>
            </div>
          ) : (
            <OrderFormView
              services={services}
              user={user}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              onSubmitOrder={handleSubmitOrder}
              onOpenTopUp={() => setIsTopUpOpen(true)}
              setActiveTab={navigateToTab}
              onDeductBalance={(amt) => handleDeductCredits(amt)}
            />
          )
        )}

        {activeTab === 'api_docs' && <ResellerAPIView user={user} />}

        {activeTab === 'support' && <SupportGuideView />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={handleLoginUser}
        onLogout={handleLogoutUser}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onAddCredits={handleAddCredits}
        onDeductCredits={handleDeductCredits}
        onLockCredits={handleLockCredits}
        onUnlockCredits={handleUnlockCredits}
        user={user}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        services={services}
        orders={orders}
        user={user}
        notificationLogs={notificationLogs}
        slides={slides}
        websiteLive={websiteLive}
        onToggleMaintenanceMode={handleToggleMaintenanceMode}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddAnnouncement={handleAddAnnouncement}
        onUpdateUserBalance={handleUpdateUserBalance}
        onUpdateUser={handleUpdateUser}
        onDeductCredits={handleDeductCredits}
        onLockCredits={handleLockCredits}
        onUnlockCredits={handleUnlockCredits}
        onClearNotificationLogs={handleClearNotificationLogs}
        onSendCustomNotification={handleSendCustomNotification}
        onSaveSlides={setSlides}
        onSaveAllChanges={handleSaveAllChanges}
      />

      <AIDiagnosticsModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        services={services}
        onSelectService={(srv) => setSelectedService(srv)}
        setActiveTab={setActiveTab}
      />

      {/* Floating WhatsApp Button (+258 869 726 969) */}
      <a
        href="https://wa.me/258869726969"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/20"
        title="Chat with Administrator on WhatsApp (+258 869 726 969)"
        id="floating-whatsapp-btn"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </div>
  );
}

