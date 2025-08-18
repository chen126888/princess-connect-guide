import React from 'react';
import type { ShopType } from '../../types/shop';
import { useImageErrorHandler } from '../../hooks/useImageErrorHandler';
import { IMAGE_PATHS } from '../../config/constants';
import TabNavigation, { type TabItem } from '../Common/TabNavigation';

interface ShopNavigationProps {
  activeShop: ShopType;
  onShopChange: (shop: ShopType) => void;
}

const ShopNavigation: React.FC<ShopNavigationProps> = ({
  activeShop,
  onShopChange
}) => {
  const { handleImageError, hasImageError } = useImageErrorHandler();

  const shopTypes: TabItem<ShopType>[] = [
    { key: 'dungeon', label: '地下城', icon: '🏰', hasImage: true },
    { key: 'arena', label: '競技場', icon: '⚔️', hasImage: true },
    { key: 'p_arena', label: '公主競技場', icon: '👑', hasImage: true },
    { key: 'clan', label: '戰隊', icon: '🛡️', hasImage: true },
    { key: 'master', label: '大師', icon: '🌟', hasImage: true },
    { key: 'ex_equipment', label: 'EX裝備', icon: '💎', hasImage: true },
    { key: 'link', label: '連結', icon: '🔗', hasImage: true },
    { key: 'goddess_stone', label: '女神的秘石', icon: '💠', hasImage: true },
    { key: 'tour', label: '巡遊', icon: '🎪', hasImage: true }
  ];

  // 自定義圖標渲染函數
  const renderShopIcon = (item: TabItem<ShopType>) => {
    if (item.hasImage && !hasImageError(item.key)) {
      // 特殊檔名對應
      const fileNameMap: Record<string, string> = {
        'EX裝備': 'EX裝備幣',
        '連結': '連結幣'
      };
      
      const fileName = fileNameMap[item.label] || item.label;
      const imagePath = `${IMAGE_PATHS.SHOP_ICONS}/${fileName}.png`;
      
      return (
        <img 
          src={imagePath}
          alt={item.label}
          className="w-6 h-6 object-contain"
          onError={() => handleImageError(item.key)}
        />
      );
    }
    return <span className="text-lg">{item.icon}</span>;
  };

  const description = (
    <div className="text-xs text-yellow-700 space-y-1">
      <p>⚠️ 所有出現在商店列表中的商品在刷新前僅可購買一次</p>
      <p>📝 未放入的商品為相對不重要的</p>
      <p>💰 一般/限定商店商品，為瑪娜購買，若有需要可以全購買</p>
    </div>
  );

  return (
    <TabNavigation
      items={shopTypes}
      activeItem={activeShop}
      onItemChange={onShopChange}
      title="商店類型"
      description={description}
      descriptionClassName="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
      renderIcon={renderShopIcon}
      buttonSize="sm"
      layout="center"
    />
  );
};

export default ShopNavigation;