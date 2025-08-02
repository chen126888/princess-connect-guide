import React, { useState } from 'react';
import type { Character } from '../../types';
import CharacterTooltip from '../Common/CharacterTooltip';
import { getCharacterImageSrc, handleCharacterImageError } from '../../utils/characterImageUtils';

interface CharacterImageCardProps {
  character: Character;
}

// 角色圖片組件（含懸停詳情）
const CharacterImageCard: React.FC<CharacterImageCardProps> = ({ character }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className="w-16 h-16 bg-beige-300 overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-all duration-200 hover:shadow-md"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        <img
          src={getCharacterImageSrc(character)}
          alt={character.角色名稱}
          className="w-full h-full object-cover"
          onError={(e) => handleCharacterImageError(e, character, imageError, setImageError)}
        />
      </div>
      
      {/* 懸停詳情 */}
      {showTooltip && (
        <CharacterTooltip 
          character={character} 
          className="z-10" 
        />
      )}
    </div>
  );
};

export default CharacterImageCard;