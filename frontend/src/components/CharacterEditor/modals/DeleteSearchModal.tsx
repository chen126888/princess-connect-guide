import React from 'react';
import { Search } from 'lucide-react';
import BaseModal from '../../Management/BaseModal';
import type { Character } from '../../../types';

interface DeleteSearchModalProps {
  searchTerm: string;
  characters: Character[];
  onSearchChange: (value: string) => void;
  onSelectCharacter: (character: Character) => void;
  onCancel: () => void;
}

const DeleteSearchModal: React.FC<DeleteSearchModalProps> = ({
  searchTerm,
  characters,
  onSearchChange,
  onSelectCharacter,
  onCancel
}) => {
  const filteredCharacters = characters.filter(char =>
    char.角色名稱.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (char.暱稱 && char.暱稱.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const headerActions = (
    <button
      onClick={onCancel}
      className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
    >
      取消
    </button>
  );

  return (
    <BaseModal
      isOpen={true}
      onClose={onCancel}
      title="🗑️ 刪除角色"
      maxWidth="max-w-md"
      headerActions={headerActions}
    >
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">搜尋要刪除的角色</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="輸入角色名稱或暱稱..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        
        {/* 搜尋結果 */}
        {searchTerm && (
          <div className="mb-4 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">搜尋結果：</h3>
            <div className="space-y-1">
              {filteredCharacters.slice(0, 5).map(character => (
                <button
                  key={character.id}
                  onClick={() => onSelectCharacter(character)}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded border border-gray-200"
                >
                  <div className="font-medium">{character.角色名稱}</div>
                  {character.暱稱 && (
                    <div className="text-sm text-gray-500">暱稱: {character.暱稱}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default DeleteSearchModal;