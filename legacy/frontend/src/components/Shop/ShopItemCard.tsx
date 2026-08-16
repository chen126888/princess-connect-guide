import React, { useState } from 'react';
import type { ShopItem } from '../../types/shop';
import type { Character } from '../../types';
import PriorityBadge from './PriorityBadge';
import CharacterTooltip from '../Common/CharacterTooltip';
import { getCharacterImageSrc, handleCharacterImageError } from '../../utils/characterImageUtils';
import { getItemDescription } from '../../shopData/itemDescriptions';
import { IMAGE_PATHS } from '../../config/constants';
import { useTooltip } from '../../hooks/useTooltip';

interface ShopItemCardProps {
  item: ShopItem;
  characters?: Character[];
  className?: string;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  characters = [],
  className = ''
}) => {
  // 根據characterId查找對應角色 - 標準化移除所有空格
  const character = item.type === 'character' && item.characterId 
    ? characters.find(char => {
        const normalizedCharName = char?.角色名稱?.replace(/\s+/g, '') || '';
        const normalizedItemId = item.characterId?.replace(/\s+/g, '') || '';
        return normalizedCharName === normalizedItemId;
      })
    : null;

  const [imageError, setImageError] = useState(false);
  const { showTooltip, onMouseEnter, onMouseLeave } = useTooltip();
  
  const itemDescription = getItemDescription(item.name);
  const shouldShowTooltip = (item.type === 'character' && character) || itemDescription;

  // 決定要顯示的圖片 URL
  const getImageSrc = (): string => {
    if (!character) return item.icon || '📦';
    return getCharacterImageSrc(character);
  };

  return (
    <div
      className={`relative bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg ${className}`}
      onMouseEnter={shouldShowTooltip ? onMouseEnter : undefined}
      onMouseLeave={shouldShowTooltip ? onMouseLeave : undefined}
    >
      <div className="p-4">
        {/* 商品圖片/角色 */}
        <div className="flex items-center justify-center mb-3">
          {item.type === 'character' && character ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
              <img 
                src={getImageSrc()}
                alt={character.角色名稱}
                className="w-full h-full object-cover"
                onError={(e) => character && handleCharacterImageError(e, character, imageError, setImageError)}
              />
            </div>
          ) : item.hasImage ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
              <img 
                src={`${IMAGE_PATHS.SHOP_ICONS}/${item.name}.png`}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';  
                  }
                }}
              />
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-2xl" style={{ display: 'none' }}>
                {item.icon || '📦'}
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              {item.icon || '📦'}
            </div>
          )}
        </div>

        {/* 商品名稱 */}
        <h4 className="text-sm font-semibold text-gray-800 text-center mb-2 line-clamp-2">
          {item.name}
        </h4>

        {/* 優先級標籤 */}
        <div className="flex justify-center">
          <PriorityBadge priority={item.priority} />
        </div>
      </div>

      {/* 懸停詳情卡片 */}
      {showTooltip && (
        <>
          {/* 角色詳情卡片 */}
          {character && (
            <CharacterTooltip character={character} />
          )}
          
          {/* 商品說明卡片 */}
          {!character && itemDescription && (
            <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-gray-800 font-bold mb-1 text-sm">{item.name}</h3>
              <p className="text-gray-600 text-xs">{itemDescription}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopItemCard;