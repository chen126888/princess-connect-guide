export interface UpdateLogItem {
  date: string;
  version: string;
  title: string;
  items: string[];
  summary?: string;
  type: 'major' | 'minor' | 'patch';
}

export const updateLogs: UpdateLogItem[] = [
  {
  date: '2025/09/13',
  version: 'v1.2.0',
  title: '新增功能',
  type: 'minor',
  items: [
    '深淵討伐未來視',
    '滿等必做',
    '其他小項目文字說明更新'
  ]
  },
  {
  date: '2025/08/25',
  version: 'v1.1.0',
  title: '新增功能',
  type: 'minor',
  items: [
    '加入戰隊戰未來視'
  ]
  },
  {
    date: '2025/08/19',
    version: 'v1.0',
    title: '🎉 網站功能全面完成',
    type: 'major',
    items: [
      '新增 **非六星角色養成** 推薦',
      '完成 **回鍋玩家指南** 系統',
      '優化角色搜尋和圖片載入'
    ],
    summary: '✨ 所有核心功能已完成，感謝大家的支持！'
  }
  
  // 未來新增更新記錄的範例：
  // {
  //   date: '2025/08/25',
  //   version: 'v1.1',
  //   title: '📝 角色評級更新',
  //   type: 'minor',
  //   items: [
  //     '更新 **戰隊戰評級** - 調整多個角色評價',
  //     '新增角色：**華音** 相關資料',
  //     '修正部分角色圖片載入問題'
  //   ],
  //   summary: '🔄 根據最新版本調整角色評價與新角色資料'
  // }
];

// 版本類型對應的樣式
export const getVersionBadgeStyle = (type: UpdateLogItem['type']) => {
  switch (type) {
    case 'major':
      return 'bg-blue-100 text-blue-800';
    case 'minor':
      return 'bg-green-100 text-green-800';
    case 'patch':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 版本類型中文標籤
export const getVersionLabel = (type: UpdateLogItem['type']) => {
  switch (type) {
    case 'major':
      return '完整版';
    case 'minor':
      return '功能更新';
    case 'patch':
      return '修正更新';
    default:
      return '更新';
  }
};