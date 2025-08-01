import React from 'react';
import type { Character } from '../../types';
import Card from '../Common/Card';
import CharacterImageCard from './CharacterImageCard';

interface CharacterTierGroupProps {
  rating: string;
  characters: Character[];
}

const CharacterTierGroup: React.FC<CharacterTierGroupProps> = ({ rating, characters }) => {
  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {rating} 級別
      </h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {characters.map(character => (
          <CharacterImageCard key={character.id} character={character} />
        ))}
      </div>
    </Card>
  );
};

export default CharacterTierGroup;