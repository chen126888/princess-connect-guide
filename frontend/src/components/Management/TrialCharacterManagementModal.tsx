import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { ModalInput, ModalSelect, DeleteButton, AddButton, ConfirmButtons } from './FormElements';
import { trialCharactersApi } from '../../services/api';

interface TrialCharacter {
  id: number;
  character_name: string;
  category: string;
}

interface TrialCharacterManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: '推薦練', label: '推薦練' },
  { value: '後期練', label: '後期資源夠再練' }
];

const TrialCharacterManagementModal: React.FC<TrialCharacterManagementModalProps> = ({ 
  isOpen, 
  onClose,
  onSave 
}) => {
  const [characters, setCharacters] = useState<TrialCharacter[]>([]);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterCategory, setNewCharacterCategory] = useState('推薦練');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCharacters, setEditingCharacters] = useState<TrialCharacter[]>([]);

  // 載入資料
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await trialCharactersApi.getAll();
      setCharacters(data);
      setEditingCharacters([...data]); // 建立副本用於編輯
    } catch (error) {
      console.error('Failed to load trial characters:', error);
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
      const newCharacter: TrialCharacter = {
        id: -Date.now(), // 暫時ID，保存時會更新
        character_name: newCharacterName.trim(),
        category: newCharacterCategory
      };
      setEditingCharacters([...editingCharacters, newCharacter]);
      setNewCharacterName('');
      setNewCharacterCategory('推薦練'); // 重置為預設值
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

  // 更新角色分類
  const handleUpdateCharacterCategory = (id: number, newCategory: string) => {
    setEditingCharacters(editingCharacters.map(char => 
      char.id === id ? { ...char, category: newCategory } : char
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
          original.category !== char.category
        );
      });
      // 找出需要刪除的角色
      const toDelete = characters.filter(char => 
        !editingCharacters.find(ec => ec.id === char.id)
      );

      // 執行刪除
      for (const char of toDelete) {
        await trialCharactersApi.delete(char.id);
      }

      // 執行更新
      for (const char of toUpdate) {
        await trialCharactersApi.update(char.id, { 
          character_name: char.character_name,
          category: char.category
        });
      }

      // 執行新增
      for (const char of toAdd) {
        await trialCharactersApi.create({ 
          character_name: char.character_name,
          category: char.category
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
    setNewCharacterCategory('推薦練');
    onClose();
  };

  // 按Enter鍵新增角色
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCharacter();
    }
  };

  // 按分類排序角色
  const sortedCharacters = editingCharacters.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category === '推薦練' ? -1 : 1;
    }
    return a.character_name.localeCompare(b.character_name);
  });

  return (
    <BaseModal isOpen={isOpen} onClose={handleCancel} title="戰鬥試煉場角色管理">
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
              value={newCharacterCategory}
              onChange={(e) => setNewCharacterCategory(e.target.value)}
              disabled={loading || saving}
            >
              {CATEGORY_OPTIONS.map(option => (
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
              {/* 推薦練分組 */}
              {sortedCharacters.filter(char => char.category === '推薦練').length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-1">推薦練</h4>
                  <div className="space-y-2">
                    {sortedCharacters
                      .filter(char => char.category === '推薦練')
                      .map((char) => (
                        <div key={char.id} className="flex gap-2 items-center pl-4">
                          <ModalInput
                            value={char.character_name}
                            onChange={(e) => handleUpdateCharacterName(char.id, e.target.value)}
                            disabled={loading || saving}
                          />
                          <ModalSelect
                            value={char.category}
                            onChange={(e) => handleUpdateCharacterCategory(char.id, e.target.value)}
                            disabled={loading || saving}
                          >
                            {CATEGORY_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </ModalSelect>
                          <DeleteButton onClick={() => handleDeleteCharacter(char.id)} />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 後期練分組 */}
              {sortedCharacters.filter(char => char.category === '後期練').length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 px-1">後期資源夠再練</h4>
                  <div className="space-y-2">
                    {sortedCharacters
                      .filter(char => char.category === '後期練')
                      .map((char) => (
                        <div key={char.id} className="flex gap-2 items-center pl-4">
                          <ModalInput
                            value={char.character_name}
                            onChange={(e) => handleUpdateCharacterName(char.id, e.target.value)}
                            disabled={loading || saving}
                          />
                          <ModalSelect
                            value={char.category}
                            onChange={(e) => handleUpdateCharacterCategory(char.id, e.target.value)}
                            disabled={loading || saving}
                          >
                            {CATEGORY_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </ModalSelect>
                          <DeleteButton onClick={() => handleDeleteCharacter(char.id)} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
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

export default TrialCharacterManagementModal;