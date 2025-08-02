// 商店相關類型定義

export type ShopType = 
  | 'dungeon' 
  | 'arena' 
  | 'p_arena' 
  | 'clan' 
  | 'master' 
  | 'ex_equipment' 
  | 'link' 
  | 'goddess_stone'
  | 'tour';

export type ItemType = 'character' | 'equipment' | 'material' | 'misc' | 'item';

export type Currency = 
  | 'dungeon_coin'
  | 'arena_coin' 
  | 'p_arena_coin'
  | 'clan_coin'
  | 'master_coin'
  | 'goddess_stone'
  | 'mana'
  | 'jewel';

export type Priority = 'must_buy' | 'recommended' | 'optional' | 'skip';

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  characterId?: string; // 如果是角色碎片，關聯角色ID
  priority: Priority;
  sortOrder?: number; // 排序順序，數字越小優先級越高
  shopType: ShopType;
  // 以下欄位為可選，用於其他商店或特殊商品
  icon?: string;
  hasImage?: boolean; // 是否有對應的圖片檔案
  cost?: number;
  currency?: Currency;
  description?: string;
  recommendation?: string;
  maxQuantity?: number; // 最大購買數量
  resetPeriod?: 'daily' | 'weekly' | 'monthly' | 'permanent'; // 重置週期
}

export interface ShopConfig {
  name: string;
  description: string;
  currency: Currency;
  currencyIcon: string;
  currencyName: string;
  currencySource?: string; // 貨幣獲取方式
}