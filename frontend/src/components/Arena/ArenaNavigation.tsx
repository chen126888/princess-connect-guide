import React from 'react';
import type { ArenaType } from '../../types/arena';

interface ArenaNavigationProps {
  activeType: ArenaType;
  onTypeChange: (type: ArenaType) => void;
}

const ArenaNavigation: React.FC<ArenaNavigationProps> = ({
  activeType,
  onTypeChange
}) => {
  const arenaTypes: { key: ArenaType; label: string; icon: string }[] = [
    { key: 'arena', label: '競技場', icon: '⚔️' },
    { key: 'trial', label: '戰鬥試煉場', icon: '🏆' },
    { key: 'memory', label: '追憶', icon: '📖' }
  ];

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">功能選擇</h3>
      <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-blue-700">
          <p>📝 僅介紹常用角色(開專)，或基礎通關隊伍</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {arenaTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => onTypeChange(type.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeType === type.key
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:transform hover:scale-105'
            }`}
          >
            <span className="text-lg">{type.icon}</span>
            <span className="text-sm">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArenaNavigation;