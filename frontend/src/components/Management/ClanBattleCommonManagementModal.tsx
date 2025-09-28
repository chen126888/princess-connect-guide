import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { CharacterModalInput, DeleteButton, AddButton, ModalSelect } from './FormElements';
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
  const [activeAttribute, setActiveAttribute] = useState('火屬');

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
        attribute: activeAttribute, // 使用當前選中的屬性
        damage_type: '物理',
        importance: '核心'
      });
    }
  };

  // 根據當前選擇的屬性篩選角色，並按重要性排序
  const getFilteredCharacters = (damageType?: string) => {
    return editingCharacters.filter(char => {
      const attributeMatch = char.attribute === activeAttribute;
      const damageTypeMatch = damageType ? char.damage_type === damageType : true;
      return attributeMatch && damageTypeMatch;
    }).sort((a, b) => {
      // 重要性排序：核心 -> 重要 -> 普通
      const importanceOrder = { '核心': 0, '重要': 1, '普通': 2 };
      const orderA = importanceOrder[a.importance as keyof typeof importanceOrder] ?? 999;
      const orderB = importanceOrder[b.importance as keyof typeof importanceOrder] ?? 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // 相同重要性時按角色名稱排序
      return a.character_name.localeCompare(b.character_name);
    });
  };

  // 當切換屬性時，同步更新新增角色的屬性
  const handleAttributeChange = (attribute: string) => {
    setActiveAttribute(attribute);
    setNewCharacter(prev => ({ ...prev, attribute }));
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
    setActiveAttribute('火屬');
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
        {/* 屬性標籤頁 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            {attributeOptions.map((attribute) => (
              <button
                key={attribute}
                onClick={() => handleAttributeChange(attribute)}
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeAttribute === attribute
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {attribute}
                <span className="ml-1 text-xs text-gray-400">
                  ({getFilteredCharacters().length})
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* 新增角色區域 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">新增{activeAttribute}角色</h4>
          <div className="flex gap-2">
            <CharacterModalInput
              value={newCharacter.character_name}
              onChange={(e) => setNewCharacter({ ...newCharacter, character_name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="輸入角色名稱"
              disabled={loading || saving}
              className="flex-1"
            />
            <ModalSelect
              value={newCharacter.damage_type}
              onChange={(e) => setNewCharacter({ ...newCharacter, damage_type: e.target.value })}
              disabled={loading || saving}
              className="w-20"
            >
              {damageTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </ModalSelect>
            <ModalSelect
              value={newCharacter.importance}
              onChange={(e) => setNewCharacter({ ...newCharacter, importance: e.target.value })}
              disabled={loading || saving}
              className="w-20"
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

        {/* 當前屬性的角色列表 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">載入中...</div>
          ) : (
            <>
              {/* 物理角色 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  物理角色 ({getFilteredCharacters('物理').length}個)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getFilteredCharacters('物理').length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-sm">暫無{activeAttribute}物理角色</div>
                  ) : (
                    getFilteredCharacters('物理').map((char) => (
                      <div key={char.id} className="flex gap-2 items-center bg-white p-2 rounded border">
                        <CharacterModalInput
                          value={char.character_name}
                          onChange={(e) => handleUpdateCharacter(char.id, 'character_name', e.target.value)}
                          disabled={loading || saving}
                          className="flex-1"
                          placeholder="角色名稱"
                        />
                        <ModalSelect
                          value={char.importance}
                          onChange={(e) => handleUpdateCharacter(char.id, 'importance', e.target.value)}
                          disabled={loading || saving}
                          className="w-20"
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

              {/* 法術角色 */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  法術角色 ({getFilteredCharacters('法術').length}個)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getFilteredCharacters('法術').length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-sm">暫無{activeAttribute}法術角色</div>
                  ) : (
                    getFilteredCharacters('法術').map((char) => (
                      <div key={char.id} className="flex gap-2 items-center bg-white p-2 rounded border">
                        <CharacterModalInput
                          value={char.character_name}
                          onChange={(e) => handleUpdateCharacter(char.id, 'character_name', e.target.value)}
                          disabled={loading || saving}
                          className="flex-1"
                          placeholder="角色名稱"
                        />
                        <ModalSelect
                          value={char.importance}
                          onChange={(e) => handleUpdateCharacter(char.id, 'importance', e.target.value)}
                          disabled={loading || saving}
                          className="w-20"
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
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ClanBattleCommonManagementModal;