import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import ArenaNavigation from '../../components/Arena/ArenaNavigation';
import ArenaContent from '../../components/Arena/ArenaContent';
import type { ArenaType } from '../../types/arena';
import { useCharacters } from '../../hooks/useCharacters';

const Arena: React.FC = () => {
  const [activeType, setActiveType] = useState<ArenaType>('arena');
  const { characters, loading: charactersLoading } = useCharacters();

  return (
    <PageContainer>
      <ArenaNavigation 
        activeType={activeType}
        onTypeChange={setActiveType}
      />
      <ArenaContent 
        activeType={activeType} 
        characters={characters}
        loading={charactersLoading}
      />
    </PageContainer>
  );
};

export default Arena;