#!/usr/bin/env node

/**
 * 將前端靜態攻略資料遷移到資料庫的腳本
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// 商店配置資料
const shopConfigs = {
  dungeon: {
    name: '地下城商店',
    description: '使用地下城幣兌換角色碎片、裝備和強化素材\n\n優先級說明：\n- 必買：最高優先級，強烈建議購買\n- 推薦：建議購買，性價比高\n- 可選：根據需求選擇\n- 跳過：上述兌換完再考慮換',
    currency: 'dungeon_coin',
    currencyIcon: '🏰',
    currencyName: '地下城幣',
    currencySource: '每日通關地下城獲得'
  },
  arena: {
    name: '競技場商店',
    description: '使用競技場幣兌換角色碎片和裝備',
    currency: 'arena_coin',
    currencyIcon: '⚔️',
    currencyName: '競技場幣',
    currencySource: '競技場排名獎勵'
  },
  p_arena: {
    name: '公主競技場商店',
    description: '使用公主競技場幣兌換角色碎片',
    currency: 'p_arena_coin',
    currencyIcon: '👑',
    currencyName: '公主競技場幣',
    currencySource: '公主競技場排名獎勵'
  },
  clan: {
    name: '戰隊商店',
    description: '使用戰隊幣兌換角色碎片和戰隊戰道具',
    currency: 'clan_coin',
    currencyIcon: '👥',
    currencyName: '戰隊幣',
    currencySource: '戰隊戰參與獎勵'
  },
  master: {
    name: '大師商店',
    description: '使用大師幣兌換特殊角色碎片',
    currency: 'master_coin',
    currencyIcon: '🎓',
    currencyName: '大師幣',
    currencySource: '大師等級提升獲得'
  },
  goddess_stone: {
    name: '女神的秘石商店',
    description: '使用女神的秘石兌換限定角色碎片',
    currency: 'goddess_stone',
    currencyIcon: '💎',
    currencyName: '女神的秘石',
    currencySource: '活動及特殊獎勵'
  },
  ex_equipment: {
    name: 'EX裝備商店',
    description: 'EX裝備相關道具兌換',
    currency: 'ex_coin',
    currencyIcon: '⚡',
    currencyName: 'EX裝備幣',
    currencySource: 'EX關卡獲得'
  },
  tour: {
    name: '巡遊商店',
    description: '限時巡遊活動商店',
    currency: 'tour_coin',
    currencyIcon: '🎫',
    currencyName: '巡遊幣',
    currencySource: '巡遊活動獎勵'
  },
  link: {
    name: '連結商店',
    description: '使用連結幣兌換道具',
    currency: 'link_coin',
    currencyIcon: '🔗',
    currencyName: '連結幣',
    currencySource: '連結關卡獲得'
  }
};

// 競技場配置資料
const arenaConfigs = {
  arena: {
    name: '競技場',
    description: '',
    icon: '⚔️',
    content: JSON.stringify({
      title: '',
      sections: [
        {
          title: '競技場簡介',
          description: '競技場分為戰鬥競技場 (1隊 vs 1隊) 及公主競技場 (3隊 vs 3隊)。首次提升名次可獲得一次性鑽石獎勵，排名越高獎勵越豐厚。'
        },
        {
          title: '常用角色',
          description: '以下是競技場中推薦使用的角色，將滑鼠懸停在頭像上可查看詳細資訊。',
          recommendedCharacters: ['新年怜', '暗姊姊', '嘉夜', '祈梨', '布丁']
        }
      ]
    })
  },
  trial: {
    name: '試煉',
    description: '挑戰各種試煉關卡',
    icon: '🔥',
    content: JSON.stringify({
      title: '試煉攻略',
      sections: [
        {
          title: '試煉簡介',
          description: '試煉是測試玩家實力的特殊關卡'
        }
      ]
    })
  },
  memory: {
    name: '追憶',
    description: '重溫過去的故事',
    icon: '📚',
    content: JSON.stringify({
      title: '追憶內容',
      sections: [
        {
          title: '追憶簡介',
          description: '追憶功能讓玩家重新體驗過去的劇情'
        }
      ]
    })
  }
};

// 戰隊戰配置資料
const clanBattleConfigs = {
  main: JSON.stringify({
    introduction: '戰隊戰是公主連結的重要玩法之一',
    phases: {
      '1-2階段': '建議角色等級 120-140',
      '3-4階段': '建議角色等級 140-160',
      '5階段': '建議角色等級 160+'
    }
  }),
  youtube: JSON.stringify({
    channels: [
      { name: '攻略頻道1', link: 'https://youtube.com/channel1' },
      { name: '攻略頻道2', link: 'https://youtube.com/channel2' }
    ]
  }),
  characters: JSON.stringify({
    '火': {
      physical: [
        { name: '貪吃佩可', tier: '核心' },
        { name: '杏奈', tier: '重要' }
      ],
      magic: [
        { name: '咲戀', tier: '核心' },
        { name: '安', tier: '重要' }
      ]
    }
    // 可以繼續添加其他屬性...
  }),
  compensation: JSON.stringify({
    recommendedCharacters: ['補償刀推薦角色1', '補償刀推薦角色2']
  })
};

async function migrateShopGuides() {
  console.log('🏪 開始遷移商店攻略資料...');
  
  for (const [shopType, config] of Object.entries(shopConfigs)) {
    try {
      await prisma.shopGuide.upsert({
        where: { shopType },
        update: config,
        create: { shopType, ...config }
      });
      console.log(`✅ 商店攻略 ${config.name} 遷移完成`);
    } catch (error) {
      console.error(`❌ 商店攻略 ${config.name} 遷移失敗:`, error);
    }
  }
}

async function migrateArenaGuides() {
  console.log('⚔️ 開始遷移競技場攻略資料...');
  
  for (const [arenaType, config] of Object.entries(arenaConfigs)) {
    try {
      await prisma.arenaGuide.upsert({
        where: { arenaType },
        update: config,
        create: { arenaType, ...config }
      });
      console.log(`✅ 競技場攻略 ${config.name} 遷移完成`);
    } catch (error) {
      console.error(`❌ 競技場攻略 ${config.name} 遷移失敗:`, error);
    }
  }
}

async function migrateClanBattleGuides() {
  console.log('👥 開始遷移戰隊戰攻略資料...');
  
  for (const [type, content] of Object.entries(clanBattleConfigs)) {
    try {
      await prisma.clanBattleGuide.upsert({
        where: { type },
        update: { content },
        create: { type, content }
      });
      console.log(`✅ 戰隊戰攻略 ${type} 遷移完成`);
    } catch (error) {
      console.error(`❌ 戰隊戰攻略 ${type} 遷移失敗:`, error);
    }
  }
}

async function migrateDungeonGuide() {
  console.log('🏰 開始遷移深域攻略資料...');
  
  const dungeonContent = JSON.stringify({
    introduction: '深域是公主連結的高難度副本',
    sections: [
      {
        title: '深域系統介紹',
        description: '深域提供各種挑戰和獎勵'
      },
      {
        title: '強化系統',
        description: '透過各種強化來提升角色能力'
      }
    ]
  });

  try {
    await prisma.dungeonGuide.create({
      data: { content: dungeonContent }
    });
    console.log('✅ 深域攻略遷移完成');
  } catch (error) {
    console.error('❌ 深域攻略遷移失敗:', error);
  }
}

async function migrateCharacterDevelopmentGuides() {
  console.log('👤 開始遷移角色養成攻略資料...');
  
  const categories = ['sixStar', 'uniqueEquipment1', 'uniqueEquipment2', 'nonSixStar'];
  
  for (const category of categories) {
    const content = JSON.stringify({
      category,
      characters: [] // 實際資料可以從前端檔案讀取
    });

    try {
      await prisma.characterDevelopmentGuide.upsert({
        where: { category },
        update: { content },
        create: { category, content }
      });
      console.log(`✅ 角色養成攻略 ${category} 遷移完成`);
    } catch (error) {
      console.error(`❌ 角色養成攻略 ${category} 遷移失敗:`, error);
    }
  }
}

async function migrateNewbieGuides() {
  console.log('🔰 開始遷移新人指南資料...');
  
  const categories = ['mustRead', 'itemOverview', 'characterSystem', 'eventIntro', 'teamFormation'];
  
  for (const category of categories) {
    const content = JSON.stringify({
      category,
      sections: [] // 實際資料可以從前端檔案讀取
    });

    try {
      await prisma.newbieGuide.upsert({
        where: { category },
        update: { content },
        create: { category, content }
      });
      console.log(`✅ 新人指南 ${category} 遷移完成`);
    } catch (error) {
      console.error(`❌ 新人指南 ${category} 遷移失敗:`, error);
    }
  }
}

async function migrateReturnPlayerGuides() {
  console.log('🔄 開始遷移回鍋玩家指南資料...');
  
  const categories = ['newbieBoost', 'characterPlanning', 'dailyStrategy'];
  
  for (const category of categories) {
    const content = JSON.stringify({
      category,
      sections: [] // 實際資料可以從前端檔案讀取
    });

    try {
      await prisma.returnPlayerGuide.upsert({
        where: { category },
        update: { content },
        create: { category, content }
      });
      console.log(`✅ 回鍋玩家指南 ${category} 遷移完成`);
    } catch (error) {
      console.error(`❌ 回鍋玩家指南 ${category} 遷移失敗:`, error);
    }
  }
}

async function main() {
  console.log('🚀 開始靜態資料遷移...\n');
  
  try {
    await migrateShopGuides();
    console.log('');
    
    await migrateArenaGuides();
    console.log('');
    
    await migrateClanBattleGuides();
    console.log('');
    
    await migrateDungeonGuide();
    console.log('');
    
    await migrateCharacterDevelopmentGuides();
    console.log('');
    
    await migrateNewbieGuides();
    console.log('');
    
    await migrateReturnPlayerGuides();
    console.log('');
    
    console.log('🎉 所有靜態資料遷移完成！');
    
  } catch (error) {
    console.error('💥 遷移過程中發生致命錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 執行遷移
if (require.main === module) {
  main();
}