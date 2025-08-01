import React from 'react';
import type { ShopType } from '../../types/shop';

interface ShopNavigationProps {
  activeShop: ShopType;
  onShopChange: (shop: ShopType) => void;
}

const ShopNavigation: React.FC<ShopNavigationProps> = ({
  activeShop,
  onShopChange
}) => {
  const shopTypes = [
    { key: 'dungeon' as ShopType, label: '地下城', icon: '🏰' },
    { key: 'arena' as ShopType, label: '競技場', icon: '⚔️' },
    { key: 'p_arena' as ShopType, label: '公主競技場', icon: '👑' },
    { key: 'clan' as ShopType, label: '戰隊', icon: '🛡️' },
    { key: 'master' as ShopType, label: '大師', icon: '🌟' },
    { key: 'ex_equipment' as ShopType, label: 'EX裝備', icon: '💎' },
    { key: 'link' as ShopType, label: '連結', icon: '🔗' },
    { key: 'goddess_stone' as ShopType, label: '女神的祕石', icon: '💠' }
  ];

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">商店類型</h3>
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
            <span className="text-lg">{shop.icon}</span>
            <span className="text-sm">{shop.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopNavigation;