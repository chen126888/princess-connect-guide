import React from 'react';
import type { ShopType } from '../../types/shop';
import { getCurrencySource, shopConfigs } from '../../shopData/shopConfigs';
import { useTooltip } from '../../hooks/useTooltip';

interface ShopTitleTooltipProps {
  shopType: ShopType;
  children: React.ReactNode;
}

const ShopTitleTooltip: React.FC<ShopTitleTooltipProps> = ({ shopType, children }) => {
  const { showTooltip, onMouseEnter, onMouseLeave } = useTooltip();
  const currencySource = getCurrencySource(shopType);
  const currencyName = shopConfigs[shopType]?.currencyName || '';

  if (!currencySource) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-80 max-w-xs bg-white p-3 border border-gray-200 rounded-lg shadow-lg pointer-events-none">
          <div className="text-sm">
            <h4 className="font-semibold text-gray-800 mb-1">{currencyName}獲取方式</h4>
            <p className="text-gray-600 break-words">{currencySource}</p>
          </div>
          {/* 箭頭 */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200"></div>
        </div>
      )}
    </div>
  );
};

export default ShopTitleTooltip;