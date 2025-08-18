import React from 'react';
import type { CharacterPriorityInfo } from '../../characterDevelopmentData';
import type { Character } from '../../types';
import UnifiedCharacterCard from '../Common/UnifiedCharacterCard';

interface CharacterCardProps {
  priorityInfo: CharacterPriorityInfo;
  character?: Character;
  displayMode: 'sixStar' | 'uePriority' | 'nonSixStar';
}

const CharacterCard: React.FC<CharacterCardProps> = ({ priorityInfo, character, displayMode }) => {
  if (!character) {
    return null; // 或者顯示一個預設的卡片
  }

  return (
    <UnifiedCharacterCard 
      character={character}
      priorityInfo={priorityInfo}
      variant="detailed"
      displayMode={displayMode}
    />
  );
};

export default CharacterCard;