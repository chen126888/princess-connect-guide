import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ModalInput, DeleteButton, AddButton } from './FormElements';
import { nonSixstarCharactersApi } from '../../services/api';

interface NonSixstarCharacter {
  id: number;
  character_name: string;
  description: string;
  acquisition_method: string;
}

interface NonSixstarManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const NonSixstarManagementModal: React.FC<NonSixstarManagementModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [characters, setCharacters] = useState<NonSixstarCharacter[]>([]);
  const [newCharacter, setNewCharacter] = useState({
    character_name: '',
    description: '',
    acquisition_method: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCharacters, setEditingCharacters] = useState<NonSixstarCharacter[]>([]);

  // 載入資料
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await nonSixstarCharactersApi.getAll();
      setCharacters(data);
      setEditingCharacters([...data]); // 建立副本用於編輯
    } catch (error) {
      console.error('Failed to load non-sixstar characters:', error);
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
    if (newCharacter.character_name.trim() && 
        newCharacter.description.trim() && 
        newCharacter.acquisition_method.trim()) {
      const newChar: NonSixstarCharacter = {
        id: -Date.now(), // 暫時ID，保存時會更新
        character_name: newCharacter.character_name.trim(),
        description: newCharacter.description.trim(),
        acquisition_method: newCharacter.acquisition_method.trim()
      };
      setEditingCharacters([...editingCharacters, newChar]);
      setNewCharacter({
        character_name: '',
        description: '',
        acquisition_method: ''
      });
    }
  };

  // 刪除角色
  const handleDeleteCharacter = (id: number) => {
    setEditingCharacters(editingCharacters.filter(char => char.id !== id));
  };

  // 更新角色資料
  const handleUpdateCharacter = (id: number, field: keyof NonSixstarCharacter, value: string) => {
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
          original.description !== char.description ||
          original.acquisition_method !== char.acquisition_method
        );
      });
      // 找出需要刪除的角色
      const toDelete = characters.filter(char => 
        !editingCharacters.find(ec => ec.id === char.id)
      );

      // 執行刪除
      for (const char of toDelete) {
        await nonSixstarCharactersApi.delete(char.id);
      }

      // 執行更新
      for (const char of toUpdate) {
        await nonSixstarCharactersApi.update(char.id, { 
          character_name: char.character_name,
          description: char.description,
          acquisition_method: char.acquisition_method
        });
      }

      // 執行新增
      for (const char of toAdd) {
        await nonSixstarCharactersApi.create({ 
          character_name: char.character_name,
          description: char.description,
          acquisition_method: char.acquisition_method
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
    setNewCharacter({
      character_name: '',
      description: '',
      acquisition_method: ''
    });
    onClose();
  };

  // 檢查新增表單是否完整
  const isNewCharacterValid = newCharacter.character_name.trim() && 
                             newCharacter.description.trim() && 
                             newCharacter.acquisition_method.trim();

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
      title="非六星角色管理"
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {/* 新增角色區域 */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">新增角色</h4>
          <div className="space-y-2">
            <ModalInput
              value={newCharacter.character_name}
              onChange={(e) => setNewCharacter({...newCharacter, character_name: e.target.value})}
              placeholder="角色名稱"
              disabled={loading || saving}
            />
            <ModalInput
              value={newCharacter.description}
              onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
              placeholder="角色描述 (如: 水奶、火法師等)"
              disabled={loading || saving}
            />
            <ModalInput
              value={newCharacter.acquisition_method}
              onChange={(e) => setNewCharacter({...newCharacter, acquisition_method: e.target.value})}
              placeholder="取得方式 (如: 刷圖取得、活動限定等)"
              disabled={loading || saving}
            />
            <div className="flex justify-end">
              <AddButton 
                onClick={handleAddCharacter}
                disabled={!isNewCharacterValid}
              >
                新增角色
              </AddButton>
            </div>
          </div>
        </div>

        {/* 角色列表 */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-gray-500">載入中...</div>
          ) : editingCharacters.length === 0 ? (
            <div className="text-center py-4 text-gray-500">目前沒有角色資料</div>
          ) : (
            editingCharacters.map((char) => (
              <div key={char.id} className="p-4 border border-gray-200 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2 mr-4">
                    <ModalInput
                      value={char.character_name}
                      onChange={(e) => handleUpdateCharacter(char.id, 'character_name', e.target.value)}
                      disabled={loading || saving}
                      placeholder="角色名稱"
                    />
                    <ModalInput
                      value={char.description}
                      onChange={(e) => handleUpdateCharacter(char.id, 'description', e.target.value)}
                      disabled={loading || saving}
                      placeholder="角色描述"
                    />
                    <ModalInput
                      value={char.acquisition_method}
                      onChange={(e) => handleUpdateCharacter(char.id, 'acquisition_method', e.target.value)}
                      disabled={loading || saving}
                      placeholder="取得方式"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <DeleteButton onClick={() => handleDeleteCharacter(char.id)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default NonSixstarManagementModal;