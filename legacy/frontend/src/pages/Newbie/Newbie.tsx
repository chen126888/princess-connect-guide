import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import MustRead from '../../components/Newbie/MustRead';
import ItemOverview from '../../components/Newbie/ItemOverview';
import CharacterSystem from '../../components/Newbie/CharacterSystem';
import EventIntro from '../../components/Newbie/EventIntro';
import TeamFormation from '../../components/Newbie/TeamFormation';

type NewbieTab = 'mustRead' | 'itemOverview' | 'characterSystem' | 'eventIntro' | 'teamFormation';

const Newbie: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NewbieTab>('mustRead');

  const tabs: { key: NewbieTab; label: string }[] = [
    { key: 'mustRead', label: '新人必看' },
    { key: 'itemOverview', label: '道具總覽' },
    { key: 'characterSystem', label: '角色系統' },
    { key: 'eventIntro', label: '活動介紹' },
    { key: 'teamFormation', label: '新人組隊建議' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'mustRead':
        return <MustRead />;
      case 'itemOverview':
        return <ItemOverview />;
      case 'characterSystem':
        return <CharacterSystem />;
      case 'eventIntro':
        return <EventIntro />;
      case 'teamFormation':
        return <TeamFormation />;
      default:
        return <MustRead />;
    }
  };

  return (
    <PageContainer>
      <div className="w-full">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-6 bg-white p-2 rounded-lg shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 font-semibold rounded-md transition-colors duration-200 mx-1 ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </PageContainer>
  );
};

export default Newbie;
