// 統一匯出所有商店資料
import type { ShopType, ShopItem } from '../types/shop';
import { dungeonShopItems } from './dungeonShop';
import { arenaShopItems } from './arenaShop';
import { pArenaShopItems } from './pArenaShop';
import { clanShopItems } from './clanShop';
import { masterShopItems } from './masterShop';
import { linkShopItems } from './linkShop';
import { exEquipmentShopItems } from './exEquipmentShop';
import { goddessStoneShopItems } from './goddessStoneShop';
import { tourShopItems } from './tourShop';

// 統一的商店資料獲取函數  
export const getShopItems = (shopType: ShopType): ShopItem[] => {
  const shopData: Record<ShopType, ShopItem[]> = {
    dungeon: dungeonShopItems,
    arena: arenaShopItems,
    p_arena: pArenaShopItems,
    clan: clanShopItems,
    master: masterShopItems,
    ex_equipment: exEquipmentShopItems,
    link: linkShopItems,
    goddess_stone: goddessStoneShopItems,
    tour: tourShopItems
  };

  const items = shopData[shopType] || [];
  
  // 按優先級和排序順序排序
  return items.sort((a, b) => {
    // 優先級排序：must_buy -> recommended -> optional -> skip
    const priorityOrder = { must_buy: 1, recommended: 2, optional: 3, skip: 4 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // 相同優先級內維持原始順序 (或根據資料定義的順序)
    return 0;
  });
};

// 匯出所有商店資料（供其他地方使用）
export { dungeonShopItems } from './dungeonShop';
export { arenaShopItems } from './arenaShop';
export { pArenaShopItems } from './pArenaShop';
export { clanShopItems } from './clanShop';
export { masterShopItems } from './masterShop';
export { linkShopItems } from './linkShop';
export { exEquipmentShopItems } from './exEquipmentShop';
export { goddessStoneShopItems } from './goddessStoneShop';
export { tourShopItems } from './tourShop';
export { shopConfigs, getShopTitle, getShopDescription, getShopResetTime } from './shopConfigs';