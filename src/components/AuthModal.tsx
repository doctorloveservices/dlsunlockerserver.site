import React, { useState } from 'react';
import { X, Eye, EyeOff, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (updatedUser: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export function AuthModal({ isOpen, onClose, user, onLogin, onLogout }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user.fullName || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [currency, setCurrency] = useState('USD - US Dollar');
  const [showPassword, setShowPassword] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loginError, setLoginError] = useState(false);

  React.useEffect(() => {
    if (!user.isLoggedIn) {
      setMode('login');
      setEmail('');
      setPassword('');
      setName('');
      setSuccessMsg('');
      setLoginError(false);
    }
  }, [user.isLoggedIn]);

  if (!isOpen) return null;

  const handleLogoutClick = () => {
    onLogout();
    setMode('login');
    setEmail('');
    setPassword('');
    setName('');
    setSuccessMsg('');
    setLoginError(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(false);

    setTimeout(async () => {
      setIsLoading(false);
      const cleanInput = email.toLowerCase().trim();
      const cleanPass = password.trim();

      const isAdminUserAttempt =
        cleanInput === 'admin' ||
        cleanInput === 'admin@dlsunlockerserver.site' ||
        email.trim().toLowerCase() === 'admin';

      if (mode === 'login') {
        if (isAdminUserAttempt) {
          if (password === '869726969,Pe' || cleanPass === '869726969,Pe') {
            onLogin({
              username: 'Admin',
              fullName: 'Administrator',
              email: 'admin@dlsunlockerserver.site',
              balance: 10000.00,
              lockedBalance: 0.00,
              totalOrders: 0,
              completedOrders: 0,
              totalSpent: 0.00,
              totalReceipts: 0,
              vipTier: 'Distributor',
              isLoggedIn: true,
              isAdmin: true,
              role: 'admin',
            });
            setSuccessMsg('Logged in as Administrator (Admin)! Full Access Granted.');
            setTimeout(async () => {
              onClose();
            }, 1200);
          } else {
            setLoginError(true);
          }
        } else {
          // Check if user entered intentionally wrong credentials
          const isKnownIncorrect =
            cleanPass === 'wrong' ||
            cleanPass === 'error' ||
            cleanPass === 'fail' ||
            cleanPass === 'incorrect' ||
            cleanPass.length < 3;

          if (isKnownIncorrect) {
            setLoginError(true);
          } else {
            // Retrieve saved account from DB if available
            let matchedProfile: UserProfile | null = null;
            try {
              const res = await fetch('/api/db');
              const resData = await res.json();
              if (resData.success && resData.data && Array.isArray(resData.data.users)) {
                matchedProfile = resData.data.users.find(
                  (u: any) =>
                    (u.email && u.email.toLowerCase() === cleanInput) ||
                    (u.username && u.username.toLowerCase() === cleanInput)
                ) || null;
              }
            } catch {
              matchedProfile = null;
            }

            if (matchedProfile) {
              onLogin({
                ...matchedProfile,
                isLoggedIn: true,
              });
              setSuccessMsg(`Welcome back, ${matchedProfile.fullName || matchedProfile.username}!`);
            } else {
              // Create user profile using exact username/email entered
              const derivedName = cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput;
              const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
              const newProfile: UserProfile = {
                email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@dlsunlockerserver.site`,
                fullName: formattedName,
                username: derivedName,
                balance: 0.00,
                lockedBalance: 0.00,
                totalOrders: 0,
                completedOrders: 0,
                totalSpent: 0.00,
                totalReceipts: 0,
                vipTier: 'Customer',
                discountPercentage: 0,
                apiKey: `key_${derivedName}_${Date.now().toString().slice(-4)}`,
                whitelistedIPs: [],
                isLoggedIn: true,
                isAdmin: false,
                role: 'customer',
              };
              onLogin(newProfile);
              setSuccessMsg(`Logged in successfully as ${formattedName}!`);
            }

            setTimeout(async () => {
              onClose();
            }, 1000);
          }
        }
      } else {
        // Mode === 'register'
        const cleanPhone = mobileNumber.trim();
        if (!cleanPhone || cleanPhone.length < 5) {
          setIsLoading(false);
          alert('A valid phone number is mandatory to create an account.');
          return;
        }

        // Detect country and currency automatically from phone number
        const cleanDigits = cleanPhone.replace(/\s+|-|\(|\)/g, '');
        const isMozambique = cleanDigits.startsWith('+258') || cleanDigits.startsWith('258') || cleanDigits.startsWith('00258');
        const detectedCurrency: 'MZN' | 'USD' = isMozambique ? 'MZN' : 'USD';
        const detectedCountry = isMozambique ? 'Mozambique (+258)' : 'International';

        const newRegisteredUser: UserProfile = {
          email: cleanInput,
          fullName: name || cleanInput.split('@')[0],
          username: name ? name.toLowerCase().replace(/\s+/g, '_') : cleanInput.split('@')[0],
          phoneNumber: cleanPhone,
          country: detectedCountry,
          currency: detectedCurrency,
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
          isLoggedIn: true,
          isAdmin: false,
          role: 'customer',
          status: 'active',
        };

        try {
          const res = await fetch('/api/db');
          const resData = await res.json();
          let currentList: UserProfile[] = [];
          if (resData.success && resData.data && Array.isArray(resData.data.users)) {
            currentList = resData.data.users;
          }
          currentList = currentList.filter((u: any) => u.email.toLowerCase() !== cleanInput.toLowerCase());
          currentList.push(newRegisteredUser);
          await fetch('/api/db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users: currentList })
          });
        } catch (e) {
          console.error('Failed to sync new user', e);
        }

        onLogin(newRegisteredUser);
        setSuccessMsg(`Account created successfully! Detected Country: ${detectedCountry} (${detectedCurrency}). Welcome to DLS Unlocker Server.`);
        setTimeout(async () => {
          onClose();
        }, 1200);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative text-slate-900 dark:text-slate-100">
        
        {/* Modal Top Bar */}
        <div className="flex justify-between items-center px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </h2>
            {mode === 'register' && (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-md">
                Step 1/3
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition"
            id="close-auth-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-2 space-y-4">
          {successMsg ? (
            <div className="p-4 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="text-sm font-medium">{successMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* IMAGE 3: LOGIN FORM */}
              {mode === 'login' ? (
                <>
                  {loginError && (
                    <div className="p-4 bg-rose-50/95 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-2xl text-rose-900 dark:text-rose-100 text-xs sm:text-sm space-y-2.5 animate-fadeIn shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-rose-100 dark:bg-rose-900/60 rounded-full shrink-0 mt-0.5">
                          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-sm text-rose-900 dark:text-rose-100 leading-tight">
                            Login Failed
                          </h4>
                          <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-normal">
                            The email address, username, or password you entered is incorrect. Please check your credentials and try again.
                          </p>
                        </div>
                      </div>

                      <div className="pl-9 space-y-1.5 text-xs text-rose-800 dark:text-rose-200">
                        <p className="font-semibold text-rose-900 dark:text-rose-100">Please make sure that:</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-xs">
                          <li>Your email address or username is correct.</li>
                          <li>Your password is correct.</li>
                          <li>Caps Lock is turned off.</li>
                          <li>There are no extra spaces before or after your email or password.</li>
                        </ul>
                        <p className="pt-1.5 text-[11px] sm:text-xs text-rose-800 dark:text-rose-300">
                          If you forgot your password, click the{' '}
                          <button
                            type="button"
                            onClick={() => alert('Password reset instructions sent to email.')}
                            className="font-bold text-rose-900 dark:text-rose-100 hover:underline inline cursor-pointer"
                          >
                            "Forgot Password?"
                          </button>{' '}
                          link to reset it.
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Username / Email
                    </label>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (loginError) setLoginError(false);
                      }}
                      placeholder=""
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-white font-normal"
                      id="auth-email-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (loginError) setLoginError(false);
                        }}
                        placeholder=""
                        autoComplete="new-password"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-white font-mono"
                        id="auth-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        id="toggle-auth-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Trust device & Forgot */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={trustDevice}
                        onChange={(e) => setTrustDevice(e.target.checked)}
                        className="w-4 h-4 rounded text-[#008080] focus:ring-[#008080] border-slate-300 dark:border-slate-700 accent-[#008080]"
                        id="trust-device-checkbox"
                      />
                      <span>Trust this device</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions sent to email.')}
                      className="font-medium text-[#008080] dark:text-teal-400 hover:underline"
                      id="forgot-password-link"
                    >
                      Forgot?
                    </button>
                  </div>

                  {/* Primary Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#008080] hover:bg-[#006666] active:bg-[#004d4d] text-white font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                      id="submit-auth-form"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Log In'
                      )}
                    </button>
                  </div>

                  {/* Divider OR */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium lowercase">
                      or
                    </span>
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  </div>

                  {/* Create Account Outlined Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setStep(1);
                    }}
                    className="w-full py-2.5 bg-white dark:bg-transparent border border-[#008080] text-[#008080] dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 font-semibold rounded-lg transition text-sm cursor-pointer"
                    id="toggle-auth-mode"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                /* IMAGE 4: CREATE ACCOUNT FORM (Step 1/3) */
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-white placeholder:text-slate-400 font-normal"
                      id="reg-name-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-white placeholder:text-slate-400 font-normal"
                      id="reg-email-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mobile Number <span className="text-rose-500 font-bold">* (Mandatory)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        const cleanDigits = e.target.value.replace(/\s+|-|\(|\)/g, '');
                        if (cleanDigits.startsWith('+258') || cleanDigits.startsWith('258') || cleanDigits.startsWith('00258')) {
                          setCurrency('MZN - Mozambican Metical');
                        } else {
                          setCurrency('USD - US Dollar');
                        }
                      }}
                      placeholder="+258 84 000 0000 or +1..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-white placeholder:text-slate-400 font-normal"
                      id="reg-mobile-input"
                    />
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-medium">
                      Mozambique (+258) = MZN Prices | Other Countries = USD Prices
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-white appearance-none cursor-pointer pr-10 font-normal"
                        id="reg-currency-select"
                      >
                        <option value="USD - US Dollar">USD - US Dollar</option>
                        <option value="EUR - Euro">EUR - Euro</option>
                        <option value="MZN - Mozambican Metical">MZN - Mozambican Metical</option>
                        <option value="ZAR - South African Rand">ZAR - South African Rand</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#008080] hover:bg-[#006666] active:bg-[#004d4d] text-white font-semibold rounded-lg shadow transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                      id="reg-continue-btn"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>

                  {/* Divider OR */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-medium lowercase">
                      or
                    </span>
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  </div>

                  {/* Back to Log In Outlined Button */}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full py-2.5 bg-white dark:bg-transparent border border-[#008080] text-[#008080] dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 font-semibold rounded-lg transition text-sm cursor-pointer"
                    id="back-to-login-btn"
                  >
                    Back to Log In
                  </button>
                </>
              )}
            </form>
          )}

          {user.isLoggedIn && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2 cursor-pointer"
                id="auth-logout-button"
              >
                Logout Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

