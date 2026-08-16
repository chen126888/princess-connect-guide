import type { ArenaConfig } from '../types/arena';

export const arenaConfigTrial: ArenaConfig = {
  name: '戰鬥試煉場',
  description: '',
  icon: '🏆',
  content: {
    title: '',
    sections: [
      {
        title:'戰鬥試煉場簡介',
        description:'戰鬥試煉場為一個月一次的活動，為期五天，共18關，皆為1 vs 1。越後面關卡對手等級越高，通關有通關獎勵，若達成指定條件可獲得最高三星(每關)。整個活動獎勵有鑽石、突破戒指等等。'
      },
      {
        title: '推薦練',
        description: '建議優先培養的角色，先後順序不代表優先順序。',
        // 角色資料已遷移到資料庫，由 TrialCharacter 表管理
      },
      {
        title: '後期資源夠再練',
        description: '資源充足後再考慮培養的角色，除了嘉夜外，其他三星有機會就夠用。',
        // 角色資料已遷移到資料庫，由 TrialCharacter 表管理
      },
      {
        title: '1~12關常見隊伍',
        description: '新手前期可以用做參考',
        subsections: [
          {
            title: '第一隊',
            description:'',
            recommendedCharacters: ['新年姆咪', '酒鬼', '姬騎士', '中二', '咲戀(夏日)']
          },
          {
            title: '第二隊',
            description:'',
            recommendedCharacters: ['魔霞', '杏奈', '聖誕姊法', '酒鬼', '祈梨']
          },
          {
            title: '第三隊',
            description:'',
            recommendedCharacters: ['優妮', '雪', '凱留', '妹弓', '酒鬼']
          }
        ]
      }
    ]
  }
};