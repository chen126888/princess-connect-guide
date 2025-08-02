// 應用程式常數配置

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const IMAGE_PATHS = {
  SHOP_ICONS: `${API_BASE_URL}/images/shop_icon`,
  CHARACTERS: `${API_BASE_URL}/images/characters`,
} as const;

export const IMAGE_FALLBACKS = {
  SHOP_ITEM: '📦',
  CURRENCY: '💰',
} as const;