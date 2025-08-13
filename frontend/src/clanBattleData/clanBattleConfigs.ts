interface YoutubeChannel {
  name: string;
  link: string;
}

type CharacterTier = '核心' | '重要' | '普通';

interface ClanBattleCharacter {
  name: string;
  tier: CharacterTier;
}

interface ClanBattleDamageTypeSection {
  physical: ClanBattleCharacter[];
  magic: ClanBattleCharacter[];
}

interface ClanBattleAttributeSection {
  [attribute: string]: ClanBattleDamageTypeSection;
}

interface ClanBattleConfig {
  youtubeChannels: YoutubeChannel[];
  commonCharacters: ClanBattleAttributeSection;
  compensationKnifeContent: {
    recommendedCharacters: string[];
  };
}

export const clanBattleConfigs: ClanBattleConfig = {
  youtubeChannels: [
    { name: '煌靈/LongTimeNoC', link: 'https://www.youtube.com/@LongTimeNoC/videos' },
    { name: 'Eruru/えるるぅ', link: 'https://www.youtube.com/@Eruru/featured' },
  ],
  compensationKnifeContent: {
    recommendedCharacters: [
      '公主黑貓',
      '泳咲',
      '解放望',
      '空花(大江戶)',
      '露娜',
      '大公主',
      '咖啡貓',
      '聖誕熊槌',
      '泳真',
    ],
  },
  commonCharacters: {
    fire: {
      physical: [
        { name: '涅妃', tier: '核心' },
        { name: '克總', tier: '核心' },
        { name: '小鳳', tier: '核心' },
        { name: '華音', tier: '重要' },
        { name: '舞孃咲戀', tier: '重要' },
        { name: '姬騎士', tier: '重要' },
        { name: '雌小鬼', tier: '普通' },
        { name: '純', tier: '普通' },
        { name: '矛依未', tier: '普通' },
        { name:'泳裝涅亞',tier:'普通'},
        { name:'萬聖美美',tier:'普通'},
      ],
      magic: [
        { name: '聖誕大公主', tier: '核心' },
        { name: '克羅茜(風靈)', tier: '核心' },
        { name: '色鹿', tier: '核心' },
        { name: '情姐', tier: '重要' },
        { name: '烏爾姆', tier: '重要' },
        { name: '泳真', tier: '重要' },
        { name: '琳德', tier: '普通' },
        { name: '新年霞', tier: '普通' },
      ],
    },
    water: {
      physical: [
        { name: '泳裝莉莉', tier: '核心' },
        { name: '公主雪菲', tier: '核心' },
        { name: '泳切嚕', tier: '核心' },
        { name: '泳優妮', tier: '重要' },
        { name: '流夏', tier: '重要' },
        { name: '聖誕熊槌', tier: '重要' },
        { name: '泳裝美美', tier: '普通' },
        { name: '泳佩', tier: '普通' },
        { name: '泳流夏', tier: '普通' },
      ],
      magic: [
        { name: '泳裝愛梅斯', tier: '核心' },
        { name: '始源晶', tier: '核心' },
        { name: '泳似', tier: '重要' },
        { name: '煉金望', tier: '重要' },
        { name: '苑', tier: '重要' },
        { name: '聖誕佩可', tier: '普通' },
        { name: '泳霞', tier: '普通' },
        { name: '優衣(夏日)', tier: '普通' },
      ],
    },
    wind: {
      physical: [
        { name: '若菜', tier: '核心' },
        { name: '栞', tier: '核心' },
        { name: '公可', tier: '核心' },
        { name: '菲歐', tier: '核心' },
        { name: '插班碧', tier: '重要' },
        { name: '遊俠栞', tier: '重要' },
        { name: '默涅', tier: '重要' },
        { name: '可可蘿', tier: '重要' },
        { name: '亞里莎', tier: '普通' },
        { name: '咖啡貓', tier: '普通' },
        { name: '優妮 (聖學祭)', tier: '普通' },
        { name: '莫妮卡', tier: '普通' },
      ],
      magic: [
        { name: '菲歐', tier: '核心' },
        { name: '泳裝厄莉絲', tier: '核心' },
        { name: '蘭法(祭服)', tier: '核心' },
        { name: '千歌(祭服)', tier: '重要' },
        { name: '默涅', tier: '重要' },
        { name: '新似', tier: '重要' },
        { name: '花鏡華', tier: '普通' },
        { name: '泳裝美空', tier: '普通' },
      ],
    },
    light: {
      physical: [
        { name: '晶', tier: '核心' },
        { name: '駕駛碧', tier: '核心' },
        { name: '煉獄紡希', tier: '重要' },
        { name: '解放望', tier: '重要' },
        { name:'彩羽', tier:'重要'},
        { name:'泳裝雪菲', tier:'重要'},
        { name: '小小甜心', tier: '普通' },
        { name: '超載佩可', tier: '普通' },
        { name: '富婆', tier: '普通' },
        { name: '初栞', tier: '普通' },
        { name: '愛梅斯', tier: '普通' },
      ],
      magic: [
        { name: '新年咲戀', tier: '核心' },
        { name: '夢想真步', tier: '重要' },
        { name: '新年初音', tier: '重要' },
        { name: '大公主', tier: '重要' },
        { name: '愛梅斯', tier: '重要' },
        { name: '似似花', tier: '普通' },
        { name: '天姐', tier: '普通' },
      ],
    },
    dark: {
      physical: [
        { name: '阿法克', tier: '核心' },
        { name: '格蕾絲', tier: '核心' },
        { name: '厄莉絲', tier: '重要' },
        { name: '教官病嬌', tier: '重要' },
        { name: '豬妹', tier: '重要' },
        { name: '倭', tier: '普通' },
        { name: '泳忍', tier: '普通' },
        { name: '可璃亞(墮落)', tier: '普通' },
        { name: '莉莉(墮落)', tier: '普通' },
        { name: '月月', tier: '普通' },
        { name: '教官月月', tier: '普通' },
      ],
      magic: [
        { name: '厄莉絲', tier: '核心' },
        { name: '阿法似', tier: '核心' },
        { name: '多娜', tier: '重要' },
        { name: '斑比', tier: '重要' },
        { name: '蘭法', tier: '重要' },
        { name: '美空', tier: '重要' },
        { name: '帆希(夏日)', tier: '重要' },
        { name: '帆希', tier: '普通' },
        { name: '公主黑貓', tier: '普通' },
        { name: '魔吉塔', tier: '普通' },
      ],
    },
  },
};
