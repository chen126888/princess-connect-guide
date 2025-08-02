import React from 'react';
import type { ShopType } from '../../types/shop';
import { useImageErrorHandler } from '../../hooks/useImageErrorHandler';
import { IMAGE_PATHS } from '../../config/constants';

interface ShopNavigationProps {
  activeShop: ShopType;
  onShopChange: (shop: ShopType) => void;
}

const ShopNavigation: React.FC<ShopNavigationProps> = ({
  activeShop,
  onShopChange
}) => {
  const { handleImageError, hasImageError } = useImageErrorHandler();

  const shopTypes = [
    { key: 'dungeon' as ShopType, label: '地下城', icon: '🏰', hasImage: true },
    { key: 'arena' as ShopType, label: '競技場', icon: '⚔️', hasImage: true },
    { key: 'p_arena' as ShopType, label: '公主競技場', icon: '👑', hasImage: true },
    { key: 'clan' as ShopType, label: '戰隊', icon: '🛡️', hasImage: true },
    { key: 'master' as ShopType, label: '大師', icon: '🌟', hasImage: true },
    { key: 'ex_equipment' as ShopType, label: 'EX裝備', icon: '💎', hasImage: true },
    { key: 'link' as ShopType, label: '連結', icon: '🔗', hasImage: true },
    { key: 'goddess_stone' as ShopType, label: '女神的秘石', icon: '💠', hasImage: true },
    { key: 'tour' as ShopType, label: '巡遊', icon: '🎪', hasImage: true }
  ];

  // 取得商店圖標（圖片或emoji）
  const getShopIcon = (shop: typeof shopTypes[0]) => {
    if (shop.hasImage && !hasImageError(shop.key)) {
      // 特殊檔名對應
      const fileNameMap: Record<string, string> = {
        'EX裝備': 'EX裝備幣',
        '連結': '連結幣'
      };
      
      const fileName = fileNameMap[shop.label] || shop.label;
      const imagePath = `${IMAGE_PATHS.SHOP_ICONS}/${fileName}.png`;
      
      return (
        <img 
          src={imagePath}
          alt={shop.label}
          className="w-6 h-6 object-contain"
          onError={() => handleImageError(shop.key)}
        />
      );
    }
    return <span className="text-lg">{shop.icon}</span>;
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">商店類型</h3>
      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-xs text-yellow-700 space-y-1">
          <p>⚠️ 所有出現在商店列表中的商品在刷新前僅可購買一次</p>
          <p>📝 未放入的商品為相對不重要的</p>
          <p>💰 一般/限定商店商品，為瑪娜購買，若有需要可以全購買</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {shopTypes.map((shop) => (
          <button
            key={shop.key}
            onClick={() => onShopChange(shop.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeShop === shop.key
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6">
              {getShopIcon(shop)}
            </div>
            <span className="text-sm">{shop.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopNavigation;