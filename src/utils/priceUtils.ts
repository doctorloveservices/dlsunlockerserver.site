import { IMEIService, UserProfile, UserLevel } from '../types';

export function getServicePrice(
  service: IMEIService,
  userLevel: UserLevel = 'customer',
  currency: 'USD' | 'MZN' = 'USD'
): number {
  const level: UserLevel = userLevel || 'customer';
  let finalPrice = 0;

  if (currency === 'MZN') {
    switch (level) {
      case 'vip': {
        const val = service.priceVipMzn ?? service.priceMznVip ?? service.priceDistributorMzn ?? service.priceMznDistributor ?? service.priceResellerMzn ?? service.priceMznReseller ?? service.priceCustomerMzn ?? service.priceMzn;
        if (val !== undefined && val > 0) finalPrice = val;
        else {
          const usdVal = service.priceVipUsd ?? service.priceVip ?? service.priceDistributorUsd ?? service.priceDistributor ?? service.priceResellerUsd ?? service.priceReseller ?? service.priceCustomerUsd ?? service.price ?? 0;
          finalPrice = usdVal * 64;
        }
        break;
      }
      case 'distributor': {
        const val = service.priceDistributorMzn ?? service.priceMznDistributor ?? service.priceResellerMzn ?? service.priceMznReseller ?? service.priceCustomerMzn ?? service.priceMzn;
        if (val !== undefined && val > 0) finalPrice = val;
        else {
          const usdVal = service.priceDistributorUsd ?? service.priceDistributor ?? service.priceResellerUsd ?? service.priceReseller ?? service.priceCustomerUsd ?? service.price ?? 0;
          finalPrice = usdVal * 64;
        }
        break;
      }
      case 'reseller': {
        const val = service.priceResellerMzn ?? service.priceMznReseller ?? service.priceCustomerMzn ?? service.priceMzn;
        if (val !== undefined && val > 0) finalPrice = val;
        else {
          const usdVal = service.priceResellerUsd ?? service.priceReseller ?? service.priceCustomerUsd ?? service.price ?? 0;
          finalPrice = usdVal * 64;
        }
        break;
      }
      case 'customer':
      default: {
        const val = service.priceCustomerMzn ?? service.priceMzn;
        if (val !== undefined && val > 0) finalPrice = val;
        else {
          const usdVal = service.priceCustomerUsd ?? service.price ?? 0;
          finalPrice = usdVal * 64;
        }
        break;
      }
    }
  } else {
    // USD
    switch (level) {
      case 'vip':
        finalPrice = service.priceVipUsd ?? service.priceVip ?? service.priceDistributorUsd ?? service.priceDistributor ?? service.priceResellerUsd ?? service.priceReseller ?? service.priceCustomerUsd ?? service.price ?? 0;
        break;
      case 'distributor':
        finalPrice = service.priceDistributorUsd ?? service.priceDistributor ?? service.priceResellerUsd ?? service.priceReseller ?? service.priceCustomerUsd ?? service.price ?? 0;
        break;
      case 'reseller':
        finalPrice = service.priceResellerUsd ?? service.priceReseller ?? service.priceCustomerUsd ?? service.price ?? 0;
        break;
      case 'customer':
      default:
        finalPrice = service.priceCustomerUsd ?? service.price ?? 0;
        break;
    }
  }
  
  // Apply 25% markup to all customer-facing prices
  return finalPrice * 1.25;
}

export function formatServicePrice(
  service: IMEIService,
  user?: Partial<UserProfile> | null
): string {
  const currency = user?.currency || 'USD';
  const level: UserLevel = (user?.userLevel as UserLevel) || 'customer';
  const priceVal = getServicePrice(service, level, currency);

  if (currency === 'MZN') {
    return `${priceVal.toFixed(2)} MZN`;
  }
  return `${priceVal.toFixed(2)} USD`;
}

