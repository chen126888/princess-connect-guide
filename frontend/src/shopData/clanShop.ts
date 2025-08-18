import type { ShopItem } from '../types/shop';

export const clanShopItems: ShopItem[] = [
  // 必買角色碎片
  {
    id: 'clan_char_001',
    name: '鈴莓碎片',
    type: 'character',
    characterId: '鈴莓',
    priority: 'must_buy',
    
    shopType: 'clan'
  },
  {
    id: 'clan_char_002',
    name: '真琴碎片',
    type: 'character',
    characterId: '真琴',
    priority: 'must_buy',
    
    shopType: 'clan'
  },

  // 推薦角色碎片
  {
    id: 'clan_char_003',
    name: '伊緒碎片',
    type: 'character',
    characterId: '伊緒',
    priority: 'recommended',
    
    shopType: 'clan'
  },

  // 跳過項目
  {
    id: 'clan_char_004',
    name: '美咲(舞台劇)碎片',
    type: 'character',
    characterId: '美咲 (舞台劇)',
    priority: 'skip',
    shopType: 'clan'
  },
  {
    id: 'clan_char_005',
    name: '咲戀(聖誕節)碎片',
    type: 'character',
    characterId: '咲戀(聖誕節)',
    priority: 'skip',
    shopType: 'clan'
  },
  {
    id: 'clan_char_006',
    name: '依里碎片',
    type: 'character',
    characterId: '依里',
    priority: 'skip',
    shopType: 'clan'
  },
  {
    id: 'clan_char_007',
    name: '千歌碎片',
    type: 'character',
    characterId: '千歌',
    priority: 'skip',
    shopType: 'clan'
  },

  // 跳過 - 裝備
  {
    id: 'clan_equip_001',
    name: '裝備',
    type: 'equipment',
    priority: 'skip',
    shopType: 'clan',
    hasImage: true
  }
];