import React from 'react';
import Card from '../Common/Card';

interface MaxLevelTask {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'longterm';
}

const maxLevelTasks: MaxLevelTask[] = [
  // 每日目標
  {
    id: 'daily_1',
    title: '深域',
    description: '記得打滿免費次數，後期屬性等級會影響傷害以及這刀能不能出。一般來說，4-10之前獲取的屬性強化道具數量差距比較大，能越早打到越好。',
    category: 'daily'
  },
  {
    id: 'daily_2',
    title: '競技場',
    description: '努力打到前200，後續等競技場角色養成起來後，再透過解陣網，慢慢把排名往前提，把競技場的鑽石挖完。',
    category: 'daily'
  },
  // 每週目標
  {
    id: 'weekly_1',
    title: '追憶戰霸',
    description: '每周會刷新左右各三次挑戰機會，記得用掉。假設都打到第三層，每五周獲取的阿爾克絲幣(彩裝幣)，可以換一件彩裝。',
    category: 'weekly'
  },
  {
    id: 'weekly_2',
    title: '探索派遣',
    description: '每三天會完成一輪探索(不加速情況下)，記得放不好刷的角色，或限定角色取得角色碎片。',
    category: 'weekly'
  },
  // 月度目標
  {
    id: 'monthly_1',
    title: '深淵討伐',
    description: '每月7號左右會開啟，目標把所有屬性強化道具獎勵拿完，屬性碎片獎勵超級多。',
    category: 'monthly'
  },
  {
    id: 'monthly_2',
    title: '大師商店',
    description: '每月15號會更新，記得把屬性強化道具換完，共需要32500大師碎片。',
    category: 'monthly'
  },
  {
    id: 'monthly_3',
    title: '戰鬥試煉場',
    description: '練好基本隊伍，目標拚到15層，差不多就可以把所有突破戒指領完。',
    category: 'monthly'
  },
  {
    id: 'monthly_4',
    title: '露娜塔',
    description: '普通關卡能打多高就打多高，多拿鑽石。',
    category: 'monthly'
  },
  {
    id: 'monthly_5',
    title: '戰隊戰',
    description: '以四階為目標，四階傷害5000w左右，分數貢獻就會比你打兩刀三階還高，所以盡量出四階。然後第一天盡量幫忙推一到三階的進度。',
    category: 'monthly'
  },
  // 長期目標
  {
    id: 'longterm_1',
    title: 'Rank',
    description: '以最高Rank xx-n為例。xx代表rank等級，n代表可以裝幾件裝備。通常最高只能裝三件裝備時，會先保留在前一等級的6件裝，等可以裝四件以上才升到最高。(範例：36-3和35-6，這時會選擇35-6)',
    category: 'longterm'
  },
  {
    id: 'longterm_2',
    title: '角色養成',
    description: '可能有不少玩家角色庫還不齊，這時候先以戰隊戰和深域會用到的為主，競技場為輔。',
    category: 'longterm'
  },
  {
    id: 'longterm_3',
    title: '地下城',
    description: '滿等後打到ex6基本上沒什麼難度，記得要打。',
    category: 'longterm'
  }
];

const MaxLevelGuideSection: React.FC = () => {

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📊';
      case 'monthly':
        return '🗓️';
      case 'longterm':
        return '🎯';
      default:
        return '📝';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'daily':
        return '每日目標';
      case 'weekly':
        return '每週目標';
      case 'monthly':
        return '月度目標';
      case 'longterm':
        return '長期目標';
      default:
        return '其他';
    }
  };

  const groupedTasks = maxLevelTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, MaxLevelTask[]>);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-purple-700">滿等後指南</h2>
        </div>
        
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <p className="text-gray-700 leading-relaxed">
            恭喜你滿等了！現在記得要跟隨加倍活動以及參考未來視喔！
          </p>
        </div>

        {Object.entries(groupedTasks).map(([category, tasks]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <h3 className="text-xl font-bold text-gray-800">{getCategoryText(category)}</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200 shadow-sm">
                    <div className="mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{task.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

      </Card>
    </div>
  );
};

export default MaxLevelGuideSection;