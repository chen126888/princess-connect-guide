const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 戰隊戰常用角色資料
const clanBattleCharacters = [
  // 火屬 - 物理
  { name: '涅妃', attribute: '火屬', damage_type: '物理', importance: '核心' },
  { name: '克總', attribute: '火屬', damage_type: '物理', importance: '核心' },
  { name: '小鳳', attribute: '火屬', damage_type: '物理', importance: '核心' },
  { name: '華音', attribute: '火屬', damage_type: '物理', importance: '重要' },
  { name: '舞孃咲戀', attribute: '火屬', damage_type: '物理', importance: '重要' },
  { name: '姬騎士', attribute: '火屬', damage_type: '物理', importance: '重要' },
  { name: '雌小鬼', attribute: '火屬', damage_type: '物理', importance: '普通' },
  { name: '純', attribute: '火屬', damage_type: '物理', importance: '普通' },
  { name: '矛依未', attribute: '火屬', damage_type: '物理', importance: '普通' },
  { name: '泳裝涅亞', attribute: '火屬', damage_type: '物理', importance: '普通' },
  { name: '萬聖美美', attribute: '火屬', damage_type: '物理', importance: '普通' },

  // 火屬 - 法術
  { name: '聖誕大公主', attribute: '火屬', damage_type: '法術', importance: '核心' },
  { name: '克羅茜(風靈)', attribute: '火屬', damage_type: '法術', importance: '核心' },
  { name: '色鹿', attribute: '火屬', damage_type: '法術', importance: '核心' },
  { name: '情姐', attribute: '火屬', damage_type: '法術', importance: '重要' },
  { name: '烏爾姆', attribute: '火屬', damage_type: '法術', importance: '重要' },
  { name: '泳真', attribute: '火屬', damage_type: '法術', importance: '重要' },
  { name: '琳德', attribute: '火屬', damage_type: '法術', importance: '普通' },
  { name: '新年霞', attribute: '火屬', damage_type: '法術', importance: '普通' },

  // 水屬 - 物理
  { name: '泳裝莉莉', attribute: '水屬', damage_type: '物理', importance: '核心' },
  { name: '公主雪菲', attribute: '水屬', damage_type: '物理', importance: '核心' },
  { name: '泳切嚕', attribute: '水屬', damage_type: '物理', importance: '核心' },
  { name: '泳優妮', attribute: '水屬', damage_type: '物理', importance: '重要' },
  { name: '流夏', attribute: '水屬', damage_type: '物理', importance: '重要' },
  { name: '聖誕熊槌', attribute: '水屬', damage_type: '物理', importance: '普通' },
  { name: '泳裝美美', attribute: '水屬', damage_type: '物理', importance: '普通' },
  { name: '泳佩', attribute: '水屬', damage_type: '物理', importance: '普通' },
  { name: '泳流夏', attribute: '水屬', damage_type: '物理', importance: '普通' },

  // 水屬 - 法術
  { name: '泳裝愛梅斯', attribute: '水屬', damage_type: '法術', importance: '核心' },
  { name: '始源晶', attribute: '水屬', damage_type: '法術', importance: '核心' },
  { name: '泳似', attribute: '水屬', damage_type: '法術', importance: '重要' },
  { name: '煉金望', attribute: '水屬', damage_type: '法術', importance: '重要' },
  { name: '苑', attribute: '水屬', damage_type: '法術', importance: '重要' },
  { name: '聖誕佩可', attribute: '水屬', damage_type: '法術', importance: '普通' },
  { name: '泳霞', attribute: '水屬', damage_type: '法術', importance: '普通' },
  { name: '優衣(夏日)', attribute: '水屬', damage_type: '法術', importance: '普通' },

  // 風屬 - 物理
  { name: '若菜', attribute: '風屬', damage_type: '物理', importance: '核心' },
  { name: '栞', attribute: '風屬', damage_type: '物理', importance: '核心' },
  { name: '公可', attribute: '風屬', damage_type: '物理', importance: '核心' },
  { name: '菲歐', attribute: '風屬', damage_type: '物理', importance: '核心' },
  { name: '插班碧', attribute: '風屬', damage_type: '物理', importance: '重要' },
  { name: '遊俠栞', attribute: '風屬', damage_type: '物理', importance: '重要' },
  { name: '默涅', attribute: '風屬', damage_type: '物理', importance: '重要' },
  { name: '可可蘿', attribute: '風屬', damage_type: '物理', importance: '重要' },
  { name: '亞里莎', attribute: '風屬', damage_type: '物理', importance: '普通' },
  { name: '咖啡貓', attribute: '風屬', damage_type: '物理', importance: '普通' },
  { name: '優妮 (聖學祭)', attribute: '風屬', damage_type: '物理', importance: '普通' },
  { name: '莫妮卡', attribute: '風屬', damage_type: '物理', importance: '普通' },

  // 風屬 - 法術
  { name: '泳厄', attribute: '風屬', damage_type: '法術', importance: '核心' },
  { name: '蘭法(祭服)', attribute: '風屬', damage_type: '法術', importance: '核心' },
  { name: '千歌(祭服)', attribute: '風屬', damage_type: '法術', importance: '重要' },
  { name: '新似', attribute: '風屬', damage_type: '法術', importance: '重要' },
  { name: '花鏡華', attribute: '風屬', damage_type: '法術', importance: '普通' },
  { name: '泳裝美空', attribute: '風屬', damage_type: '法術', importance: '普通' },

  // 光屬 - 物理
  { name: '晶', attribute: '光屬', damage_type: '物理', importance: '核心' },
  { name: '駕駛碧', attribute: '光屬', damage_type: '物理', importance: '核心' },
  { name: '煉獄紡希', attribute: '光屬', damage_type: '物理', importance: '重要' },
  { name: '解放望', attribute: '光屬', damage_type: '物理', importance: '重要' },
  { name: '彩羽', attribute: '光屬', damage_type: '物理', importance: '重要' },
  { name: '泳裝雪菲', attribute: '光屬', damage_type: '物理', importance: '重要' },
  { name: '小小甜心', attribute: '光屬', damage_type: '物理', importance: '普通' },
  { name: '超載佩可', attribute: '光屬', damage_type: '物理', importance: '普通' },
  { name: '富婆', attribute: '光屬', damage_type: '物理', importance: '普通' },
  { name: '初栞', attribute: '光屬', damage_type: '物理', importance: '普通' },
  { name: '愛梅斯', attribute: '光屬', damage_type: '物理', importance: '普通' },

  // 光屬 - 法術
  { name: '新年咲戀', attribute: '光屬', damage_type: '法術', importance: '核心' },
  { name: '夢想真步', attribute: '光屬', damage_type: '法術', importance: '重要' },
  { name: '新年初音', attribute: '光屬', damage_type: '法術', importance: '重要' },
  { name: '大公主', attribute: '光屬', damage_type: '法術', importance: '重要' },
  { name: '似似花', attribute: '光屬', damage_type: '法術', importance: '普通' },
  { name: '天姐', attribute: '光屬', damage_type: '法術', importance: '普通' },

  // 闇屬 - 物理
  { name: '阿法克', attribute: '闇屬', damage_type: '物理', importance: '核心' },
  { name: '格蕾絲', attribute: '闇屬', damage_type: '物理', importance: '核心' },
  { name: '厄莉絲', attribute: '闇屬', damage_type: '物理', importance: '重要' },
  { name: '教官病嬌', attribute: '闇屬', damage_type: '物理', importance: '重要' },
  { name: '豬妹', attribute: '闇屬', damage_type: '物理', importance: '重要' },
  { name: '倭', attribute: '闇屬', damage_type: '物理', importance: '普通' },
  { name: '泳忍', attribute: '闇屬', damage_type: '物理', importance: '普通' },
  { name: '可璃亞(墮落)', attribute: '闇屬', damage_type: '物理', importance: '普通' },
  { name: '莉莉(墮落)', attribute: '闇屬', damage_type: '物理', importance: '普通' },
  { name: '月月', attribute: '闇屬', damage_type: '物理', importance: '普通' },
  { name: '教官月月', attribute: '闇屬', damage_type: '物理', importance: '普通' },

  // 闇屬 - 法術
  { name: '阿法似', attribute: '闇屬', damage_type: '法術', importance: '核心' },
  { name: '多娜', attribute: '闇屬', damage_type: '法術', importance: '重要' },
  { name: '斑比', attribute: '闇屬', damage_type: '法術', importance: '重要' },
  { name: '蘭法', attribute: '闇屬', damage_type: '法術', importance: '重要' },
  { name: '美空', attribute: '闇屬', damage_type: '法術', importance: '重要' },
  { name: '帆希(夏日)', attribute: '闇屬', damage_type: '法術', importance: '重要' },
  { name: '帆希', attribute: '闇屬', damage_type: '法術', importance: '普通' },
  { name: '公主黑貓', attribute: '闇屬', damage_type: '法術', importance: '普通' },
  { name: '魔吉塔', attribute: '闇屬', damage_type: '法術', importance: '普通' },
];

