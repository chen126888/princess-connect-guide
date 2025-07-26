import React, { useState, useEffect } from 'react';
import type { Character } from '../../types';
import { characterApi } from '../../services/api';
import { Search, Loader } from 'lucide-react';
import Card from '../../components/Common/Card'; 
import Button from '../../components/Common/Button';
import PageContainer from '../../components/Common/PageContainer';

// 圖片路徑生成函數
const getCharacterImagePath = (character: Character): { sixStar: string | null; normal: string | null } => {
  const API_BASE_URL = 'http://localhost:3000';
  
  return {
    sixStar: character.六星頭像檔名 ? `${API_BASE_URL}/images/characters/${character.六星頭像檔名}` : null,
    normal: character.頭像檔名 ? `${API_BASE_URL}/images/characters/${character.頭像檔名}` : null
  };
};

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


// 角色圖片組件（含懸停詳情）
const CharacterImage = ({ character }: { character: Character }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imagePaths = getCharacterImagePath(character);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (!imageError && imagePaths.sixStar && img.src === imagePaths.sixStar) {
      // 六星圖片載入失敗，嘗試普通圖片
      if (imagePaths.normal) {
        img.src = imagePaths.normal;
        setImageError(true);
      } else {
        // 沒有普通圖片，使用預設圖片
        img.src = "/default-character.svg";
      }
    } else {
      // 普通圖片也載入失敗，使用預設圖片
      img.src = "/default-character.svg";
    }
  };

  // 決定要顯示的圖片 URL
  const getImageSrc = (): string => {
    // 優先顯示六星圖片，沒有則顯示普通圖片，都沒有則顯示預設圖片
    if (imagePaths.sixStar) return imagePaths.sixStar;
    if (imagePaths.normal) return imagePaths.normal;
    return "/default-character.svg";
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className="w-16 h-16 bg-beige-300 overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-all duration-200 hover:shadow-md"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        <img
          src={getImageSrc()}
          alt={character.角色名稱}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      {/* 懸停詳情 */}
      {showTooltip && (
        <div 
          className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white p-4 border border-gray-200"
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <h3 className="text-gray-800 font-bold mb-1">{character.角色名稱}</h3>
          <p className="text-gray-600 text-sm mb-2">暱稱：{character.暱稱 || '(無資料)'}</p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-700">位置：{character.位置}</p>
            <p className="text-gray-700">定位：{character.角色定位 || '(無資料)'}</p>
            <p className="text-gray-700">獲得：{character.常駐限定 || '(無資料)'}</p>
            <p className="text-gray-700">屬性：{character.屬性 || '(無資料)'}</p>
            <p className="text-gray-700">能力偏向：{character.能力偏向 || '(無資料)'}</p>
            <p className="text-gray-700">競技場進攻：{character.競技場進攻 || '(無資料)'}</p>
            <p className="text-gray-700">競技場防守：{character.競技場防守 || '(無資料)'}</p>
            <p className="text-gray-700">戰隊戰等抄作業場合：{character.戰隊戰等抄作業場合 || '(無資料)'}</p>
          </div>
          <p className="text-gray-600 text-xs mt-2 leading-relaxed border-t border-gray-200 pt-2">
            說明：{character.說明 || '(無資料)'}
          </p>
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

  // 處理"全部"按鈕點擊 - 如果全選則清空，否則全選
  const handleSelectAll = (filterType: keyof Pick<FilterState, 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability'>) => {
    const allOptions = filterOptions[filterType];
    const isCurrentlyAllSelected = filters[filterType].length === allOptions.length;
    
    setFilters(prev => ({
      ...prev,
      [filterType]: isCurrentlyAllSelected ? [] : allOptions
    }));
  };

  // 處理單個按鈕點擊
  const handleFilterButtonClick = (
    filterType: keyof Pick<FilterState, 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability'>,
    value: string
  ) => {
    const isCurrentlySelected = filters[filterType].includes(value);
    const newFilterState = isCurrentlySelected
      ? filters[filterType].filter(item => item !== value)
      : [...filters[filterType], value];
    
    setFilters(prev => ({
      ...prev,
      [filterType]: newFilterState
    }));
  };

  // 檢查該類別是否所有按鈕都被選中
  const isAllSelected = (filterType: keyof Pick<FilterState, 'positions' | 'elements' | 'arenaTypes' | 'characterRoles' | 'availability'>) => {
    const allOptions = filterOptions[filterType];
    return filters[filterType].length === allOptions.length;
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
        {/* 左側卡片 - 30%寬度 */}
        <div className="w-[30%]">
          <Card>
            {/* 搜索功能 */}
            <div className="mb-6">
              <h3 className="text-gray-700 font-medium mb-3 text-base">搜索角色</h3>
              <div className="flex gap-2">
                {/* 搜索輸入框 */}
                <input
                  type="text"
                  placeholder="輸入角色名稱或暱稱..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                  style={{ borderRadius: '0.5rem' }}
                />
                {/* 搜索按鈕 */}
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 transition-colors duration-200 flex items-center justify-center"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <Search style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            </div>

            {/* 分隔線 */}
            <hr className="border-gray-200 mb-6" />

            {/* 排序功能 */}
            <div>
              <h3 className="text-gray-700 font-medium mb-3 text-base">排序方式</h3>
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-4 py-3 text-xs rounded-lg border-2 transition-colors font-medium ${
                    filters.sortOrder === 'T0_to_倉管'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'T0_to_倉管' }))}
                >
                  T0 → 倉管
                </button>
                <button
                  className={`flex-1 px-4 py-3 text-xs rounded-lg border-2 transition-colors font-medium ${
                    filters.sortOrder === '倉管_to_T0'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, sortOrder: '倉管_to_T0' }))}
                >
                  倉管 → T0
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* 中間間隔 - 5%寬度 */}
        <div className="w-[5%]"></div>
        
        {/* 右側卡片 - 60%寬度 */}
        <div className="w-[60%]">
          <Card>
            <div className="space-y-3">
              {/* 位置篩選 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">位置</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                      isAllSelected('positions')
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectAll('positions')}
                  >
                    全部
                  </button>
                  {filterOptions.positions.map(position => (
                    <button
                      key={position}
                      className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                        filters.positions.includes(position)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handleFilterButtonClick('positions', position)}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>

              {/* 屬性篩選 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">屬性</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                      isAllSelected('elements')
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectAll('elements')}
                  >
                    全部
                  </button>
                  {filterOptions.elements.map(element => (
                    <button
                      key={element}
                      className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                        filters.elements.includes(element)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handleFilterButtonClick('elements', element)}
                    >
                      {element}
                    </button>
                  ))}
                </div>
              </div>

              {/* 用途篩選 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">用途</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                      isAllSelected('arenaTypes')
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectAll('arenaTypes')}
                  >
                    全部
                  </button>
                  {filterOptions.arenaTypes.map(type => (
                    <button
                      key={type}
                      className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                        filters.arenaTypes.includes(type)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handleFilterButtonClick('arenaTypes', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 定位篩選 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">定位</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                      isAllSelected('characterRoles')
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectAll('characterRoles')}
                  >
                    全部
                  </button>
                  {filterOptions.characterRoles.map(role => (
                    <button
                      key={role}
                      className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                        filters.characterRoles.includes(role)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handleFilterButtonClick('characterRoles', role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* 獲得方式篩選 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-700 font-medium text-sm w-12 flex-shrink-0">獲得</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                      isAllSelected('availability')
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectAll('availability')}
                  >
                    全部
                  </button>
                  {filterOptions.availability.map(avail => (
                    <button
                      key={avail}
                      className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-colors font-medium ${
                        filters.availability.includes(avail)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                      onClick={() => handleFilterButtonClick('availability', avail)}
                    >
                      {avail}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 角色結果顯示 - 依照tier排序 */}
      <div className="space-y-6 mt-8">
        {Object.entries(groupedCharacters).map(([rating, characters]) => (
          <Card key={rating}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {rating} 級別
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {characters.map(character => (
                <CharacterImage key={character.id} character={character} />
              ))}
            </div>
          </Card>
        ))}
      </div>

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