import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  type CharacterPriorityInfo, 
  sixStarTiers, 
  uniqueEquipment1Tiers, 
  uniqueEquipment2Tiers 
} from '../../characterDevelopmentData';
import type { Character } from '../../types'; // Import canonical Character type
import CharacterTooltip from '../../components/Common/CharacterTooltip'; // Import shared tooltip
import { getCharacterImageSrc, handleCharacterImageError } from '../../utils/characterImageUtils'; // Import image utilities
import CharacterSearch from '../../components/Character/CharacterSearch'; // Import CharacterSearch component

// API response structure
interface ApiResponse {
  characters: Character[];
}

type ActiveTab = 'sixStar' | 'unique1' | 'unique2';

// --- CharacterCard Component ---
interface CharacterCardProps {
  priorityInfo: CharacterPriorityInfo;
  character?: Character;
  displayMode: 'sixStar' | 'uePriority';
}

const CharacterCard: React.FC<CharacterCardProps> = ({ priorityInfo, character, displayMode }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative border border-gray-200 rounded-lg shadow-sm flex flex-col items-center py-1 text-center transition-all duration-300 hover:shadow-md hover:scale-105 h-full w-20 mx-auto"
      style={{ backgroundColor: '#fffaf0' }} // 米色背景
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div className="w-16 h-16 mb-2 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
        <img 
          src={getCharacterImageSrc(character)}
          alt={priorityInfo.name}
          onError={(e) => handleCharacterImageError(e, character, imageError, setImageError)}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-800 mb-1 flex-grow">{priorityInfo.name}</h3>
      
      {/* UE2 Status (for six-star tab only) */}
      {displayMode === 'sixStar' && (
        <div className="text-xs text-center text-gray-600 w-full px-1 mt-auto">
          {priorityInfo.ue2 === '有' && <p>專二</p>}
        </div>
      )}

      {/* Hover Tooltip (shows full details) */}
      {isHovered && character && (
        <CharacterTooltip character={character!} />
      )}
    </div>
  );
};


