const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

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

async function importData() {
  try {
    console.log('開始匯入資料...');
    
    // 1. 匯入競技場常用角色
    console.log('匯入競技場常用角色...');
    for (const characterName of arenaCommonCharacters) {
      try {
        await axios.post(`${API_BASE}/arena-common`, {
          character_name: characterName
        });
        console.log(`✅ 已新增競技場角色: ${characterName}`);
      } catch (error) {
        console.error(`❌ 新增競技場角色失敗: ${characterName}`, error.response?.data || error.message);
      }
    }

    // 2. 匯入戰鬥試煉場角色
    console.log('匯入戰鬥試煉場角色...');
    for (const [category, characters] of Object.entries(trialCharacters)) {
      for (const characterName of characters) {
        try {
          await axios.post(`${API_BASE}/trial-characters`, {
            character_name: characterName,
            category: category
          });
          console.log(`✅ 已新增試煉角色: ${characterName} (${category})`);
        } catch (error) {
          console.error(`❌ 新增試煉角色失敗: ${characterName}`, error.response?.data || error.message);
        }
      }
    }

    // 3. 匯入六星優先度
    console.log('匯入六星優先度...');
    for (const [tier, characters] of Object.entries(sixstarPriority)) {
      for (const character of characters) {
        try {
          await axios.post(`${API_BASE}/sixstar-priority`, {
            character_name: character.name,
            tier: tier
          });
          console.log(`✅ 已新增六星角色: ${character.name} (${tier})`);
        } catch (error) {
          console.error(`❌ 新增六星角色失敗: ${character.name}`, error.response?.data || error.message);
        }
      }
    }

    // 4. 匯入非六星角色
    console.log('匯入非六星角色...');
    for (const character of nonSixstarCharacters) {
      try {
        await axios.post(`${API_BASE}/non-sixstar-characters`, {
          character_name: character.name,
          description: character.description,
          acquisition_method: character.acquisition_method
        });
        console.log(`✅ 已新增非六星角色: ${character.name}`);
      } catch (error) {
        console.error(`❌ 新增非六星角色失敗: ${character.name}`, error.response?.data || error.message);
      }
    }

    console.log('🎉 資料匯入完成！');

  } catch (error) {
    console.error('❌ 匯入過程中發生錯誤:', error);
  }
}

importData();