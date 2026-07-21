import React, { useState } from 'react';
import type { Character } from '../../types';
import type { CharacterPriorityInfo } from '../../characterDevelopmentData';
import CharacterTooltip from './CharacterTooltip';
import { getCharacterImageSrc, handleCharacterImageError } from '../../utils/characterImageUtils';

interface UnifiedCharacterCardProps {
  character: Character;
  priorityInfo?: CharacterPriorityInfo;
  variant?: 'simple' | 'detailed';
  displayMode?: 'sixStar' | 'uePriority' | 'nonSixStar';
  className?: string;
}

const UnifiedCharacterCard: React.FC<UnifiedCharacterCardProps> = ({ 
  character, 
  priorityInfo,
  variant = 'simple',
  displayMode,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (variant === 'simple') {
    // 簡單版本 - 用於戰隊戰/競技場等場景
    return (
      <div 
        className={`relative group cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        {isHovered && (
          <CharacterTooltip 
            character={character} 
            className="z-10" 
          />
        )}
      </div>
    );
  }

  // 詳細版本 - 用於角色養成頁面
  return (
    <div 
      className={`relative border border-gray-200 rounded-lg shadow-sm flex flex-col items-center py-1 text-center transition-all duration-300 hover:shadow-md hover:scale-105 h-full w-20 mx-auto ${className}`}
      style={{ backgroundColor: '#fffaf0' }} // 米色背景
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className="w-16 h-16 mb-2 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
        <img 
          src={getCharacterImageSrc(character)}
          alt={priorityInfo?.name || character.角色名稱}
          onError={(e) => handleCharacterImageError(e, character, imageError, setImageError)}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-800 mb-1 flex-grow">
        {priorityInfo?.name || character.角色名稱}
      </h3>
      
      {/* UE2 Status (for six-star tab only) */}
      {displayMode === 'sixStar' && priorityInfo && (
        <div className="text-xs text-center text-gray-600 w-full px-1 mt-auto">
          {priorityInfo.ue2 === '有' && <p>專二</p>}
        </div>
      )}

      {/* Hover Tooltip (shows full details) */}
      {isHovered && (
        <CharacterTooltip character={character} />
      )}
    </div>
  );
};

export default UnifiedCharacterCard;