import type { ArenaConfig } from '../types/arena';

export const arenaConfigArena: ArenaConfig = {
  name: '競技場',
  description: '',
  icon: '⚔️',
  content: {
    title: '',
    sections: [
      {
        title: '競技場簡介',
        description: '競技場分為戰鬥競技場 (1隊 vs 1隊) 及公主競技場 (3隊 vs 3隊)。首次提升名次可獲得一次性鑽石獎勵，排名越高獎勵越豐厚。日常獎勵包含競技場幣 (每小時發放一次) 及鑽石 (每日發放一次)，獎勵數量同樣隨排名提升而增加。',
      },
      {
        title: '常用角色',
        description: '以下是競技場中推薦使用的角色，將滑鼠懸停在頭像上可查看詳細資訊。',
        // 角色資料已遷移到資料庫，由 ArenaCommonCharacter 表管理
      },
      {
        title: '新手推薦',
        description: '先用新人推薦組隊競技場的隊伍+默涅隊，打初期的競技場，前期基本上都是電腦，打不贏也可以靠等級壓制。\n\n進入後期遇到真人玩家後(開始遇到比較現代的防守隊)，就可以開始靠解陣網去打贏，但此時需要的角色就比較多了。\n\n解陣網連結如下，以下都考慮角色滿等開專，但不考慮煉金裝和大師面板等。\n\n來源對岸：https://www.pcrdfans.com/battle\n\n日服：https://appmedia.jp/priconne-redive/4466131',
        subsections: [
          {
            title: '戰鬥競技場 (1 vs 1)：進攻',
            description: '',
            recommendedCharacters: ['凱留', '妹弓', ['咲戀(夏日)', '雪'], '步未', ['杏奈', '布丁']]
          },
          {
            title: '戰鬥競技場 (1 vs 1)：防守',
            description: '',
            recommendedCharacters: ['厄', '愛梅斯', '默涅', '步未', '酒鬼']
          },
          {
            title: '公主競技場 (3 vs 3)：第一隊',
            description: '',
            recommendedCharacters: ['凱留', '妹弓', ['咲戀(夏日)', '雪'], '步未', ['杏奈', '布丁']]
          },
          {
            title: '公主競技場 (3 vs 3)：第二隊',
            description: '',
            recommendedCharacters: ['厄', '愛梅斯', '默涅', ['新年帆希', '似似花'], '酒鬼']
          },
          {
            title: '通用隊伍',
            description: '若上述角色都組不出來可以使用，此為日常推圖及深域3-10前中道通關隊伍。',
            recommendedCharacters: ['厄', '愛梅斯', '霞',[ '新年帆希','似似花'], '默涅']
          }
        ]
      },
      {
        title: '滿等後期較常見防守陣',
        description: '不提供進攻陣，因為依據防守隊伍，會有不同選擇，沒有一個百分百贏的陣容，至於較新的競技場攻略，b站有人在做相關的影片，請自行去查。',
        subsections: [
          {
            title: '部分較現代防守陣',
            description: '',
            defenseTeams: [
              ['布丁', '新年怜', '小鳳', '機娘', '厄'],
              ['酒鬼', '步未', '魔霞', '菲歐', '涅比亞'],
              ['酒鬼', '霞', '魔霞', '愛梅斯', '涅比亞'],
              ['新年怜', '流夏', '機娘', '艾姬多娜(夏日)', '厄'],
              ['布丁', '新年怜', '步未', '愛梅斯', '涅比亞'],
              ['真陽', '酒鬼', '中二', '咖啡貓', '涅比亞']
            ]
          }
        ]
      }
    ]
  }
};