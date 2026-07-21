import React from 'react';
import { Save } from 'lucide-react';
import type { Character } from '../../../types';

export type EditMode = 'complete' | 'rating' | 'missing' | 'drag-rating';

interface EditCharacterModalProps {
  character: Character;
  editMode: EditMode;
  onSave: (character: Character) => void;
  onCancel: () => void;
  onChange: (character: Character) => void;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({
  character,
  editMode,
  onSave,
  onCancel,
  onChange
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* 右上角按鈕 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onSave(character)}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <Save className="w-3 h-3" />
            儲存
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            取消
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 pr-32">
          {editMode === 'rating' ? '⭐ 評價編輯' : editMode === 'missing' ? '🔍 補充資料' : '📝 完整編輯'}: 
          {character.角色名稱}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 基本資料欄位 - 僅在完整編輯和補充資料模式顯示 */}
          {editMode !== 'rating' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">暱稱</label>
                <input
                  type="text"
                  value={character.暱稱 || ''}
                  onChange={(e) => onChange({...character, 暱稱: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                <select
                  value={character.位置 || ''}
                  onChange={(e) => onChange({...character, 位置: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">請選擇</option>
                  <option value="前衛">前衛</option>
                  <option value="中衛">中衛</option>
                  <option value="後衛">後衛</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">屬性</label>
                <select
                  value={character.屬性 || ''}
                  onChange={(e) => onChange({...character, 屬性: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">請選擇</option>
                  <option value="火屬">火屬</option>
                  <option value="水屬">水屬</option>
                  <option value="風屬">風屬</option>
                  <option value="光屬">光屬</option>
                  <option value="闇屬">闇屬</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色定位</label>
                <input
                  type="text"
                  value={character.角色定位 || ''}
                  onChange={(e) => onChange({...character, 角色定位: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">常駐/限定</label>
                <select
                  value={character['常駐/限定'] || ''}
                  onChange={(e) => onChange({...character, '常駐/限定': e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">請選擇</option>
                  <option value="常駐">常駐</option>
                  <option value="限定">限定</option>
                  <option value="絕版">絕版</option>
                </select>
              </div>
            </>
          )}

          {/* 評價欄位 - 在所有模式下都顯示 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              競技場進攻 {editMode === 'rating' && <span className="text-red-500">*</span>}
            </label>
            <select
              value={character.競技場進攻 || ''}
              onChange={(e) => onChange({...character, 競技場進攻: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇</option>
              <option value="T0">T0</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4">T4</option>
              <option value="倉管">倉管</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              競技場防守 {editMode === 'rating' && <span className="text-red-500">*</span>}
            </label>
            <select
              value={character.競技場防守 || ''}
              onChange={(e) => onChange({...character, 競技場防守: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇</option>
              <option value="T0">T0</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4">T4</option>
              <option value="倉管">倉管</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              戰隊戰 {editMode === 'rating' && <span className="text-red-500">*</span>}
            </label>
            <select
              value={character.戰隊戰 || ''}
              onChange={(e) => onChange({...character, 戰隊戰: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇</option>
              <option value="T0">T0</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4">T4</option>
              <option value="倉管">倉管</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              深域及抄作業 {editMode === 'rating' && <span className="text-red-500">*</span>}
            </label>
            <select
              value={character.深域及抄作業 || ''}
              onChange={(e) => onChange({...character, 深域及抄作業: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇</option>
              <option value="T0">T0</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4">T4</option>
              <option value="倉管">倉管</option>
            </select>
          </div>

          {/* 其他欄位 - 僅在完整編輯和補充資料模式顯示 */}
          {editMode !== 'rating' && (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">能力偏向</label>
                <input
                  type="text"
                  value={character.能力偏向 || ''}
                  onChange={(e) => onChange({...character, 能力偏向: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* 說明欄位 - 僅在完整編輯和補充資料模式顯示 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">說明</label>
                <textarea
                  rows={3}
                  value={character.說明 || ''}
                  onChange={(e) => onChange({...character, 說明: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCharacterModal;