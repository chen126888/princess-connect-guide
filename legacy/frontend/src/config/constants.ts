// 應用程式常數配置

// 環境變數配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const IMAGE_PATHS = {
  SHOP_ICONS: `${IMAGE_BASE_URL}/icons`,
  CHARACTERS: `${IMAGE_BASE_URL}/characters`,
} as const;

export const IMAGE_FALLBACKS = {
  SHOP_ITEM: '📦',
  CURRENCY: '💰',
} as const;