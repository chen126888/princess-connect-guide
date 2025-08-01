// 統一匯出所有商店資料
import type { ShopType, ShopItem } from '../types/shop';
import { dungeonShopItems } from './dungeonShop';
import { arenaShopItems } from './arenaShop';

// 統一的商店資料獲取函數  
export const getShopItems = (shopType: ShopType): ShopItem[] => {
  const shopData: Record<ShopType, ShopItem[]> = {
    dungeon: dungeonShopItems,
    arena: arenaShopItems,
    p_arena: [], // 待補充
    clan: [], // 待補充
    master: [], // 待補充
    ex_equipment: [], // 待補充
    link: [], // 待補充
    goddess_stone: [] // 待補充
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
    
    // 相同優先級內按 sortOrder 排序
    const aSort = a.sortOrder || 999;
    const bSort = b.sortOrder || 999;
    return aSort - bSort;
  });
};

// 匯出所有商店資料（供其他地方使用）
export { dungeonShopItems } from './dungeonShop';
export { arenaShopItems } from './arenaShop';
export { shopConfigs, getShopTitle, getShopDescription, getShopResetTime } from './shopConfigs';