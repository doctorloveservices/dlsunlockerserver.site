export type UserLevel = 'customer' | 'reseller' | 'distributor' | 'vip';

export type ServiceCategory = 
  | 'apple_icloud' 
  | 'apple_network' 
  | 'samsung_frp' 
  | 'carrier_unlock' 
  | 'blacklist_check' 
  | 'xiaomi_account' 
  | 'motorola_lg' 
  | 'remote_usb' 
  | 'file_services'
  | 'tool_rent'
  | 'service_group'
  | 'imei_sn'
  | 'server_credit';

export type ServiceType = 'imei' | 'server' | 'file' | 'tool_rent';

export interface CustomerOrderField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface ProductCustomField {
  id?: string;
  name: string;
  value: string;
}

export type ProductType = 
  | '🌐 IMEI/SN Service'
  | '🛒 Server/Credit Service'
  | '🔰 Tool Rent'
  | '💥 Service By Group'
  | 'IMEI/SN Service' 
  | 'Server/Credit Service' 
  | 'Tool Rent' 
  | 'Service By Group'
  | 'IMEI/SN'
  | 'Server/Credit'
  | 'Service Group';

export interface IMEIService {
  id: string;
  name: string;
  category: ServiceCategory;
  type: ServiceType;
  serviceTypeGroup?: ProductType;
  brand: string;
  price: number; // Customer USD
  priceReseller?: number; // Reseller USD
  priceDistributor?: number; // Distributor USD
  priceVip?: number; // VIP USD
  priceMzn?: number; // Customer MZN
  priceMznReseller?: number; // Reseller MZN
  priceMznDistributor?: number; // Distributor MZN
  priceMznVip?: number; // VIP MZN
  priceCustomerUsd?: number;
  priceCustomerMzn?: number;
  priceResellerUsd?: number;
  priceResellerMzn?: number;
  priceDistributorUsd?: number;
  priceDistributorMzn?: number;
  priceVipUsd?: number;
  priceVipMzn?: number;
  originalPrice?: number;
  deliveryTime: string; // e.g. "INSTANT, MINUTES, 1-3 HOURS"
  successRate: number; // e.g. 99.4
  requiresIMEI?: boolean;
  requiresSN?: boolean;
  requiresProviderID?: boolean;
  description: string;
  requirements?: string[];
  isHot?: boolean;
  isInstant?: boolean;
  status: 'active' | 'maintenance' | 'Online' | 'Offline';
  imageUrl?: string;
  logoUrl?: string; // Product logo image URL
  badgeTag?: string; // e.g. "INSTANT", "5-15 MINUTES", "0-6 HOURS"
  sortOrder?: number;
  toolDownloadUrl?: string; // TOOL / DRIVER DOWNLOAD LINK (URL)
  customerOrderFields?: CustomerOrderField[];
  customFields?: ProductCustomField[];
  visibleToUsers?: boolean;
}

export interface SlideItem {
  id: string;
  badge: string;
  badgeColor?: string;
  title: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  bgGradient?: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

export type OrderStatus = 'in_process' | 'completed' | 'rejected' | 'waiting_carrier';

export interface Order {
  id: string;
  orderNumber: string;
  serviceId: string;
  serviceName: string;
  brand: string;
  imei: string;
  serialNumber?: string;
  cost: number;
  status: OrderStatus;
  code?: string; // Unlock code, cert, or result details
  replyMessage?: string;
  submittedAt: string;
  completedAt?: string;
  clientRef?: string;
  ipAddress?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

export interface UserProfile {
  id?: string;
  username: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  currency?: 'USD' | 'MZN';
  userLevel?: UserLevel;
  balance: number;
  lockedBalance: number;
  vipTier: 'Bronze Reseller' | 'Silver Reseller' | 'Gold VIP Reseller' | 'Master Distributor' | 'Distributor' | string;
  discountPercentage: number;
  apiKey: string;
  whitelistedIPs: string[];
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  totalReceipts: number;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  status?: 'active' | 'banned';
  role?: 'admin' | 'customer' | 'reseller' | 'distributor' | 'vip' | string;
}

export interface PlatformSettings {
  general: {
    websiteLogo: string;
    platformName: string;
    siteDescription: string;
    contactNumber: string;
    whatsAppNumber: string;
    email: string;
    currencySettings: string;
    timeZone: string;
  };
  switches: {
    maintenanceMode: boolean;
    userRegistration: boolean;
    walletDeposits: boolean;
    walletWithdrawals: boolean;
    productOrders: boolean;
    whatsAppNotifications: boolean;
    emailNotifications: boolean;
    announcementSlider: boolean;
    userLogin: boolean;
  };
  appearance: {
    websiteTheme: 'dark' | 'light' | 'system';
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
  };
  security: {
    googleRecaptcha: boolean;
    otpVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeoutMinutes: number;
  };
  payment: {
    usdWallet: boolean;
    mznWallet: boolean;
    mobileMoney: boolean;
    bankTransfer: boolean;
    cryptocurrency: boolean;
  };
  alerts: {
    announcementSliderText: string;
    popupNoticesEnabled: boolean;
    popupNoticeText: string;
    maintenanceMessage: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface NotificationLogItem {
  id: string;
  timestamp: string;
  recipientEmail: string;
  subject: string;
  body: string;
  status: 'sent' | 'queued' | 'failed';
  orderId?: string;
  orderNumber?: string;
}

export interface StatementItem {
  id: string;
  date: string;
  type: 'deposit' | 'order_charge' | 'refund' | 'bonus';
  description: string;
  amount: number;
  balanceAfter: number;
  referenceId?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  userEmail: string;
  userName: string;
  serviceName: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  paymentMethod: string;
  txHash?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  date?: string;
  timestamp?: string;
}

export interface IMEICheckResult {
  imei: string;
  validLuhn: boolean;
  tacInfo?: {
    brand: string;
    model: string;
    deviceType: string;
    manufacturer: string;
  };
  iCloudStatus?: 'CLEAN' | 'LOST/STOLEN' | 'OFF' | 'ON';
  carrierLock?: 'LOCKED' | 'UNLOCKED' | 'UNKNOWN';
  carrierName?: string;
  blacklistStatus?: 'CLEAN' | 'BLACKLISTED' | 'REPORTED STOLEN';
  warrantyStatus?: 'Active' | 'Expired';
  purchaseCountry?: string;
  estimatedUnlockCost?: number;
  recommendedServiceId?: string;
}

export interface AIUnlockAnalysis {
  deviceModel: string;
  lockType: string;
  feasibilityScore: number; // 0 - 100
  verdict: 'EASY_UNLOCK' | 'MODERATE' | 'HARD_SERVER' | 'IMPOSSIBLE';
  summary: string;
  recommendedServices: {
    serviceId: string;
    serviceName: string;
    reason: string;
    estimatedCost: number;
    estimatedTime: string;
  }[];
  stepByStepGuide: string[];
  importantWarnings: string[];
}
