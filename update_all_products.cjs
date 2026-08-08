const fs = require('fs');

const imeiServices = [
  {
    id: 'imei-01',
    name: 'HFZ Activator A12+ Hello Bypass with Signal (iOS 15 - 18)',
    brand: 'Apple',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 18.50,
    priceMzn: 1184,
    priceCustomerUsd: 18.50,
    priceCustomerMzn: 1184,
    priceResellerUsd: 16.00,
    priceResellerMzn: 1024,
    priceDistributorUsd: 14.50,
    priceDistributorMzn: 928,
    priceVipUsd: 13.00,
    priceVipMzn: 832,
    deliveryTime: '1-10 MINUTES',
    badgeTag: 'INSTANT',
    isInstant: true,
    isHot: true,
    successRate: 99.8,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'HFZ Activator A12+ Hello Screen Bypass with full cellular network signal, FaceTime & iCloud services support.',
    requirements: ['Enter Device Serial Number (SN)', 'Enter Device IMEI']
  },
  {
    id: 'imei-02',
    name: 'iKey Prime / iBypass LPRO iCloud Bypass with Call/SMS',
    brand: 'Apple',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 14.00,
    priceMzn: 896,
    priceCustomerUsd: 14.00,
    priceCustomerMzn: 896,
    priceResellerUsd: 12.00,
    priceResellerMzn: 768,
    priceDistributorUsd: 11.00,
    priceDistributorMzn: 704,
    priceVipUsd: 10.00,
    priceVipMzn: 640,
    deliveryTime: '1-15 MINUTES',
    badgeTag: 'INSTANT',
    isInstant: true,
    isHot: true,
    successRate: 99.5,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'iKey Prime LPRO A12+ Hello screen bypass tool with full cellular signal, notifications, and iMessage.',
    requirements: ['Enter Device Serial Number (SN)']
  },
  {
    id: 'imei-03',
    name: 'iPhone Carrier Factory Unlock (AT&T USA - Premium All Models)',
    brand: 'Apple',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 12.50,
    priceMzn: 800,
    priceCustomerUsd: 12.50,
    priceCustomerMzn: 800,
    priceResellerUsd: 10.50,
    priceResellerMzn: 672,
    priceDistributorUsd: 9.00,
    priceDistributorMzn: 576,
    priceVipUsd: 8.00,
    priceVipMzn: 512,
    deliveryTime: '1-24 HOURS',
    badgeTag: '1-24 HOURS',
    successRate: 99.0,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Official permanent factory network unlock for AT&T iPhones (iPhone 6 up to iPhone 16 Pro Max).',
    requirements: ['Enter IMEI Number']
  },
  {
    id: 'imei-04',
    name: 'Apple GSX Full Check & Serial Info Auto Report',
    brand: 'Apple GSX',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 1.20,
    priceMzn: 76.8,
    priceCustomerUsd: 1.20,
    priceCustomerMzn: 76.8,
    priceResellerUsd: 1.00,
    priceResellerMzn: 64.0,
    priceDistributorUsd: 0.85,
    priceDistributorMzn: 54.4,
    priceVipUsd: 0.70,
    priceVipMzn: 44.8,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Official Apple GSX carrier check, FMI status, warranty status, and original purchase country report.',
    requirements: ['Enter IMEI / Serial Number']
  },
  {
    id: 'imei-05',
    name: 'Samsung FRP Removal via USB Remote / Server Key',
    brand: 'Samsung',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 8.50,
    priceMzn: 544,
    priceCustomerUsd: 8.50,
    priceCustomerMzn: 544,
    priceResellerUsd: 7.50,
    priceResellerMzn: 480,
    priceDistributorUsd: 6.50,
    priceDistributorMzn: 416,
    priceVipUsd: 5.50,
    priceVipMzn: 352,
    deliveryTime: '5-15 MINUTES',
    badgeTag: '5-15 MINUTES',
    isInstant: false,
    successRate: 99.7,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Instant Samsung FRP Google Account Removal for all Android versions (Android 11, 12, 13, 14, 15).',
    requirements: ['Enter USB Redirector IP Address', 'Enter Samsung Phone Model']
  },
  {
    id: 'imei-06',
    name: 'Xiaomi Find My Device Off / Account Auth Lock Removal',
    brand: 'Xiaomi',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 11.00,
    priceMzn: 704,
    priceCustomerUsd: 11.00,
    priceCustomerMzn: 704,
    priceResellerUsd: 9.50,
    priceResellerMzn: 608,
    priceDistributorUsd: 8.50,
    priceDistributorMzn: 544,
    priceVipUsd: 7.50,
    priceVipMzn: 480,
    deliveryTime: '10-30 MINUTES',
    badgeTag: '10-30 MINUTES',
    successRate: 99.2,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Official Xiaomi Mi Account & Find Device lock removal worldwide server response.',
    requirements: ['Enter Lock Code from Screen']
  },
  {
    id: 'imei-07',
    name: 'Motorola FRP & Bootloader Unlock Code Server',
    brand: 'Motorola',
    category: 'imei_sn',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 5.00,
    priceMzn: 320,
    priceCustomerUsd: 5.00,
    priceCustomerMzn: 320,
    priceResellerUsd: 4.20,
    priceResellerMzn: 268.8,
    priceDistributorUsd: 3.50,
    priceDistributorMzn: 224,
    priceVipUsd: 3.00,
    priceVipMzn: 192,
    deliveryTime: '1-3 HOURS',
    badgeTag: '1-3 HOURS',
    successRate: 99.0,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Official Motorola bootloader unlock key & FRP bypass code.',
    requirements: ['Enter IMEI Number']
  }
];

