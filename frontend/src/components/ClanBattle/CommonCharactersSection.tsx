import React from 'react';
import Card from '../../components/Common/Card';
import CharacterImageCard from '../../components/Character/CharacterImageCard';
import type { Character } from '../../types';

import type { ClanBattleCharacter, ClanBattleDamageTypeSection, ClanBattleAttributeSection } from '../../clanBattleData/clanBattleConfigs';

interface CommonCharactersSectionProps {
  activeAttribute: string;
  commonCharactersData: ClanBattleAttributeSection;
  allCharacters: Character[];
}

const CommonCharactersSection: React.FC<CommonCharactersSectionProps> = ({ activeAttribute, commonCharactersData, allCharacters }) => {
  const currentAttributeData = commonCharactersData[activeAttribute];

  if (!currentAttributeData) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-600">
          <p>選擇一個屬性來查看常用角色。</p>
        </div>
      </Card>
    );
  }

  const getCharacterDetails = (charName: string) => {
    return allCharacters.find(c => c.角色名稱 === charName || (c.暱稱 && c.暱稱.includes(charName)));
  };

  type CharacterTier = '核心' | '重要' | '普通'; // Re-define or import if needed, but it's in clanBattleConfigs.ts now

  const renderCharactersByTier = (characters: ClanBattleCharacter[], allChars: Character[]) => {
    const tiers: Record<CharacterTier, ClanBattleCharacter[]> = {
      核心: [],
      重要: [],
      普通: [],
    };

    characters.forEach(char => {
      if (char.tier) { // Ensure tier exists
        tiers[char.tier].push(char);
      }
    });

    const tierOrder: CharacterTier[] = ['核心', '重要', '普通'];

    return (
      <div className="space-y-4">
        {tierOrder.map(tier => (
          tiers[tier].length > 0 && (
            <div key={tier}>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">{tier}：</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {tiers[tier].map((char, index) => {
                  const character = allChars.find(c => c.角色名稱 === char.name || (c.暱稱 && c.暱稱.includes(char.name)));
                  return character ? <CharacterImageCard key={index} character={character} /> : null;
                })}
              </div>
            </div>
          )
        ))}
        {characters.length === 0 && <p className="text-gray-600">此屬性暫無常用角色。</p>}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Physical Characters Section */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">物理常用角色</h3>
        {renderCharactersByTier(currentAttributeData.physical, allCharacters)}
      </Card>

      {/* Magic Characters Section */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">法術常用角色</h3>
        {renderCharactersByTier(currentAttributeData.magic, allCharacters)}
      </Card>
    </div>
  );
};

export default CommonCharactersSection;
