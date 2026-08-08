const fs = require('fs');

const productsToAdd = [
  {
    name: 'CF Tools Rent [ 12 Hours ]',
    priceCustomerUsd: 0.68,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/cftool.svg'
  },
  {
    name: 'CHEETAH TOOL RENT [ 25 Days ]',
    priceCustomerUsd: 7.8,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/cheetah_rent.svg'
  },
  {
    name: 'CM2 Dongle Rent ( New Version ) [ 1 Hour ]',
    priceCustomerUsd: 2.6,
    badgeTag: '1-10 MINUTES',
    imageUrl: '/images/tools/teal_placeholder.svg'
  },
  {
    name: 'CP- Tools Rent [ 12 hours]',
    priceCustomerUsd: 2.1,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/teal_placeholder.svg'
  },
  {
    name: 'DFT Pro Tool Rent [ 48 hours ]',
    priceCustomerUsd: 1.77,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/dftpro.svg'
  },
  {
    name: 'AMT - Android Multi Tool Rent [12 Hours]',
    priceCustomerUsd: 0.78,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/amt.svg'
  },
  {
    name: 'AMT - Android Multi Tool Rent [2 Hours]',
    priceCustomerUsd: 0.38,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/amt.svg'
  },
  {
    name: 'AndroidWinTool Rent [ 48 hours ]',
    priceCustomerUsd: 1.38,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/androidwin.svg'
  },
  {
    name: 'AnonySHU Tool Rent [ 12 Hours ]',
    priceCustomerUsd: 2.35,
    badgeTag: 'INSTANT',
    imageUrl: '/images/tools/anonyshu.svg'
  },
  {
    name: 'APIZU MDM TOOL PRO Rent { Time: 4 Hours }',
    priceCustomerUsd: 1.8,
    badgeTag: 'MINIUTES',
    imageUrl: '/images/tools/teal_placeholder.svg'
  }
];

const db = JSON.parse(fs.readFileSync('database.json'));

let newIdCounter = Date.now();

productsToAdd.forEach(p => {
  const existingIdx = db.services.findIndex(s => s.name === p.name);
  
  const baseService = {
    category: 'tool_rent',
    serviceTypeGroup: '🔰 Tool Rent',
    type: 'tool_rent',
    status: 'active',
    successRate: 100,
    deliveryTime: p.badgeTag,
    brand: p.name.split(' ')[0],
    description: `Rent ${p.name} instantly.`,
    requirements: ['Enter TeamViewer / AnyDesk ID & Password']
  };

  const newService = {
    ...baseService,
    id: `tool-rent-${newIdCounter++}`,
    name: p.name,
    priceCustomerUsd: p.priceCustomerUsd,
    priceCustomerMzn: p.priceCustomerUsd * 64,
    priceResellerUsd: p.priceCustomerUsd,
    priceResellerMzn: p.priceCustomerUsd * 64,
    priceDistributorUsd: p.priceCustomerUsd,
    priceDistributorMzn: p.priceCustomerUsd * 64,
    priceVipUsd: p.priceCustomerUsd,
    priceVipMzn: p.priceCustomerUsd * 64,
    price: p.priceCustomerUsd,
    priceMzn: p.priceCustomerUsd * 64,
    badgeTag: p.badgeTag,
    imageUrl: p.imageUrl,
    logoUrl: p.imageUrl,
  };

  if (existingIdx !== -1) {
    db.services[existingIdx] = { ...db.services[existingIdx], ...newService, id: db.services[existingIdx].id };
  } else {
    // Add to the front of tool_rent category
    const firstToolRentIdx = db.services.findIndex(s => s.category === 'tool_rent');
    if (firstToolRentIdx !== -1) {
      db.services.splice(firstToolRentIdx, 0, newService);
    } else {
      db.services.push(newService);
    }
  }
});

fs.writeFileSync('database.json', JSON.stringify(db, null, 2));

// Update servicesData.ts
const servicesDataText = fs.readFileSync('src/data/servicesData.ts', 'utf8');
const newAllServicesString = `export const ALL_SERVICES: IMEIService[] = ${JSON.stringify(db.services, null, 2)};`;
const updatedServicesDataText = servicesDataText.replace(
  /export const ALL_SERVICES: IMEIService\[\] = \[[\s\S]*?\];/,
  newAllServicesString
);
fs.writeFileSync('src/data/servicesData.ts', updatedServicesDataText);

console.log("Added screenshot products!");
