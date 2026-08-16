import React from 'react';
import BaseModal from '../../Management/BaseModal';
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
  const headerActions = (
    <div className="flex gap-2">
      <button
        onClick={onConfirm}
        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
      >
        確認刪除
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
      >
        取消
      </button>
    </div>
  );

  return (
    <BaseModal
      isOpen={true}
      onClose={onCancel}
      title="⚠️ 確認刪除"
      maxWidth="max-w-sm"
      headerActions={headerActions}
    >
      <div className="p-6">
        <p className="text-gray-700 mb-4">
          確定要刪除角色「<span className="font-bold">{character.角色名稱}</span>」嗎？
        </p>
        <p className="text-red-600 text-sm">
          此操作無法復原！
        </p>
      </div>
    </BaseModal>
  );
};

export default DeleteConfirmModal;