// --- Main Page Component ---
const CharacterDevelopmentPage: React.FC = () => {
  const [characterMap, setCharacterMap] = useState<Map<string, Character>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('sixStar');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:3000/api/characters?limit=400');
        const newCharMap = new Map<string, Character>();
        for (const char of response.data.characters) {
          newCharMap.set(char.角色名稱, char);
          if (char.暱稱) { // If nickname exists, add it as a key too
            newCharMap.set(char.暱稱, char);
          }
        }
        setCharacterMap(newCharMap);
      } catch (err) {
        setError('無法載入角色資料，請稍後再試。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const tabDescriptions: Record<ActiveTab, string> = {
    sixStar: '以下為筆者按自己觀點排的，僅供參考，主要以純新手為主，其中角色排序已獲取難度、開花難度為優先考量點，以常駐和FES角色為主，故有些角色雖六星強力，但因獲取難度高，排序較後。此表確保新手在初期階段優先培養基本坦克、補師、輸出 ，確保推圖、活動、露娜塔能順利進行，以穩定獲得資源+鑽石。回鍋及較高等玩家，若不知道該養成哪隻，請多參考戰隊戰/深域/專一/專二表，及其他網路資源/未來視，作為自身養成順序。',
    unique1: '此表已滿等或接近滿等玩家為準，不考慮對應碎片關卡打不過或無法開花的情況。',
    unique2: '此表已滿等或接近滿等玩家為準，不考慮對應碎片關卡打不過或無法開花的情況。'
  };

  const sixStarSpecificDescription = '筆者認為此表A級以上基本都用的到，除了望、吉塔、嘉夜在深域較少見，其他在滿等之後還是常用到，就算戰隊戰沒用到，深域及抄業都有不少上場空間。\n雖說新角色越來越多，但中期深域關卡，基本沒人再繼續更新過關隊伍，尤其4~5的道中，沒有默涅隊可用，有這些角色對於懶得試隊伍的人，抄作業上有很大幫助。\n此表角色都有專用武器一，專一都需要開，是否升上去，取決於是否輸出。';

  const unique1SpecificDescription = '此表A以上皆為常用到的，有部分角色為競技場角色，可考慮將優先順序往後延，輸出角色的專武優先升高。';

  const unique2SpecificDescription = '有部分角色為競技場角色，可考慮將優先順序往後延，輸出角色的專武優先升高。';

  const { activeTiers, displayMode } = useMemo(() => {
    switch (activeTab) {
      case 'sixStar': 
        return { activeTiers: sixStarTiers, displayMode: 'sixStar' as const };
      case 'unique1': 
        return { activeTiers: uniqueEquipment1Tiers, displayMode: 'uePriority' as const };
      case 'unique2': 
        return { activeTiers: uniqueEquipment2Tiers, displayMode: 'uePriority' as const };
      default: 
        return { activeTiers: [], displayMode: 'uePriority' as const };
    }
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <div className="text-center p-8">正在載入角色資料...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (activeTiers.length === 0) return <div className="text-center p-8 text-gray-500">此類別目前沒有資料。</div>;

    return (
      <div className="space-y-6">
        {activeTiers.map((tier) => {
          const finalFilteredCharacters = tier.characters.map(p => {
            const foundCharacter = Array.from(characterMap.values()).find(char =>
              char.角色名稱 === p.name || (char.暱稱 && char.暱稱.includes(p.name))
            );
            // Only return an object if foundCharacter exists
            return foundCharacter ? { priorityInfo: p, character: foundCharacter } : null;
          }).filter((item): item is { priorityInfo: typeof tier.characters[number]; character: Character } => {
            // Filter out nulls and assert type for TypeScript
            if (item === null) return false;

            // Apply search filter
            if (searchTerm) {
              const lowerCaseSearchTerm = searchTerm.toLowerCase();
              const nameMatch = item.character.角色名稱.toLowerCase().includes(lowerCaseSearchTerm);
              const nicknameMatch = item.character.暱稱?.toLowerCase().includes(lowerCaseSearchTerm);
              if (!nameMatch && !nicknameMatch) return false;
            }
            return true;
          });

          if (finalFilteredCharacters.length === 0) return null;

          return (
            <div key={tier.tier} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className={`text-xl font-bold mb-3 text-white px-3 py-1 rounded-md inline-block ${tier.color || 'bg-gray-600'}`}>
                {tier.tier}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 gap-[0.1px]">
                {finalFilteredCharacters.map((item, index) => (
                  <CharacterCard 
                    key={item.priorityInfo.name + index} 
                    priorityInfo={item.priorityInfo} 
                    character={item.character} 
                    displayMode={displayMode}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">角色養成優先順序</h1>
        <CharacterSearch
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="輸入角色名稱或暱稱..."
          showButton={false} // No search button needed, filter as typing
        />
        <div className="mb-6 flex items-center border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium text-lg transition-colors duration-200 ${activeTab === 'sixStar' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('sixStar')}
          >六星角色</button>
          <button 
            className={`px-4 py-2 font-medium text-lg transition-colors duration-200 ${activeTab === 'unique1' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('unique1')}
          >專一優先</button>
          <button 
            className={`px-4 py-2 font-medium text-lg transition-colors duration-200 ${activeTab === 'unique2' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('unique2')}
          >專二優先</button>
        </div>

        {/* Description Box */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm text-sm">
          <p>{tabDescriptions[activeTab]}</p>
        </div>

        {/* Six-Star Specific Description Box */}
        {activeTab === 'sixStar' && (
          <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
            {sixStarSpecificDescription.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        {/* Unique1 Specific Description Box */}
        {activeTab === 'unique1' && (
          <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
            <p>{unique1SpecificDescription}</p>
          </div>
        )}

        {/* Unique2 Specific Description Box */}
        {activeTab === 'unique2' && (
          <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
            <p>{unique2SpecificDescription}</p>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default CharacterDevelopmentPage;