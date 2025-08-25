import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import TabNavigation from '../../components/Common/TabNavigation';
import Introduction from '../../components/ClanBattle/Introduction';
import CommonCharacters from '../../components/ClanBattle/CommonCharacters';
import { useCharacters } from '../../hooks/useCharacters';

const ClanBattle: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('introduction');
  const { characters, loading: charactersLoading } = useCharacters();

  const tabs = [
    { key: 'introduction', label: '簡介' },
    { key: 'commonCharacters', label: '常用角色' }
  ];

  if (charactersLoading) {
    return <PageContainer><div className="text-center p-8">正在載入角色資料...</div></PageContainer>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'introduction':
        return <Introduction />;
      case 'commonCharacters':
        return <CommonCharacters allCharacters={characters} />;
      default:
        return <Introduction />;
    }
  };

  return (
    <PageContainer>
      <TabNavigation
        items={tabs}
        activeItem={activeTab}
        onItemChange={setActiveTab}
      />
      
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </PageContainer>
  );
};

export default ClanBattle;
