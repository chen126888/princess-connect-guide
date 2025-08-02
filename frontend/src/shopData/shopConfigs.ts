import type { ShopType, ShopConfig } from '../types/shop';

export const shopConfigs: Record<ShopType, ShopConfig> = {
  dungeon: {
    name: '地下城商店',
    description: `使用地下城幣兌換角色碎片、裝備和強化素材

優先級說明：
- 必買：最高優先級，強烈建議購買
- 推薦：建議購買，性價比高  
- 可選：根據需求選擇
- 跳過：上述兌換完再考慮換

💡 將滑鼠懸停在角色碎片上可查看詳細資訊

⭐ 花凜兌換說明：
花凜需要收集任意角色碎片共 3000 個進行兌換
建議順序：
1. 優先兌換「必買」角色所需數量
2. 接著考慮「推薦」角色碎片或兌換任意角色碎片
3. 累積滿 3000 個碎片即可兌換花凜
（所有角色碎片都計入，包含已滿星角色）`,
    currency: 'dungeon_coin',
    currencyIcon: '🏰',
    currencyName: '地下城幣',
    currencySource: '每日通關地下城獲得'
  },
  arena: {
    name: '競技場商店',
    description: `使用競技場幣兌換角色碎片

優先級說明：
- 必買：最高優先級，強烈建議購買
- 推薦：建議購買，性價比高  
- 可選：根據需求選擇
- 跳過：上述兌換完再考慮換，裝備為全部換完才考慮的

💡 將滑鼠懸停在角色碎片上可查看詳細資訊`,
    currency: 'arena_coin',
    currencyIcon: '⚔️',
    currencyName: '競技場幣',
    currencySource: '競技場獎勵，每小時發一次可累積'
  },
  p_arena: {
    name: '公主競技場商店',
    description: `使用公主競技場幣兌換角色碎片

優先級說明：
- 必買：最高優先級，強烈建議購買
- 推薦：建議購買，性價比高  
- 可選：根據需求選擇
- 跳過：上述兌換完再考慮換，裝備為全部換完才考慮的

💡 將滑鼠懸停在角色碎片上可查看詳細資訊`,
    currency: 'p_arena_coin',
    currencyIcon: '👑',
    currencyName: '公主競技場幣',
    currencySource: '公主競技場獎勵，每小時發一次可累積'
  },
  clan: {
    name: '戰隊商店',
    description: `使用戰隊幣兌換角色碎片

優先級說明：
- 必買：最高優先級，強烈建議購買
- 推薦：建議購買，性價比高  
- 可選：根據需求選擇
- 跳過：上述兌換完再考慮換，裝備為全部換完才考慮的

💡 將滑鼠懸停在角色碎片上可查看詳細資訊`,
    currency: 'clan_coin',
    currencyIcon: '🛡️',
    currencyName: '戰隊幣',
    currencySource: '戰隊戰打王以及結算成績獎勵取得'
  },
  master: {
    name: '大師商店',
    description: `使用大師幣兌換屬性強化素材和角色碎片

優先級說明：
- 必買：最高優先級，強烈建議購買
- 推薦：建議購買，性價比高  
- 可選：根據需求選擇
- 跳過：上述兌換完再考慮換

💡 將滑鼠懸停在商品上可查看詳細資訊`,
    currency: 'master_coin',
    currencyIcon: '🌟',
    currencyName: '大師幣',
    currencySource: '滿等且經驗值已滿後，每消耗一點體力給一幣'
  },
  ex_equipment: {
    name: 'EX裝備商店',
    description: `兌換EX裝備

僅列出彩裝，彩裝順序參考自煌靈大大
至於一般EX裝備請按自身需求購買

📹 詳細說明請查詢以下影片：
彩裝：[影片連結](https://youtu.be/gxmhkdtAmrU?si=ygUTDkyo9u2JJAw3)
一般：[影片連結](https://youtu.be/s0K2FLYTxIE?si=lq0UBZ2n6V3bvmgs)`,
    currency: 'jewel',
    currencyIcon: '💎',
    currencyName: 'EX裝備材料',
    currencySource: '有武器防具飾品彩裝四種，分解裝備或追憶取得'
  },
  link: {
    name: '連結商店',
    description: '只兌換大師碎片，全部可換大師碎片換完，才考慮其他的道具',
    currency: 'jewel',
    currencyIcon: '🔗',
    currencyName: '連結素材',
    currencySource: '每抽一抽給一幣，有時抽角色活動會額外給'
  },
  goddess_stone: {
    name: '女神的秘石商店',
    description: `使用女神的秘石兌換角色記憶碎片，若非必要，請勿用來購買純淨碎片

價格說明：
所有角色的記憶碎片
• 前20個為 1/個
• 第21~40個的為 2/個
• 第41~60個的為 3/個
• 第61~80個的為 4/個
• 第81個及以後的為 5/個

6星角色開花所需純淨碎片為 20/個`,
    currency: 'goddess_stone',
    currencyIcon: '💠',
    currencyName: '女神的秘石',
    currencySource: '多種來源，活動、抽角色、商店兌換等等'
  },
  tour: {
    name: '巡遊商店',
    description: `一般來說，如果10個骰子跑完一圈，後面全部跳過，也足夠換完推薦以上(包含)所有商品

優先級說明：
- 必買：最高優先級，強烈建議購買
- 推薦：建議購買，性價比高  
- 可選：根據需求選擇
- 跳過：上述兌換完再考慮換

💡 將滑鼠懸停在商品上可查看詳細資訊`,
    currency: 'jewel',
    currencyIcon: '🎪',
    currencyName: '巡遊素材',
    currencySource: '巡遊活動中，每跑完一圈會結算一次，並給予對應巡遊幣獎勵。另外該商店位於巡遊活動中，與其他商店位置不同'
  }
};

export const getShopTitle = (shopType: ShopType): string => {
  return shopConfigs[shopType]?.name || '未知商店';
};

export const getShopDescription = (shopType: ShopType): string => {
  return shopConfigs[shopType]?.description || '';
};

// 商店重置時間
export const shopResetTimes: Record<ShopType, string> = {
  dungeon: '每日 05:00 重置',
  arena: '每日 05:00 重置', 
  p_arena: '每日 05:00 重置',
  clan: '每日 05:00 重置',
  master: '每月 15 號重置',
  ex_equipment: '每月 1 號重置',
  link: '不重置',
  goddess_stone: '永久有效',
  tour: '活動期間限定'
};

export const getShopResetTime = (shopType: ShopType): string => {
  return shopResetTimes[shopType] || '';
};

export const getCurrencySource = (shopType: ShopType): string => {
  return shopConfigs[shopType]?.currencySource || '';
};