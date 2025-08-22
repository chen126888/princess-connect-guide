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
  const [selectedFlexible, setSelectedFlexible] = useState<string[]>([]);

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
    if (teamData.flexibleOptions) {
      setSelectedFlexible(teamData.flexibleOptions.map(options => options[0] || ''));
    }
  }, [teamData]);

  const findCharacter = (name: string): Character | null => {
    return characterMap.get(name) || null;
  };

  const handleFlexibleSelect = (groupIndex: number, characterName: string) => {
    setSelectedFlexible(prev => {
      const newSelected = [...prev];
      newSelected[groupIndex] = characterName;
      return newSelected;
    });
  };

  const parseCharacterNames = (name: string): { characters: string[]; separator: string } => {
    if (name.includes('/')) {
      return { characters: name.split('/').map(n => n.trim()), separator: '或' };
    }
    return { characters: [name], separator: '' };
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
      <div className="flex flex-wrap items-center gap-3">
        {teamData.fixedCharacters.map((characterName, index) => {
          const { characters, separator } = parseCharacterNames(characterName);
          
          return (
            <React.Fragment key={`fixed-${index}`}>
              <div className="flex items-center gap-1">
                {characters.map((charName, charIndex) => {
                  const character = findCharacter(charName);
                  return (
                    <React.Fragment key={charIndex}>
                      <CharacterAvatar
                        character={character}
                        characterName={charName}
                        size="medium"
                        showName={true}
                      />
                      {charIndex < characters.length - 1 && (
                        <span className={`mx-1 ${textColor} text-sm font-medium`}>
                          {separator}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {(index < teamData.fixedCharacters.length - 1 || !isAllFixed) && (
                <span className={`${textColor} text-lg font-medium`}>+</span>
              )}
            </React.Fragment>
          );
        })}

        {!isAllFixed && teamData.flexibleOptions?.map((options, groupIndex) => (
          <React.Fragment key={`flexible-${groupIndex}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <CharacterAvatar
                  character={findCharacter(selectedFlexible[groupIndex])}
                  characterName={selectedFlexible[groupIndex]}
                  size="medium"
                  showName={true}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleFlexibleSelect(groupIndex, option)}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedFlexible[groupIndex] === option
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {groupIndex < teamData.flexibleOptions.length - 1 && (
              <span className={`${textColor} text-lg font-medium`}>+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FlexibleTeamLineup;