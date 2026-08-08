const fs = require('fs');

const servicesDataPath = './src/data/servicesData.ts';
let content = fs.readFileSync(servicesDataPath, 'utf8');

const newProducts = `
  {
    id: 'imei-01',
    name: 'iPhone Network Unlock (AT&T)',
    brand: 'Apple',
    category: 'imei',
    serviceTypeGroup: '🌐 IMEI/SN Service',
    type: 'imei',
    price: 15.00,
    priceMzn: 950,
    priceCustomerUsd: 15.00,
    priceCustomerMzn: 950,
    priceResellerUsd: 12.00,
    priceResellerMzn: 760,
    priceDistributorUsd: 10.00,
    priceDistributorMzn: 630,
    priceVipUsd: 8.00,
    priceVipMzn: 500,
    deliveryTime: '1-24 HOURS',
    badgeTag: 'HOT',
    successRate: 99,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Factory unlock for AT&T iPhones.',
    requirements: ['Enter IMEI Number']
  },
  {
    id: 'server-01',
    name: 'Z3X Samsung Activation',
    brand: 'Z3X',
    category: 'server',
    serviceTypeGroup: '🛒 Server/Credit Service',
    type: 'server',
    price: 45.00,
    priceMzn: 2850,
    priceCustomerUsd: 45.00,
    priceCustomerMzn: 2850,
    priceResellerUsd: 40.00,
    priceResellerMzn: 2530,
    priceDistributorUsd: 38.00,
    priceDistributorMzn: 2400,
    priceVipUsd: 35.00,
    priceVipMzn: 2200,
    deliveryTime: 'INSTANT',
    badgeTag: 'INSTANT',
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Instant Z3X activation credit.',
    requirements: ['Enter Username']
  },
  {
    id: 'file-01',
    name: 'Samsung Firmware Pack',
    brand: 'Samsung',
    category: 'service_group',
    serviceTypeGroup: '💥 Service By Group',
    type: 'file',
    price: 5.00,
    priceMzn: 315,
    priceCustomerUsd: 5.00,
    priceCustomerMzn: 315,
    priceResellerUsd: 4.00,
    priceResellerMzn: 250,
    priceDistributorUsd: 3.50,
    priceDistributorMzn: 220,
    priceVipUsd: 3.00,
    priceVipMzn: 190,
    deliveryTime: 'INSTANT',
    badgeTag: 'FILE',
    successRate: 100,
    imageUrl: '/images/tools/rent.svg',
    logoUrl: '/images/tools/rent.svg',
    status: 'active',
    description: 'Download the latest firmware files.',
    requirements: ['Enter Model Number']
  },
`;

content = content.replace(/\];\s*$/, newProducts + '\n];\n');
fs.writeFileSync(servicesDataPath, content);
console.log("Products patched");
