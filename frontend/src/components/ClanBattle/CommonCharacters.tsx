import React, { useState } from 'react';
import AttributeSelector from './AttributeSelector';
import { clanBattleConfigs } from '../../clanBattleData/clanBattleConfigs';
import { useAuth } from '../../hooks/useAuth';
import { useClanBattleData } from '../../hooks/useClanBattleData';
import ManagementButton from '../Management/ManagementButton';
import ClanBattleCommonManagementModal from '../Management/ClanBattleCommonManagementModal';
import ClanBattleCompensationManagementModal from '../Management/ClanBattleCompensationManagementModal';
import Card from '../Common/Card';
import CharacterImageCard from '../Character/CharacterImageCard';
import type { Character } from '../../types';

interface CommonCharactersProps {
  allCharacters: Character[];
}


const CommonCharacters: React.FC<CommonCharactersProps> = ({ allCharacters }) => {
  const [activeAttribute, setActiveAttribute] = useState<string>('fire'); // Default to 'fire' or first attribute
  const { isAdmin } = useAuth();
  const { clanBattleCommonCharacters, clanBattleCompensationCharacters, loading, refetch } = useClanBattleData();
  
  // Modal states
  const [isCommonManagementModalOpen, setIsCommonManagementModalOpen] = useState(false);
  const [isCompensationManagementModalOpen, setIsCompensationManagementModalOpen] = useState(false);
  
  const config = clanBattleConfigs;

  // Handle modal operations
  const handleCommonManagementModalOpen = () => setIsCommonManagementModalOpen(true);
  const handleCommonManagementModalClose = () => setIsCommonManagementModalOpen(false);
  const handleCompensationManagementModalOpen = () => setIsCompensationManagementModalOpen(true);
  const handleCompensationManagementModalClose = () => setIsCompensationManagementModalOpen(false);
  
  // Handle save operations
  const handleManagementSave = () => {
    refetch(); // Refresh clan battle data
  };

  if (loading) {
    return <Card><div className="text-center p-8">正在載入戰隊戰資料...</div></Card>;
  }

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
        <Card className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">補償刀常用角色</h2>
            {isAdmin && (
              <ManagementButton onEdit={handleCompensationManagementModalOpen} />
            )}
          </div>
          {clanBattleCompensationCharacters && clanBattleCompensationCharacters.length > 0 ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {clanBattleCompensationCharacters.map((charData, index) => {
                const character = allCharacters.find(c => 
                  c.角色名稱 === charData.character_name || 
                  (c.暱稱 && c.暱稱.includes(charData.character_name))
                );
                return character ? (
                  <CharacterImageCard key={index} character={character} />
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center">目前沒有補償刀推薦角色。</p>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Physical Characters Section */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">物理常用角色</h3>
              {isAdmin && (
                <ManagementButton onEdit={handleCommonManagementModalOpen} />
              )}
            </div>
            {(() => {
              const physicalChars = clanBattleCommonCharacters.filter(char => 
                char.attribute === getAttributeMapping(activeAttribute) && char.damage_type === '物理'
              );
              return physicalChars.length > 0;
            })() ? (
              <div className="space-y-4">
                {['核心', '重要', '普通'].map(tier => {
                  const tierCharacters = clanBattleCommonCharacters.filter(char => 
                    char.attribute === getAttributeMapping(activeAttribute) && 
                    char.damage_type === '物理' && 
                    char.importance === tier
                  );
                  
                  if (tierCharacters.length === 0) return null;
                  
                  return (
                    <div key={tier}>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">{tier}：</h4>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {tierCharacters.map((charData, index) => {
                          const character = allCharacters.find(c => 
                            c.角色名稱 === charData.character_name || 
                            (c.暱稱 && c.暱稱.includes(charData.character_name))
                          );
                          return character ? (
                            <CharacterImageCard key={index} character={character} />
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">此屬性暫無物理常用角色。</p>
            )}
          </Card>

          {/* Magic Characters Section */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">魔法常用角色</h3>
              {isAdmin && (
                <ManagementButton onEdit={handleCommonManagementModalOpen} />
              )}
            </div>
            {(() => {
              const magicChars = clanBattleCommonCharacters.filter(char => 
                char.attribute === getAttributeMapping(activeAttribute) && char.damage_type === '法術'
              );
              return magicChars.length > 0;
            })() ? (
              <div className="space-y-4">
                {['核心', '重要', '普通'].map(tier => {
                  const tierCharacters = clanBattleCommonCharacters.filter(char => 
                    char.attribute === getAttributeMapping(activeAttribute) && 
                    char.damage_type === '法術' && 
                    char.importance === tier
                  );
                  
                  if (tierCharacters.length === 0) return null;
                  
                  return (
                    <div key={tier}>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">{tier}：</h4>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {tierCharacters.map((charData, index) => {
                          const character = allCharacters.find(c => 
                            c.角色名稱 === charData.character_name || 
                            (c.暱稱 && c.暱稱.includes(charData.character_name))
                          );
                          return character ? (
                            <CharacterImageCard key={index} character={character} />
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">此屬性暫無魔法常用角色。</p>
            )}
          </Card>
        </div>
      )}
      
      {/* Management Modals */}
      <ClanBattleCommonManagementModal
        isOpen={isCommonManagementModalOpen}
        onClose={handleCommonManagementModalClose}
        onSave={handleManagementSave}
      />
      
      <ClanBattleCompensationManagementModal
        isOpen={isCompensationManagementModalOpen}
        onClose={handleCompensationManagementModalClose}
        onSave={handleManagementSave}
      />
    </>
  );
};

// Helper function to map attribute keys to Chinese names
const getAttributeMapping = (attribute: string): string => {
  const mapping: Record<string, string> = {
    fire: '火屬',
    water: '水屬',
    wind: '風屬',
    light: '光屬',
    dark: '闇屬'
  };
  return mapping[attribute] || attribute;
};

export default CommonCharacters;