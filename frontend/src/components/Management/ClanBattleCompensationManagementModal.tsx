import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ModalInput, DeleteButton, AddButton } from './FormElements';
import { clanBattleCompensationApi } from '../../services/api';

interface ClanBattleCompensationCharacter {
  id: number;
  character_name: string;
}

interface ClanBattleCompensationManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ClanBattleCompensationManagementModal: React.FC<ClanBattleCompensationManagementModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [characters, setCharacters] = useState<ClanBattleCompensationCharacter[]>([]);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCharacters, setEditingCharacters] = useState<ClanBattleCompensationCharacter[]>([]);

  // 載入資料
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clanBattleCompensationApi.getAll();
      setCharacters(data);
      setEditingCharacters([...data]); // 建立副本用於編輯
    } catch (error) {
      console.error('Failed to load clan battle compensation characters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modal開啟時載入資料
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // 新增角色
  const handleAddCharacter = () => {
    if (newCharacterName.trim()) {
      const newCharacter: ClanBattleCompensationCharacter = {
        id: -Date.now(), // 暫時ID，保存時會更新
        character_name: newCharacterName.trim()
      };
      setEditingCharacters([...editingCharacters, newCharacter]);
      setNewCharacterName('');
    }
  };

  // 刪除角色
  const handleDeleteCharacter = (id: number) => {
    setEditingCharacters(editingCharacters.filter(char => char.id !== id));
  };

  // 更新角色名稱
  const handleUpdateCharacterName = (id: number, newName: string) => {
    setEditingCharacters(editingCharacters.map(char => 
      char.id === id ? { ...char, character_name: newName } : char
    ));
  };

  // 保存變更
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 找出需要新增的角色 (id < 0)
      const toAdd = editingCharacters.filter(char => char.id < 0);
      // 找出需要更新的角色
      const toUpdate = editingCharacters.filter(char => {
        const original = characters.find(c => c.id === char.id);
        return original && original.character_name !== char.character_name;
      });
      // 找出需要刪除的角色
      const toDelete = characters.filter(char => 
        !editingCharacters.find(ec => ec.id === char.id)
      );

      // 執行刪除
      for (const char of toDelete) {
        await clanBattleCompensationApi.delete(char.id);
      }

      // 執行更新
      for (const char of toUpdate) {
        await clanBattleCompensationApi.update(char.id, { 
          character_name: char.character_name 
        });
      }

      // 執行新增
      for (const char of toAdd) {
        await clanBattleCompensationApi.create({ 
          character_name: char.character_name 
        });
      }

      // 呼叫父組件的保存回調
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('保存失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  // 取消變更
  const handleCancel = () => {
    setEditingCharacters([...characters]); // 重置為原始資料
    setNewCharacterName('');
    onClose();
  };

  // 按Enter鍵新增角色
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCharacter();
    }
  };

  const headerActions = (
    <div className="flex gap-2">
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors text-sm"
      >
        {saving ? "保存中..." : "保存"}
      </button>
      <button
        onClick={handleCancel}
        disabled={saving}
        className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors text-sm"
      >
        取消
      </button>
    </div>
  );

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="戰隊戰補償刀角色管理"
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {/* 新增角色區域 */}
        <div className="flex gap-2">
          <ModalInput
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入角色名稱"
            disabled={loading || saving}
          />
          <AddButton onClick={handleAddCharacter}>
            新增
          </AddButton>
        </div>

        {/* 角色列表 */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-500">載入中...</div>
          ) : editingCharacters.length === 0 ? (
            <div className="text-center py-4 text-gray-500">目前沒有角色資料</div>
          ) : (
            editingCharacters.map((char) => (
              <div key={char.id} className="flex gap-2 items-center">
                <ModalInput
                  value={char.character_name}
                  onChange={(e) => handleUpdateCharacterName(char.id, e.target.value)}
                  disabled={loading || saving}
                />
                <DeleteButton onClick={() => handleDeleteCharacter(char.id)} />
              </div>
            ))
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ClanBattleCompensationManagementModal;