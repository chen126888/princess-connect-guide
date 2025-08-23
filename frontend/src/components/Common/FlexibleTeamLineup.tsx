import React, { useState, useEffect } from 'react';
import CharacterAvatar from './CharacterAvatar';
import type { Character } from '../../types';
import { characterApi } from '../../services/api';

interface FlexibleTeamData {
  id: string;
  fixedCharacters: string[];
  flexibleOptions?: string[][];
}

interface FlexibleTeamLineupProps {
  teamData: FlexibleTeamData;
  bgColor?: string;
  textColor?: string;
}

const FlexibleTeamLineup: React.FC<FlexibleTeamLineupProps> = ({ 
  teamData, 
  bgColor = 'bg-white',
  textColor = 'text-gray-800'
}) => {
  const [characterMap, setCharacterMap] = useState<Map<string, Character>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedCombination, setSelectedCombination] = useState<number>(0);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await characterApi.getAll({ limit: 400 });
        const newCharMap = new Map<string, Character>();
        
        for (const char of response.characters) {
          newCharMap.set(char.角色名稱, char);
          if (char.暱稱 && char.暱稱 !== '--') {
            const nicknames = char.暱稱.split(/[、&]/).map((name: string) => name.trim());
            nicknames.forEach((nickname: string) => {
              if (nickname && nickname !== '--') {
                newCharMap.set(nickname, char);
              }
            });
          }
        }
        setCharacterMap(newCharMap);
      } catch (err) {
        console.error('Failed to fetch characters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    // 預設選擇第一個彈性組合
    setSelectedCombination(0);
  }, [teamData]);

  const findCharacter = (name: string): Character | null => {
    return characterMap.get(name) || null;
  };

  const handleCombinationSelect = (combinationIndex: number) => {
    setSelectedCombination(combinationIndex);
  };


  if (loading) {
    return (
      <div className={`${bgColor} p-4 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-500">載入中...</span>
      </div>
    );
  }

  const isAllFixed = !teamData.flexibleOptions || teamData.flexibleOptions.length === 0;

  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      {/* 隊伍成員顯示 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* 固定角色 */}
        {teamData.fixedCharacters.map((characterName, index) => {
          const character = findCharacter(characterName);
          return (
            <React.Fragment key={`fixed-${index}`}>
              <CharacterAvatar
                character={character}
                characterName={characterName}
                size="medium"
                showName={true}
              />
              {index < teamData.fixedCharacters.length - 1 && (
                <span className={`${textColor} text-lg font-medium`}>+</span>
              )}
            </React.Fragment>
          );
        })}

        {/* 加號分隔符 */}
        {teamData.fixedCharacters.length > 0 && !isAllFixed && (
          <span className={`${textColor} text-lg font-medium`}>+</span>
        )}

        {/* 當前選中的彈性組合 */}
        {!isAllFixed && teamData.flexibleOptions && teamData.flexibleOptions[selectedCombination]?.map((characterName, index) => {
          const character = findCharacter(characterName);
          return (
            <React.Fragment key={`flexible-${index}`}>
              <CharacterAvatar
                character={character}
                characterName={characterName}
                size="medium"
                showName={true}
              />
              {index < (teamData.flexibleOptions?.[selectedCombination]?.length || 0) - 1 && (
                <span className={`${textColor} text-lg font-medium`}>+</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 彈性組合選擇按鈕 */}
      {!isAllFixed && teamData.flexibleOptions && teamData.flexibleOptions.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <span className={`${textColor} text-sm font-medium mr-2`}>彈性組合：</span>
          {teamData.flexibleOptions.map((combination, index) => (
            <button
              key={index}
              onClick={() => handleCombinationSelect(index)}
              className={`px-3 py-1 text-sm rounded ${
                selectedCombination === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              組合 {index + 1} ({combination.join('、')})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlexibleTeamLineup;