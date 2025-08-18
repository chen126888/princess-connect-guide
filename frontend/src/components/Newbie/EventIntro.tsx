import React, { useState } from 'react';
import Card from '../Common/Card';
import { eventCategories } from '../../newbieData';

type EventTab = 'daily' | 'limited' | 'pvp' | 'advanced';

const EventIntro: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EventTab>('daily');

  const tabs = [
    { key: 'daily' as EventTab, label: '日常' },
    { key: 'limited' as EventTab, label: '限時' },
    { key: 'pvp' as EventTab, label: 'PVP' },
    { key: 'advanced' as EventTab, label: '高難度' }
  ];

  // 根據分頁映射到對應的活動分類
  const getCategoryByTab = (tab: EventTab) => {
    const categoryMap = {
      'daily': 'pve-daily',     // PVE 基本
      'limited': 'pve-limited', // PVE 限時
      'pvp': 'pvp',             // PVP 競技
      'advanced': 'pve-advanced' // PVE 高階挑戰
    };
    return eventCategories.find(cat => cat.id === categoryMap[tab]);
  };

  const renderContent = () => {
    const category = getCategoryByTab(activeTab);
    
    if (!category) {
      return (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">此分類內容準備中...</p>
          </div>
        </Card>
      );
    }

    return (
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-amber-700">{category.title}</h2>
        <div className="space-y-6">
          {category.events.map((event) => (
            <div key={event.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{event.name}</h3>
              <div className="space-y-2">
                <p className="text-gray-700"><strong className="text-gray-800">介紹：</strong> {event.description}</p>
                <p className="text-gray-700"><strong className="text-gray-800">新手建議：</strong> {event.advice}</p>
                {event.common_question && (
                  <p className="text-gray-700"><strong className="text-gray-800">常見疑問：</strong> {event.common_question}</p>
                )}
                <p className="text-gray-700">
                  <strong className="text-gray-800">主要獎勵：</strong> 
                  <span className="font-medium text-green-600 ml-1">{event.rewards}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div>
      {/* 導航按鈕 */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 內容區域 */}
      {renderContent()}
    </div>
  );
};

export default EventIntro;