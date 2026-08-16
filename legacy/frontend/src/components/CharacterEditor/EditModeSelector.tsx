import React from 'react';

export type EditMode = 'complete' | 'rating' | 'missing' | 'drag-rating';

interface EditModeSelectorProps {
  editMode: EditMode;
  onModeChange: (mode: EditMode) => void;
  onAddCharacter: () => void;
  onDeleteCharacter: () => void;
}

const EditModeSelector: React.FC<EditModeSelectorProps> = ({
  editMode,
  onModeChange,
  onAddCharacter,
  onDeleteCharacter
}) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">編輯模式</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onModeChange('complete')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            editMode === 'complete'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 完整編輯
        </button>
        <button
          onClick={() => onModeChange('missing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            editMode === 'missing'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔍 檢查空缺資料
        </button>
        <button
          onClick={() => onModeChange('rating')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            editMode === 'rating'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⭐ 更改評價
        </button>
        <button
          onClick={() => onModeChange('drag-rating')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            editMode === 'drag-rating'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎯 拖拽評級
        </button>
        <button
          onClick={onAddCharacter}
          className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors"
        >
          ➕ 新增角色
        </button>
        <button
          onClick={onDeleteCharacter}
          className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          🗑️ 刪除角色
        </button>
      </div>
    </div>
  );
};

export default EditModeSelector;