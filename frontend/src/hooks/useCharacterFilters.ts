import { useState, useMemo } from 'react';
import type { Character } from '../types';

// 篩選狀態類型
export interface FilterState {
  search: string;
  sortOrder: 'T0_to_倉管' | '倉管_to_T0';
  positions: string[];
  elements: string[];
  arenaTypes: string[];
  characterRoles: string[];
  availability: string[];
}

// 篩選選項配置
export const filterOptions = {
  positions: ['前衛', '中衛', '後衛'],
  elements: ['火屬', '水屬', '風屬', '光屬', '闇屬'],
  arenaTypes: ['競技場進攻', '競技場防守', '戰隊戰', '深域及抄作業'],
  characterRoles: ['輸出', '破防', '補師', '增益', '妨礙', '補TP'],
  availability: ['常駐', '限定']
};

export const useCharacterFilters = (characters: Character[]) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortOrder: 'T0_to_倉管',
    positions: [],
    elements: [],
    arenaTypes: [],
    characterRoles: [],
    availability: []
  });

  // 應用篩選邏輯
  const filteredCharacters = useMemo(() => {
    let filtered = characters.filter(character => {
      // 搜索過濾
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const nameMatch = character.角色名稱.toLowerCase().includes(searchTerm);
        const nicknameMatch = character.暱稱?.toLowerCase().includes(searchTerm);
        if (!nameMatch && !nicknameMatch) return false;
      }

      // 位置過濾
      if (filters.positions.length > 0 && !filters.positions.includes(character.位置)) {
        return false;
      }

      // 屬性過濾
      if (filters.elements.length > 0 && character.屬性 && !filters.elements.includes(character.屬性)) {
        return false;
      }

      // 可用性過濾
      if (filters.availability.length > 0 && character['常駐/限定']) {
        const isMatched = filters.availability.some(avail => 
          character['常駐/限定']?.includes(avail)
        );
        if (!isMatched) return false;
      }

      // 競技場類型過濾
      if (filters.arenaTypes.length > 0) {
        const hasMatchingArenaType = filters.arenaTypes.some(type => {
          switch (type) {
            case '競技場進攻':
              return character.競技場進攻 && character.競技場進攻 !== '倉管';
            case '競技場防守':
              return character.競技場防守 && character.競技場防守 !== '倉管';
            case '戰隊戰':
              return character.戰隊戰 && character.戰隊戰 !== '倉管';
            case '深域及抄作業':
              return character.深域及抄作業 && character.深域及抄作業 !== '倉管';
            default:
              return false;
          }
        });
        if (!hasMatchingArenaType) return false;
      }

      // 角色定位過濾
      if (filters.characterRoles.length > 0 && character.角色定位) {
        const isMatchingRole = filters.characterRoles.some(role => 
          character.角色定位?.includes(role)
        );
        if (!isMatchingRole) return false;
      }

      return true;
    });

    // 排序邏輯
    const tierOrder = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管'];
    
    const getHighestRating = (character: Character) => {
      // 如果有選擇特定用途，只考慮選中的用途評級
      if (filters.arenaTypes.length > 0) {
        const selectedRatings: string[] = [];
        
        filters.arenaTypes.forEach(type => {
          switch (type) {
            case '競技場進攻':
              if (character.競技場進攻) selectedRatings.push(character.競技場進攻);
              break;
            case '競技場防守':
              if (character.競技場防守) selectedRatings.push(character.競技場防守);
              break;
            case '戰隊戰':
              if (character.戰隊戰) selectedRatings.push(character.戰隊戰);
              break;
            case '深域及抄作業':
              if (character.深域及抄作業) selectedRatings.push(character.深域及抄作業);
              break;
          }
        });
        
        const validRatings = selectedRatings.filter(rating => rating && rating !== '倉管');
        if (validRatings.length === 0) return '倉管';
        
        // 找出最高評級
        for (const tier of tierOrder) {
          if (validRatings.includes(tier)) {
            return tier;
          }
        }
        return '倉管';
      }
      
      // 沒有選擇特定用途時，取所有用途的最高評級
      const ratings = [
        character.競技場進攻,
        character.競技場防守,
        character.戰隊戰,
        character.深域及抄作業
      ].filter(rating => rating && rating !== '倉管');
      
      if (ratings.length === 0) return '倉管';
      
      // 找出最高評級（T0 > T1 > T2 > T3 > T4）
      for (const tier of tierOrder) {
        if (ratings.includes(tier)) {
          return tier;
        }
      }
      return '倉管';
    };
    
    filtered.sort((a, b) => {
      const aRating = getHighestRating(a);
      const bRating = getHighestRating(b);
      
      const aIndex = tierOrder.indexOf(aRating);
      const bIndex = tierOrder.indexOf(bRating);
      
      const aOrder = aIndex === -1 ? tierOrder.length : aIndex;
      const bOrder = bIndex === -1 ? tierOrder.length : bIndex;
      
      return filters.sortOrder === 'T0_to_倉管' ? aOrder - bOrder : bOrder - aOrder;
    });

    return filtered;
  }, [characters, filters]);

  // 按評級分組
  const groupedCharacters = useMemo(() => {
    const tierOrder = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管'];
    
    const getHighestRatingForGrouping = (character: Character) => {
      // 如果有選擇特定用途，只考慮選中的用途評級
      if (filters.arenaTypes.length > 0) {
        const selectedRatings: string[] = [];
        
        filters.arenaTypes.forEach(type => {
          switch (type) {
            case '競技場進攻':
              if (character.競技場進攻) selectedRatings.push(character.競技場進攻);
              break;
            case '競技場防守':
              if (character.競技場防守) selectedRatings.push(character.競技場防守);
              break;
            case '戰隊戰':
              if (character.戰隊戰) selectedRatings.push(character.戰隊戰);
              break;
            case '深域及抄作業':
              if (character.深域及抄作業) selectedRatings.push(character.深域及抄作業);
              break;
          }
        });
        
        const validRatings = selectedRatings.filter(rating => rating && rating !== '倉管');
        if (validRatings.length === 0) return '倉管';
        
        // 找出最高評級
        for (const tier of tierOrder) {
          if (validRatings.includes(tier)) {
            return tier;
          }
        }
        return '倉管';
      }
      
      // 沒有選擇特定用途時，取所有用途的最高評級
      const ratings = [
        character.競技場進攻,
        character.競技場防守,
        character.戰隊戰,
        character.深域及抄作業
      ].filter(rating => rating && rating !== '倉管');
      
      if (ratings.length === 0) return '倉管';
      
      // 找出最高評級（T0 > T1 > T2 > T3 > T4）
      for (const tier of tierOrder) {
        if (ratings.includes(tier)) {
          return tier;
        }
      }
      return '倉管';
    };
    
    return filteredCharacters.reduce((groups, character) => {
      const rating = getHighestRatingForGrouping(character);
      if (!groups[rating]) groups[rating] = [];
      groups[rating].push(character);
      return groups;
    }, {} as Record<string, Character[]>);
  }, [filteredCharacters, filters.arenaTypes]);

  // 篩選變更處理函數
  const handleArrayFilterChange = (
    filterType: keyof Pick<FilterState, 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability'>,
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  // 處理"全部"按鈕點擊
  const handleSelectAll = (filterType: keyof Pick<FilterState, 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability'>) => {
    const allOptions = filterOptions[filterType];
    const isCurrentlyAllSelected = filters[filterType].length === allOptions.length;
    
    setFilters(prev => ({
      ...prev,
      [filterType]: isCurrentlyAllSelected ? [] : allOptions
    }));
  };

  // 檢查該類別是否所有按鈕都被選中
  const isAllSelected = (filterType: keyof Pick<FilterState, 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability'>) => {
    const allOptions = filterOptions[filterType];
    return filters[filterType].length === allOptions.length;
  };

  return {
    filters,
    setFilters,
    filteredCharacters,
    groupedCharacters,
    handleArrayFilterChange,
    handleSelectAll,
    isAllSelected,
    filterOptions
  };
};