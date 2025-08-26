import React from 'react';
import type { ArenaType } from '../../types/arena';
import TabNavigation, { type TabItem } from '../Common/TabNavigation';

interface ArenaNavigationProps {
  activeType: ArenaType;
  onTypeChange: (type: ArenaType) => void;
}

const ArenaNavigation: React.FC<ArenaNavigationProps> = ({
  activeType,
  onTypeChange
}) => {
  const arenaTypes: TabItem<ArenaType>[] = [
    { key: 'arena', label: '競技場', icon: '⚔️' },
    { key: 'trial', label: '戰鬥試煉場' },
    { key: 'memory', label: '追憶' }
  ];

  return (
    <TabNavigation
      items={arenaTypes}
      activeItem={activeType}
      onItemChange={onTypeChange}
      title="功能選擇"
      description="📝 僅介紹常用角色(開專)，或基礎通關隊伍"
    />
  );
};

export default ArenaNavigation;