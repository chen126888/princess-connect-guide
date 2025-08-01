import React, { useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import Card from '../../components/Common/Card';
import ShopNavigation from '../../components/Shop/ShopNavigation';
import ShopItemCard from '../../components/Shop/ShopItemCard';
import { useCharacters } from '../../hooks/useCharacters';
import type { ShopType } from '../../types/shop';
import { getShopItems, getShopTitle, getShopDescription, getShopResetTime } from '../../shopData';

const Shop: React.FC = () => {
  const [activeShop, setActiveShop] = useState<ShopType>('dungeon');
  const { characters } = useCharacters();

  const shopItems = getShopItems(activeShop);

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        
        {/* 商店導航 */}
        <ShopNavigation 
          activeShop={activeShop}
          onShopChange={setActiveShop}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主要內容區域 */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {getShopTitle(activeShop)}
                </h2>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {getShopResetTime(activeShop)}
                </div>
              </div>
              
              {shopItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {shopItems.map((item) => (
                    <ShopItemCard
                      key={item.id}
                      item={item}
                      characters={characters}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {getShopTitle(activeShop)}資料準備中
                  </h3>
                  <p className="text-gray-500">
                    我們正在整理這個商店的購買建議，請稍後再來查看
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* 側邊說明資訊 */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                說明
              </h3>
              <div className="text-sm text-gray-600 space-y-3">
                <p className="text-gray-700">{getShopDescription(activeShop)}</p>
                
                <div className="border-t pt-3">
                  <h4 className="font-medium text-gray-700 mb-2">優先級說明：</h4>
                  <div className="space-y-1">
                    <p>• <span className="text-red-600 font-medium">必買</span>：最高優先級，強烈建議購買</p>
                    <p>• <span className="text-orange-500 font-medium">推薦</span>：建議購買，性價比高</p>
                    <p>• <span className="text-blue-500 font-medium">可選</span>：根據需求選擇</p>
                    <p>• <span className="text-gray-500 font-medium">跳過</span>：不建議購買</p>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500">💡 將滑鼠懸停在角色碎片上可查看詳細資訊</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Shop;