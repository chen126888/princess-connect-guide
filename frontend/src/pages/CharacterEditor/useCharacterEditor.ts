import { useState, useMemo } from 'react';
import type { Character } from '../../types';
import api from '../../services/api';

export type EditMode = 'complete' | 'rating' | 'missing';

export const useCharacterEditor = (characters: Character[]) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState<EditMode>('complete');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteSearchTerm, setDeleteSearchTerm] = useState('');
  const [deleteCharacter, setDeleteCharacter] = useState<Character | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id'>>({
    角色名稱: '',
    暱稱: '',
    位置: '前衛',
    屬性: '',
    角色定位: '',
    '常駐/限定': '常駐',
    能力偏向: '',
    競技場進攻: '',
    競技場防守: '',
    戰隊戰等抄作業場合: '',
    說明: ''
  });

  // Computed
  const filteredCharacters = useMemo(() => {
    let filtered = characters;

    // 根據編輯模式篩選
    if (editMode === 'missing') {
      // 檢查空缺資料 - 顯示有任何空白欄位的角色
      filtered = characters.filter(character => 
        !character.暱稱 || 
        !character.角色定位 || 
        !character.屬性 || 
        !character.能力偏向 || 
        !character.競技場進攻 || 
        !character.競技場防守 || 
        !character.戰隊戰等抄作業場合 || 
        !character.說明
      );
    } else if (editMode === 'rating') {
      // 更改評價 - 顯示有評級的角色（競技場進攻或防守不為空）
      filtered = characters.filter(character => 
        character.競技場進攻 || character.競技場防守
      );
    }
    // editMode === 'complete' 時顯示所有角色

    // 再根據搜索條件篩選
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(character => 
        character.角色名稱?.toLowerCase().includes(lowerSearchTerm) ||
        character.暱稱?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return filtered;
  }, [characters, searchTerm, editMode]);

  // Actions
  const handleAddCharacter = async () => {
    try {
      if (!newCharacter.角色名稱 || !newCharacter.位置) {
        throw new Error('角色名稱和位置為必填欄位');
      }

      await api.post('/characters', newCharacter);
      
      // 重置表單
      setNewCharacter({
        角色名稱: '',
        暱稱: '',
        位置: '前衛',
        屬性: '',
        角色定位: '',
        '常駐/限定': '常駐',
        能力偏向: '',
        競技場進攻: '',
        競技場防守: '',
        戰隊戰等抄作業場合: '',
        說明: ''
      });
      setSelectedPhoto(null);
      setShowAddForm(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || '新增角色失敗');
    }
  };

  const handleUpdateCharacter = async (character: Character) => {
    try {
      await api.put(`/characters/${character.id}`, character);
      setEditingCharacter(null);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || '更新角色失敗');
    }
  };

  const handleDeleteCharacter = async () => {
    try {
      if (!deleteCharacter) return;
      
      await api.delete(`/characters/${deleteCharacter.id}`);
      
      // 重置刪除相關狀態
      setDeleteCharacter(null);
      setShowDeleteConfirm(false);
      setDeleteSearchTerm('');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || '刪除角色失敗');
    }
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    editMode,
    setEditMode,
    selectedPhoto,
    setSelectedPhoto,
    editingCharacter,
    setEditingCharacter,
    showAddForm,
    setShowAddForm,
    showDeleteForm,
    setShowDeleteForm,
    deleteSearchTerm,
    setDeleteSearchTerm,
    deleteCharacter,
    setDeleteCharacter,
    showDeleteConfirm,
    setShowDeleteConfirm,
    newCharacter,
    setNewCharacter,
    
    // Computed
    filteredCharacters,
    
    // Actions
    handleAddCharacter,
    handleUpdateCharacter,
    handleDeleteCharacter
  };
};