import React from 'react';
import { Loader, Flame, Droplet, Wind, Sun, Moon } from 'lucide-react';
import Card from '../../components/Common/Card';
import PageContainer from '../../components/Common/PageContainer';
import CharacterSearch from '../../components/Character/CharacterSearch';
import CharacterSortControls from '../../components/Character/CharacterSortControls';
import CharacterTierGroup from '../../components/Character/CharacterTierGroup';
import { useCharacters } from '../../hooks/useCharacters';
import { useCharacterFilters } from '../../hooks/useCharacterFilters';

// 篩選按鈕組件
const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'all';
}> = ({ active, onClick, children, variant = 'default' }) => {
  const baseClass = "px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium";
  const variantClass = variant === 'all' 
    ? active ? 'bg-gray-500 text-white border-gray-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
    : active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400';
  
  return (
    <button className={`${baseClass} ${variantClass}`} onClick={onClick}>
      {children}
    </button>
  );
};

// 篩選區塊組件
const FilterSection: React.FC<{
  title: string;
  filterType: 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability';
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
}> = ({ title, options, selectedValues, onToggle, onSelectAll, isAllSelected }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">{title}</span>
    <div className="flex flex-wrap gap-2">
      <FilterButton
        active={isAllSelected}
        onClick={onSelectAll}
        variant="all"
      >
        全部
      </FilterButton>
      {options.map(option => (
        <FilterButton
          key={option}
          active={selectedValues.includes(option)}
          onClick={() => onToggle(option)}
        >
          {option}
        </FilterButton>
      ))}
    </div>
  </div>
);

const Characters: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const {
    filters,
    setFilters,
    filteredCharacters,
    groupedCharacters,
    handleArrayFilterChange,
    handleSelectAll,
    isAllSelected,
    filterOptions
  } = useCharacterFilters(characters);

  // 獲取屬性圖標
  const getElementIcon = (element: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      火屬: <Flame className="w-3 h-3" />,
      水屬: <Droplet className="w-3 h-3" />,
      風屬: <Wind className="w-3 h-3" />,
      光屬: <Sun className="w-3 h-3" />,
      闇屬: <Moon className="w-3 h-3" />
    };
    return iconMap[element];
  };

  // 獲取屬性樣式
  const getElementStyles = (element: string) => {
    const styleMap: Record<string, { default: string; selected: string }> = {
      火屬: {
        default: 'border-red-500 bg-red-100 text-red-600 hover:bg-red-200',
        selected: 'border-red-500 bg-red-500 text-white'
      },
      水屬: {
        default: 'border-blue-500 bg-blue-100 text-blue-600 hover:bg-blue-200',
        selected: 'border-blue-500 bg-blue-500 text-white'
      },
      風屬: {
        default: 'border-green-500 bg-green-100 text-green-600 hover:bg-green-200',
        selected: 'border-green-500 bg-green-500 text-white'
      },
      光屬: {
        default: 'border-yellow-500 bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
        selected: 'border-yellow-500 bg-yellow-500 text-white'
      },
      闇屬: {
        default: 'border-purple-500 bg-purple-100 text-purple-600 hover:bg-purple-200',
        selected: 'border-purple-500 bg-purple-500 text-white'
      }
    };
    return styleMap[element] || { default: '', selected: '' };
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin w-16 h-16 text-white mb-4 mx-auto" />
          <p className="text-white text-xl">載入角色資料中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">載入失敗</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors"
          >
            🔄 重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      {/* 主要功能區域 - 兩個卡片水平置中 */}
      <div className="flex justify-center items-start">
        {/* 左側卡片 - 搜索和排序 */}
        <div className="w-[30%]">
          <Card>
            <CharacterSearch
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
            />
            
            {/* 分隔線 */}
            <hr className="border-gray-200 mb-6" />
            
            <CharacterSortControls
              sortOrder={filters.sortOrder}
              onSortOrderChange={(order) => setFilters(prev => ({ ...prev, sortOrder: order }))}
            />
          </Card>
        </div>

        {/* 中間間隔 */}
        <div className="w-[5%]"></div>
        
        {/* 右側卡片 - 篩選功能 */}
        <div className="w-[60%]">
          <Card>
            <div className="space-y-3">
              <FilterSection
                title="位置"
                filterType="positions"
                options={filterOptions.positions}
                selectedValues={filters.positions}
                onToggle={(value) => handleArrayFilterChange('positions', value, !filters.positions.includes(value))}
                onSelectAll={() => handleSelectAll('positions')}
                isAllSelected={isAllSelected('positions')}
              />

              {/* 屬性篩選 - 特殊樣式 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">屬性</span>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={isAllSelected('elements')}
                    onClick={() => handleSelectAll('elements')}
                    variant="all"
                  >
                    全部
                  </FilterButton>
                  {filterOptions.elements.map(option => (
                    <button
                      key={option}
                      onClick={() => handleArrayFilterChange('elements', option, !filters.elements.includes(option))}
                      className={`px-3 py-1 text-xs rounded-lg border-2 transition-colors font-medium flex items-center justify-center ${
                        filters.elements.includes(option)
                          ? getElementStyles(option).selected
                          : getElementStyles(option).default
                      }`}
                    >
                      {getElementIcon(option)}
                    </button>
                  ))}
                </div>
              </div>

              <FilterSection
                title="用途"
                filterType="arenaTypes"
                options={filterOptions.arenaTypes}
                selectedValues={filters.arenaTypes}
                onToggle={(value) => handleArrayFilterChange('arenaTypes', value, !filters.arenaTypes.includes(value))}
                onSelectAll={() => handleSelectAll('arenaTypes')}
                isAllSelected={isAllSelected('arenaTypes')}
              />

              <FilterSection
                title="定位"
                filterType="characterRoles"
                options={filterOptions.characterRoles}
                selectedValues={filters.characterRoles}
                onToggle={(value) => handleArrayFilterChange('characterRoles', value, !filters.characterRoles.includes(value))}
                onSelectAll={() => handleSelectAll('characterRoles')}
                isAllSelected={isAllSelected('characterRoles')}
              />

              <FilterSection
                title="獲得"
                filterType="availability"
                options={filterOptions.availability}
                selectedValues={filters.availability}
                onToggle={(value) => handleArrayFilterChange('availability', value, !filters.availability.includes(value))}
                onSelectAll={() => handleSelectAll('availability')}
                isAllSelected={isAllSelected('availability')}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 角色結果顯示 - 依照tier排序 */}
      <div className="space-y-6 mt-8">
        {(() => {
          const tierOrder = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管'];
          const sortedOrder = filters.sortOrder === 'T0_to_倉管' ? tierOrder : [...tierOrder].reverse();
          
          return sortedOrder.map(rating => (
            <CharacterTierGroup 
              key={rating} 
              rating={rating} 
              characters={groupedCharacters[rating] || []} 
            />
          )).filter(Boolean);
        })()}
      </div>

      {/* 無結果提示 */}
      {filteredCharacters.length === 0 && (
        <Card>
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-800 text-lg font-medium">沒有符合條件的角色</p>
            <p className="text-gray-600 mt-2">請嘗試調整篩選條件</p>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default Characters;