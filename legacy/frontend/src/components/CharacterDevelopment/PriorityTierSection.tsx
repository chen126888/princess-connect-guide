import React, { useState } from 'react';
import type { PriorityTier, CharacterPriorityInfo } from '../../characterDevelopmentData';
import type { Character } from '../../types';
import CharacterCard from './CharacterCard';
import { getCharacterImageSrc, handleCharacterImageError } from '../../utils/characterImageUtils';
import { useAuth } from '../../hooks/useAuth';
import ManagementButton from '../Management/ManagementButton';

interface PriorityTierSectionProps {
  tiers: PriorityTier[];
  characterMap: Map<string, Character>;
  searchTerm: string;
  displayMode: 'sixStar' | 'uePriority' | 'nonSixStar';
  onManagementModalOpen?: () => void;
}

const PriorityTierSection: React.FC<PriorityTierSectionProps> = ({
  tiers,
  characterMap,
  searchTerm,
  displayMode,
  onManagementModalOpen
}) => {
  const { isAdmin } = useAuth();
  const renderTierContent = () => {
    // Special handling for nonSixStar display mode
    if (displayMode === 'nonSixStar') {
      return (
        <div className="space-y-6">
          {tiers.map((tier) => (
            <div key={tier.tier} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className={`text-xl font-bold text-white px-3 py-1 rounded-md inline-block ${tier.color || 'bg-purple-600'}`}>
                  {tier.tier}
                </h2>
                {isAdmin && onManagementModalOpen && tiers.indexOf(tier) === 0 && (
                  <ManagementButton onEdit={onManagementModalOpen} />
                )}
              </div>
              <div className="space-y-3">
                {tier.characters.map((char, index) => {
                  // Try to find the character in the database
                  const foundCharacter = Array.from(characterMap.values()).find(dbChar =>
                    dbChar.角色名稱 === char.name || (dbChar.暱稱 && dbChar.暱稱.split(/[、&]/).map(name => name.trim()).includes(char.name))
                  );

                  const CharacterImageComponent = ({ character }: { character: Character }) => {
                    const [imageError, setImageError] = useState(false);
                    
                    return (
                      <img 
                        src={getCharacterImageSrc(character)}
                        alt={char.name}
                        className="w-full h-full object-cover"
                        onError={(e) => handleCharacterImageError(e, character, imageError, setImageError)}
                      />
                    );
                  };

                  return (
                    <div key={index} className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      {/* Character Image */}
                      <div className="w-16 h-16 mr-4 rounded-full overflow-hidden border-2 border-purple-300 flex-shrink-0">
                        {foundCharacter ? (
                          <CharacterImageComponent character={foundCharacter} />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                            未找到
                          </div>
                        )}
                      </div>
                      
                      {/* Character Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-800 mb-1">{char.name}</h3>
                        <p className="text-gray-700 text-sm">{char.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Standard handling for other display modes
    return (
      <div className="space-y-6">
        {tiers.map((tier) => {
          const finalFilteredCharacters = tier.characters.map(p => {
            const foundCharacter = Array.from(characterMap.values()).find(char =>
              char.角色名稱 === p.name || (char.暱稱 && char.暱稱.split(/[、&]/).map(name => name.trim()).includes(p.name))
            );
            return foundCharacter ? { priorityInfo: p, character: foundCharacter } : null;
          }).filter((item): item is { priorityInfo: CharacterPriorityInfo; character: Character } => {
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
              <div className="flex justify-between items-center mb-3">
                <h2 className={`text-xl font-bold text-white px-3 py-1 rounded-md inline-block ${tier.color || 'bg-gray-600'}`}>
                  {tier.tier}
                </h2>
                {isAdmin && onManagementModalOpen && tiers.indexOf(tier) === 0 && (
                  <ManagementButton onEdit={onManagementModalOpen} />
                )}
              </div>
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

  return renderTierContent();
};

export default PriorityTierSection;