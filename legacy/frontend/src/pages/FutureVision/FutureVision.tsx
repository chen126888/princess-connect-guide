import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import TabNavigation from '../../components/Common/TabNavigation';
import CharacterPredictions from './CharacterPredictions';
import ClanBattleFuture from './ClanBattleFuture';
import AbyssRaidFuture from './AbyssRaidFuture';

const FutureVision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('predictions');

  const tabs = [
    { key: 'predictions', label: '角色' },
    { key: 'clan-battle', label: '戰隊戰' },
    { key: 'abyss-raid', label: '深淵討伐' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'predictions':
        return <CharacterPredictions />;
      case 'clan-battle':
        return <ClanBattleFuture />;
      case 'abyss-raid':
        return <AbyssRaidFuture />;
      default:
        return <CharacterPredictions />;
    }
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">

        <TabNavigation
          items={tabs}
          activeItem={activeTab}
          onItemChange={setActiveTab}
        />

        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </PageContainer>
  );
};

export default FutureVision;