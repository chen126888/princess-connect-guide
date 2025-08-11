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
        recommendedCharacters: ['新年怜', '暗姊姊', '嘉夜', '祈梨', '布丁', '紡希', '跳跳虎', '靜流&璃乃', '豬妹', '酒鬼', '步未', '雌小鬼', '若菜', '默涅', '公可', '真陽', '涅妃', '泳媽', '妹弓', '霞', '魔霞', '愛梅斯', '凱留', '多娜', '厄', '小雪', '涅比亞', '公凱', '泳裝EMT']
      },
      {
        title: '新手推薦隊伍',
        description: '這邊僅推薦新手前期好用陣容，以戰隊戰或其他場合也較常用到的角色為主，自身經驗約可爬到前200(滿等時)。角色不夠可以競技防守同一隊',
        subsections: [
          {
            title: '戰鬥競技場 (1 vs 1)：進攻',
            description: '',
            recommendedCharacters: ['凱留', '妹弓', ['泳媽', '小雪'], '步未', ['杏奈', '布丁']]
          },
          {
            title: '戰鬥競技場 (1 vs 1)：防守',
            description: '',
            recommendedCharacters: ['厄', '愛梅斯', '默涅', '步未', '酒鬼']
          },
          {
            title: '公主競技場 (3 vs 3)：第一隊',
            description: '',
            recommendedCharacters: ['凱留', '妹弓', ['泳媽', '小雪'], '步未', ['杏奈', '布丁']]
          },
          {
            title: '公主競技場 (3 vs 3)：第二隊',
            description: '',
            recommendedCharacters: ['厄', '愛梅斯', '默涅', ['新年帆希', '帆希'], '酒鬼']
          },
          {
            title: '通用隊伍',
            description: '若上述角色都組不出來可以使用，此為日常推圖及深域3-10前中道通關隊伍。',
            recommendedCharacters: ['厄', '愛梅斯', '霞',[ '新年帆希','似似花'], '默涅']
          }
        ]
      }
    ]
  }
};