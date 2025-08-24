import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ModalInput, DeleteButton, AddButton, ModalSelect } from './FormElements';
import { clanBattleCommonApi } from '../../services/api';

interface ClanBattleCommonCharacter {
  id: number;
  character_name: string;
  attribute: string;
  damage_type: string;
  importance: string;
}

interface ClanBattleCommonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ClanBattleCommonManagementModal: React.FC<ClanBattleCommonManagementModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [characters, setCharacters] = useState<ClanBattleCommonCharacter[]>([]);
  const [newCharacter, setNewCharacter] = useState({
    character_name: '',
    attribute: '火屬',
    damage_type: '物理',
    importance: '核心'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCharacters, setEditingCharacters] = useState<ClanBattleCommonCharacter[]>([]);

  // 選項定義
  const attributeOptions = ['火屬', '水屬', '風屬', '光屬', '闇屬'];
  const damageTypeOptions = ['物理', '法術'];
  const importanceOptions = ['核心', '重要', '普通'];

  // 載入資料
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await clanBattleCommonApi.getAll();
      setCharacters(data);
      setEditingCharacters([...data]);
    } catch (error) {
      console.error('Failed to load clan battle common characters:', error);
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
    if (newCharacter.character_name.trim()) {
      const newChar: ClanBattleCommonCharacter = {
        id: -Date.now(), // 暫時ID，保存時會更新
        character_name: newCharacter.character_name.trim(),
        attribute: newCharacter.attribute,
        damage_type: newCharacter.damage_type,
        importance: newCharacter.importance
      };
      setEditingCharacters([...editingCharacters, newChar]);
      setNewCharacter({
        character_name: '',
        attribute: '火屬',
        damage_type: '物理',
        importance: '核心'
      });
    }
  };

  // 刪除角色
  const handleDeleteCharacter = (id: number) => {
    setEditingCharacters(editingCharacters.filter(char => char.id !== id));
  };

  // 更新角色
  const handleUpdateCharacter = (id: number, field: keyof ClanBattleCommonCharacter, value: string) => {
    setEditingCharacters(editingCharacters.map(char => 
      char.id === id ? { ...char, [field]: value } : char
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
        return original && (
          original.character_name !== char.character_name ||
          original.attribute !== char.attribute ||
          original.damage_type !== char.damage_type ||
          original.importance !== char.importance
        );
      });
      // 找出需要刪除的角色
      const toDelete = characters.filter(char => 
        !editingCharacters.find(ec => ec.id === char.id)
      );

      // 執行刪除
      for (const char of toDelete) {
        await clanBattleCommonApi.delete(char.id);
      }

      // 執行更新
      for (const char of toUpdate) {
        await clanBattleCommonApi.update(char.id, {
          character_name: char.character_name,
          attribute: char.attribute,
          damage_type: char.damage_type,
          importance: char.importance
        });
      }

      // 執行新增
      for (const char of toAdd) {
        await clanBattleCommonApi.create({
          character_name: char.character_name,
          attribute: char.attribute,
          damage_type: char.damage_type,
          importance: char.importance
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
    setEditingCharacters([...characters]);
    setNewCharacter({
      character_name: '',
      attribute: '火屬',
      damage_type: '物理',
      importance: '核心'
    });
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
      title="戰隊戰常用角色管理"
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {/* 新增角色區域 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <ModalInput
              value={newCharacter.character_name}
              onChange={(e) => setNewCharacter({ ...newCharacter, character_name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="輸入角色名稱"
              disabled={loading || saving}
              className="w-2/5"
            />
            <ModalSelect
              value={newCharacter.attribute}
              onChange={(e) => setNewCharacter({ ...newCharacter, attribute: e.target.value })}
              disabled={loading || saving}
              className="w-1/5"
            >
              {attributeOptions.map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </ModalSelect>
            <ModalSelect
              value={newCharacter.damage_type}
              onChange={(e) => setNewCharacter({ ...newCharacter, damage_type: e.target.value })}
              disabled={loading || saving}
              className="w-1/5"
            >
              {damageTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </ModalSelect>
            <ModalSelect
              value={newCharacter.importance}
              onChange={(e) => setNewCharacter({ ...newCharacter, importance: e.target.value })}
              disabled={loading || saving}
              className="w-1/5"
            >
              {importanceOptions.map(imp => (
                <option key={imp} value={imp}>{imp}</option>
              ))}
            </ModalSelect>
            <AddButton onClick={handleAddCharacter}>
              新增
            </AddButton>
          </div>
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
                  onChange={(e) => handleUpdateCharacter(char.id, 'character_name', e.target.value)}
                  disabled={loading || saving}
                  className="w-2/5 flex-shrink-0"
                  placeholder="角色名稱"
                />
                <ModalSelect
                  value={char.attribute}
                  onChange={(e) => handleUpdateCharacter(char.id, 'attribute', e.target.value)}
                  disabled={loading || saving}
                  className="w-1/5"
                >
                  {attributeOptions.map(attr => (
                    <option key={attr} value={attr}>{attr}</option>
                  ))}
                </ModalSelect>
                <ModalSelect
                  value={char.damage_type}
                  onChange={(e) => handleUpdateCharacter(char.id, 'damage_type', e.target.value)}
                  disabled={loading || saving}
                  className="w-1/5"
                >
                  {damageTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </ModalSelect>
                <ModalSelect
                  value={char.importance}
                  onChange={(e) => handleUpdateCharacter(char.id, 'importance', e.target.value)}
                  disabled={loading || saving}
                  className="w-1/5"
                >
                  {importanceOptions.map(imp => (
                    <option key={imp} value={imp}>{imp}</option>
                  ))}
                </ModalSelect>
                <DeleteButton onClick={() => handleDeleteCharacter(char.id)} />
              </div>
            ))
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ClanBattleCommonManagementModal;