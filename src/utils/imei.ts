/**
 * Validates IMEI using Luhn Algorithm (MOD 10)
 */
export function isValidIMEI(imei: string): boolean {
  const cleanIMEI = imei.trim().replace(/\D/g, '');
  if (cleanIMEI.length !== 15) return false;

  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(cleanIMEI.charAt(i), 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Parses TAC (Type Allocation Code - first 8 digits of IMEI)
 */
export function parseTAC(imei: string): { brand: string; model: string; manufacturer: string } | null {
  const cleanIMEI = imei.trim().replace(/\D/g, '');
  if (cleanIMEI.length < 8) return null;

  const tac = cleanIMEI.substring(0, 8);

  // TAC Database simulation for popular devices
  const tacMap: Record<string, { brand: string; model: string; manufacturer: string }> = {
    '35208109': { brand: 'Apple', model: 'iPhone 13 Pro', manufacturer: 'Apple Inc.' },
    '35284311': { brand: 'Apple', model: 'iPhone 14 Pro Max', manufacturer: 'Apple Inc.' },
    '35820411': { brand: 'Apple', model: 'iPhone 15 Pro', manufacturer: 'Apple Inc.' },
    '35324110': { brand: 'Apple', model: 'iPhone 12', manufacturer: 'Apple Inc.' },
    '35482910': { brand: 'Apple', model: 'iPhone 11', manufacturer: 'Apple Inc.' },
    '35691011': { brand: 'Samsung', model: 'Galaxy S23 Ultra 5G', manufacturer: 'Samsung Electronics' },
    '35928111': { brand: 'Samsung', model: 'Galaxy S24 Ultra', manufacturer: 'Samsung Electronics' },
    '35492109': { brand: 'Samsung', model: 'Galaxy A54 5G', manufacturer: 'Samsung Electronics' },
    '35719208': { brand: 'Google', model: 'Pixel 8 Pro', manufacturer: 'Google LLC' },
    '35628109': { brand: 'Xiaomi', model: '13 Pro 5G', manufacturer: 'Xiaomi Communications' },
    '35819207': { brand: 'Motorola', model: 'Edge 40 Pro', manufacturer: 'Motorola Mobility' },
  };

  if (tacMap[tac]) return tacMap[tac];

  // Heuristic based on TAC prefix
  if (tac.startsWith('352') || tac.startsWith('358') || tac.startsWith('353') || tac.startsWith('354') || tac.startsWith('356')) {
    const digitSum = Array.from(tac).reduce((a, b) => a + parseInt(b), 0);
    if (digitSum % 3 === 0) return { brand: 'Apple', model: 'iPhone 14 / 15 Series', manufacturer: 'Apple Inc.' };
    if (digitSum % 3 === 1) return { brand: 'Samsung', model: 'Galaxy S Series / Z Fold', manufacturer: 'Samsung Electronics' };
    return { brand: 'Google', model: 'Pixel Smartphone', manufacturer: 'Google LLC' };
  }

  return { brand: 'Generic GSM Device', model: '3G/4G/5G Smartphone', manufacturer: 'Global OEM' };
}

/**
 * Format currency
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate random unlock code / cert token
 */
export function generateRandomCode(brand: string): string {
  if (brand.toLowerCase() === 'apple') {
    return 'UNLOCKED_IN_APPLE_GSX_DATABASE [Status: Factory Unlocked]';
  }
  if (brand.toLowerCase() === 'samsung') {
    const nck = Math.floor(10000000 + Math.random() * 90000000);
    const mcK = Math.floor(10000000 + Math.random() * 90000000);
    return `NCK: ${nck} | MCK: ${mcK} [Samsung Official Database]`;
  }
  const code = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  return `NETWORK_CODE: ${code}`;
}
