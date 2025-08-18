import React from 'react';
import TabNavigation, { type TabItem } from '../Common/TabNavigation';

export type ActiveTab = 'sixStar' | 'unique1' | 'unique2' | 'nonSixStar';

interface CharacterDevelopmentTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const CharacterDevelopmentTabs: React.FC<CharacterDevelopmentTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs: TabItem<ActiveTab>[] = [
    { key: 'sixStar', label: '六星角色' },
    { key: 'unique1', label: '專一優先' },
    { key: 'unique2', label: '專二優先' },
    { key: 'nonSixStar', label: '非六星' }
  ];

  return (
    <TabNavigation
      items={tabs}
      activeItem={activeTab}
      onItemChange={onTabChange}
    />
  );
};

export default CharacterDevelopmentTabs;