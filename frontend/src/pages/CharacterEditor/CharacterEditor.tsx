import React from 'react';
import CharacterSearch from '../../components/Character/CharacterSearch';
import CharacterInfoCard from '../../components/Character/CharacterInfoCard';
import EditModeSelector from '../../components/CharacterEditor/EditModeSelector';
import DragRatingManager from '../../components/CharacterEditor/DragRatingManager';
import EditCharacterModal from '../../components/CharacterEditor/modals/EditCharacterModal';
import AddCharacterModal from '../../components/CharacterEditor/modals/AddCharacterModal';
import DeleteSearchModal from '../../components/CharacterEditor/modals/DeleteSearchModal';
import CharacterInfoModal from '../../components/CharacterEditor/modals/CharacterInfoModal';
import DeleteConfirmModal from '../../components/CharacterEditor/modals/DeleteConfirmModal';
import { useCharacters } from '../../hooks/useCharacters';
import { useCharacterEditor } from './useCharacterEditor';
import { characterApi } from '../../services/api';

const CharacterEditor: React.FC = () => {
  const { characters, loading, error, fetchCharacters } = useCharacters();
  const {
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
  } = useCharacterEditor(characters);

  // 包裝操作函數以包含重新獲取資料
  const wrappedAddCharacter = async () => {
    try {
      await handleAddCharacter();
      await fetchCharacters();
    } catch (error: any) {
      alert(error.message || '操作失敗');
    }
  };

  const wrappedUpdateCharacter = async (character: any) => {
    try {
      await handleUpdateCharacter(character);
      await fetchCharacters();
    } catch (error: any) {
      alert(`更新失敗: ${error.response?.data?.error || error.response?.data?.details || error.message}`);
    }
  };

  const wrappedDeleteCharacter = async () => {
    try {
      await handleDeleteCharacter();
      await fetchCharacters();
    } catch (error: any) {
      alert(`刪除失敗: ${error.response?.data?.error || error.message}`);
    }
  };

  // 處理拖拽評級批次更新
  const handleBatchRatingUpdate = async (category: string, changes: any[]) => {
    try {
      // 轉換格式以符合 API 要求
      const updates = changes.map(change => ({
        characterId: change.characterId,
        category: category,
        value: change.newValue
      }));
      
      // 使用批次更新 API
      await characterApi.batchUpdateRatings(updates);
      
      // 重新獲取資料
      await fetchCharacters();
    } catch (error: any) {
      throw new Error(`批次更新失敗: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">載入中...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">角色資料編輯器</h1>
        
        {/* 編輯模式選擇 */}
        <EditModeSelector
          editMode={editMode}
          onModeChange={setEditMode}
          onAddCharacter={() => setShowAddForm(true)}
          onDeleteCharacter={() => setShowDeleteForm(true)}
        />
        
        {/* 根據編輯模式顯示不同內容 */}
        {editMode === 'drag-rating' ? (
          <DragRatingManager
            characters={characters}
            onSaveChanges={handleBatchRatingUpdate}
          />
        ) : (
          <>
            {/* 搜索框 */}
            <div className="mb-6">
              <CharacterSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="搜索角色名稱或暱稱..."
                showButton={false}
              />
            </div>

            {/* 角色列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharacters.map((character) => (
                <CharacterInfoCard
                  key={character.id}
                  character={character}
                  onEdit={() => setEditingCharacter(character)}
                />
              ))}
            </div>
          </>
        )}

        {/* 編輯角色彈窗 */}
        {editingCharacter && (
          <EditCharacterModal
            character={editingCharacter}
            editMode={editMode}
            onSave={wrappedUpdateCharacter}
            onCancel={() => setEditingCharacter(null)}
            onChange={setEditingCharacter}
          />
        )}

        {/* 新增角色彈窗 */}
        {showAddForm && (
          <AddCharacterModal
            character={newCharacter}
            selectedPhoto={selectedPhoto}
            onSave={wrappedAddCharacter}
            onCancel={() => setShowAddForm(false)}
            onChange={setNewCharacter}
            onPhotoChange={setSelectedPhoto}
          />
        )}

        {/* 刪除角色搜索彈窗 */}
        {showDeleteForm && (
          <DeleteSearchModal
            searchTerm={deleteSearchTerm}
            characters={characters}
            onSearchChange={setDeleteSearchTerm}
            onSelectCharacter={(character) => {
              setDeleteCharacter(character);
              setShowDeleteForm(false);
            }}
            onCancel={() => {
              setShowDeleteForm(false);
              setDeleteSearchTerm('');
            }}
          />
        )}

        {/* 角色資訊確認彈窗 */}
        {deleteCharacter && !showDeleteConfirm && (
          <CharacterInfoModal
            character={deleteCharacter}
            onDelete={() => setShowDeleteConfirm(true)}
            onCancel={() => {
              setDeleteCharacter(null);
              setShowDeleteForm(true);
            }}
          />
        )}

        {/* 刪除確認彈窗 */}
        {showDeleteConfirm && deleteCharacter && (
          <DeleteConfirmModal
            character={deleteCharacter}
            onConfirm={wrappedDeleteCharacter}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterEditor;