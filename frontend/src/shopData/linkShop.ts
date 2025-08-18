import type { ShopItem } from '../types/shop';

export const linkShopItems: ShopItem[] = [
  // 必買
  {
    id: 'link_char_001',
    name: '大師碎片',
    type: 'character',
    characterId: '大師',
    priority: 'must_buy',
    
    shopType: 'link',
    hasImage: true
  }
];