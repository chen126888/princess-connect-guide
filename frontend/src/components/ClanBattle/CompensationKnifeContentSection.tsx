import React from 'react';
import Card from '../../components/Common/Card';
import CharacterImageCard from '../../components/Character/CharacterImageCard';

import type { Character } from '../../types'; // Add this import

interface CompensationKnifeContentSectionProps {
  content: {
    recommendedCharacters: string[];
  };
  allCharacters: Character[];
}

const CompensationKnifeContentSection: React.FC<CompensationKnifeContentSectionProps> = ({ content, allCharacters }) => {
  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">補償刀常用角色</h2> {/* Hardcode title */}
      {content.recommendedCharacters && content.recommendedCharacters.length > 0 ? (
        <div className="flex flex-wrap gap-3 justify-center">
          {content.recommendedCharacters.map((charName, index) => {
            const character = allCharacters.find(c => c.角色名稱 === charName || (c.暱稱 && c.暱稱.includes(charName)));
            return character ? <CharacterImageCard key={index} character={character} /> : null;
          })}
        </div>
      ) : (
        <p className="text-gray-600 text-center">目前沒有補償刀推薦角色。</p>
      )}
    </Card>
  );
};

export default CompensationKnifeContentSection;
