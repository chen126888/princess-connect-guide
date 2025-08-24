const { PrismaClient } = require('@prisma/client');

// 直接連接到遠端 PostgreSQL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.keuofuuilimtlfepsuol:ji3e04su3us6@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
    }
  }
});

// 競技場常用角色資料
const arenaCommonCharacters = [
  '新年怜', '闇姊姊', '嘉夜', '祈梨', '布丁', '紡希', '跳跳虎', 
  '靜流&璃乃', '豬妹', '酒鬼', '步未', '雌小鬼', '若菜', '默涅', 
  '公可', '真陽', '涅妃', '咲戀(夏日)', '妹弓', '霞', '魔霞', 
  '愛梅斯', '凱留', '多娜', '厄', '雪', '涅比亞', '凱留(公主)', '泳裝EMT'
];

// 戰鬥試煉場角色資料
const trialCharacters = {
  推薦練: ['新年怜', '魔霞', '杏奈', '酒鬼', '咲戀(夏日)', '妹弓', '雪', '凱留', '祈梨', '吉塔', '公凱', '新年帆希', '步未', '厄', '姬騎士'],
  後期練: ['優妮', '聖誕姊法', '嘉夜', '新年姆咪']
};

// 六星優先度資料
const sixstarPriority = {
  'SS': [
    { name: '優花梨', ue2: '無' },
    { name: '望', ue2: '無' }
  ],
  'S': [
    { name: '真步', ue2: '無' },
    { name: '璃乃', ue2: '有' }
  ],
  'AA': [
    { name: '吉塔', ue2: '無' }, { name: '步未', ue2: '無' }, { name: '凱留', ue2: '有' },
    { name: '宮子', ue2: '無' }, { name: '克莉絲提娜', ue2: '無' }, { name: '栞', ue2: '無' },
    { name: '霞', ue2: '無' }, { name: '矛依未', ue2: '無' }, { name: '怜(新年)', ue2: '無' }
  ],
  'A': [
    { name: '紡希', ue2: '無' }, { name: '純', ue2: '無' }, { name: '真陽', ue2: '有' },
    { name: '可可蘿', ue2: '有' }, { name: '祈梨', ue2: '無' }, { name: '莫妮卡', ue2: '無' },
    { name: '流夏', ue2: '無' }, { name: '真琴', ue2: '無' }, { name: '茉莉', ue2: '無' },
    { name: '鈴莓', ue2: '有' }, { name: '可可蘿(夏日)', ue2: '無' }, { name: '斑比', ue2: '無' },
    { name: '嘉夜', ue2: '無' }, { name: '杏奈', ue2: '無' }, { name: '伊莉亞', ue2: '無' }
  ],
  'B': [
    { name: '亞里莎', ue2: '無' }, { name: '忍', ue2: '無' }, { name: '深月', ue2: '無' },
    { name: '惠理子', ue2: '無' }, { name: '愛蜜莉雅', ue2: '無' }, { name: '雷姆', ue2: '無' },
    { name: '拉姆', ue2: '無' }, { name: '鈴奈', ue2: '有' }
  ],
  'C': [
    { name: '珠希', ue2: '無' }, { name: '鈴', ue2: '無' }, { name: '七七香', ue2: '無' },
    { name: '鏡華', ue2: '無' }, { name: '空花', ue2: '無' }, { name: '優衣', ue2: '無' }
  ]
};

// UE1優先度資料
const ue1Priority = {
  'SS': ['克莉絲提娜', '優花梨', '璃乃', '泳咲'],
  'S': ['凱留(公主)', '似似花', '晶', '栞', '矛依未', '流夏', '純', '望(解放者)', '吉塔(魔導士)', '可可蘿(公主)', '帆希(新年)', '怜(夏日)', '真步(夏日)', '美空', '蘭法', '莉莉(泳裝)', '愛梅斯(夏日)', '帆希(夏日)', '杏奈', '步未', '雪', '宮子', '凱留', '惠理子(指揮官)', '似似花(夏日)', '禊&美美&鏡華', '咲戀(夏日)'],
  'A': ['靜流(情人節)', '凱留(編入生)', '霞(夏日)', '茉莉', '祈梨', '斑比', '鈴莓', '紡希', '真陽', '伊緒(黑暗)', '霞(魔法少女)', '怜(新年)', '純(聖誕節)', '碧(插班生)', '栞(遊俠)', '似似花(新年)', '碧(工作服)', '秋乃&咲戀', '日和(星辰)', '咲戀(舞姬)', '涅亞(夏日)', '霞(新年)', '可可蘿', '初音&栞', '優依(星辰)', '庫露露', '真步(夢想樂園)', '優衣(新年)', '真步(灰姑娘)', '空花(黑暗)', '美空(夏日)', '莫妮卡', '珠希(咖啡廳)', '真步', '莉瑪', '可可蘿(夏日)', '貪吃佩可(夏日)', '優妮(冬日)', '綾音(聖誕節)'],
  'B': ['嘉夜', '伊緒', '怜', '鈴奈', '貪吃佩可(超載)', '吉塔', '伊莉亞', '望', '莫妮卡(魔法少女)', '矛依未(解放者)', '胡桃(舞台劇)', '優妮', '依里(聖誕)', '杏奈(海盜)', '流夏(薩拉薩利亞)']
};

// UE2優先度資料
const ue2Priority = {
  'SS': ['泳咲', '妹弓'],
  'S': ['魔霞', '怜', '聖克', '泳真', '凱留', '鈴莓', '情姐', '可可蘿', '插班碧', '真步(夏日)', '真陽'],
  'A': ['泳狗', '江空', '聖誕熊槌', '鈴奈', '泳七', '綾音(聖誕節)', '貪吃(佩可夏日)']
};

