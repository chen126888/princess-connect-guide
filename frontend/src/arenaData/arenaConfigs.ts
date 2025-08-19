import type { ArenaType, ArenaConfig } from '../types/arena';

export const arenaConfigs: Record<ArenaType, ArenaConfig> = {
  arena: {
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
          recommendedCharacters: ['新年怜', '暗姊姊', '嘉夜', '祈梨', '布丁', '紡希', '跳跳虎', '靜流&璃乃', '豬妹', '酒鬼', '步未', '雌小鬼', '若菜', '默涅', '公可', '真陽', '涅妃', '咲戀(夏日)', '妹弓', '霞', '魔霞', '愛梅斯', '凱留', '多娜', '厄', '雪', '涅比亞', '公凱', '泳裝EMT']
        },
        {
          title: '新手推薦隊伍',
          description: '這邊僅推薦新手前期好用陣容，以戰隊戰或其他場合也較常用到的角色為主，自身經驗約可爬到前200(滿等時)。角色不夠可以競技防守同一隊',
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
        }
      ]
    }
  },
  trial: {
    name: '戰鬥試煉場',
    description: '挑戰各種試煉關卡，獲得豐厚獎勵',
    icon: '🏆',
    content: {
      title: '戰鬥試煉場攻略',
      sections: [
        {
          title: '試煉類型',
          description: '不同類型的試煉挑戰',
          items: [
            {
              name: '每日試煉',
              description: '每日更新的挑戰關卡，獲得經驗和素材',
              priority: 'high'
            },
            {
              name: '週期試煉',
              description: '週期性開放的特殊挑戰',
              priority: 'medium'
            },
            {
              name: '限時試煉',
              description: '限時開放的高難度挑戰',
              priority: 'medium'
            }
          ]
        },
        {
          title: '攻略要點',
          description: '通關試煉的重要策略',
          items: [
            {
              name: '角色等級',
              description: '確保角色等級足夠應對挑戰',
              priority: 'high'
            },
            {
              name: '裝備強化',
              description: '提升裝備等級和品質',
              priority: 'high'
            },
            {
              name: '技能升級',
              description: '優先升級核心技能',
              priority: 'medium'
            }
          ]
        }
      ]
    }
  },
  memory: {
    name: '追憶',
    description: '重溫經典劇情，體驗角色故事',
    icon: '📖',
    content: {
      title: '追憶系統指南',
      sections: [
        {
          title: '追憶功能',
          description: '追憶系統讓玩家重新體驗角色的經典時刻',
          items: [
            {
              name: '角色追憶',
              description: '體驗特定角色的專屬劇情',
              priority: 'high'
            },
            {
              name: '活動追憶',
              description: '重溫過往活動的精彩內容',
              priority: 'medium'
            },
            {
              name: '主線追憶',
              description: '回顧主線劇情的重要章節',
              priority: 'medium'
            }
          ]
        },
        {
          title: '追憶獎勵',
          description: '完成追憶可獲得的各種獎勵',
          items: [
            {
              name: '角色碎片',
              description: '獲得特定角色的記憶碎片',
              priority: 'high'
            },
            {
              name: '裝備素材',
              description: '獲得角色養成所需的素材',
              priority: 'medium'
            },
            {
              name: '紀念物品',
              description: '獲得紀念性質的特殊物品',
              priority: 'low'
            }
          ]
        }
      ]
    }
  }
};