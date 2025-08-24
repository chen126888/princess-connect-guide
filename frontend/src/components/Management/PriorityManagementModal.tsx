import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ModalInput, ModalSelect, DeleteButton, AddButton } from './FormElements';
import { sixstarPriorityApi, ue1PriorityApi, ue2PriorityApi } from '../../services/api';

interface PriorityCharacter {
  id: number;
  character_name: string;
  tier: string;
}

interface PriorityManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  type: 'sixstar' | 'ue1' | 'ue2';
}

// 根據類型定義不同的tier選項
const getTierOptions = (type: 'sixstar' | 'ue1' | 'ue2') => {
  switch (type) {
    case 'sixstar':
      return [
        { value: 'SS', label: 'SS級' },
        { value: 'S', label: 'S級' },
        { value: 'A', label: 'A級' },
        { value: 'B', label: 'B級' },
        { value: 'C', label: 'C級' }
      ];
    case 'ue1':
      return [
        { value: 'SS', label: 'SS級' },
        { value: 'S', label: 'S級' },
        { value: 'A', label: 'A級' },
        { value: 'B', label: 'B級' }
      ];
    case 'ue2':
      return [
        { value: 'SS', label: 'SS級' },
        { value: 'S', label: 'S級' },
        { value: 'A', label: 'A級' }
      ];
    default:
      return [];
  }
};

// 根據類型獲取API
const getApi = (type: 'sixstar' | 'ue1' | 'ue2') => {
  switch (type) {
    case 'sixstar':
      return sixstarPriorityApi;
    case 'ue1':
      return ue1PriorityApi;
    case 'ue2':
      return ue2PriorityApi;
    default:
      throw new Error('Invalid type');
  }
};

// 根據類型獲取標題
const getTitle = (type: 'sixstar' | 'ue1' | 'ue2') => {
  switch (type) {
    case 'sixstar':
      return '六星角色優先度管理';
    case 'ue1':
      return 'UE1角色優先度管理';
    case 'ue2':
      return 'UE2角色優先度管理';
    default:
      return '優先度管理';
  }
};

const PriorityManagementModal: React.FC<PriorityManagementModalProps> = ({ 
  isOpen, 
  onClose,
  onSave,
  type
}) => {
  const [characters, setCharacters] = useState<PriorityCharacter[]>([]);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterTier, setNewCharacterTier] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCharacters, setEditingCharacters] = useState<PriorityCharacter[]>([]);

  const tierOptions = getTierOptions(type);
  const api = getApi(type);
  const title = getTitle(type);

  // 設定預設tier
  useEffect(() => {
    if (tierOptions.length > 0) {
      setNewCharacterTier(tierOptions[0].value);
    }
  }, [type]);

  // 載入資料
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAll();
      setCharacters(data);
      setEditingCharacters([...data]); // 建立副本用於編輯
    } catch (error) {
      console.error(`Failed to load ${type} priority characters:`, error);
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
    if (newCharacterName.trim() && newCharacterTier) {
      const newCharacter: PriorityCharacter = {
        id: -Date.now(), // 暫時ID，保存時會更新
        character_name: newCharacterName.trim(),
        tier: newCharacterTier
      };
      setEditingCharacters([...editingCharacters, newCharacter]);
      setNewCharacterName('');
      setNewCharacterTier(tierOptions[0]?.value || ''); // 重置為預設值
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

  // 更新角色tier
  const handleUpdateCharacterTier = (id: number, newTier: string) => {
    setEditingCharacters(editingCharacters.map(char => 
      char.id === id ? { ...char, tier: newTier } : char
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
          original.tier !== char.tier
        );
      });
      // 找出需要刪除的角色
      const toDelete = characters.filter(char => 
        !editingCharacters.find(ec => ec.id === char.id)
      );

      // 執行刪除
      for (const char of toDelete) {
        await api.delete(char.id);
      }

      // 執行更新
      for (const char of toUpdate) {
        await api.update(char.id, { 
          character_name: char.character_name,
          tier: char.tier
        });
      }

      // 執行新增
      for (const char of toAdd) {
        await api.create({ 
          character_name: char.character_name,
          tier: char.tier
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
    setNewCharacterTier(tierOptions[0]?.value || '');
    onClose();
  };

  // 按Enter鍵新增角色
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCharacter();
    }
  };

  // 按tier排序角色
  const sortedCharacters = editingCharacters.sort((a, b) => {
    const tierOrder = tierOptions.map(option => option.value);
    const aTierIndex = tierOrder.indexOf(a.tier);
    const bTierIndex = tierOrder.indexOf(b.tier);
    
    if (aTierIndex !== bTierIndex) {
      return aTierIndex - bTierIndex;
    }
    return a.character_name.localeCompare(b.character_name);
  });

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
      title={title}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {/* 新增角色區域 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <ModalInput
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入角色名稱"
              disabled={loading || saving}
            />
            <ModalSelect
              value={newCharacterTier}
              onChange={(e) => setNewCharacterTier(e.target.value)}
              disabled={loading || saving}
            >
              {tierOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
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
          ) : sortedCharacters.length === 0 ? (
            <div className="text-center py-4 text-gray-500">目前沒有角色資料</div>
          ) : (
            <>
              {tierOptions.map(tierOption => {
                const charactersInTier = sortedCharacters.filter(char => char.tier === tierOption.value);
                if (charactersInTier.length === 0) return null;
                
                return (
                  <div key={tierOption.value} className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 px-1">{tierOption.label}</h4>
                    <div className="space-y-2">
                      {charactersInTier.map((char) => (
                        <div key={char.id} className="flex gap-2 items-center pl-4">
                          <ModalInput
                            value={char.character_name}
                            onChange={(e) => handleUpdateCharacterName(char.id, e.target.value)}
                            disabled={loading || saving}
                          />
                          <ModalSelect
                            value={char.tier}
                            onChange={(e) => handleUpdateCharacterTier(char.id, e.target.value)}
                            disabled={loading || saving}
                          >
                            {tierOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </ModalSelect>
                          <DeleteButton onClick={() => handleDeleteCharacter(char.id)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default PriorityManagementModal;