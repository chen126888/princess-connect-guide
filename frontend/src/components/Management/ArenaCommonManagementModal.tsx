import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ModalInput, DeleteButton, AddButton, ConfirmButtons } from './FormElements';
import { arenaCommonApi } from '../../services/api';

interface ArenaCommonCharacter {
  id: number;
  character_name: string;
}

interface ArenaCommonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ArenaCommonManagementModal: React.FC<ArenaCommonManagementModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [characters, setCharacters] = useState<ArenaCommonCharacter[]>([]);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCharacters, setEditingCharacters] = useState<ArenaCommonCharacter[]>([]);

  // 載入資料
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await arenaCommonApi.getAll();
      setCharacters(data);
      setEditingCharacters([...data]); // 建立副本用於編輯
    } catch (error) {
      console.error('Failed to load arena common characters:', error);
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
      const newCharacter: ArenaCommonCharacter = {
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
        await arenaCommonApi.delete(char.id);
      }

      // 執行更新
      for (const char of toUpdate) {
        await arenaCommonApi.update(char.id, { 
          character_name: char.character_name 
        });
      }

      // 執行新增
      for (const char of toAdd) {
        await arenaCommonApi.create({ 
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

  return (
    <BaseModal isOpen={isOpen} onClose={handleCancel} title="競技場常用角色管理">
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

        {/* 確認按鈕 */}
        <ConfirmButtons
          onCancel={handleCancel}
          onSave={handleSave}
          disabled={saving}
          saveText={saving ? "保存中..." : "保存"}
        />
      </div>
    </BaseModal>
  );
};

export default ArenaCommonManagementModal;