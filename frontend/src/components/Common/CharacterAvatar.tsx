import React, { useState } from 'react';
import type { Character } from '../../types';
import { getCharacterImageSrc, handleCharacterImageError } from '../../utils/characterImageUtils';

interface CharacterAvatarProps {
  character: Character | null;
  characterName: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ 
  character, 
  characterName, 
  size = 'medium',
  showName = false 
}) => {
  const [imageError, setImageError] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-12 h-12';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'medium':
        return 'text-sm';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${getSizeClasses()} rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 bg-gray-100`}>
        {character ? (
          <img 
            src={getCharacterImageSrc(character)}
            alt={characterName}
            onError={(e) => handleCharacterImageError(e, character, imageError, setImageError)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">?</span>
          </div>
        )}
      </div>
      {showName && (
        <span className={`mt-1 text-center text-gray-700 font-medium ${getTextSize()}`}>
          {characterName}
        </span>
      )}
    </div>
  );
};

export default CharacterAvatar;