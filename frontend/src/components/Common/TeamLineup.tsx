import React, { useState, useEffect } from 'react';
import CharacterAvatar from './CharacterAvatar';
import type { Character } from '../../types';
import axios from 'axios';

interface TeamLineupProps {
  characterNames: string[];
  bgColor?: string;
  textColor?: string;
}

interface ApiResponse {
  characters: Character[];
}

const TeamLineup: React.FC<TeamLineupProps> = ({ 
  characterNames, 
  bgColor = 'bg-white',
  textColor = 'text-gray-800'
}) => {
  const [characterMap, setCharacterMap] = useState<Map<string, Character>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:3000/api/characters?limit=400');
        const newCharMap = new Map<string, Character>();
        
        for (const char of response.data.characters) {
          // 使用角色名稱作為 key
          newCharMap.set(char.角色名稱, char);
          // 如果有暱稱，也加入 map 中
          if (char.暱稱 && char.暱稱 !== '--') {
            const nicknames = char.暱稱.split(/[、&]/).map(name => name.trim());
            nicknames.forEach(nickname => {
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

  const parseCharacterNames = (name: string): { characters: string[]; separator: string } => {
    if (name.includes('/')) {
      return { characters: name.split('/').map(n => n.trim()), separator: '或' };
    }
    return { characters: [name], separator: '' };
  };

  const findCharacter = (name: string): Character | null => {
    return characterMap.get(name) || null;
  };

  if (loading) {
    return (
      <div className={`${bgColor} p-4 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-500">載入中...</span>
      </div>
    );
  }

  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="flex flex-wrap items-center gap-3">
        {characterNames.map((characterName, index) => {
          const { characters, separator } = parseCharacterNames(characterName);
          
          return (
            <React.Fragment key={index}>
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
              {index < characterNames.length - 1 && (
                <span className={`${textColor} text-lg font-medium`}>+</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TeamLineup;