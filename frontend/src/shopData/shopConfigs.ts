import type { ShopType, ShopConfig } from '../types/shop';

export const shopConfigs: Record<ShopType, ShopConfig> = {
  dungeon: {
    name: '地下城商店',
    description: '使用地下城幣兌換角色碎片、裝備和強化素材',
    currency: 'dungeon_coin',
    currencyIcon: '🏰',
    currencyName: '地下城幣'
  },
  arena: {
    name: '競技場商店',
    description: '使用競技場幣兌換強力角色碎片和升級材料',
    currency: 'arena_coin',
    currencyIcon: '⚔️',
    currencyName: '競技場幣'
  },
  p_arena: {
    name: '公主競技場商店',
    description: '使用公主競技場幣兌換頂級角色和專屬裝備',
    currency: 'p_arena_coin',
    currencyIcon: '👑',
    currencyName: '公主競技場幣'
  },
  clan: {
    name: '戰隊商店',
    description: '使用戰隊幣兌換戰隊戰專用道具和高級材料',
    currency: 'clan_coin',
    currencyIcon: '🛡️',
    currencyName: '戰隊幣'
  },
  master: {
    name: '大師商店',
    description: '使用大師幣兌換稀有強化素材和高級裝備',
    currency: 'master_coin',
    currencyIcon: '🌟',
    currencyName: '大師幣'
  },
  ex_equipment: {
    name: 'EX裝備商店',
    description: '兌換角色專屬EX裝備材料',
    currency: 'jewel',
    currencyIcon: '💎',
    currencyName: 'EX裝備材料'
  },
  link: {
    name: '連結商店',
    description: '兌換連結相關道具和素材',
    currency: 'jewel',
    currencyIcon: '🔗',
    currencyName: '連結素材'
  },
  goddess_stone: {
    name: '女神的祕石商店',
    description: '使用女神的祕石兌換特殊道具',
    currency: 'goddess_stone',
    currencyIcon: '💠',
    currencyName: '女神的祕石'
  }
};

export const getShopTitle = (shopType: ShopType): string => {
  return shopConfigs[shopType]?.name || '未知商店';
};

export const getShopDescription = (shopType: ShopType): string => {
  return shopConfigs[shopType]?.description || '';
};

// 商店重置時間
export const shopResetTimes: Record<ShopType, string> = {
  dungeon: '每日 05:00 重置',
  arena: '每日 05:00 重置', 
  p_arena: '每日 05:00 重置',
  clan: '每月 1 日重置',
  master: '每日 05:00 重置',
  ex_equipment: '每月 1 日重置',
  link: '每週一 05:00 重置',
  goddess_stone: '永久有效'
};

export const getShopResetTime = (shopType: ShopType): string => {
  return shopResetTimes[shopType] || '';
};