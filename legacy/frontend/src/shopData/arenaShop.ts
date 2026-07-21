import type { ShopItem } from '../types/shop';

export const arenaShopItems: ShopItem[] = [
  // 必買角色碎片
  {
    id: 'arena_char_001',
    name: '璃乃碎片',
    type: 'character',
    characterId: '璃乃',
    priority: 'must_buy',
    
    shopType: 'arena'
  },
  {
    id: 'arena_char_002',
    name: '碧(工作服)碎片',
    type: 'character',
    characterId: '碧 (工作服)',
    priority: 'must_buy',
    
    shopType: 'arena'
  },
  {
    id: 'arena_char_003',
    name: '莫妮卡碎片',
    type: 'character',
    characterId: '莫妮卡',
    priority: 'must_buy',
    
    shopType: 'arena'
  },

  // 推薦角色碎片
  {
    id: 'arena_char_008',
    name: '優衣(夏日)碎片',
    type: 'character',
    characterId: '優衣(夏日)',
    priority: 'recommended',
    shopType: 'arena'
  },
  // 可選角色碎片
  {
    id: 'arena_char_004',
    name: '珠希碎片',
    type: 'character',
    characterId: '珠希',
    priority: 'optional',
    shopType: 'arena'
  },

  // 跳過角色碎片
  {
    id: 'arena_char_005',
    name: '日和碎片',
    type: 'character',
    characterId: '日和',
    priority: 'skip',
    shopType: 'arena'
  },
  {
    id: 'arena_char_006',
    name: '綾音碎片',
    type: 'character',
    characterId: '綾音',
    priority: 'skip',
    shopType: 'arena'
  },
  {
    id: 'arena_char_007',
    name: '七七香碎片',
    type: 'character',
    characterId: '七七香',
    priority: 'skip',
    shopType: 'arena'
  },
  {
    id: 'arena_char_009',
    name: '璃乃(聖誕節)碎片',
    type: 'character',
    characterId: '璃乃 (聖誕節)',
    priority: 'skip',
    shopType: 'arena'
  },
  {
    id: 'arena_char_010',
    name: '禊碎片',
    type: 'character',
    characterId: '禊',
    priority: 'skip',
    shopType: 'arena'
  },

  // 跳過 - 裝備
  {
    id: 'arena_equip_001',
    name: '裝備',
    type: 'equipment',
    priority: 'skip',
    shopType: 'arena',
    hasImage: true
  }
];