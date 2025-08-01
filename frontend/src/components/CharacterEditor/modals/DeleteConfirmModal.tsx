import React from 'react';
import type { Character } from '../../../types';

interface DeleteConfirmModalProps {
  character: Character;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  character,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ 確認刪除</h2>
        
        <p className="text-gray-700 mb-4">
          確定要刪除角色「<span className="font-bold">{character.角色名稱}</span>」嗎？
        </p>
        <p className="text-red-600 text-sm mb-6">
          此操作無法復原！
        </p>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;