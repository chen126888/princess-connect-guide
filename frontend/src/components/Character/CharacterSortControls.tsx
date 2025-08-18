import React from 'react';
import RatingGuideTooltip from './RatingGuideTooltip';

type SortOrder = 'T0_to_倉管' | '倉管_to_T0';

interface CharacterSortControlsProps {
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

const CharacterSortControls: React.FC<CharacterSortControlsProps> = ({ 
  sortOrder, 
  onSortOrderChange 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-700 font-medium text-base">排序方式</h3>
        <RatingGuideTooltip />
      </div>
      <div className="flex gap-2">
        <button
          className={`flex-1 px-4 py-3 text-xs rounded-lg border-2 transition-colors font-medium ${
            sortOrder === 'T0_to_倉管'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => onSortOrderChange('T0_to_倉管')}
        >
          T0 → 倉管
        </button>
        <button
          className={`flex-1 px-4 py-3 text-xs rounded-lg border-2 transition-colors font-medium ${
            sortOrder === '倉管_to_T0'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => onSortOrderChange('倉管_to_T0')}
        >
          倉管 → T0
        </button>
      </div>
    </div>
  );
};

export default CharacterSortControls;