const serverServices = [
  {
    id: 'server-01',
    name: 'Z3X Samsung Tool Server Credits (10 Credits)',
    brand: 'Z3X',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 12.00,
    priceMzn: 768,
    priceCustomerUsd: 12.00,
    priceCustomerMzn: 768,
    priceResellerUsd: 10.50,
    priceResellerMzn: 672,
    priceDistributorUsd: 9.50,
    priceDistributorMzn: 608,
    priceVipUsd: 8.50,
    priceVipMzn: 544,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: '10 Server Credits for Z3X Samsung Tool account auto credit refill.',
    requirements: ['Enter Z3X Username']
  },
  {
    id: 'server-02',
    name: 'Chimera Tool Server Credits (100 Credits)',
    brand: 'Chimera',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 11.50,
    priceMzn: 736,
    priceCustomerUsd: 11.50,
    priceCustomerMzn: 736,
    priceResellerUsd: 10.00,
    priceResellerMzn: 640,
    priceDistributorUsd: 9.00,
    priceDistributorMzn: 576,
    priceVipUsd: 8.00,
    priceVipMzn: 512,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: '100 Chimera Tool Server Credits for repair and unlock operations.',
    requirements: ['Enter Chimera Username']
  },
  {
    id: 'server-03',
    name: 'Octoplus Server Credits (50 Credits)',
    brand: 'Octoplus',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 15.00,
    priceMzn: 960,
    priceCustomerUsd: 15.00,
    priceCustomerMzn: 960,
    priceResellerUsd: 13.50,
    priceResellerMzn: 864,
    priceDistributorUsd: 12.00,
    priceDistributorMzn: 768,
    priceVipUsd: 11.00,
    priceVipMzn: 704,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: '50 Octoplus Box / Digital Server Credits auto top-up.',
    requirements: ['Enter Octoplus Username / Serial']
  },
  {
    id: 'server-04',
    name: 'UnlockTool Digital Server Credits (10 Credits)',
    brand: 'Unlock Tool',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 10.00,
    priceMzn: 640,
    priceCustomerUsd: 10.00,
    priceCustomerMzn: 640,
    priceResellerUsd: 9.00,
    priceResellerMzn: 576,
    priceDistributorUsd: 8.00,
    priceDistributorMzn: 512,
    priceVipUsd: 7.00,
    priceVipMzn: 448,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: '10 UnlockTool server credits for Samsung / Xiaomi / Oppo auth operations.',
    requirements: ['Enter UnlockTool Account Email']
  },
  {
    id: 'server-05',
    name: 'Pandora Tool Server Credits (10 Credits)',
    brand: 'Pandora',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 12.00,
    priceMzn: 768,
    priceCustomerUsd: 12.00,
    priceCustomerMzn: 768,
    priceResellerUsd: 10.50,
    priceResellerMzn: 672,
    priceDistributorUsd: 9.50,
    priceDistributorMzn: 608,
    priceVipUsd: 8.50,
    priceVipMzn: 544,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Pandora Tool account server credits for MediaTek & Unisoc devices.',
    requirements: ['Enter Pandora Box Serial / Username']
  },
  {
    id: 'server-06',
    name: 'AMT - Android Multi Tool Server Credits (10 Credits)',
    brand: 'AMT',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 8.00,
    priceMzn: 512,
    priceCustomerUsd: 8.00,
    priceCustomerMzn: 512,
    priceResellerUsd: 7.00,
    priceResellerMzn: 448,
    priceDistributorUsd: 6.00,
    priceDistributorMzn: 384,
    priceVipUsd: 5.00,
    priceVipMzn: 320,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Android Multi Tool (AMT) account credits refill.',
    requirements: ['Enter AMT Username']
  },
  {
    id: 'server-07',
    name: 'SamKEY Code / Credits for Samsung Unlock (3 Credits)',
    brand: 'SamKEY',
    category: 'server_credit',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 6.50,
    priceMzn: 416,
    priceCustomerUsd: 6.50,
    priceCustomerMzn: 416,
    priceResellerUsd: 5.50,
    priceResellerMzn: 352,
    priceDistributorUsd: 5.00,
    priceDistributorMzn: 320,
    priceVipUsd: 4.50,
    priceVipMzn: 288,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    isInstant: true,
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Official SamKEY Server Credits for instant Samsung network unlock.',
    requirements: ['Enter SamKEY Username']
  }
];

