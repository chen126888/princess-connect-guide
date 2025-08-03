import type { ArenaType, ArenaConfig } from '../types/arena';

export const arenaConfigs: Record<ArenaType, ArenaConfig> = {
  arena: {
    name: '競技場',
    description: '競技場攻略、陣容推薦、角色搭配',
    icon: '⚔️',
    content: {
      title: '競技場攻略指南',
      sections: [
        {
          title: '基本概念',
          description: '競技場是玩家之間的 PvP 對戰模式，需要策略性地組建隊伍',
          items: [
            {
              name: '攻擊優勢',
              description: '攻擊方擁有 10% 攻擊力加成，選擇合適的隊伍進攻',
              priority: 'high'
            },
            {
              name: '防守陣容',
              description: '設置強力的防守陣容，阻止其他玩家進攻',
              priority: 'high'
            },
            {
              name: '排名獎勵',
              description: '根據最終排名獲得競技場幣和其他獎勵',
              priority: 'medium'
            }
          ]
        },
        {
          title: '推薦陣容',
          description: '根據當前環境推薦的強力陣容組合',
          subsections: [
            {
              title: '物理隊',
              description: '以物理輸出為主的陣容配置',
              items: [
                { name: '前衛坦克', description: '承受傷害，保護後排', priority: 'high' },
                { name: '物理輸出', description: '主要傷害來源', priority: 'high' },
                { name: '輔助支援', description: '提供增益效果', priority: 'medium' }
              ]
            },
            {
              title: '魔法隊',
              description: '以魔法輸出為主的陣容配置',
              items: [
                { name: '魔法輸出', description: '主要魔法傷害', priority: 'high' },
                { name: '魔法支援', description: '提供魔法增益', priority: 'medium' },
                { name: '控制角色', description: '負責控制敵方', priority: 'medium' }
              ]
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