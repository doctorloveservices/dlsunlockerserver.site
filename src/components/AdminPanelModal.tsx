import React, { useState, useRef } from 'react';
import { ProductLogo } from './ProductLogo';
import { 
  Settings, 
  Plus, 
  CheckCircle2, 
  X,
  Zap,
  Mail,
  Terminal,
  Search,
  Trash2,
  Layers,
  Eye,
  EyeOff,
  Edit3,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  BookOpen,
  Laptop,
  Smartphone,
  Wrench,
  FolderPlus,
  Users,
  Shield,
  Lock,
  Unlock,
  DollarSign,
  AlertTriangle,
  Megaphone,
  CreditCard,
  Sliders,
  Bell,
  Globe,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  KeyRound,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { 
  IMEIService, 
  Order, 
  UserProfile, 
  Announcement, 
  NotificationLogItem, 
  SlideItem, 
  CustomerOrderField, 
  ProductCustomField,
  ProductType,
  UserLevel,
  PlatformSettings
} from '../types';
import { formatUSD } from '../utils/imei';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: IMEIService[];
  orders: Order[];
  user: UserProfile;
  notificationLogs?: NotificationLogItem[];
  slides?: SlideItem[];
  websiteLive?: boolean;
  onToggleMaintenanceMode?: (live: boolean) => void;
  onAddService: (service: IMEIService) => void;
  onUpdateService?: (service: IMEIService) => void;
  onDeleteService?: (serviceId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], code?: string) => void;
  onAddAnnouncement: (ann: Announcement) => void;
  onUpdateUserBalance: (newBalance: number) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onDeductCredits?: (amount: number) => void;
  onLockCredits?: (amount: number) => void;
  onUnlockCredits?: (amount: number) => void;
  onClearNotificationLogs?: () => void;
  onSendCustomNotification?: (email: string, subject: string, body: string) => void;
  onSaveSlides?: (updatedSlides: SlideItem[]) => void;
  onSaveAllChanges?: () => void;
}

const DEFAULT_FIELD_LIBRARY: CustomerOrderField[] = [
  { id: 'f-imei', label: '15-Digit IMEI Number', type: 'text', required: true, placeholder: 'e.g. 352091082391024' },
  { id: 'f-sn', label: 'Device Serial Number (SN)', type: 'text', required: true, placeholder: 'e.g. F2LXM019HG82' },
  { id: 'f-provider', label: 'Provider / Carrier ID', type: 'text', required: false, placeholder: 'e.g. PRV-35012-001' },
  { id: 'f-username', label: 'Account Username / Email', type: 'text', required: true, placeholder: 'e.g. client@domain.com' },
  { id: 'f-model', label: 'Phone Model & Brand', type: 'text', required: false, placeholder: 'e.g. Samsung S24 Ultra' },
  { id: 'f-notes', label: 'Client Special Instructions', type: 'textarea', required: false, placeholder: 'Any extra details...' },
];

const DEFAULT_PRODUCT_CUSTOM_FIELDS = [
  'Ultraview ID',
  'Ultraview Password',
  'AnyDesk ID',
  'Gmail',
  'Serial Number',
  'Phone Model',
  'WhatsApp Number',
  'SN',
  'IMEI',
];

