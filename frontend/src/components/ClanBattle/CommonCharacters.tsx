import React, { useState } from 'react';
import AttributeSelector from './AttributeSelector';
import CommonCharactersSection from './CommonCharactersSection';
import CompensationKnifeContentSection from './CompensationKnifeContentSection';
import { clanBattleConfigs } from '../../clanBattleData/clanBattleConfigs';
import type { Character } from '../../types';

interface CommonCharactersProps {
  allCharacters: Character[];
}

const CommonCharacters: React.FC<CommonCharactersProps> = ({ allCharacters }) => {
  const [activeAttribute, setActiveAttribute] = useState<string>('fire'); // Default to 'fire' or first attribute
  const config = clanBattleConfigs;

  return (
    <>
      {config.commonCharacters && (
        <AttributeSelector
          attributes={Object.keys(config.commonCharacters).concat(['compensationKnife'])}
          activeAttribute={activeAttribute}
          onAttributeChange={setActiveAttribute}
        />
      )}

      {activeAttribute === 'compensationKnife' ? (
        config.compensationKnifeContent && (
          <CompensationKnifeContentSection content={config.compensationKnifeContent} allCharacters={allCharacters} />
        )
      ) : (
        config.commonCharacters && (
          <CommonCharactersSection
            activeAttribute={activeAttribute}
            commonCharactersData={config.commonCharacters}
            allCharacters={allCharacters}
          />
        )
      )}
    </>
  );
};

export default CommonCharacters;