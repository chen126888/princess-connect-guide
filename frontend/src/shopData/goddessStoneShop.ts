import type { ShopItem } from '../types/shop';

export const goddessStoneShopItems: ShopItem[] = [
  {
    id: 'goddess_char_001',
    name: '各式記憶碎片',
    type: 'item',
    priority: 'must_buy',
    
    shopType: 'goddess_stone',
    hasImage: true
  },
  {
    id: 'goddess_char_002',
    name: '各式純淨記憶碎片',
    type: 'item',
    priority: 'skip',
    
    shopType: 'goddess_stone',
    hasImage: true
  }
];