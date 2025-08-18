import React, { useState, useMemo } from 'react';
import { 
  sixStarTiers, 
  uniqueEquipment1Tiers, 
  uniqueEquipment2Tiers,
  nonSixStarTiers
} from '../../characterDevelopmentData';
import type { Character } from '../../types';
import CharacterDevelopmentTabs, { type ActiveTab } from '../../components/CharacterDevelopment/CharacterDevelopmentTabs';
import CharacterDevelopmentDescription from '../../components/CharacterDevelopment/CharacterDevelopmentDescription';
import PriorityTierSection from '../../components/CharacterDevelopment/PriorityTierSection';
import PageContainer from '../../components/Common/PageContainer';
import { useCharacters } from '../../hooks/useCharacters';

const CharacterDevelopmentPage: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const [activeTab, setActiveTab] = useState<ActiveTab>('sixStar');
  const [searchTerm] = useState<string>('');

  // 建立角色名稱對應表
  const characterMap = useMemo(() => {
    const newCharMap = new Map<string, Character>();
    for (const char of characters) {
      newCharMap.set(char.角色名稱, char);
      if (char.暱稱) {
        newCharMap.set(char.暱稱, char);
      }
    }
    return newCharMap;
  }, [characters]);

  const { activeTiers, displayMode } = useMemo(() => {
    switch (activeTab) {
      case 'sixStar': 
        return { activeTiers: sixStarTiers, displayMode: 'sixStar' as const };
      case 'unique1': 
        return { activeTiers: uniqueEquipment1Tiers, displayMode: 'uePriority' as const };
      case 'unique2': 
        return { activeTiers: uniqueEquipment2Tiers, displayMode: 'uePriority' as const };
      case 'nonSixStar':
        return { activeTiers: nonSixStarTiers, displayMode: 'nonSixStar' as const };
      default: 
        return { activeTiers: [], displayMode: 'uePriority' as const };
    }
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <div className="text-center p-8">正在載入角色資料...</div>;
    if (error) return <div className="text-center p-8 text-red-500">無法載入角色資料，請稍後再試。</div>;
    if (activeTiers.length === 0) return <div className="text-center p-8 text-gray-500">此類別目前沒有資料。</div>;

    return (
      <PriorityTierSection
        tiers={activeTiers}
        characterMap={characterMap}
        searchTerm={searchTerm}
        displayMode={displayMode}
      />
    );
  };

  return (
    <PageContainer>
      <CharacterDevelopmentTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <CharacterDevelopmentDescription 
        activeTab={activeTab}
      />

      {renderContent()}
    </PageContainer>
  );
};

export default CharacterDevelopmentPage;