import React from 'react';
import type { Character } from '../../types';
import UnifiedCharacterCard from '../Common/UnifiedCharacterCard';

interface CharacterImageCardProps {
  character: Character;
  className?: string;
}

// 角色圖片組件（含懸停詳情）
const CharacterImageCard: React.FC<CharacterImageCardProps> = ({ character, className }) => {
  return (
    <UnifiedCharacterCard 
      character={character}
      variant="simple"
      className={className}
    />
  );
};

export default CharacterImageCard;