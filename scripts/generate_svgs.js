import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'images', 'tools');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const svgs = {
  // Default RENTAL Image
  'rent.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#0d746d"/>
    <filter id="bevel">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
      <feOffset in="blur" dx="2" dy="2" result="offset"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <text x="150" y="115" font-family="'Arial Black', 'Impact', sans-serif" font-size="44" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="3" filter="url(#bevel)">RENTAL</text>
  </svg>`,

  'octoplus.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#ffffff"/>
    <g transform="translate(20, 20)">
      <path d="M 120 40 C 100 20, 70 30, 50 50 C 30 70, 20 100, 35 120 C 45 130, 60 110, 75 90 C 85 75, 95 65, 110 60 C 130 55, 160 60, 180 40 C 190 30, 170 20, 150 25 Z" fill="#08819a"/>
      <path d="M 40 100 C 10 110, 0 130, 20 150 C 40 170, 70 140, 80 120 C 85 105, 75 95, 60 95 C 50 95, 45 100, 40 100 Z" fill="#08819a"/>
      <path d="M 80 120 C 60 140, 60 170, 85 180 C 100 185, 110 160, 105 135 C 100 115, 90 110, 80 120 Z" fill="#08819a"/>
      <rect x="90" y="75" width="150" height="36" rx="8" fill="#08819a"/>
      <text x="165" y="100" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">OCTOPLUS</text>
    </g>
  </svg>`,

  'infinity.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#e2e8f0"/>
    <g transform="translate(150, 100)">
      <path d="M -50 -30 C -80 -30 -100 -15 -100 0 C -100 15 -80 30 -50 30 C -20 30 20 -30 50 -30 C 80 -30 100 -15 100 0 C 100 15 80 30 50 30 C 20 30 -20 -30 -50 -30 Z" fill="none" stroke="#0099ff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M -50 -30 C -80 -30 -100 -15 -100 0 C -100 15 -80 30 -50 30 C -20 30 20 -30 50 -30 C 80 -30 100 -15 100 0 C 100 15 80 30 50 30 C 20 30 -20 -30 -50 -30 Z" fill="none" stroke="#0033cc" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="0" y="8" font-family="'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#05133d" text-anchor="middle" letter-spacing="2">INFINITY</text>
    </g>
  </svg>`,

  'dftpro.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#04122e"/>
    <circle cx="150" cy="100" r="70" fill="#1d4ed8" stroke="#3b82f6" stroke-width="4"/>
    <circle cx="150" cy="100" r="62" fill="#0f2b5c"/>
    <text x="110" y="108" font-family="'Arial Black', sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">DFT</text>
    <rect x="152" y="86" width="52" height="28" rx="4" fill="#f97316"/>
    <text x="178" y="107" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">Pro</text>
  </svg>`,

  'anonyshu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#0b1320"/>
    <g transform="translate(150, 95)">
      <path d="M -45 -15 L -55 -15 L -55 -25 L -45 -25 M 45 -15 L 55 -15 L 55 -25 L 45 -25 M -15 -45 L -15 -55 L -25 -55 L -25 -45 M -15 45 L -15 55 L -25 55 L -25 45" stroke="#38bdf8" stroke-width="6"/>
      <circle cx="0" cy="0" r="42" fill="#1e293b" stroke="#64748b" stroke-width="6"/>
      <rect x="-90" y="-18" width="180" height="36" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
      <text x="0" y="7" font-family="'Arial Black', sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">ANONYSHU</text>
    </g>
  </svg>`,

  'cftool.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <defs>
      <linearGradient id="cfbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#581c87"/>
        <stop offset="100%" stop-color="#9d174d"/>
      </linearGradient>
    </defs>
    <rect width="300" height="200" fill="url(#cfbg)"/>
    <g transform="translate(100, 30)">
      <rect x="0" y="0" width="100" height="140" rx="6" fill="#1e1b4b" stroke="#38bdf8" stroke-width="3"/>
      <rect x="0" y="0" width="100" height="24" rx="4" fill="#3b82f6"/>
      <text x="50" y="50" font-family="sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">CF TOOL</text>
      <text x="50" y="68" font-family="sans-serif" font-size="11" font-weight="bold" fill="#a5b4fc" text-anchor="middle">ACTIVATION</text>
      <text x="50" y="115" font-family="'Impact', sans-serif" font-size="36" font-weight="900" fill="#ec4899" text-anchor="middle">CF</text>
    </g>
  </svg>`,

  'tfmtool.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#071930"/>
    <g transform="translate(150, 100)">
      <circle cx="0" cy="0" r="50" fill="#0f2b48" stroke="#1d4ed8" stroke-width="8" stroke-dasharray="15 8"/>
      <text x="-5" y="-5" font-family="'Impact', sans-serif" font-size="46" font-weight="900" fill="#ffffff" text-anchor="middle">TFM</text>
      <text x="0" y="32" font-family="'Arial Black', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">TOOL</text>
    </g>
  </svg>`,

  'kgfix.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#070b1e"/>
    <g transform="translate(150, 80)">
      <circle cx="0" cy="0" r="42" fill="#dc2626"/>
      <text x="0" y="15" font-family="'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">K</text>
    </g>
    <text x="150" y="152" font-family="'Arial Black', sans-serif" font-size="22" font-weight="900" fill="#ef4444" text-anchor="middle">KG FIX TOOL</text>
  </svg>`,

  'pandora.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <defs>
      <linearGradient id="panbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4338ca"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>
    <rect width="300" height="200" fill="url(#panbg)"/>
    <g transform="translate(110, 30)">
      <rect x="0" y="0" width="80" height="130" rx="8" fill="#ffffff"/>
      <text x="40" y="65" font-family="'Arial Black', sans-serif" font-size="52" font-weight="900" fill="#0284c7" text-anchor="middle">P</text>
      <text x="40" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0284c7" text-anchor="middle">Pandora</text>
    </g>
  </svg>`,

  'apizu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#0a1936"/>
    <text x="150" y="85" font-family="'Arial Black', sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">APIZU TOOL</text>
    <text x="150" y="135" font-family="'Impact', sans-serif" font-size="36" font-weight="normal" fill="#fef08a" text-anchor="middle" letter-spacing="2">Activation</text>
  </svg>`,

  'mst.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#000000"/>
    <rect x="25" y="20" width="250" height="160" rx="24" fill="#000000" stroke="#f97316" stroke-width="6"/>
    <text x="150" y="115" font-family="'Arial Black', sans-serif" font-size="52" font-weight="900" fill="#f97316" text-anchor="middle">MST</text>
  </svg>`,

  'hydra.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
    <rect width="300" height="200" fill="#03140e"/>
    <text x="150" y="105" font-family="'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">HYDRA</text>
    <text x="150" y="135" font-family="sans-serif" font-size="11" font-weight="bold" fill="#22c55e" text-anchor="middle">Ethical Hacking &amp; Unlock Tool</text>
  </svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(dir, filename), content);
  console.log(`Wrote ${filename}`);
}
