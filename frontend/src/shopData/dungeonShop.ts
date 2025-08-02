import type { ShopItem } from '../types/shop';

export const dungeonShopItems: ShopItem[] = [
  // 必買角色碎片 (優先級1-4)
  {
    id: 'dun_char_001',
    name: '優花梨碎片',
    type: 'character',
    characterId: '優花梨',
    priority: 'must_buy',
    sortOrder: 1,
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_002',
    name: '步未碎片',
    type: 'character',
    characterId: '步未',
    priority: 'must_buy',
    sortOrder: 2,
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_003',
    name: '真步碎片',
    type: 'character',
    characterId: '真步',
    priority: 'must_buy',
    sortOrder: 3,
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_004',
    name: '凱留碎片',
    type: 'character',
    characterId: '凱留',
    priority: 'must_buy',
    sortOrder: 4,
    shopType: 'dungeon'
  },

  // 推薦角色碎片 (優先級5-8)
  {
    id: 'dun_char_005',
    name: '杏奈(海盜)碎片',
    type: 'character',
    characterId: '杏奈 (海盜)',
    priority: 'recommended',
    sortOrder: 5,
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_006',
    name: '茉莉碎片',
    type: 'character',
    characterId: '茉莉',
    priority: 'recommended',
    sortOrder: 6,
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_007',
    name: '望碎片',
    type: 'character',
    characterId: '望',
    priority: 'optional',
    sortOrder: 7,
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_008',
    name: '空花碎片',
    type: 'character',
    characterId: '空花',
    priority: 'optional',
    sortOrder: 8,
    shopType: 'dungeon'
  },

  // 可選 - 裝備
  {
    id: 'dun_equip_001',
    name: '裝備',
    type: 'equipment',
    priority: 'optional',
    sortOrder: 9,
    shopType: 'dungeon',
    hasImage: true
  },

  // 跳過角色碎片
  {
    id: 'dun_char_009',
    name: '鈴奈(萬聖節)碎片',
    type: 'character',
    characterId: '鈴奈 (萬聖節)',
    priority: 'skip',
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_010',
    name: '克蘿依(聖學祭)碎片',
    type: 'character',
    characterId: '克蘿依 (聖學祭)',
    priority: 'skip',
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_011',
    name: '美里碎片',
    type: 'character',
    characterId: '美里',
    priority: 'skip',
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_012',
    name: '鈴碎片',
    type: 'character',
    characterId: '鈴',
    priority: 'skip',
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_013',
    name: '茜里碎片',
    type: 'character',
    characterId: '茜里',
    priority: 'skip',
    shopType: 'dungeon'
  },
  {
    id: 'dun_char_014',
    name: '深月碎片',
    type: 'character',
    characterId: '深月',
    priority: 'skip',
    shopType: 'dungeon'
  }
];