// 補償刀角色資料
const compensationCharacters = [
  '公主黑貓',
  '泳咲',
  '解放望',
  '空花(大江戶)',
  '露娜',
  '大公主',
  '咖啡貓',
  '聖誕熊槌',
  '泳真',
];

async function importClanBattleData() {
  try {
    console.log('🚀 開始匯入戰隊戰角色資料...');

    // 清除現有資料
    console.log('🧹 清除現有資料...');
    await prisma.clanBattleCommonCharacter.deleteMany({});
    await prisma.clanBattleCompensationCharacter.deleteMany({});

    // 匯入戰隊戰常用角色
    console.log('📝 匯入戰隊戰常用角色...');
    for (const character of clanBattleCharacters) {
      await prisma.clanBattleCommonCharacter.create({
        data: {
          character_name: character.name,
          attribute: character.attribute,
          damage_type: character.damage_type,
          importance: character.importance,
        },
      });
    }

    // 匯入補償刀角色
    console.log('🗡️ 匯入補償刀角色...');
    for (const characterName of compensationCharacters) {
      await prisma.clanBattleCompensationCharacter.create({
        data: {
          character_name: characterName,
        },
      });
    }

    console.log('✅ 匯入完成！');
    console.log(`📊 匯入統計:`);
    console.log(`   - 戰隊戰常用角色: ${clanBattleCharacters.length} 個`);
    console.log(`   - 補償刀角色: ${compensationCharacters.length} 個`);

  } catch (error) {
    console.error('❌ 匯入失敗:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importClanBattleData();