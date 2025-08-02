import React from 'react';
import type { ShopType } from '../../types/shop';
import { useTooltip } from '../../hooks/useTooltip';
import { IMAGE_PATHS } from '../../config/constants';

interface ManualResetButtonProps {
  shopType: ShopType;
}

const ManualResetButton: React.FC<ManualResetButtonProps> = ({ shopType }) => {
  const { showTooltip, onMouseEnter, onMouseLeave } = useTooltip();

  // 取得商店名稱對應
  const getShopName = (shop: ShopType): string => {
    const nameMap: Record<ShopType, string> = {
      dungeon: '地下城',
      arena: '競技場', 
      p_arena: '公主競技場',
      clan: '戰隊',
      master: '大師',
      ex_equipment: 'EX裝備',
      link: '連結',
      goddess_stone: '女神的祕石',
      tour: '巡遊'
    };
    return nameMap[shop] || shop;
  };

  // 取得重置費用資訊
  const getResetCosts = () => {
    const shopName = getShopName(shopType);
    return [
      { range: '1~4次', cost: `10${shopName}幣` },
      { range: '5~8次', cost: `50${shopName}幣` },
      { range: '9~12次', cost: `100${shopName}幣` },
      { range: '後續', cost: `尚未測試` }
    ];
  };

  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button className="flex items-center gap-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200">
        <img 
          src={`${IMAGE_PATHS.SHOP_ICONS}/商店.png`}
          alt="手動重置"
          className="w-4 h-4 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <span className="text-blue-500">🔄</span>
        <span className="text-sm text-blue-600 font-medium">手動重置</span>
      </button>

      {/* 重置費用提示 */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full right-0 mb-2 w-48 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
          <div className="p-3">
            <div className="font-medium text-white mb-2">重置費用</div>
            <div className="space-y-1">
              {getResetCosts().map((cost, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-300">{cost.range}</span>
                  <span className="text-white">{cost.cost}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 小箭頭 */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default ManualResetButton;