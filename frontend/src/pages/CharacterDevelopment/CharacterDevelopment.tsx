import React, { useState, useMemo } from 'react';
import type { Character } from '../../types';
import CharacterDevelopmentTabs, { type ActiveTab } from '../../components/CharacterDevelopment/CharacterDevelopmentTabs';
import CharacterDevelopmentDescription from '../../components/CharacterDevelopment/CharacterDevelopmentDescription';
import PriorityTierSection from '../../components/CharacterDevelopment/PriorityTierSection';
import PageContainer from '../../components/Common/PageContainer';
import { useCharacters } from '../../hooks/useCharacters';
import { useCharacterDevelopmentData } from '../../hooks/useCharacterDevelopmentData';
import PriorityManagementModal from '../../components/Management/PriorityManagementModal';
import NonSixstarManagementModal from '../../components/Management/NonSixstarManagementModal';

const CharacterDevelopmentPage: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const { 
    sixstarTiers, 
    ue1Tiers, 
    ue2Tiers, 
    nonSixstarTiers,
    loading: developmentDataLoading,
    refetch
  } = useCharacterDevelopmentData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('sixStar');
  const [searchTerm] = useState<string>('');
  
  // Modal 狀態管理
  const [isSixstarModalOpen, setIsSixstarModalOpen] = useState(false);
  const [isUe1ModalOpen, setIsUe1ModalOpen] = useState(false);
  const [isUe2ModalOpen, setIsUe2ModalOpen] = useState(false);
  const [isNonSixstarModalOpen, setIsNonSixstarModalOpen] = useState(false);

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

  // Modal 管理函數
  const handleManagementSave = () => {
    refetch(); // 刷新資料
  };

  const { activeTiers, displayMode, onManagementModalOpen } = useMemo(() => {
    switch (activeTab) {
      case 'sixStar': 
        return { 
          activeTiers: sixstarTiers, 
          displayMode: 'sixStar' as const,
          onManagementModalOpen: () => setIsSixstarModalOpen(true)
        };
      case 'unique1': 
        return { 
          activeTiers: ue1Tiers, 
          displayMode: 'uePriority' as const,
          onManagementModalOpen: () => setIsUe1ModalOpen(true)
        };
      case 'unique2': 
        return { 
          activeTiers: ue2Tiers, 
          displayMode: 'uePriority' as const,
          onManagementModalOpen: () => setIsUe2ModalOpen(true)
        };
      case 'nonSixStar':
        return { 
          activeTiers: nonSixstarTiers, 
          displayMode: 'nonSixStar' as const,
          onManagementModalOpen: () => setIsNonSixstarModalOpen(true)
        };
      default: 
        return { 
          activeTiers: [], 
          displayMode: 'uePriority' as const,
          onManagementModalOpen: undefined
        };
    }
  }, [activeTab, sixstarTiers, ue1Tiers, ue2Tiers, nonSixstarTiers]);

  const renderContent = () => {
    if (loading || developmentDataLoading) return <div className="text-center p-8">正在載入角色資料...</div>;
    if (error) return <div className="text-center p-8 text-red-500">無法載入角色資料，請稍後再試。</div>;
    if (activeTiers.length === 0) return <div className="text-center p-8 text-gray-500">此類別目前沒有資料。</div>;

    return (
      <PriorityTierSection
        tiers={activeTiers}
        characterMap={characterMap}
        searchTerm={searchTerm}
        displayMode={displayMode}
        onManagementModalOpen={onManagementModalOpen}
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
      
      {/* 管理Modals */}
      <PriorityManagementModal
        isOpen={isSixstarModalOpen}
        onClose={() => setIsSixstarModalOpen(false)}
        onSave={handleManagementSave}
        type="sixstar"
      />
      
      <PriorityManagementModal
        isOpen={isUe1ModalOpen}
        onClose={() => setIsUe1ModalOpen(false)}
        onSave={handleManagementSave}
        type="ue1"
      />
      
      <PriorityManagementModal
        isOpen={isUe2ModalOpen}
        onClose={() => setIsUe2ModalOpen(false)}
        onSave={handleManagementSave}
        type="ue2"
      />
      
      <NonSixstarManagementModal
        isOpen={isNonSixstarModalOpen}
        onClose={() => setIsNonSixstarModalOpen(false)}
        onSave={handleManagementSave}
      />
    </PageContainer>
  );
};

export default CharacterDevelopmentPage;