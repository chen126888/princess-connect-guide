import React, { useState, useCallback } from 'react';
import DragRatingNavigation from './DragRatingNavigation';
import SingleCategoryRating from './SingleCategoryRating';
import AttributeSelector from '../../components/ClanBattle/AttributeSelector'; // Import AttributeSelector
import type { Character } from '../../types';

type RatingCategory = '競技場進攻' | '競技場防守' | '戰隊戰' | '深域及抄作業';

interface LocalChange {
  characterId: string;
  oldValue: string | undefined;
  newValue: string;
}

interface DragRatingManagerProps {
  characters: Character[];
  onSaveChanges: (category: RatingCategory, changes: LocalChange[]) => Promise<void>;
}

const DragRatingManager: React.FC<DragRatingManagerProps> = ({
  characters,
  onSaveChanges
}) => {
  const [activeCategory, setActiveCategory] = useState<RatingCategory>('競技場進攻');

  const handleCategoryChange = useCallback((category: RatingCategory) => {
    setActiveCategory(category);
  }, []);

  const [activeAttribute, setActiveAttribute] = useState<string>('fire'); // New state for attribute selection

  const handleAttributeChange = useCallback((attribute: string) => {
    setActiveAttribute(attribute);
  }, []);

  return (
    <div className="space-y-6">
      {/* 導航選擇器 */}
      <DragRatingNavigation
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* 屬性選擇器 */}
      <AttributeSelector
        attributes={['fire', 'water', 'wind', 'light', 'dark']} // Only attributes, no compensationKnife
        activeAttribute={activeAttribute}
        onAttributeChange={handleAttributeChange}
      />

      {/* 當前選中類別和屬性的評級系統 */}
      <SingleCategoryRating
        category={activeCategory}
        attribute={activeAttribute} // Pass activeAttribute
        characters={characters}
        onSaveChanges={onSaveChanges}
      />
    </div>
  );
};

export default DragRatingManager;