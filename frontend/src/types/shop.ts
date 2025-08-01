// 商店相關類型定義

export type ShopType = 
  | 'dungeon' 
  | 'arena' 
  | 'p_arena' 
  | 'clan' 
  | 'master' 
  | 'ex_equipment' 
  | 'link' 
  | 'goddess_stone';

export type ItemType = 'character' | 'equipment' | 'material' | 'misc';

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
  icon: string;
  cost: number;
  currency: Currency;
  priority: Priority;
  sortOrder?: number; // 排序順序，數字越小優先級越高
  description: string;
  recommendation: string;
  shopType: ShopType;
  maxQuantity?: number; // 最大購買數量
  resetPeriod?: 'daily' | 'weekly' | 'monthly' | 'permanent'; // 重置週期
}

export interface ShopConfig {
  name: string;
  description: string;
  currency: Currency;
  currencyIcon: string;
  currencyName: string;
}