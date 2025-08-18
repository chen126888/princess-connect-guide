import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import CharacterPlanningSection from '../../components/ReturnPlayer/CharacterPlanningSection';
import DailyStrategySection from '../../components/ReturnPlayer/DailyStrategySection';
import NewbieBoostSection from '../../components/ReturnPlayer/NewbieBoostSection';
import Card from '../../components/Common/Card';

interface ReturnPlayerProps {
  onNavigateToPage?: (page: string) => void;
}

type ReturnPlayerTab = 'planning' | 'development' | 'strategy';

const ReturnPlayer: React.FC<ReturnPlayerProps> = ({ onNavigateToPage }) => {
  const [activeTab, setActiveTab] = useState<ReturnPlayerTab>('planning');

  const tabs: { key: ReturnPlayerTab; label: string }[] = [
    { key: 'planning', label: '養成與抽角' },
    { key: 'development', label: '同步與屬性' },
    { key: 'strategy', label: '日常與副本攻略' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'planning':
        return (
          <>
            <CharacterPlanningSection 
              onNavigateToCharacterDevelopment={() => onNavigateToPage?.('characterDevelopment')}
            />
            <NewbieBoostSection />
          </>
        );
      case 'development':
        return (
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">同步與屬性相關影片</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 shadow-sm">
                <h3 className="font-bold text-amber-800 mb-2">同步</h3>
                <a 
                  href="https://www.youtube.com/watch?v=wuCLds8srKo&ab_channel=%E7%85%8C%E9%9D%88%2FLongTimeNoC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  https://www.youtube.com/watch?v=wuCLds8srKo&ab_channel=煌靈%2FLongTimeNoC
                </a>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 shadow-sm">
                <h3 className="font-bold text-amber-800 mb-2">屬性</h3>
                <a 
                  href="https://www.youtube.com/watch?v=2mH10HqHnzU&ab_channel=%E7%85%8C%E9%9D%88%2FLongTimeNoC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  https://www.youtube.com/watch?v=2mH10HqHnzU&ab_channel=煌靈%2FLongTimeNoC
                </a>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 shadow-sm">
                <h3 className="font-bold text-amber-800 mb-2">職階</h3>
                <a 
                  href="https://www.youtube.com/watch?v=A2fDql8_0uM&ab_channel=%E7%85%8C%E9%9D%88%2FLongTimeNoC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  https://www.youtube.com/watch?v=A2fDql8_0uM&ab_channel=煌靈%2FLongTimeNoC
                </a>
              </div>
            </div>
          </Card>
        );
      case 'strategy':
        return <DailyStrategySection />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {/* 標籤頁按鈕 */}
      <div className="flex justify-center mb-6 bg-white p-2 rounded-lg shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 font-semibold rounded-md transition-colors duration-200 mx-1 ${
              activeTab === tab.key
                ? 'bg-amber-500 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 內容區域 */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </PageContainer>
  );
};

export default ReturnPlayer;