// 非六星角色資料
const nonSixstarCharacters = [
  {
    name: '碧(工作服)',
    description: '深域好用，競技場商店可換。',
    acquisition_method: '競技場商店'
  },
  {
    name: '魔霞',
    description: '需開專二，競技場好用，冒險可刷到。',
    acquisition_method: '冒險'
  },
  {
    name: '碧(插班生)',
    description: '深域戰隊戰都能用到，冒險可刷。',
    acquisition_method: '冒險'
  },
  {
    name: '優妮(聖學祭)',
    description: '深域/風深淵討伐會用到，冒險可刷。',
    acquisition_method: '冒險'
  },
  {
    name: '霞(夏日)',
    description: '深域/水深淵討伐/戰對戰都有機會用到，冒險可刷。',
    acquisition_method: '冒險'
  },
  {
    name: '七七香(夏日)',
    description: '看日服說開專二有用，冒險可刷。',
    acquisition_method: '冒險'
  },
  {
    name: '空花(大江戶)',
    description: '戰隊戰/深域偶爾出現，冒險可刷。',
    acquisition_method: '冒險'
  },
  {
    name: '香織(夏日)',
    description: '水4-10會用到，開專二即可，冒險可刷。',
    acquisition_method: '冒險'
  },
  {
    name: '真步(灰姑娘)',
    description: '深域/推圖常用，冒險可刷。',
    acquisition_method: '冒險'
  }
];

async function uploadDataToRemoteDB() {
  try {
    console.log('🌐 開始上傳資料到遠端 PostgreSQL 資料庫...');
    
    // 1. 清空所有資料表（避免重複）
    console.log('🧹 清空現有資料...');
    await prisma.nonSixstarCharacter.deleteMany({});
    await prisma.ue2Priority.deleteMany({});
    await prisma.ue1Priority.deleteMany({});
    await prisma.sixstarPriority.deleteMany({});
    await prisma.trialCharacter.deleteMany({});
    await prisma.arenaCommonCharacter.deleteMany({});
    
    // 2. 上傳競技場常用角色
    console.log('📊 上傳競技場常用角色...');
    for (const characterName of arenaCommonCharacters) {
      await prisma.arenaCommonCharacter.create({
        data: {
          character_name: characterName
        }
      });
      console.log(`✅ 已新增競技場角色: ${characterName}`);
    }

    // 3. 上傳戰鬥試煉場角色
    console.log('⚔️ 上傳戰鬥試煉場角色...');
    for (const [category, characters] of Object.entries(trialCharacters)) {
      for (const characterName of characters) {
        await prisma.trialCharacter.create({
          data: {
            character_name: characterName,
            category: category
          }
        });
        console.log(`✅ 已新增試煉角色: ${characterName} (${category})`);
      }
    }

    // 4. 上傳六星優先度
    console.log('⭐ 上傳六星優先度...');
    for (const [tier, characters] of Object.entries(sixstarPriority)) {
      for (const character of characters) {
        await prisma.sixstarPriority.create({
          data: {
            character_name: character.name,
            tier: tier
          }
        });
        console.log(`✅ 已新增六星角色: ${character.name} (${tier})`);
      }
    }

    // 5. 上傳UE1優先度
    console.log('🛡️ 上傳UE1優先度...');
    for (const [tier, characters] of Object.entries(ue1Priority)) {
      for (const characterName of characters) {
        await prisma.ue1Priority.create({
          data: {
            character_name: characterName,
            tier: tier
          }
        });
        console.log(`✅ 已新增UE1角色: ${characterName} (${tier})`);
      }
    }

    // 6. 上傳UE2優先度
    console.log('🗡️ 上傳UE2優先度...');
    for (const [tier, characters] of Object.entries(ue2Priority)) {
      for (const characterName of characters) {
        await prisma.ue2Priority.create({
          data: {
            character_name: characterName,
            tier: tier
          }
        });
        console.log(`✅ 已新增UE2角色: ${characterName} (${tier})`);
      }
    }

    // 7. 上傳非六星角色
    console.log('📋 上傳非六星角色...');
    for (const character of nonSixstarCharacters) {
      await prisma.nonSixstarCharacter.create({
        data: {
          character_name: character.name,
          description: character.description,
          acquisition_method: character.acquisition_method
        }
      });
      console.log(`✅ 已新增非六星角色: ${character.name}`);
    }

    // 8. 驗證上傳結果
    console.log('\n📊 驗證上傳結果...');
    const arenaCount = await prisma.arenaCommonCharacter.count();
    const trialCount = await prisma.trialCharacter.count();
    const sixstarCount = await prisma.sixstarPriority.count();
    const ue1Count = await prisma.ue1Priority.count();
    const ue2Count = await prisma.ue2Priority.count();
    const nonSixstarCount = await prisma.nonSixstarCharacter.count();

    console.log(`✅ 競技場常用角色: ${arenaCount} 筆`);
    console.log(`✅ 戰鬥試煉場角色: ${trialCount} 筆`);
    console.log(`✅ 六星優先度: ${sixstarCount} 筆`);
    console.log(`✅ UE1優先度: ${ue1Count} 筆`);
    console.log(`✅ UE2優先度: ${ue2Count} 筆`);
    console.log(`✅ 非六星角色: ${nonSixstarCount} 筆`);

    console.log('\n🎉 資料上傳到遠端 PostgreSQL 完成！');

  } catch (error) {
    console.error('❌ 上傳過程中發生錯誤:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadDataToRemoteDB();