import React, { useState } from 'react';
import type { Character } from '../../types';

// 圖片路徑生成函數
const getCharacterImagePath = (character: Character): { sixStar: string | null; normal: string | null } => {
  const API_BASE_URL = 'http://localhost:3000';
  
  return {
    sixStar: character.六星頭像檔名 ? `${API_BASE_URL}/images/characters/${character.六星頭像檔名}` : null,
    normal: character.頭像檔名 ? `${API_BASE_URL}/images/characters/${character.頭像檔名}` : null
  };
};

interface CharacterImageCardProps {
  character: Character;
}

// 角色圖片組件（含懸停詳情）
const CharacterImageCard: React.FC<CharacterImageCardProps> = ({ character }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imagePaths = getCharacterImagePath(character);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (!imageError && imagePaths.sixStar && img.src === imagePaths.sixStar) {
      // 六星圖片載入失敗，嘗試普通圖片
      if (imagePaths.normal) {
        img.src = imagePaths.normal;
        setImageError(true);
      } else {
        // 沒有普通圖片，使用預設圖片
        img.src = "/default-character.svg";
      }
    } else {
      // 普通圖片也載入失敗，使用預設圖片
      img.src = "/default-character.svg";
    }
  };

  // 決定要顯示的圖片 URL
  const getImageSrc = (): string => {
    // 優先顯示六星圖片，沒有則顯示普通圖片，都沒有則顯示預設圖片
    if (imagePaths.sixStar) return imagePaths.sixStar;
    if (imagePaths.normal) return imagePaths.normal;
    return "/default-character.svg";
  };

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
          src={getImageSrc()}
          alt={character.角色名稱}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      {/* 懸停詳情 */}
      {showTooltip && (
        <div 
          className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white p-4 border border-gray-200"
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <h3 className="text-gray-800 font-bold mb-1">{character.角色名稱}</h3>
          <p className="text-gray-600 text-sm mb-2">暱稱：{character.暱稱 || '(無資料)'}</p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-700">位置：{character.位置}</p>
            <p className="text-gray-700">定位：{character.角色定位 || '(無資料)'}</p>
            <p className="text-gray-700">獲得：{character['常駐/限定'] || '(無資料)'}</p>
            <p className="text-gray-700">屬性：{character.屬性 || '(無資料)'}</p>
            <p className="text-gray-700">能力偏向：{character.能力偏向 || '(無資料)'}</p>
            <p className="text-gray-700">競技場進攻：{character.競技場進攻 || '(無資料)'}</p>
            <p className="text-gray-700">競技場防守：{character.競技場防守 || '(無資料)'}</p>
            <p className="text-gray-700">戰隊戰等抄作業場合：{character.戰隊戰等抄作業場合 || '(無資料)'}</p>
          </div>
          <p className="text-gray-600 text-xs mt-2 leading-relaxed border-t border-gray-200 pt-2">
            說明：{character.說明 || '(無資料)'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CharacterImageCard;