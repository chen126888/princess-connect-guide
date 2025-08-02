import type { ShopItem } from '../types/shop';

export const tourShopItems: ShopItem[] = [
  // 必買商品
  {
    id: 'tour_char_001',
    name: '大師碎片',
    type: 'character',
    characterId: '大師',
    priority: 'must_buy',
    sortOrder: 1,
    shopType: 'tour',
    hasImage: true
  },
  {
    id: 'tour_item_001',
    name: '阿斯特賴亞戒指',
    type: 'equipment',
    priority: 'must_buy',
    sortOrder: 2,
    shopType: 'tour',
    hasImage: true
  },
  {
    id: 'tour_item_002',
    name: '專用裝備1輝光水晶球Lv270',
    type: 'equipment',
    priority: 'must_buy',
    sortOrder: 3,
    shopType: 'tour',
    hasImage: true
  },

  // 推薦商品
  {
    id: 'tour_item_003',
    name: '各式記憶碎片',
    type: 'material',
    priority: 'recommended',
    sortOrder: 4,
    shopType: 'tour',
    hasImage: true
  },
  {
    id: 'tour_item_004',
    name: '女神的秘石',
    type: 'material',
    priority: 'recommended',
    sortOrder: 5,
    shopType: 'tour',
    hasImage: true
  },
  {
    id: 'tour_item_005',
    name: '公主之心(碎片)',
    type: 'material',
    priority: 'recommended',
    sortOrder: 6,
    shopType: 'tour',
    hasImage: true
  },
  {
    id: 'tour_item_006',
    name: '公主寶珠',
    type: 'material',
    priority: 'recommended',
    sortOrder: 7,
    shopType: 'tour',
    hasImage: true
  },

  // 可選商品
  {
    id: 'tour_item_007',
    name: '各式原礦',
    type: 'material',
    priority: 'optional',
    sortOrder: 8,
    shopType: 'tour',
    hasImage: true
  },
  {
    id: 'tour_item_008',
    name: '輝光水晶球Lv280',
    type: 'equipment',
    priority: 'optional',
    sortOrder: 9,
    shopType: 'tour',
    hasImage: true
  }
];