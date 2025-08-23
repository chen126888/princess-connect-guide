import React, { useState } from 'react';
import Card from '../Common/Card';
import { items } from '../../newbieData';

// 道具名稱到檔案名稱的映射
const getItemIconFileName = (itemName: string): string => {
  const mapping: Record<string, string> = {
    '各式原礦': '各式原礦',
    'EXP藥水': '特製EXP藥水',
    'EX裝備鍊成幣': 'EX裝備鍊成幣',
    '精煉石': '精煉石', // 現在有專用圖標了
    '記憶碎片': '各式記憶碎片',
    '純淨記憶碎片': '各式純淨記憶碎片',
    '公主之星(碎片)': '公主之心(碎片)',
    '星素水晶球': '星素水晶球(光)', // 預設用光屬性
    '彩裝': '其他彩裝'
  };
  
  return mapping[itemName] || itemName;
};

const ItemOverview: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (itemId: number) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  const getIconPath = (itemName: string) => {
    const fileName = getItemIconFileName(itemName);
    if (!fileName) return null;
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
    // 對檔案名稱進行 URL 編碼以處理中文字符
    const encodedFileName = encodeURIComponent(fileName);
    return `${IMAGE_BASE_URL}/icons/${encodedFileName}.png`;
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-amber-700">📦 道具總覽</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const iconPath = getIconPath(item.name);
          const hasError = imageErrors.has(item.id);
          
          return (
            <div key={item.id} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-3">
                {/* 道具圖標 */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {iconPath && !hasError ? (
                    <img 
                      src={iconPath}
                      alt={item.name}
                      className="w-10 h-10 object-contain"
                      onError={() => {
                        console.warn(`圖片載入失敗: ${item.name} -> ${iconPath}`);
                        handleImageError(item.id);
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-amber-600 text-xs font-bold">📦</span>
                    </div>
                  )}
                </div>
                
                {/* 道具資訊 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">{item.description}</p>
                  {item.source && (
                    <p className="text-blue-600 text-xs leading-relaxed">
                      <span className="font-medium">主要來源：</span>{item.source}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ItemOverview;