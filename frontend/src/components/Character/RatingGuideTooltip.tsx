import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

type RatingCategory = '競技場進攻/防守' | '戰隊戰' | '深域及抄作業';

const RatingGuideTooltip: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RatingCategory>('競技場進攻/防守');
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 點擊外部關閉彈窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const ratingData = {
    '競技場進攻/防守': [
      { tier: 'T0', description: '競技場必練角色。', color: 'text-red-300' },
      { tier: 'T1', description: '常上場。', color: 'text-orange-300' },
      { tier: 'T2', description: '有時上場。', color: 'text-yellow-300' },
      { tier: 'T3', description: '偶爾上場，優先度不高', color: 'text-green-300' },
      { tier: 'T4', description: '僅作為過度用', color: 'text-blue-300' },
      { tier: '倉管', description: '基本沒看過', color: 'text-gray-300' },
    ],
    '戰隊戰': [
      { tier: 'T0', description: '可跨屬', color: 'text-red-300' },
      { tier: 'T1', description: '常用角色，該屬性物理/魔法幾乎必上', color: 'text-orange-300' },
      { tier: 'T2', description: '有時會上場，選用角但常用到。', color: 'text-yellow-300' },
      { tier: 'T3', description: '偶爾上場，優先度不高', color: 'text-green-300' },
      { tier: 'T4', description: '幾乎是倉管，優先度低，可能很少登場或有更強替代。', color: 'text-blue-300' },
      { tier: '倉管', description: '舊角色，數值已過環境。', color: 'text-gray-300' },
    ],
    '深域及抄作業': [
      { tier: 'T0', description: '該屬性物理/魔法幾乎必上，或者其他多數場合幾乎必上。ex：泳咲', color: 'text-red-300' },
      { tier: 'T1', description: '深域常用角色，或其他至少兩個場合常用角色。', color: 'text-orange-300' },
      { tier: 'T2', description: '深域有時會上場，或其他至少一個場合常用角色。', color: 'text-yellow-300' },
      { tier: 'T3', description: '深域偶爾上場，其他場合可能一兩個月突然見到一次。', color: 'text-green-300' },
      { tier: 'T4', description: '深域沒上場，其他場合兩三個月可能偶爾見到一次，但不是最優解。', color: 'text-blue-300' },
      { tier: '倉管', description: '舊角色，數值已過環境。', color: 'text-gray-300' },
    ],
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors rounded hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="查看評價依據"
      >
        <span className="text-sm font-medium">評價依據</span>
        <Info className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[500px] z-50">
          <div ref={modalRef} className="bg-gray-800 text-white text-sm rounded-lg shadow-lg overflow-hidden">
            {/* 標題 */}
            <div className="p-4 text-center border-b border-gray-600">
              <div className="font-bold text-blue-200 mb-2">評價依據 (皆已滿等開專作為考量)</div>
              
              {/* 標籤頁 */}
              <div className="flex gap-1">
                {Object.keys(ratingData).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category as RatingCategory)}
                    className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                      activeTab === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 內容區域 */}
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="space-y-2">
                {ratingData[activeTab].map((item, index) => (
                  <div key={index} className="text-xs">
                    <span className={`font-medium ${item.color}`}>
                      {item.tier}：
                    </span>
                    <span className="text-gray-300">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
              
              {activeTab === '深域及抄作業' && (
                <div className="mt-3 text-xs text-gray-400 bg-gray-700 p-2 rounded">
                  ※ 主要為深域+其他場合的常用角色
                </div>
              )}
            </div>
            
            {/* 小箭頭 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingGuideTooltip;