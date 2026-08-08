import React, { useState } from 'react';

interface ProductLogoProps {
  logoUrl?: string;
  imageUrl?: string;
  brand?: string;
  serviceName?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const getMatchingProductImage = (serviceName: string = '', brand: string = ''): string => {
  const nameLower = (serviceName + ' ' + brand).toLowerCase();

  // Relogin service does not have its own tool image
  if (nameLower.includes('relogin')) {
    return '/images/tools/rent.svg';
  }

  // Unlock Tool
  if (nameLower.includes('unlock tool') || nameLower.includes('unlocktool') || nameLower.includes('unlock-tool')) {
    return '/images/tools/unlocktool.svg';
  }

  // AMT / Android Multi Tool
  if (nameLower.includes('android multi tool') || nameLower.includes('amt')) {
    return '/images/tools/amt.svg';
  }

  // Octoplus
  if (nameLower.includes('octoplus')) {
    return '/images/tools/octoplus.svg';
  }

  // Infinity / CM2
  if (nameLower.includes('infinity') || nameLower.includes('cm2')) {
    return '/images/tools/infinity.svg';
  }

  // DFT Pro
  if (nameLower.includes('dft pro') || nameLower.includes('dftpro')) {
    return '/images/tools/dftpro.svg';
  }

  // AnonySHU
  if (nameLower.includes('anonyshu')) {
    return '/images/tools/anonyshu.svg';
  }

  // CF Tool (Does NOT match Cheetah Tool)
  if (nameLower.includes('cf tool') || nameLower.includes('cf-tool') || nameLower.includes('cf tools')) {
    return '/images/tools/cftool.svg';
  }

  // TFM Tool Pro
  if (nameLower.includes('tfm tool') || nameLower.includes('tfmpro') || nameLower.includes('tfm pro')) {
    return '/images/tools/tfmtool.svg';
  }

  // KG Fix / KG Killer
  if (nameLower.includes('kg fix') || nameLower.includes('kg killer') || nameLower.includes('kgfix')) {
    return '/images/tools/kgfix.svg';
  }

  // Pandora Tool
  if (nameLower.includes('pandora')) {
    return '/images/tools/pandora.svg';
  }

  // APIZU MDM Tool
  if (nameLower.includes('apizu')) {
    return '/images/tools/apizu.svg';
  }

  // MST MobileSea
  if (nameLower.includes('mobilesea') || (nameLower.includes('mst') && !nameLower.includes('tsm'))) {
    return '/images/tools/mst.svg';
  }

  // Hydra Tool
  if (nameLower.includes('hydra')) {
    return '/images/tools/hydra.svg';
  }

  // EFT Pro
  if (nameLower.includes('eft pro') || nameLower.includes('eftpro') || nameLower.includes('eft')) {
    return '/images/tools/eftpro.svg';
  }

  // Griffin
  if (nameLower.includes('griffin')) {
    return '/images/tools/griffin.svg';
  }

  // TSM
  if (nameLower.includes('tsm')) {
    return '/images/tools/tsm.svg';
  }

  // AndroidWin
  if (nameLower.includes('androidwin') || nameLower.includes('android win')) {
    return '/images/tools/androidwin.svg';
  }

  // CP Tool
  if (nameLower.includes('cp- tool') || nameLower.includes('cp tool') || nameLower.includes('cptool')) {
    return '/images/tools/cptool.svg';
  }

  // Default Fallback Image
  return '/images/tools/rent.svg';
};

export const ProductLogo: React.FC<ProductLogoProps> = ({
  logoUrl,
  imageUrl,
  brand = '',
  serviceName = '',
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [logoUrl, imageUrl, serviceName, brand]);

  const matchedImage = getMatchingProductImage(serviceName, brand);
  const primarySrc = imageUrl || logoUrl;

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-md',
    md: 'w-10 h-10 rounded-lg',
    lg: 'w-14 h-14 rounded-xl',
    full: 'w-full h-full rounded-xl',
  }[size];

  // If primarySrc is missing, errored, or points to placeholder, use matchedImage
  const finalSrc = primarySrc && !imgError && !primarySrc.includes('placeholder') && primarySrc !== '/images/tools/default_placeholder.svg' ? primarySrc : matchedImage;

  return (
    <div
      className={`${sizeClasses} bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs ${className}`}
    >
      <img
        src={finalSrc}
        alt=""
        className="w-full h-full object-contain rounded-xs"
        onError={() => {
          if (!imgError) {
            setImgError(true);
          }
        }}
      />
    </div>
  );
};
