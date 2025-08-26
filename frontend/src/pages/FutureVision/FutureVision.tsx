import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import TabNavigation from '../../components/Common/TabNavigation';
import CharacterPredictions from './CharacterPredictions';
import ClanBattleFuture from './ClanBattleFuture';

const FutureVision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('predictions');

  const tabs = [
    { key: 'predictions', label: '角色六星/專武' },
    { key: 'clan-battle', label: '戰隊戰' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'predictions':
        return <CharacterPredictions />;
      case 'clan-battle':
        return <ClanBattleFuture />;
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