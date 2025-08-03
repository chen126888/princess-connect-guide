import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import ArenaNavigation from '../../components/Arena/ArenaNavigation';
import ArenaContent from '../../components/Arena/ArenaContent';
import type { ArenaType } from '../../types/arena';

const Arena: React.FC = () => {
  const [activeType, setActiveType] = useState<ArenaType>('arena');

  return (
    <PageContainer>
      <ArenaNavigation 
        activeType={activeType}
        onTypeChange={setActiveType}
      />
      <ArenaContent activeType={activeType} />
    </PageContainer>
  );
};

export default Arena;