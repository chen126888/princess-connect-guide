import React from 'react';

type RatingCategory = '競技場進攻' | '競技場防守' | '戰隊戰' | '深域及抄作業';

interface DragRatingNavigationProps {
  activeCategory: RatingCategory;
  onCategoryChange: (category: RatingCategory) => void;
}

const DragRatingNavigation: React.FC<DragRatingNavigationProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const categories: Array<{key: RatingCategory, label: string, emoji: string}> = [
    { key: '競技場進攻', label: '競技場進攻', emoji: '⚔️' },
    { key: '競技場防守', label: '競技場防守', emoji: '🛡️' },
    { key: '戰隊戰', label: '戰隊戰', emoji: '👥' },
    { key: '深域及抄作業', label: '深域及抄作業', emoji: '🏛️' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 選擇評級類別</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors
              ${activeCategory === category.key
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }
            `}
          >
            <span className="text-lg">{category.emoji}</span>
            <span className="text-sm lg:text-base">{category.label}</span>
          </button>
        ))}
      </div>
      
      {/* 當前選中類別的說明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-medium">當前編輯：</span>
          {categories.find(c => c.key === activeCategory)?.emoji} {activeCategory}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          拖拽角色頭像在不同評級區塊間移動，只會影響此類別的評級
        </p>
      </div>
    </div>
  );
};

export default DragRatingNavigation;