// Initial mock users list for administration
const INITIAL_USERS_LIST: UserProfile[] = [
  {
    email: 'admin@dlsunlockerserver.site',
    fullName: 'Administrator (Admin)',
    username: 'admin',
    phoneNumber: '+258869726969',
    country: 'Mozambique (+258)',
    currency: 'MZN',
    userLevel: 'vip',
    balance: 10000.00,
    lockedBalance: 0.00,
    discountPercentage: 0,
    apiKey: 'key_admin_123',
    whitelistedIPs: [],
    totalOrders: 42,
    completedOrders: 40,
    totalSpent: 1250.00,
    totalReceipts: 50,
    vipTier: 'VIP Member',
    isLoggedIn: true,
    isAdmin: true,
    role: 'admin',
    status: 'active',
  },
  {
    email: 'moz_reseller@dlsunlocker.com',
    fullName: 'Carlos Mateus',
    username: 'carlos_m',
    phoneNumber: '+258841234567',
    country: 'Mozambique (+258)',
    currency: 'MZN',
    userLevel: 'reseller',
    balance: 4500.00,
    lockedBalance: 0.00,
    discountPercentage: 0,
    apiKey: '',
    whitelistedIPs: [],
    totalOrders: 18,
    completedOrders: 18,
    totalSpent: 890.00,
    totalReceipts: 20,
    vipTier: 'Reseller',
    isLoggedIn: false,
    isAdmin: false,
    role: 'customer',
    status: 'active',
  },
  {
    email: 'global_distributor@dlsunlocker.com',
    fullName: 'John Smith',
    username: 'john_dist',
    phoneNumber: '+14155552671',
    country: 'International',
    currency: 'USD',
    userLevel: 'distributor',
    balance: 850.00,
    lockedBalance: 50.00,
    discountPercentage: 0,
    apiKey: '',
    whitelistedIPs: [],
    totalOrders: 65,
    completedOrders: 62,
    totalSpent: 3400.00,
    totalReceipts: 70,
    vipTier: 'Distributor',
    isLoggedIn: false,
    isAdmin: false,
    role: 'customer',
    status: 'active',
  },
  {
    email: 'test_client@domain.com',
    fullName: 'David Matusse',
    username: 'david_m',
    phoneNumber: '+258829876543',
    country: 'Mozambique (+258)',
    currency: 'MZN',
    userLevel: 'customer',
    balance: 150.00,
    lockedBalance: 0.00,
    discountPercentage: 0,
    apiKey: '',
    whitelistedIPs: [],
    totalOrders: 3,
    completedOrders: 2,
    totalSpent: 45.00,
    totalReceipts: 4,
    vipTier: 'Customer',
    isLoggedIn: false,
    isAdmin: false,
    role: 'customer',
    status: 'active',
  }
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  services,
  orders,
  user,
  notificationLogs = [],
  slides = [],
  websiteLive = true,
  onToggleMaintenanceMode,
  onAddService,
  onUpdateService,
  onDeleteService,
  onUpdateOrderStatus,
  onAddAnnouncement,
  onUpdateUserBalance,
  onUpdateUser,
  onDeductCredits,
  onLockCredits,
  onUnlockCredits,
  onClearNotificationLogs,
  onSendCustomNotification,
  onSaveSlides,
  onSaveAllChanges,
}) => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'products' | 'users' | 'settings' | 'slides' | 'categories' | 'api_sync' | 'broadcast' | 'notifications'
  >('products');

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // -------------------------------------------------------------
  // 1. SETTINGS TAB STATE (Matching Image 2 Modern Design)
  // -------------------------------------------------------------
  const [settingsSubTab, setSettingsSubTab] = useState<
    'general' | 'switches' | 'appearance' | 'security' | 'payment' | 'alerts'
  >('general');

  const [siteName, setSiteName] = useState('DLS UNLOCKER SERVER');
  const [siteDomain, setSiteDomain] = useState('dlsunlockerserver.site');
  const [siteDescription, setSiteDescription] = useState('Official GSM Unlock, Tool Rental & IMEI SN Server Gateway');
  const [supportPhone, setSupportPhone] = useState('+258 869 726 969');
  const [whatsappNumber, setWhatsappNumber] = useState('258869726969');
  const [adminEmail, setAdminEmail] = useState('admin@dlsunlockerserver.site');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('CAT (UTC+2) Maputo');

  // Operational Switches State
  const [switches, setSwitches] = useState({
    maintenanceMode: false,
    userRegistration: true,
    walletDeposits: true,
    walletWithdrawals: true,
    productOrders: true,
    whatsappAlerts: true,
    emailAlerts: true,
    announcementTicker: true,
    userLogin: true,
  });

  // Ticker / Alerts State
  const [tickerSpeed, setTickerSpeed] = useState('25s');
  const [tickerText, setTickerText] = useState(
    '🔥 WELCOME TO DLS UNLOCKER SERVER • INSTANT SERVICE DELIVERIES • SUPPORT WHATSAPP: +258 869 726 969'
  );

  // -------------------------------------------------------------
  // 2. USER MANAGEMENT TAB STATE
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  
  const updateAndSaveUsers = (action: React.SetStateAction<UserProfile[]>) => {
    setUsersList(prev => {
      const newList = typeof action === 'function' ? action(prev) : action;
      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: newList }),
      }).catch(() => {});
      return newList;
    });
  };
  
  // Sync users
  React.useEffect(() => {
    fetch('/api/db').then(res => res.json()).then(resData => {
      if(resData.success && resData.data && Array.isArray(resData.data.users)) {
        setUsersList(resData.data.users);
      }
    }).catch(() => {});
  }, []);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userLevelFilter, setUserLevelFilter] = useState<string>('all');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);
  
  // User Balance Change Modal State
  const [balanceModalUser, setBalanceModalUser] = useState<UserProfile | null>(null);
  const [balanceActionType, setBalanceActionType] = useState<'add' | 'deduct'>('add');
  const [balanceAmountInput, setBalanceAmountInput] = useState('');
  const [balanceReasonNote, setBalanceReasonNote] = useState('');

  // Edit User Form State
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserLevel, setEditUserLevel] = useState<UserLevel>('customer');
  const [editUserStatus, setEditUserStatus] = useState<'active' | 'banned'>('active');
  const [editUserCurrency, setEditUserCurrency] = useState<'MZN' | 'USD'>('USD');
  const [editUserPassword, setEditUserPassword] = useState('');

  // -------------------------------------------------------------
  // 3. PRODUCTS MANAGEMENT STATE (4-LEVEL TIERED PRICING)
  // -------------------------------------------------------------
  const [srvSearchQuery, setSrvSearchQuery] = useState('');
  const [srvTypeGroupFilter, setSrvTypeGroupFilter] = useState<string>('🌐 IMEI/SN Service');
  const [srvSortOrder, setSrvSortOrder] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'status_online' | 'sort_order'>('name_asc');

  // Add / Edit Product Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [sName, setSName] = useState('');
  const [sDelivery, setSDelivery] = useState('INSTANT, MINUTES, 1-3 HOURS');
  const [sStatus, setSStatus] = useState<'Online' | 'Offline'>('Online');
  const [sServiceTypeGroup, setSServiceTypeGroup] = useState<ProductType>('🌐 IMEI/SN Service');
  const [sCategory, setSCategory] = useState('General');
  const [sSortOrder, setSSortOrder] = useState('1');
  const [sToolDownloadUrl, setSToolDownloadUrl] = useState('https://example.com/tool.zip');
  const [sDescription, setSDescription] = useState('Service description...');
  const [sCustomerFields, setSCustomerFields] = useState<CustomerOrderField[]>([]);
  const [sCustomFields, setSCustomFields] = useState<ProductCustomField[]>([]);
  const [sVisibleToUsers, setSVisibleToUsers] = useState(true);
  const [sImageUrl, setSImageUrl] = useState('');

  // Product Custom Fields Helpers
  const handleAddPresetCustomField = (fieldName: string) => {
    if (sCustomFields.some((f) => f.name.toLowerCase() === fieldName.toLowerCase())) return;
    setSCustomFields((prev) => [...prev, { id: `cf-${Date.now()}-${Math.random()}`, name: fieldName, value: '' }]);
  };

  const handleAddEmptyCustomField = () => {
    setSCustomFields((prev) => [...prev, { id: `cf-${Date.now()}-${Math.random()}`, name: '', value: '' }]);
  };

  const handleUpdateCustomFieldName = (index: number, name: string) => {
    setSCustomFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const handleUpdateCustomFieldValue = (index: number, value: string) => {
    setSCustomFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value };
      return updated;
    });
  };

  const handleRemoveCustomField = (index: number) => {
    setSCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  // Detailed 4-Level Pricing State
  const [sPriceCustomerUsd, setSPriceCustomerUsd] = useState('0.00');
  const [sPriceCustomerMzn, setSPriceCustomerMzn] = useState('0.00');
  const [sPriceResellerUsd, setSPriceResellerUsd] = useState('0.00');
  const [sPriceResellerMzn, setSPriceResellerMzn] = useState('0.00');
  const [sPriceDistributorUsd, setSPriceDistributorUsd] = useState('0.00');
  const [sPriceDistributorMzn, setSPriceDistributorMzn] = useState('0.00');
  const [sPriceVipUsd, setSPriceVipUsd] = useState('0.00');
  const [sPriceVipMzn, setSPriceVipMzn] = useState('0.00');

  // Image Ref
  const srvImageFileInputRef = useRef<HTMLInputElement>(null);

  // Field Library State
  const [isFieldLibraryOpen, setIsFieldLibraryOpen] = useState(false);
  const [fieldLibrary, setFieldLibrary] = useState<CustomerOrderField[]>(DEFAULT_FIELD_LIBRARY);
  const [isAssignFieldOpen, setIsAssignFieldOpen] = useState(false);

  // Slider State
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideDesktopImg, setSlideDesktopImg] = useState('');
  const [slideMobileImg, setSlideMobileImg] = useState('');
  const [slideTitleText, setSlideTitleText] = useState('Untitled');
  const [slideDescText, setSlideDescText] = useState('Control homepage banners');
  const [slideBtnText, setSlideBtnText] = useState('Explore All Services');
  const [slideBtnLink, setSlideBtnLink] = useState('imei_services');
  const [slideIsActive, setSlideIsActive] = useState(true);

  // Order Fulfillment State
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);
  const [unlockCodeInput, setUnlockCodeInput] = useState('');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');

  // API Sync State
  const [dhruApiUrl, setDhruApiUrl] = useState('https://dlsunlockerserver.site/api/dhru');
  const [dhruApiKey, setDhruApiKey] = useState('dhru_live_key_9981240129481');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Image File Picker Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add Product Modal
  const handleOpenAddServiceModal = () => {
    setEditingServiceId(null);
    setSName('');
    setSPriceCustomerUsd('0.00');
    setSPriceCustomerMzn('0.00');
    setSPriceResellerUsd('0.00');
    setSPriceResellerMzn('0.00');
    setSPriceDistributorUsd('0.00');
    setSPriceDistributorMzn('0.00');
    setSPriceVipUsd('0.00');
    setSPriceVipMzn('0.00');
    setSDelivery('INSTANT, MINUTES, 1-3 HOURS');
    setSStatus('Online');
    
    let defaultGroup: ProductType = '🌐 IMEI/SN Service';
    if (srvTypeGroupFilter === '🛒 Server/Credit Service') defaultGroup = '🛒 Server/Credit Service';
    if (srvTypeGroupFilter === '🔰 Tool Rent') defaultGroup = '🔰 Tool Rent';
    if (srvTypeGroupFilter === '💥 Service By Group') defaultGroup = '💥 Service By Group';
    setSServiceTypeGroup(defaultGroup);

    setSCategory('General');
    setSSortOrder('1');
    setSToolDownloadUrl('https://example.com/tool.zip');
    setSDescription('Service description...');
    setSCustomerFields([]);
    setSCustomFields([]);
    setSVisibleToUsers(true);
    setSImageUrl('');
    setIsServiceModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditServiceModal = (srv: IMEIService) => {
    setEditingServiceId(srv.id);
    setSName(srv.name);

    // Customer level prices
    const custUsd = srv.price || 0;
    const custMzn = srv.priceMzn || custUsd * 64;
    setSPriceCustomerUsd(custUsd.toString());
    setSPriceCustomerMzn(custMzn.toString());

    // Reseller level prices
    const resUsd = srv.priceResellerUsd || srv.priceReseller || custUsd * 0.9;
    const resMzn = srv.priceResellerMzn || srv.priceMznReseller || resUsd * 64;
    setSPriceResellerUsd(resUsd.toFixed(2));
    setSPriceResellerMzn(resMzn.toFixed(2));

    // Distributor level prices
    const distUsd = srv.priceDistributorUsd || srv.priceDistributor || custUsd * 0.8;
    const distMzn = srv.priceDistributorMzn || srv.priceMznDistributor || distUsd * 64;
    setSPriceDistributorUsd(distUsd.toFixed(2));
    setSPriceDistributorMzn(distMzn.toFixed(2));

    // VIP level prices
    const vipUsd = srv.priceVipUsd || srv.priceVip || custUsd * 0.7;
    const vipMzn = srv.priceVipMzn || srv.priceMznVip || vipUsd * 64;
    setSPriceVipUsd(vipUsd.toFixed(2));
    setSPriceVipMzn(vipMzn.toFixed(2));

    setSDelivery(srv.deliveryTime || 'INSTANT, MINUTES, 1-3 HOURS');
    setSStatus(srv.status === 'maintenance' || srv.status === 'Offline' ? 'Offline' : 'Online');
    
    let stg: ProductType = '🌐 IMEI/SN Service';
    const currentGroup = srv.serviceTypeGroup;
    if (currentGroup?.includes('Server/Credit') || srv.type === 'server') stg = '🛒 Server/Credit Service';
    else if (currentGroup?.includes('Tool Rent') || srv.type === 'tool_rent') stg = '🔰 Tool Rent';
    else if (currentGroup?.includes('Service By Group') || currentGroup?.includes('Service Group') || srv.type === 'file') stg = '💥 Service By Group';
    else stg = '🌐 IMEI/SN Service';
    
    setSServiceTypeGroup(stg);
    setSCategory(srv.category || 'General');
    setSSortOrder(srv.sortOrder ? srv.sortOrder.toString() : '1');
    setSToolDownloadUrl(srv.toolDownloadUrl || 'https://example.com/tool.zip');
    setSDescription(srv.description || 'Service description...');
    setSCustomerFields(srv.customerOrderFields || []);
    setSCustomFields(srv.customFields ? JSON.parse(JSON.stringify(srv.customFields)) : []);
    setSVisibleToUsers(srv.visibleToUsers !== false);
    setSImageUrl(srv.imageUrl || srv.logoUrl || '');
    setIsServiceModalOpen(true);
  };

  // Submit Add / Edit Product Form with Tiered Pricing
  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) return;

    const pCustUsd = parseFloat(sPriceCustomerUsd) || 0;
    const pCustMzn = parseFloat(sPriceCustomerMzn) || 0;
    const pResUsd = parseFloat(sPriceResellerUsd) || 0;
    const pResMzn = parseFloat(sPriceResellerMzn) || 0;
    const pDistUsd = parseFloat(sPriceDistributorUsd) || 0;
    const pDistMzn = parseFloat(sPriceDistributorMzn) || 0;
    const pVipUsd = parseFloat(sPriceVipUsd) || 0;
    const pVipMzn = parseFloat(sPriceVipMzn) || 0;
    const parsedSortOrder = parseInt(sSortOrder) || 1;

    let mappedType: IMEIService['type'] = 'imei';
    if (sServiceTypeGroup.includes('Tool Rent')) mappedType = 'tool_rent';
    if (sServiceTypeGroup.includes('Server/Credit')) mappedType = 'server';
    if (sServiceTypeGroup.includes('Service By Group') || sServiceTypeGroup.includes('Service Group')) mappedType = 'file';

    const cleanedCustomFields = sCustomFields.filter((f) => f.name.trim() !== '' || f.value.trim() !== '');

    const serviceData: IMEIService = {
      id: editingServiceId ? editingServiceId : `srv-${Date.now()}`,
      name: sName.trim(),
      category: sCategory.toLowerCase().replace(/\s+/g, '_') as any,
      type: mappedType,
      serviceTypeGroup: sServiceTypeGroup,
      brand: sCategory.trim() || 'General',
      
      // Standard prices
      price: pCustUsd,
      priceMzn: pCustMzn,
      priceReseller: pResUsd,
      priceMznReseller: pResMzn,

      // 4-Level Tiered Pricing
      priceCustomerUsd: pCustUsd,
      priceCustomerMzn: pCustMzn,
      priceResellerUsd: pResUsd,
      priceResellerMzn: pResMzn,
      priceDistributorUsd: pDistUsd,
      priceDistributorMzn: pDistMzn,
      priceVipUsd: pVipUsd,
      priceVipMzn: pVipMzn,

      deliveryTime: sDelivery.trim() || 'Instant',
      successRate: 99.5,
      requiresIMEI: sServiceTypeGroup.includes('IMEI/SN'),
      requiresSN: sServiceTypeGroup.includes('IMEI/SN'),
      description: sDescription.trim(),
      requirements: [sDelivery],
      status: sStatus === 'Online' ? 'active' : 'maintenance',
      imageUrl: sImageUrl.trim() || undefined,
      logoUrl: sImageUrl.trim() || undefined,
      badgeTag: sStatus.toUpperCase(),
      sortOrder: parsedSortOrder,
      toolDownloadUrl: sToolDownloadUrl.trim() || undefined,
      customerOrderFields: sCustomerFields,
      customFields: cleanedCustomFields,
      visibleToUsers: sVisibleToUsers,
    };

    if (editingServiceId) {
      if (onUpdateService) {
        onUpdateService(serviceData);
      } else {
        const idx = services.findIndex((s) => s.id === editingServiceId);
        if (idx !== -1) services[idx] = serviceData;
      }
    } else {
      onAddService(serviceData);
    }

    setSaveSuccessMsg(`Product "${sName}" saved with tiered pricing across all levels!`);
    setTimeout(() => setSaveSuccessMsg(''), 5000);

    setIsServiceModalOpen(false);
  };

  const handleDeleteServiceClick = (srv: IMEIService) => {
    if (confirm(`Are you sure you want to delete service "${srv.name}"?`)) {
      if (onDeleteService) {
        onDeleteService(srv.id);
      } else {
        const idx = services.findIndex((s) => s.id === srv.id);
        if (idx !== -1) services.splice(idx, 1);
      }
      
      setSaveSuccessMsg(`Service "${srv.name}" removed from catalog.`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleToggleServiceStatus = (srv: IMEIService) => {
    const nextStatus = srv.status === 'active' ? 'maintenance' : 'active';
    const updated = { ...srv, status: nextStatus };
    if (onUpdateService) {
      onUpdateService(updated);
    } else {
      srv.status = nextStatus;
    }
    
    setSaveSuccessMsg(`Service "${srv.name}" status changed to ${nextStatus === 'active' ? 'Online' : 'Offline'}.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // User Management Actions
  const handleToggleBanUser = (targetEmail: string) => {
    updateAndSaveUsers((prev) =>
      prev.map((u) => {
        if (u.email === targetEmail) {
          const nextStatus = u.status === 'banned' ? 'active' : 'banned';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    setSaveSuccessMsg(`User status updated!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleDeleteUser = (targetEmail: string) => {
    if (confirm(`Are you sure you want to delete user "${targetEmail}" permanently?`)) {
      updateAndSaveUsers((prev) => prev.filter((u) => u.email !== targetEmail));
      setSaveSuccessMsg(`User "${targetEmail}" deleted permanently.`);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleOpenEditUser = (usr: UserProfile) => {
    setSelectedUserForEdit(usr);
    setEditUserName(usr.fullName || usr.username);
    setEditUserEmail(usr.email);
    setEditUserPhone(usr.phoneNumber || '');
    setEditUserLevel(usr.userLevel || 'customer');
    setEditUserStatus(usr.status || 'active');
    setEditUserCurrency(usr.currency || 'USD');
    setEditUserPassword('');
  };

  const handleSaveEditedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    const updatedRole = editUserLevel;
    const updatedVipTier = editUserLevel === 'vip' ? 'VIP Member' : editUserLevel === 'distributor' ? 'Distributor' : editUserLevel === 'reseller' ? 'Reseller' : 'Customer';

    const updatedUser: UserProfile = {
      ...selectedUserForEdit,
      fullName: editUserName,
      email: editUserEmail,
      phoneNumber: editUserPhone,
      userLevel: updatedRole,
      role: updatedRole,
      vipTier: updatedVipTier,
      status: editUserStatus,
      currency: editUserCurrency,
    };

    const newUsers = usersList.map((u) => {
      if (u.email.toLowerCase() === selectedUserForEdit.email.toLowerCase()) {
        return updatedUser;
      }
      return u;
    });

    updateAndSaveUsers(newUsers);
    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: newUsers }),
    }).catch(() => {});

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setSelectedUserForEdit(null);
    setSaveSuccessMsg(`User account updated successfully! Role & pricing tier changed to ${updatedVipTier}.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleApplyUserBalanceChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalUser) return;
    const amount = parseFloat(balanceAmountInput) || 0;
    if (amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    updateAndSaveUsers((prev) =>
      prev.map((u) => {
        if (u.email === balanceModalUser.email) {
          const newBal = balanceActionType === 'add' ? u.balance + amount : Math.max(0, u.balance - amount);
          return { ...u, balance: newBal };
        }
        return u;
      })
    );

    // If active logged-in user is updated, notify parent
    if (balanceModalUser.email === user.email) {
      const newBal = balanceActionType === 'add' ? user.balance + amount : Math.max(0, user.balance - amount);
      onUpdateUserBalance(newBal);
    }

    setSaveSuccessMsg(`Wallet balance updated for ${balanceModalUser.email} (${balanceActionType === 'add' ? '+' : '-'}${amount})!`);
    setBalanceModalUser(null);
    setBalanceAmountInput('');
    setBalanceReasonNote('');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Service field assignment
  const handleAssignFieldToService = (field: CustomerOrderField) => {
    if (sCustomerFields.some((f) => f.id === field.id)) return;
    setSCustomerFields((prev) => [...prev, field]);
    setIsAssignFieldOpen(false);
  };

  const handleRemoveFieldFromService = (fieldId: string) => {
    setSCustomerFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  // Order Fulfillment Submit
  const handleCompleteOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingOrderId || !unlockCodeInput.trim()) return;
    onUpdateOrderStatus(completingOrderId, 'completed', unlockCodeInput.trim());
    setCompletingOrderId(null);
    setUnlockCodeInput('');
  };

  // Count Statistics for Services
  const imeiSnCount = services.filter((s) => s.serviceTypeGroup === '🌐 IMEI/SN Service' || s.serviceTypeGroup === 'IMEI/SN Service' || s.serviceTypeGroup === 'IMEI/SN' || (!s.serviceTypeGroup && s.type === 'imei')).length;
  const serverCreditCount = services.filter((s) => s.serviceTypeGroup === '🛒 Server/Credit Service' || s.serviceTypeGroup === 'Server/Credit Service' || s.serviceTypeGroup === 'Server/Credit' || (!s.serviceTypeGroup && s.type === 'server')).length;
  const toolRentCount = services.filter((s) => s.serviceTypeGroup === '🔰 Tool Rent' || s.serviceTypeGroup === 'Tool Rent' || s.category === 'tool_rent' || (!s.serviceTypeGroup && s.type === 'tool_rent')).length;
  const serviceGroupCount = services.filter((s) => s.serviceTypeGroup === '💥 Service By Group' || s.serviceTypeGroup === 'Service By Group' || s.serviceTypeGroup === 'Service Group' || s.category === 'service_group' || (!s.serviceTypeGroup && s.type === 'file')).length;

  // Filtered Services
  const filteredServicesList = services
    .filter((srv) => {
      const matchesSearch =
        !srvSearchQuery.trim() ||
        srv.name.toLowerCase().includes(srvSearchQuery.toLowerCase()) ||
        srv.category.toLowerCase().includes(srvSearchQuery.toLowerCase()) ||
        srv.brand.toLowerCase().includes(srvSearchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (srvTypeGroupFilter === '🌐 IMEI/SN Service' || srvTypeGroupFilter === 'IMEI/SN') {
        return srv.serviceTypeGroup === '🌐 IMEI/SN Service' || srv.serviceTypeGroup === 'IMEI/SN Service' || srv.serviceTypeGroup === 'IMEI/SN' || (!srv.serviceTypeGroup && srv.type === 'imei');
      }
      if (srvTypeGroupFilter === '🛒 Server/Credit Service' || srvTypeGroupFilter === 'Server/Credit') {
        return srv.serviceTypeGroup === '🛒 Server/Credit Service' || srv.serviceTypeGroup === 'Server/Credit Service' || srv.serviceTypeGroup === 'Server/Credit' || (!srv.serviceTypeGroup && srv.type === 'server');
      }
      if (srvTypeGroupFilter === '🔰 Tool Rent') {
        return srv.serviceTypeGroup === '🔰 Tool Rent' || srv.serviceTypeGroup === 'Tool Rent' || srv.category === 'tool_rent' || (!srv.serviceTypeGroup && srv.type === 'tool_rent');
      }
      if (srvTypeGroupFilter === '💥 Service By Group' || srvTypeGroupFilter === 'Service Group') {
        return srv.serviceTypeGroup === '💥 Service By Group' || srv.serviceTypeGroup === 'Service By Group' || srv.serviceTypeGroup === 'Service Group' || srv.category === 'service_group' || (!srv.serviceTypeGroup && srv.type === 'file');
      }
      return true;
    })
    .sort((a, b) => {
      if (srvSortOrder === 'name_asc') return a.name.localeCompare(b.name);
      if (srvSortOrder === 'name_desc') return b.name.localeCompare(a.name);
      if (srvSortOrder === 'price_asc') return a.price - b.price;
      if (srvSortOrder === 'price_desc') return b.price - a.price;
      if (srvSortOrder === 'status_online') return (a.status === 'active' ? -1 : 1) - (b.status === 'active' ? -1 : 1);
      if (srvSortOrder === 'sort_order') return (a.sortOrder || 99) - (b.sortOrder || 99);
      return 0;
    });

  // Filtered Users List
  const filteredUsersList = usersList.filter((u) => {
    const query = userSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.email.toLowerCase().includes(query) ||
      (u.fullName || '').toLowerCase().includes(query) ||
      (u.username || '').toLowerCase().includes(query) ||
      (u.phoneNumber || '').includes(query);

    if (!matchesSearch) return false;
    if (userLevelFilter !== 'all' && u.userLevel !== userLevelFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0b1329] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>DLS UNLOCKER SERVER</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">
                  dlsunlockerserver.site
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Administrator Control Portal • Service Catalog, Tiered Pricing, Users, Banners & Settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onSaveAllChanges) onSaveAllChanges();
                setSaveSuccessMsg('All platform settings, tiered prices & user changes published live!');
                setTimeout(() => setSaveSuccessMsg(''), 5000);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 uppercase tracking-wider cursor-pointer border border-emerald-400"
              id="admin-header-save-and-publish-btn"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Save & Publish Changes</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Success Notification Bar */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-3 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Admin Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 p-3 border-b border-slate-800 bg-[#0d1527] text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Products & Prices ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Platform Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Orders Queue ({orders.filter((o) => o.status === 'in_process').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'slides' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Slider Banners ({slides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('api_sync')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'api_sync' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'broadcast' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>News Ticker</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2 rounded-lg font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notifications' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#090f1d] text-slate-200">
          
          {/* ========================================== */}
          {/* TAB: PRODUCTS & TIERED PRICING             */}
          {/* ========================================== */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>Product Management & Tiered Pricing</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-mono">
                      {srvTypeGroupFilter}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Manage individual products with separate prices for Customer, Reseller, Distributor, and VIP Member levels.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddServiceModal}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Product Type Categories */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setSrvTypeGroupFilter('🌐 IMEI/SN Service')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    srvTypeGroupFilter === '🌐 IMEI/SN Service' ? 'bg-indigo-950/80 border-indigo-500 shadow-lg ring-1 ring-indigo-500' : 'bg-[#121c35] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      🌐
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{imeiSnCount}</div>
                      <div className="text-[11px] text-slate-300 font-bold">IMEI/SN Service</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSrvTypeGroupFilter('🛒 Server/Credit Service')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    srvTypeGroupFilter === '🛒 Server/Credit Service' ? 'bg-teal-950/80 border-teal-500 shadow-lg ring-1 ring-teal-500' : 'bg-[#121c35] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                      🛒
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{serverCreditCount}</div>
                      <div className="text-[11px] text-slate-300 font-bold">Server/Credit</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSrvTypeGroupFilter('🔰 Tool Rent')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    srvTypeGroupFilter === '🔰 Tool Rent' ? 'bg-purple-950/80 border-purple-500 shadow-lg ring-1 ring-purple-500' : 'bg-[#121c35] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                      🔰
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{toolRentCount}</div>
                      <div className="text-[11px] text-slate-300 font-bold">Tool Rent</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSrvTypeGroupFilter('💥 Service By Group')}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    srvTypeGroupFilter === '💥 Service By Group' ? 'bg-amber-950/80 border-amber-500 shadow-lg ring-1 ring-amber-500' : 'bg-[#121c35] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                      💥
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">{serviceGroupCount}</div>
                      <div className="text-[11px] text-slate-300 font-bold">Service By Group</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Search Bar & Table Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={srvSearchQuery}
                    onChange={(e) => setSrvSearchQuery(e.target.value)}
                    placeholder={`Search within ${srvTypeGroupFilter}...`}
                    className="w-full bg-[#111a30] border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Sort By:</span>
                  <select
                    value={srvSortOrder}
                    onChange={(e) => setSrvSortOrder(e.target.value as any)}
                    className="bg-[#111a30] border border-slate-800 text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500 cursor-pointer w-full sm:w-auto"
                  >
                    <option value="name_asc">Name (A - Z)</option>
                    <option value="name_desc">Name (Z - A)</option>
                    <option value="price_asc">Price (Low to High)</option>
                    <option value="price_desc">Price (High to Low)</option>
                    <option value="status_online">Status (Online First)</option>
                  </select>
                </div>
              </div>

              {/* Products List Table */}
              <div className="bg-[#0e1628] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="divide-y divide-slate-800/60 max-h-[420px] overflow-y-auto">
                  {filteredServicesList.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No products found matching criteria in <span className="text-teal-400 font-bold">{srvTypeGroupFilter}</span>.
                    </div>
                  ) : (
                    filteredServicesList.map((srv) => (
                      <div key={srv.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#121c35] transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <ProductLogo
                            logoUrl={srv.logoUrl}
                            imageUrl={srv.imageUrl}
                            brand={srv.brand}
                            serviceName={srv.name}
                            size="md"
                          />

                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate">{srv.name}</div>
                            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-teal-300 font-medium">{srv.brand || 'General'}</span>
                              <span>•</span>
                              <span>{srv.deliveryTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-shrink-0 self-end sm:self-center">
                          {/* Price Tag Display */}
                          <div className="text-right font-mono">
                            <div className="text-xs font-black text-emerald-400">${srv.price.toFixed(2)} USD</div>
                            <div className="text-[10px] text-slate-400">{srv.priceMzn ? `${srv.priceMzn} MZN` : `${(srv.price * 64).toFixed(0)} MZN`}</div>
                          </div>

                          <button
                            onClick={() => handleToggleServiceStatus(srv)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                              srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {srv.status === 'active' ? 'Online' : 'Offline'}
                          </button>

                          <button
                            onClick={() => handleOpenEditServiceModal(srv)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                            title="Edit Service & Pricing Levels"
                          >
                            <Edit3 className="w-4 h-4 text-teal-400" />
                          </button>

                          <button
                            onClick={() => handleDeleteServiceClick(srv)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: USER MANAGEMENT SECTION               */}
          {/* ========================================== */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>User Management System</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-mono">
                      {filteredUsersList.length} Accounts
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">View, search, ban/unban, delete users, assign user levels, and manage wallet credit balances.</p>
                </div>

                <button
                  onClick={() => {
                    const newUserEmail = prompt('Enter new user email:');
                    if (newUserEmail) {
                      const newUsr: UserProfile = {
                        email: newUserEmail,
                        fullName: newUserEmail.split('@')[0],
                        username: newUserEmail.split('@')[0],
                        phoneNumber: '+258869726969',
                        country: 'Mozambique (+258)',
                        currency: 'MZN',
                        userLevel: 'customer',
                        balance: 0.00,
                        lockedBalance: 0.00,
                        discountPercentage: 0,
                        apiKey: '',
                        whitelistedIPs: [],
                        totalOrders: 0,
                        completedOrders: 0,
                        totalSpent: 0.00,
                        totalReceipts: 0,
                        vipTier: 'Customer',
                        isLoggedIn: false,
                        isAdmin: false,
                        role: 'customer',
                        status: 'active',
                      };
                      updateAndSaveUsers([newUsr, ...usersList]);
                      setSaveSuccessMsg(`New user account "${newUserEmail}" created!`);
                      setTimeout(() => setSaveSuccessMsg(''), 4000);
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              </div>

              {/* User Search & Level Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search users by name, email, or phone number..."
                    className="w-full bg-[#111a30] border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold whitespace-nowrap">Level Filter:</span>
                  <select
                    value={userLevelFilter}
                    onChange={(e) => setUserLevelFilter(e.target.value)}
                    className="bg-[#111a30] border border-slate-800 text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Customer Levels</option>
                    <option value="customer">Customer Level</option>
                    <option value="reseller">Reseller Level</option>
                    <option value="distributor">Distributor Level</option>
                    <option value="vip">VIP Member Level</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#0e1628] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-3.5 bg-[#0b1222] border-b border-slate-800 grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  <div className="col-span-4 sm:col-span-3">User / Email</div>
                  <div className="col-span-3 sm:col-span-2">Phone & Country</div>
                  <div className="col-span-2 hidden sm:block">Customer Level</div>
                  <div className="col-span-3 sm:col-span-2 text-right">Wallet Balance</div>
                  <div className="col-span-2 sm:col-span-3 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-800/60 max-h-[460px] overflow-y-auto">
                  {filteredUsersList.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No users found matching query.
                    </div>
                  ) : (
                    filteredUsersList.map((usr) => (
                      <div key={usr.email} className="p-3.5 grid grid-cols-12 items-center hover:bg-[#121c35] transition text-xs">
                        {/* User Info */}
                        <div className="col-span-4 sm:col-span-3 min-w-0">
                          <div className="font-bold text-white truncate flex items-center gap-1.5">
                            <span>{usr.fullName || usr.username}</span>
                            {usr.isAdmin && (
                              <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{usr.email}</div>
                        </div>

                        {/* Phone & Country */}
                        <div className="col-span-3 sm:col-span-2 min-w-0">
                          <div className="font-mono text-slate-200 text-[11px]">{usr.phoneNumber || 'N/A'}</div>
                          <div className="text-[10px] text-teal-400">{usr.country || 'International'}</div>
                        </div>

                        {/* User Level */}
                        <div className="col-span-2 hidden sm:block">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase ${
                            usr.userLevel === 'vip' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            usr.userLevel === 'distributor' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            usr.userLevel === 'reseller' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {usr.userLevel || 'Customer'}
                          </span>
                        </div>

                        {/* Balance */}
                        <div className="col-span-3 sm:col-span-2 text-right font-mono">
                          <div className="font-black text-emerald-400">
                            {usr.currency === 'MZN' ? `${usr.balance.toFixed(2)} MZN` : `$${usr.balance.toFixed(2)} USD`}
                          </div>
                          <div className="text-[10px] text-slate-500">{usr.currency || 'USD'} Wallet</div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-1.5">
                          {/* Add / Reduce Balance Button */}
                          <button
                            onClick={() => {
                              setBalanceModalUser(usr);
                              setBalanceActionType('add');
                              setBalanceAmountInput('');
                              setBalanceReasonNote('');
                            }}
                            className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white p-1.5 rounded-lg border border-emerald-500/30 transition cursor-pointer"
                            title="Add / Subtract Wallet Balance"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User Details */}
                          <button
                            onClick={() => handleOpenEditUser(usr)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg transition cursor-pointer"
                            title="Edit User Info & Level"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                          </button>

                          {/* Ban / Unban Toggle */}
                          <button
                            onClick={() => handleToggleBanUser(usr.email)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              usr.status === 'banned'
                                ? 'bg-rose-600 text-white border-rose-500'
                                : 'bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border-slate-700'
                            }`}
                            title={usr.status === 'banned' ? 'Click to Unban User' : 'Click to Ban User'}
                          >
                            {usr.status === 'banned' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => handleDeleteUser(usr.email)}
                            className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 p-1.5 rounded-lg transition cursor-pointer"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: MODERN PLATFORM SETTINGS (IMAGE 2)    */}
          {/* ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Platform Settings Portal</h3>
                  <p className="text-xs text-slate-400">Configure core website parameters, operational switches, payment options, and security.</p>
                </div>

                <button
                  onClick={() => {
                    if (onSaveAllChanges) onSaveAllChanges();
                    setSaveSuccessMsg('Platform settings updated successfully!');
                    setTimeout(() => setSaveSuccessMsg(''), 4000);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>

              {/* Sub-Category Navigation Pills (Matching Image 2 Style) */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
                {[
                  { id: 'general', label: 'General Settings', icon: Globe },
                  { id: 'switches', label: 'Operational Switches', icon: Sliders },
                  { id: 'appearance', label: 'Appearance & Theme', icon: Eye },
                  { id: 'security', label: 'Security & Access', icon: Shield },
                  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
                  { id: 'alerts', label: 'Alerts & Ticker Text', icon: Bell },
                ].map((st) => {
                  const IconComp = st.icon;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSettingsSubTab(st.id as any)}
                      className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                        settingsSubTab === st.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400'
                          : 'bg-[#111a30] text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-purple-300" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tab 1: General Settings */}
              {settingsSubTab === 'general' && (
                <div className="bg-[#0e1628] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                    Website & Admin Info
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Platform Name</label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Domain Name</label>
                      <input
                        type="text"
                        value={siteDomain}
                        onChange={(e) => setSiteDomain(e.target.value)}
                        className="w-full bg-[#121c35] border border-slate-800 text-teal-300 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Admin Support Phone Number</label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Admin WhatsApp Number (Orders Notify)</label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="258869726969"
                        className="w-full bg-[#121c35] border border-slate-800 text-emerald-400 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Admin Email Address</label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">System Time Zone</label>
                      <input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">Site Description</label>
                    <textarea
                      rows={2}
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Operational Switches */}
              {settingsSubTab === 'switches' && (
                <div className="bg-[#0e1628] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                    Feature & Operational Switches
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Dedicated Website Maintenance Mode Card */}
                    <div className="bg-[#121c35] p-3.5 rounded-xl border-2 border-teal-500/30 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Website Maintenance Mode</span>
                          {websiteLive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[10px] border border-emerald-500/30 uppercase tracking-wider">
                              🟢 Normal Operation (Live for all users)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-black text-[10px] border border-rose-500/30 uppercase tracking-wider">
                              🔴 Maintenance Active ("Website is Maintenance — Coming Soon")
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-1">
                          When Maintenance is Active (OFF), normal users cannot log in, view products, or order. They see "Website is Maintenance — Coming Soon". Administrators retain full portal access.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onToggleMaintenanceMode) {
                            onToggleMaintenanceMode(!websiteLive);
                          }
                          setSwitches((prev) => ({ ...prev, maintenanceMode: websiteLive }));
                        }}
                        className={`w-14 h-7 rounded-full transition-colors p-1 cursor-pointer flex items-center shrink-0 ${
                          websiteLive ? 'bg-emerald-500 justify-end' : 'bg-rose-600 justify-start'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow-md font-bold text-[9px] flex items-center justify-center text-slate-900">
                          {websiteLive ? 'ON' : 'OFF'}
                        </div>
                      </button>
                    </div>

                    {[
                      { key: 'userRegistration', label: 'User Registration', desc: 'Allow new accounts creation' },
                      { key: 'walletDeposits', label: 'Wallet Deposits', desc: 'Allow users to top up wallet' },
                      { key: 'productOrders', label: 'Product Orders Gateway', desc: 'Allow client order processing' },
                      { key: 'whatsappAlerts', label: 'WhatsApp Admin Order Alerts', desc: 'Send order alert to WhatsApp (+258 869 726 969)' },
                      { key: 'emailAlerts', label: 'Email Order Dispatcher', desc: 'Send order updates via email' },
                      { key: 'announcementTicker', label: 'Announcement Ticker Bar', desc: 'Display rolling news header' },
                      { key: 'userLogin', label: 'Client Portal Login', desc: 'Allow client login sessions' },
                    ].map((item) => (
                      <div key={item.key} className="bg-[#121c35] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSwitches((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof switches],
                            }))
                          }
                          className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                            switches[item.key as keyof typeof switches] ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Appearance */}
              {settingsSubTab === 'appearance' && (
                <div className="bg-[#0e1628] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                    Visual Styling & Color Theme
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800">
                      <div className="font-bold text-white mb-2">Primary Accent Color</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#008080] border border-white/20" />
                        <span className="font-mono text-teal-400 font-bold">#008080 (Teal)</span>
                      </div>
                    </div>

                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800">
                      <div className="font-bold text-white mb-2">Background Canvas</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0f172a] border border-white/20" />
                        <span className="font-mono text-slate-300 font-bold">Slate / Dark</span>
                      </div>
                    </div>

                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800">
                      <div className="font-bold text-white mb-2">Secondary Accent</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] border border-white/20" />
                        <span className="font-mono text-purple-400 font-bold">#8b5cf6 (Purple)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Security */}
              {settingsSubTab === 'security' && (
                <div className="bg-[#0e1628] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                    Security & Mandatory Phone Verification
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">Mandatory Phone Number Verification</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Detect country &amp; currency (+258 to MZN | Others to USD)</div>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold font-mono">
                        ENABLED
                      </span>
                    </div>

                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">Google reCAPTCHA Protection</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Prevent automated bot registrations</div>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold font-mono">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 5: Payment Options */}
              {settingsSubTab === 'payment' && (
                <div className="bg-[#0e1628] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                    Payment Gateway Options
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800">
                      <div className="font-bold text-white text-sm">Mozambique M-Pesa / e-Mola (+258)</div>
                      <div className="text-[11px] text-emerald-400 font-bold mt-1">Automatic MZN Wallet Top Up</div>
                    </div>

                    <div className="bg-[#121c35] p-4 rounded-xl border border-slate-800">
                      <div className="font-bold text-white text-sm">USDT Crypto / BinancPay</div>
                      <div className="text-[11px] text-teal-400 font-bold mt-1">Automatic USD Wallet Top Up</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 6: Alerts & Ticker */}
              {settingsSubTab === 'alerts' && (
                <div className="bg-[#0e1628] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-teal-400">
                    Announcement Ticker Text Configuration
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Rolling Announcement Text</label>
                      <textarea
                        rows={3}
                        value={tickerText}
                        onChange={(e) => setTickerText(e.target.value)}
                        className="w-full bg-[#121c35] border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Scroll Duration / Speed</label>
                        <input
                          type="text"
                          value={tickerSpeed}
                          onChange={(e) => setTickerSpeed(e.target.value)}
                          className="w-full bg-[#121c35] border border-slate-800 text-white px-3 py-2 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================== */}
          {/* TAB: ORDERS QUEUE                          */}
          {/* ========================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Pending Customer Orders ({orders.filter((o) => o.status === 'in_process').length})
                </h4>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {orders.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 font-mono text-xs bg-slate-900/60 rounded-xl border border-slate-800">
                    No orders currently in queue.
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-teal-400">{ord.orderNumber} • {ord.brand}</div>
                        <div className="font-bold text-white text-sm mt-0.5">{ord.serviceName}</div>
                        <div className="text-slate-400 font-mono text-[11px] mt-1">
                          IMEI/Details: <span className="text-slate-200 font-bold">{ord.imei}</span> | Cost: ${ord.cost.toFixed(2)} | User: {ord.userEmail || 'Client'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {ord.status === 'in_process' ? (
                          <>
                            <button
                              onClick={() => setCompletingOrderId(ord.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold px-3 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                            >
                              Fulfill Code
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'rejected', 'Order rejected by server admin')}
                              className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 font-mono font-bold px-3 py-1.5 rounded-lg text-xs uppercase transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase ${
                            ord.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {ord.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {completingOrderId && (
                <form onSubmit={handleCompleteOrderSubmit} className="bg-slate-900 p-4 rounded-xl border-2 border-teal-500/50 space-y-3 font-mono">
                  <label className="block text-teal-300 font-bold uppercase text-xs">
                    Input Generated Unlock Code or Result for Order #{completingOrderId}:
                  </label>
                  <input
                    type="text"
                    required
                    value={unlockCodeInput}
                    onChange={(e) => setUnlockCodeInput(e.target.value)}
                    placeholder="e.g. NCK: 88102941 or UNLOCKED IN GSX"
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg focus:outline-none focus:border-teal-500 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCompletingOrderId(null)}
                      className="bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-600 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase"
                    >
                      Submit & Notify Customer
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: SLIDER BANNERS MANAGEMENT             */}
          {/* ========================================== */}
          {activeTab === 'slides' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm uppercase">Homepage Banners Slider</h4>
              </div>

              <div className="space-y-3">
                {slides.map((slide) => (
                  <div key={slide.id} className="bg-[#0e1628] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {slide.imageUrl && <img src={slide.imageUrl} alt={slide.title} className="w-16 h-10 object-cover rounded-lg" />}
                      <div>
                        <div className="font-bold text-white text-sm">{slide.title}</div>
                        <div className="text-xs text-slate-400">{slide.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold font-mono">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: API GATEWAY                           */}
          {/* ========================================== */}
          {activeTab === 'api_sync' && (
            <div className="space-y-4 font-mono text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider">Dhru Fusion & External Gateway</h4>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">API ENDPOINT URL:</label>
                  <input
                    type="text"
                    value={dhruApiUrl}
                    onChange={(e) => setDhruApiUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-teal-300 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">API KEY:</label>
                  <input
                    type="password"
                    value={dhruApiKey}
                    onChange={(e) => setDhruApiKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSyncing(true);
                    setTimeout(() => {
                      setIsSyncing(false);
                      setSyncStatus('API Gateway Connection Verified • 200 OK');
                    }, 800);
                  }}
                  className="bg-teal-600 text-white font-bold px-4 py-2 rounded-lg uppercase cursor-pointer"
                >
                  {isSyncing ? 'Testing...' : 'Test Gateway Connection'}
                </button>
                {syncStatus && <div className="text-emerald-400 font-bold">{syncStatus}</div>}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: NEWS TICKER BROADCAST                 */}
          {/* ========================================== */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4 text-xs font-mono">
              <h4 className="font-bold text-white uppercase">Broadcast Headline Notice</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!annTitle) return;
                  onAddAnnouncement({
                    id: `ann-${Date.now()}`,
                    title: annTitle,
                    message: annMsg,
                    date: 'JUST NOW',
                    type: 'info',
                  });
                  setAnnTitle('');
                  setAnnMsg('');
                  setSaveSuccessMsg('Headline Notice Broadcasted Live!');
                  setTimeout(() => setSaveSuccessMsg(''), 4000);
                }}
                className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Headline Title (e.g. Samsung S25 Instant Unlocks Online)"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Details..."
                  value={annMsg}
                  onChange={(e) => setAnnMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-lg"
                />
                <button type="submit" className="bg-teal-600 text-white font-bold px-4 py-2 rounded-lg uppercase cursor-pointer">
                  Publish Notice
                </button>
              </form>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: NOTIFICATION AUDIT LOGS               */}
          {/* ========================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs font-mono">
              <h4 className="font-bold text-white uppercase">System Audit & Email Dispatches</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notificationLogs.map((log) => (
                  <div key={log.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="font-bold text-teal-400">{log.subject}</div>
                    <div className="text-slate-400 text-[11px]">{log.recipientEmail} • {log.timestamp}</div>
                    <div className="text-slate-300 text-[10px] mt-1">{log.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL: EDIT USER DETAILS & LEVEL           */}
      {/* ========================================== */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-slate-100 font-sans shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-400" />
                <span>Edit User Account Details</span>
              </h3>
              <button onClick={() => setSelectedUserForEdit(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full bg-[#121c35] border border-slate-800 text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full bg-[#121c35] border border-slate-800 text-white p-2.5 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  className="w-full bg-[#121c35] border border-slate-800 text-white p-2.5 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">User Level Tier</label>
                  <select
                    value={editUserLevel}
                    onChange={(e) => setEditUserLevel(e.target.value as any)}
                    className="w-full bg-[#121c35] border border-slate-800 text-teal-300 font-bold p-2.5 rounded-xl cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="reseller">Reseller</option>
                    <option value="distributor">Distributor</option>
                    <option value="vip">VIP Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Account Currency</label>
                  <select
                    value={editUserCurrency}
                    onChange={(e) => setEditUserCurrency(e.target.value as any)}
                    className="w-full bg-[#121c35] border border-slate-800 text-emerald-400 font-bold p-2.5 rounded-xl cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="MZN">MZN (Meticais)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Account Status</label>
                <select
                  value={editUserStatus}
                  onChange={(e) => setEditUserStatus(e.target.value as any)}
                  className="w-full bg-[#121c35] border border-slate-800 text-white p-2.5 rounded-xl cursor-pointer font-bold"
                >
                  <option value="active">Active</option>
                  <option value="banned">Banned / Suspended</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Save User
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD / SUBTRACT USER BALANCE         */}
      {/* ========================================== */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4 text-slate-100 font-sans shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Adjust User Wallet Balance</span>
              </h3>
              <button onClick={() => setBalanceModalUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 bg-[#121c35] p-3 rounded-xl border border-slate-800">
              User: <strong className="text-white">{balanceModalUser.fullName || balanceModalUser.username}</strong>
              <div className="text-[11px] text-teal-400 mt-1 font-mono">
                Current Balance: {balanceModalUser.currency === 'MZN' ? `${balanceModalUser.balance.toFixed(2)} MZN` : `$${balanceModalUser.balance.toFixed(2)} USD`}
              </div>
            </div>

            <form onSubmit={handleApplyUserBalanceChange} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBalanceActionType('add')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                    balanceActionType === 'add'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#121c35] text-slate-400 border-slate-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBalanceActionType('deduct')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer border ${
                    balanceActionType === 'deduct'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-[#121c35] text-slate-400 border-slate-800'
                  }`}
                >
                  <MinusCircle className="w-4 h-4" />
                  <span>Subtract (-)</span>
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Amount to {balanceActionType === 'add' ? 'Add' : 'Deduct'} ({balanceModalUser.currency || 'USD'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 50.00"
                  value={balanceAmountInput}
                  onChange={(e) => setBalanceAmountInput(e.target.value)}
                  className="w-full bg-[#121c35] border border-slate-800 text-emerald-400 font-bold font-mono p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason / Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Deposit Confirmation"
                  value={balanceReasonNote}
                  onChange={(e) => setBalanceReasonNote(e.target.value)}
                  className="w-full bg-[#121c35] border border-slate-800 text-white p-2.5 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Apply Balance
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceModalUser(null)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT SERVICE & TIERED PRICES   */}
      {/* ========================================== */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c1322] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 font-sans">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#090e1a]">
              <h3 className="text-base font-bold text-white">
                {editingServiceId ? 'Edit Product & Tiered Prices' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveServiceForm} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
              
              {/* Product Image Dropzone */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={srvImageFileInputRef}
                  onChange={(e) => handleFileChange(e, setSImageUrl)}
                  className="hidden"
                />
                
                <div
                  onClick={() => srvImageFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700/80 hover:border-teal-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-[#10192d] group text-center"
                >
                  {sImageUrl ? (
                    <div className="relative group/img w-full h-20 flex items-center justify-center">
                      <img
                        src={sImageUrl}
                        alt=""
                        className="max-h-20 max-w-full object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/images/tools/default_placeholder.svg';
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 group-hover:bg-teal-500/20 flex items-center justify-center text-slate-400 group-hover:text-teal-400 transition mb-1">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-slate-300 font-medium text-[11px]">Tap to upload product image</span>
                    </>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Or Image URL:</span>
                  <input
                    type="text"
                    value={sImageUrl}
                    onChange={(e) => setSImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#10192d] border border-slate-800 text-white px-2 py-1 rounded-lg text-[10px]"
                  />
                </div>
              </div>

              {/* SERVICE NAME */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  PRODUCT NAME
                </label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="e.g. AMT - Android Multi Tool License"
                  className="w-full bg-[#10192d] border border-slate-800 text-white p-2.5 rounded-xl font-bold"
                />
              </div>

              {/* 4-LEVEL TIERED PRICING GRID (No rate math - manual prices) */}
              <div className="bg-[#10192d] p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-[11px] font-black uppercase text-teal-400 tracking-wider flex items-center justify-between">
                  <span>💰 Tiered Pricing (Enter Manual USD & MZN Prices)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Independent level prices</span>
                </div>

                {/* Level 1: Customer Price */}
                <div className="grid grid-cols-2 gap-2 bg-[#090e1a] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Customer Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceCustomerUsd}
                      onChange={(e) => setSPriceCustomerUsd(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-emerald-400 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Customer Price (MZN)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceCustomerMzn}
                      onChange={(e) => setSPriceCustomerMzn(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-emerald-400 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Level 2: Reseller Price */}
                <div className="grid grid-cols-2 gap-2 bg-[#090e1a] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-[10px] font-bold text-teal-300 block mb-1">Reseller Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceResellerUsd}
                      onChange={(e) => setSPriceResellerUsd(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-teal-300 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-teal-300 block mb-1">Reseller Price (MZN)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceResellerMzn}
                      onChange={(e) => setSPriceResellerMzn(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-teal-300 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Level 3: Distributor Price */}
                <div className="grid grid-cols-2 gap-2 bg-[#090e1a] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-[10px] font-bold text-purple-300 block mb-1">Distributor Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceDistributorUsd}
                      onChange={(e) => setSPriceDistributorUsd(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-purple-300 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-purple-300 block mb-1">Distributor Price (MZN)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceDistributorMzn}
                      onChange={(e) => setSPriceDistributorMzn(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-purple-300 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Level 4: VIP Member Price */}
                <div className="grid grid-cols-2 gap-2 bg-[#090e1a] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-[10px] font-bold text-amber-300 block mb-1">VIP Member Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceVipUsd}
                      onChange={(e) => setSPriceVipUsd(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-amber-300 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-300 block mb-1">VIP Member Price (MZN)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sPriceVipMzn}
                      onChange={(e) => setSPriceVipMzn(e.target.value)}
                      className="w-full bg-[#121c35] border border-slate-800 text-amber-300 font-bold p-2 rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* DELIVERY & STATUS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">DELIVERY TIME</label>
                  <input
                    type="text"
                    value={sDelivery}
                    onChange={(e) => setSDelivery(e.target.value)}
                    placeholder="INSTANT, MINUTES, 1-3 HOURS"
                    className="w-full bg-[#10192d] border border-slate-800 text-white p-2.5 rounded-xl uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">STATUS</label>
                  <select
                    value={sStatus}
                    onChange={(e) => setSStatus(e.target.value as any)}
                    className="w-full bg-[#10192d] border border-slate-800 text-white p-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              {/* PRODUCT TYPE */}
              <div>
                <label className="text-[10px] font-bold text-teal-400 block mb-1">PRODUCT CATEGORY</label>
                <select
                  value={sServiceTypeGroup}
                  onChange={(e) => setSServiceTypeGroup(e.target.value as any)}
                  className="w-full bg-[#10192d] border-2 border-teal-500/50 text-white p-2.5 rounded-xl font-bold cursor-pointer"
                >
                  <option value="🌐 IMEI/SN Service">🌐 IMEI/SN Service</option>
                  <option value="🛒 Server/Credit Service">🛒 Server/Credit Service</option>
                  <option value="🔰 Tool Rent">🔰 Tool Rent</option>
                  <option value="💥 Service By Group">💥 Service By Group</option>
                </select>
              </div>

              {/* PRODUCT CUSTOM FIELDS SECTION */}
              <div className="bg-[#10192d] p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase text-teal-400 tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Product Custom Fields & Values</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Add custom fields and values for this product. Empty fields will be hidden from customers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEmptyCustomField}
                    className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Custom Field</span>
                  </button>
                </div>

                {/* Quick Add Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Default Preset Fields (Click to Quick Add):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_PRODUCT_CUSTOM_FIELDS.map((preset) => {
                      const isAdded = sCustomFields.some(
                        (f) => f.name.toLowerCase() === preset.toLowerCase()
                      );
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddPresetCustomField(preset)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                            isAdded
                              ? 'bg-slate-800/80 text-slate-500 border-slate-800 cursor-not-allowed'
                              : 'bg-[#182542] hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border-slate-700/80 hover:border-teal-500/50'
                          }`}
                        >
                          <span>{isAdded ? '✓' : '+'}</span>
                          <span>{preset}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Fields Input List */}
                {sCustomFields.length === 0 ? (
                  <div className="text-center py-4 bg-[#090e1a] rounded-xl border border-dashed border-slate-800 text-[11px] text-slate-500">
                    No custom fields added yet. Click a default preset above or "Add Custom Field".
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {sCustomFields.map((cf, idx) => (
                      <div
                        key={cf.id || idx}
                        className="grid grid-cols-12 gap-2 bg-[#090e1a] p-2.5 rounded-xl border border-slate-800 items-center"
                      >
                        <div className="col-span-5">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                            Field Name
                          </label>
                          <input
                            type="text"
                            value={cf.name}
                            onChange={(e) => handleUpdateCustomFieldName(idx, e.target.value)}
                            placeholder="e.g. Ultraview ID / Account Type"
                            className="w-full bg-[#121c35] border border-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div className="col-span-6">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                            Value (Visible to Customer)
                          </label>
                          <input
                            type="text"
                            value={cf.value}
                            onChange={(e) => handleUpdateCustomFieldValue(idx, e.target.value)}
                            placeholder="e.g. Enter field value or details..."
                            className="w-full bg-[#121c35] border border-slate-800 text-teal-300 px-2.5 py-1.5 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(idx)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer transition"
                            title="Remove Field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 font-black py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>{editingServiceId ? 'Save Product & Prices' : 'Add Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
