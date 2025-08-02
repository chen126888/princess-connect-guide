import type { ShopItem } from '../types/shop';

export const masterShopItems: ShopItem[] = [
  // 必買
  {
    id: 'master_char_001',
    name: '大師碎片',
    type: 'character',
    characterId: '大師',
    priority: 'must_buy',
    sortOrder: 1,
    shopType: 'master',
    hasImage: true
  },

  // 推薦 - 星素碎片
  {
    id: 'master_item_001',
    name: '星素碎片',
    type: 'item',
    priority: 'recommended',
    sortOrder: 2,
    shopType: 'master',
    hasImage: true
  },

  // 推薦 - 星素水晶球 (各屬性)
  {
    id: 'master_item_002',
    name: '星素水晶球(火)',
    type: 'item',
    priority: 'recommended',
    sortOrder: 3,
    shopType: 'master',
    hasImage: true
  },
  {
    id: 'master_item_003',
    name: '星素水晶球(水)',
    type: 'item',
    priority: 'recommended',
    sortOrder: 4,
    shopType: 'master',
    hasImage: true
  },
  {
    id: 'master_item_004',
    name: '星素水晶球(風)',
    type: 'item',
    priority: 'recommended',
    sortOrder: 5,
    shopType: 'master',
    hasImage: true
  },
  {
    id: 'master_item_005',
    name: '星素水晶球(光)',
    type: 'item',
    priority: 'recommended',
    sortOrder: 6,
    shopType: 'master',
    hasImage: true
  },
  {
    id: 'master_item_006',
    name: '星素水晶球(闇)',
    type: 'item',
    priority: 'recommended',
    sortOrder: 7,
    shopType: 'master',
    hasImage: true
  },

  // 可選 - 各式記憶碎片
  {
    id: 'master_item_007',
    name: '各式記憶碎片',
    type: 'item',
    priority: 'optional',
    sortOrder: 8,
    shopType: 'master',
    hasImage: true
  },

  // 可選 - 公主之心(碎片)
  {
    id: 'master_item_008',
    name: '公主之心(碎片)',
    type: 'item',
    priority: 'optional',
    sortOrder: 9,
    shopType: 'master',
    hasImage: true
  },

  // 可選 - 女神的秘石
  {
    id: 'master_item_009',
    name: '女神的秘石',
    type: 'item',
    priority: 'optional',
    sortOrder: 10,
    shopType: 'master',
    hasImage: true
  },

  // 跳過 - 各式原礦
  {
    id: 'master_item_010',
    name: '各式原礦',
    type: 'equipment',
    priority: 'skip',
    sortOrder: 11,
    shopType: 'master',
    hasImage: true
  },

  // 跳過 - 裝備
  {
    id: 'master_item_011',
    name: '裝備',
    type: 'equipment',
    priority: 'skip',
    sortOrder: 12,
    shopType: 'master',
    hasImage: true
  },

  // 跳過 - 特製EXP藥水
  {
    id: 'master_item_012',
    name: '特製EXP藥水',
    type: 'item',
    priority: 'skip',
    sortOrder: 13,
    shopType: 'master',
    hasImage: true
  },

  // 跳過 - 瑪那
  {
    id: 'master_item_013',
    name: '瑪那',
    type: 'item',
    priority: 'skip',
    sortOrder: 14,
    shopType: 'master',
    hasImage: true
  }
];