import type { ShopItem } from '../types/shop';

export const pArenaShopItems: ShopItem[] = [
  // 必買角色碎片
  {
    id: 'p_arena_char_001',
    name: '宮子碎片',
    type: 'character',
    characterId: '宮子',
    priority: 'must_buy',
    
    shopType: 'p_arena'
  },
  {
    id: 'p_arena_char_002',
    name: '杏奈碎片',
    type: 'character',
    characterId: '杏奈',
    priority: 'must_buy',
    
    shopType: 'p_arena'
  },
  {
    id: 'p_arena_char_003',
    name: '紡希碎片',
    type: 'character',
    characterId: '紡希',
    priority: 'must_buy',
    
    shopType: 'p_arena'
  },

  // 推薦角色碎片
  {
    id: 'p_arena_char_004',
    name: '鈴奈碎片',
    type: 'character',
    characterId: '鈴奈',
    priority: 'recommended',
    
    shopType: 'p_arena'
  },
  {
    id: 'p_arena_char_005',
    name: '千歌(夏日)碎片',
    type: 'character',
    characterId: '千歌 (夏日)',
    priority: 'recommended',
    shopType: 'p_arena'
  },
  // 跳過項目
  {
    id: 'p_arena_char_006',
    name: '真琴(灰姑娘)碎片',
    type: 'character',
    characterId: '真琴(灰姑娘)',
    priority: 'skip',
    shopType: 'p_arena'
  },
  {
    id: 'p_arena_char_007',
    name: '香織碎片',
    type: 'character',
    characterId: '香織',
    priority: 'skip',
    shopType: 'p_arena'
  },
  {
    id: 'p_arena_char_008',
    name: '初音碎片',
    type: 'character',
    characterId: '初音',
    priority: 'skip',
    shopType: 'p_arena'
  },

  // 跳過 - 裝備
  {
    id: 'p_arena_equip_001',
    name: '裝備',
    type: 'equipment',
    priority: 'skip',
    shopType: 'p_arena',
    hasImage: true
  }
];