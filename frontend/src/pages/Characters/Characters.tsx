import React, { useState, useEffect } from 'react';
import type { Character } from '../../types';
import { characterApi } from '../../services/api';
import { Search, Loader } from 'lucide-react';

// 篩選狀態類型
interface FilterState {
  search: string;
  sortOrder: 'T0_to_倉管' | '倉管_to_T0';
  positions: string[];
  elements: string[];
  arenaTypes: string[];
  characterRoles: string[];
  availability: string[];
}

// 圓形 Checkbox 組件
const RoundCheckbox = ({ 
  label, 
  checked, 
  onChange, 
  variant = 'default' 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  variant?: 'default' | 'element';
}) => (
  <label className="flex items-center space-x-1.5 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
        checked 
          ? 'bg-white border-white shadow-lg' 
          : 'border-white/60 group-hover:border-white'
      }`}>
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
    <span className={`text-xs font-medium transition-colors ${
      checked ? 'text-white' : 'text-white/80 group-hover:text-white'
    }`}>
      {label}
    </span>
  </label>
);

// 角色圖片組件（含懸停詳情）
const CharacterImage = ({ character }: { character: Character }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden border-2 border-white/30 hover:border-white transition-all duration-200">
        <img
          src="/default-character.svg"
          alt={character.角色名稱}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 懸停詳情 */}
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl">
          <h3 className="text-white font-bold mb-1">{character.角色名稱}</h3>
          {character.暱稱 && (
            <p className="text-white/70 text-sm mb-2">暱稱：{character.暱稱}</p>
          )}
          <div className="space-y-1 text-xs">
            <p className="text-white/90">位置：{character.位置}</p>
            {character.角色定位 && <p className="text-white/90">定位：{character.角色定位}</p>}
            {character.常駐限定 && <p className="text-white/90">獲得：{character.常駐限定}</p>}
            {character.屬性 && <p className="text-white/90">屬性：{character.屬性}</p>}
            {character.競技場進攻 && <p className="text-white/90">競技場進攻：{character.競技場進攻}</p>}
            {character.競技場防守 && <p className="text-white/90">競技場防守：{character.競技場防守}</p>}
          </div>
          {character.說明 && (
            <p className="text-white/80 text-xs mt-2 leading-relaxed border-t border-white/20 pt-2">
              {character.說明}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 篩選狀態
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortOrder: 'T0_to_倉管',
    positions: [],
    elements: [],
    arenaTypes: [],
    characterRoles: [],
    availability: []
  });

  // 載入所有角色資料
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const data = await characterApi.getAll({ limit: 1000 });
        setCharacters(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch characters:', err);
        setError('無法載入角色資料，請確認後端服務器是否運行');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // 篩選選項配置
  const filterOptions = {
    positions: ['前衛', '中衛', '後衛'],
    elements: ['火屬', '水屬', '風屬', '光屬', '闇屬'],
    arenaTypes: ['競技場進攻', '競技場防守', '戰隊戰'],
    characterRoles: ['輸出', '破防', '補師', '增益', '妨礙', '補TP'],
    availability: ['常駐', '限定']
  };

  // 應用篩選
  const applyFilters = () => {
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
      if (filters.availability.length > 0 && character.常駐限定) {
        const isMatched = filters.availability.some(avail => 
          character.常駐限定?.includes(avail)
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
              return character.戰隊戰等抄作業場合 && character.戰隊戰等抄作業場合 !== '倉管';
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

    // 排序
    const tierOrder = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管'];
    filtered.sort((a, b) => {
      const aRating = a.競技場進攻 || '倉管';
      const bRating = b.競技場進攻 || '倉管';
      
      const aIndex = tierOrder.indexOf(aRating);
      const bIndex = tierOrder.indexOf(bRating);
      
      const aOrder = aIndex === -1 ? tierOrder.length : aIndex;
      const bOrder = bIndex === -1 ? tierOrder.length : bIndex;
      
      return filters.sortOrder === 'T0_to_倉管' ? aOrder - bOrder : bOrder - aOrder;
    });

    return filtered;
  };

  const filteredCharacters = applyFilters();

  // 按評級分組
  const groupedCharacters = filteredCharacters.reduce((groups, character) => {
    const rating = character.競技場進攻 || '倉管';
    if (!groups[rating]) groups[rating] = [];
    groups[rating].push(character);
    return groups;
  }, {} as Record<string, Character[]>);

  // 處理篩選變更
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 篩選區域 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左側 1/3 - 搜索和排序 */}
            <div className="space-y-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="搜尋角色名稱..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 text-sm focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* 排序 */}
              <div>
                <h3 className="text-white font-medium mb-2 text-sm">排序</h3>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as FilterState['sortOrder'] }))}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm"
                >
                  <option value="T0_to_倉管" className="text-gray-800">T0 → 倉管</option>
                  <option value="倉管_to_T0" className="text-gray-800">倉管 → T0</option>
                </select>
              </div>
            </div>

            {/* 右側 2/3 - 篩選選項 */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-xl p-4 space-y-2.5">
                {/* 位置 */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-xs min-w-[50px]">位置:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <RoundCheckbox
                      label="全部"
                      checked={filters.positions.length === 0}
                      onChange={(checked) => checked && setFilters(prev => ({ ...prev, positions: [] }))}
                    />
                    {filterOptions.positions.map(pos => (
                      <RoundCheckbox
                        key={pos}
                        label={pos}
                        checked={filters.positions.includes(pos)}
                        onChange={(checked) => handleArrayFilterChange('positions', pos, checked)}
                      />
                    ))}
                  </div>
                </div>

                {/* 屬性 */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-xs min-w-[50px]">屬性:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <RoundCheckbox
                      label="全部"
                      checked={filters.elements.length === 0}
                      onChange={(checked) => checked && setFilters(prev => ({ ...prev, elements: [] }))}
                    />
                    {filterOptions.elements.map(element => (
                      <RoundCheckbox
                        key={element}
                        label={element}
                        checked={filters.elements.includes(element)}
                        onChange={(checked) => handleArrayFilterChange('elements', element, checked)}
                      />
                    ))}
                  </div>
                </div>

                {/* 競技場類型 */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-xs min-w-[50px]">用途:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <RoundCheckbox
                      label="全部"
                      checked={filters.arenaTypes.length === 0}
                      onChange={(checked) => checked && setFilters(prev => ({ ...prev, arenaTypes: [] }))}
                    />
                    {filterOptions.arenaTypes.map(type => (
                      <RoundCheckbox
                        key={type}
                        label={type}
                        checked={filters.arenaTypes.includes(type)}
                        onChange={(checked) => handleArrayFilterChange('arenaTypes', type, checked)}
                      />
                    ))}
                  </div>
                </div>

                {/* 角色定位 */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-xs min-w-[50px]">定位:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <RoundCheckbox
                      label="全部"
                      checked={filters.characterRoles.length === 0}
                      onChange={(checked) => checked && setFilters(prev => ({ ...prev, characterRoles: [] }))}
                    />
                    {filterOptions.characterRoles.map(role => (
                      <RoundCheckbox
                        key={role}
                        label={role}
                        checked={filters.characterRoles.includes(role)}
                        onChange={(checked) => handleArrayFilterChange('characterRoles', role, checked)}
                      />
                    ))}
                  </div>
                </div>

                {/* 獲得方式 */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-xs min-w-[50px]">獲得:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <RoundCheckbox
                      label="全部"
                      checked={filters.availability.length === 0}
                      onChange={(checked) => checked && setFilters(prev => ({ ...prev, availability: [] }))}
                    />
                    {filterOptions.availability.map(avail => (
                      <RoundCheckbox
                        key={avail}
                        label={avail}
                        checked={filters.availability.includes(avail)}
                        onChange={(checked) => handleArrayFilterChange('availability', avail, checked)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 搜尋按鈕 */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              找到 {filteredCharacters.length} 個角色
            </p>
          </div>
        </div>

        {/* 結果顯示 - 按評級分組 */}
        <div className="space-y-8">
          {Object.entries(groupedCharacters).map(([rating, characters]) => (
            <div key={rating} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {rating} 級別 ({characters.length} 個角色)
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {characters.map(character => (
                  <CharacterImage key={character.id} character={character} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white text-lg font-medium">沒有符合條件的角色</p>
            <p className="text-white/70 mt-2">請嘗試調整篩選條件</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;