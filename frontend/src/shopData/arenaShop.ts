import type { ShopItem } from '../types/shop';

export const arenaShopItems: ShopItem[] = [
  {
    id: 'arena_001',
    name: '香織碎片',
    type: 'character',
    characterId: 'char_002', // 假設角色ID
    icon: '⚔️',
    cost: 20,
    currency: 'arena_coin',
    priority: 'recommended',
    description: '香織的角色記憶碎片',
    recommendation: '物理輸出角色，值得培養',
    shopType: 'arena',
    maxQuantity: 3,
    resetPeriod: 'daily'
  },
  {
    id: 'arena_002',
    name: '宮子碎片',
    type: 'character',
    characterId: 'char_003',
    icon: '🛡️',
    cost: 20,
    currency: 'arena_coin',
    priority: 'must_buy',
    description: '宮子的角色記憶碎片',
    recommendation: '頂級坦克，必練角色',
    shopType: 'arena',
    maxQuantity: 3,
    resetPeriod: 'daily'
  },
  {
    id: 'arena_003',
    name: '精煉石',
    type: 'material',
    icon: '🔹',
    cost: 10,
    currency: 'arena_coin',
    priority: 'recommended',
    description: '裝備精煉用材料',
    recommendation: '強化裝備必需品',
    shopType: 'arena',
    maxQuantity: 20,
    resetPeriod: 'daily'
  }
];