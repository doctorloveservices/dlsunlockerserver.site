import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight,
  Info,
  AlertTriangle
} from 'lucide-react';
import { IMEIService, UserProfile, Order, CustomerOrderField } from '../types';
import { ProductLogo } from './ProductLogo';
import { getServicePrice } from '../utils/priceUtils';

interface OrderFormViewProps {
  services: IMEIService[];
  user: UserProfile;
  selectedService: IMEIService | null;
  setSelectedService: (service: IMEIService) => void;
  onSubmitOrder: (newOrders: Order[]) => void;
  onOpenTopUp: () => void;
  setActiveTab: (tab: string) => void;
  onDeductBalance?: (amount: number) => void;
  adminWhatsAppNumber?: string;
}

export const OrderFormView: React.FC<OrderFormViewProps> = ({
  services,
  user,
  selectedService,
  setSelectedService,
  onSubmitOrder,
  onOpenTopUp,
  setActiveTab,
  onDeductBalance,
  adminWhatsAppNumber = '258869726969', // Admin WhatsApp phone number
}) => {
  const activeService = selectedService || services[0];

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [insufficientBalanceError, setInsufficientBalanceError] = useState(false);

  // Dynamic custom fields state
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  // Reset custom fields when selected product changes
  useEffect(() => {
    setCustomFieldValues({});
    setInsufficientBalanceError(false);
    setOrderSuccess(null);
  }, [activeService?.id]);

  if (!activeService) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 max-w-lg mx-auto my-8 shadow-xs">
        <Info className="w-8 h-8 text-teal-600 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Product Selected</h3>
        <p className="text-xs">Please select a product from the catalog to place an order.</p>
        <button
          onClick={() => setActiveTab('imei_services')}
          className="bg-[#008080] text-white font-bold text-xs px-4 py-2 rounded-xl mt-2 cursor-pointer"
        >
          View Product Catalog
        </button>
      </div>
    );
  }

  // Calculate pricing based on currency & level
  const currency = user.currency || 'USD';
  const userLevel = user.userLevel || 'customer';
  const totalCost = getServicePrice(activeService, userLevel, currency);
  const priceDisplay = currency === 'MZN' ? `${totalCost.toFixed(2)} MZN` : `${totalCost.toFixed(2)} USD`;

  const hasSufficientBalance = user.balance >= totalCost;
  const isOutOfStock = activeService.status === 'maintenance' || activeService.status === 'Offline';

  const customFields: CustomerOrderField[] = activeService.customerOrderFields || [];

  // Check if all required custom fields are filled
  const areRequiredFieldsFilled = customFields.every((field) => {
    if (!field.required) return true;
    const val = customFieldValues[field.id];
    return val !== undefined && val.trim() !== '';
  });

  const isOrderButtonDisabled = !agreedTerms || !areRequiredFieldsFilled || isSubmitting || isOutOfStock;

  const handleCustomFieldChange = (fieldId: string, val: string) => {
    setCustomFieldValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInsufficientBalanceError(false);

    if (!agreedTerms) {
      alert('You must agree to the Terms and Conditions before placing an order.');
      return;
    }

    if (isOutOfStock) {
      alert('This product is currently out of stock.');
      return;
    }

    // Wallet Balance Check
    if (!hasSufficientBalance) {
      setInsufficientBalanceError(true);
      return;
    }

    if (!areRequiredFieldsFilled) {
      alert('Please fill in all required custom fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Deduct balance from user wallet
      if (onDeductBalance) {
        onDeductBalance(totalCost);
      }

      const orderNum = `DLS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const isInstant = activeService.isInstant || activeService.deliveryTime?.toUpperCase().includes('INSTANT');
      const submittedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Build field summary string
      const fieldSummaryList = customFields.map((f) => `${f.label}: ${customFieldValues[f.id] || 'N/A'}`).join(' | ');

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        serviceId: activeService.id,
        serviceName: activeService.name,
        brand: activeService.brand,
        imei: fieldSummaryList || 'Digital Service Request',
        cost: totalCost,
        status: isInstant ? 'completed' : 'in_process',
        code: isInstant ? `PROCESSED_INSTANTLY` : undefined,
        replyMessage: isInstant ? 'Processed instantly' : 'Processing with gateway...',
        submittedAt: submittedDate,
        completedAt: isInstant ? submittedDate : undefined,
        userEmail: user.email,
        userName: user.fullName || user.username,
        userPhone: user.phoneNumber || 'N/A',
      };

      onSubmitOrder([newOrder]);
      setIsSubmitting(false);
      setOrderSuccess(`Order #${orderNum} placed successfully!`);

      // WhatsApp Admin Auto-Notification
      try {
        let waText = `*NEW ORDER PLACED* 🛒\n`;
        waText += `-------------------------\n`;
        waText += `*Order ID:* #${orderNum}\n`;
        waText += `*Product Name:* ${activeService.name}\n`;
        waText += `*Product Price:* ${priceDisplay}\n`;
        waText += `*Customer Name:* ${user.fullName || user.username}\n`;
        waText += `*Customer Email:* ${user.email}\n`;
        waText += `*Customer Phone:* ${user.phoneNumber || 'N/A'}\n`;
        waText += `*Date & Time:* ${submittedDate}\n`;
        waText += `-------------------------\n`;
        
        if (customFields.length > 0) {
          waText += `*CUSTOM FIELDS DETAILS:*\n`;
          customFields.forEach((f) => {
            waText += `• *${f.label}:* ${customFieldValues[f.id] || 'N/A'}\n`;
          });
          waText += `-------------------------\n`;
        }
        waText += `Please process this order. Thank you!`;

        const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
      } catch (err) {
        console.error('WhatsApp notification error:', err);
      }

      // Reset fields
      setCustomFieldValues({});
    }, 600);
  };

  const categoryLabel = 
    activeService.serviceTypeGroup || 
    (activeService.type === 'tool_rent' ? 'Tool Rent' : activeService.type === 'server' ? 'Server/Credit Service' : 'IMEI/SN Service');

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2 px-2 sm:px-4">
      {/* Main Order Card matching GSMCheap detail page */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        
        {/* Top Product Image Container (Full Image, Uncropped, aspect ratio preserved) */}
        <div className="bg-[#f5f8f7] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-6 sm:p-8 flex items-center justify-center min-h-[180px] max-h-64 shadow-xs overflow-hidden">
          <ProductLogo
            logoUrl={activeService.logoUrl}
            imageUrl={activeService.imageUrl}
            brand={activeService.brand}
            serviceName={activeService.name}
            size="full"
            className="w-full h-48 sm:h-56 border-0 bg-transparent shadow-none p-0"
          />
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          <button
            onClick={() => setActiveTab('home')}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => {
              if (activeService.type === 'tool_rent') setActiveTab('tool_rent');
              else if (activeService.type === 'server') setActiveTab('server_services');
              else setActiveTab('imei_services');
            }}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
          >
            {categoryLabel}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            Place an order
          </span>
        </nav>

        {/* Product Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {activeService.name}
          </h1>
          {activeService.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {activeService.description}
            </p>
          )}
        </div>

        {/* GSMCheap Stat Row Grid: PRICE | DELIVERY | STATUS */}
        <div className="grid grid-cols-3 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/60 dark:bg-slate-800/40 divide-x divide-slate-200 dark:divide-slate-800">
          <div className="p-4 sm:p-5 text-left">
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
              PRICE
            </div>
            <div className="text-base sm:text-xl font-black text-[#008080] dark:text-teal-400 font-mono">
              {priceDisplay}
            </div>
          </div>

          <div className="p-4 sm:p-5 text-left">
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
              DELIVERY
            </div>
            <div className="text-base sm:text-xl font-extrabold text-amber-600 dark:text-amber-400">
              {activeService.deliveryTime || 'Instant'}
            </div>
          </div>

          <div className="p-4 sm:p-5 text-left">
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
              STATUS
            </div>
            <div
              className={`text-base sm:text-xl font-black ${
                isOutOfStock
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </div>
          </div>
        </div>

        {/* Product Custom Fields & Specifications (Admin Defined) */}
        {activeService.customFields &&
          activeService.customFields.filter((f) => f.value && f.value.trim() !== '').length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-500" />
                <span>Product Details & Specifications</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeService.customFields
                  .filter((f) => f.value && f.value.trim() !== '')
                  .map((field, idx) => (
                    <div
                      key={field.id || idx}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xs flex flex-col justify-center"
                    >
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                        {field.name}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono mt-0.5 select-all">
                        {field.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Insufficient Balance Alert */}
        {insufficientBalanceError && (
          <div className="bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 p-4 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3 animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-sm">Insufficient Wallet Balance</div>
              <p className="mt-1">
                Your current wallet balance is <strong>{currency === 'MZN' ? `${user.balance.toFixed(2)} MZN` : `$${user.balance.toFixed(2)} USD`}</strong>. You need <strong>{priceDisplay}</strong> to place this order. Please deposit funds into your account to continue.
              </p>
              <button
                type="button"
                onClick={onOpenTopUp}
                className="mt-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider cursor-pointer"
              >
                Top Up / Deposit Funds
              </button>
            </div>
          </div>
        )}

        {/* Order Success Alert */}
        {orderSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 p-4 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex justify-between items-center animate-fadeIn">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{orderSuccess}</span>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="underline text-xs font-bold hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer"
            >
              View Orders &rarr;
            </button>
          </div>
        )}

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          
          {/* Custom Fields Section (Only renders if admin configured custom fields) */}
          {customFields.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                Required Order Details
              </div>

              {customFields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={customFieldValues[field.id] || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                    >
                      <option value="">-- Select {field.label} --</option>
                      {(field.options || []).map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      rows={3}
                      value={customFieldValues[field.id] || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}...`}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 font-mono"
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      required={field.required}
                      value={customFieldValues[field.id] || ''}
                      onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}...`}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 font-mono transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Default Mandatory Terms & Conditions Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#008080] focus:ring-[#008080] cursor-pointer"
            />
            <label
              htmlFor="terms-checkbox"
              className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
            >
              I agree to the <span className="text-[#008080] dark:text-teal-400 font-bold underline">terms and conditions</span>
            </label>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isOrderButtonDisabled}
            className="w-full bg-[#008080] hover:bg-[#006666] text-white font-black text-sm sm:text-base uppercase tracking-widest py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            id="place-an-order-submit-btn"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <span>PLACE AN ORDER</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