// Load existing products from servicesData.ts
const servicesDataText = fs.readFileSync('src/data/servicesData.ts', 'utf8');

// Extract existing ALL_SERVICES array block
const match = servicesDataText.match(/export const ALL_SERVICES: IMEIService\[\] = (\[[\s\S]*?\];)/);
if (!match) {
  console.error("Could not find ALL_SERVICES in servicesData.ts");
  process.exit(1);
}

// Parse existing items
let existingItems = [];
try {
  existingItems = eval(match[1].slice(0, -1)); // remove trailing semicolon
} catch (e) {
  console.error("Failed to eval ALL_SERVICES", e);
  process.exit(1);
}

// Re-categorize existing items if they match Vivo / Halabtech / Firmware
existingItems.forEach(item => {
  if (item.id === 'tool-rent-40') {
    item.category = 'imei_sn';
    item.type = 'imei';
    item.serviceTypeGroup = '🌐 IMEI/SN Service';
  } else if (item.id >= 'tool-rent-41' && item.id <= 'tool-rent-47') {
    item.category = 'service_group';
    item.type = 'file';
    item.serviceTypeGroup = '💥 Service By Group';
  } else {
    item.category = 'tool_rent';
    item.type = 'tool_rent';
    item.serviceTypeGroup = '🔰 Tool Rent';
  }
});

// Combine all services: imeiServices + serverServices + existingItems
const combinedServices = [...imeiServices, ...serverServices, ...existingItems];

console.log(`Total services generated: ${combinedServices.length}`);

// Write to database.json
const dbContent = {
  services: combinedServices,
  websiteLive: true,
  orders: [],
  announcements: [
    {
      id: 'ann-1',
      type: 'success',
      title: 'SYSTEM GATEWAY ONLINE',
      message: 'dlsunlockerserver.site 2026 Direct API Connections Active. Apple GSX, HFZ Bypass & Samsung FRP Auto 24/7.',
      timestamp: 'Just now'
    },
    {
      id: 'ann-2',
      type: 'info',
      title: 'TOOL RENT UPDATE',
      message: 'UnlockTool, AMT Tool & Chimera Rentals updated with instant login credentials.',
      timestamp: '1 hour ago'
    }
  ]
};

fs.writeFileSync('database.json', JSON.stringify(dbContent, null, 2));

// Update servicesData.ts
const newAllServicesString = `export const ALL_SERVICES: IMEIService[] = ${JSON.stringify(combinedServices, null, 2)};`;

const updatedServicesDataText = servicesDataText.replace(
  /export const ALL_SERVICES: IMEIService\[\] = \[[\s\S]*?\];/,
  newAllServicesString
);

fs.writeFileSync('src/data/servicesData.ts', updatedServicesDataText);
console.log("Updated database.json and src/data/servicesData.ts successfully!");
