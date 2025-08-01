import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Character } from '../../../types';

interface CharacterInfoModalProps {
  character: Character;
  onDelete: () => void;
  onCancel: () => void;
}

const CharacterInfoModal: React.FC<CharacterInfoModalProps> = ({
  character,
  onDelete,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            <Trash2 className="w-3 h-3" />
            刪除
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            取消
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 pr-32">🗑️ 角色資訊</h2>
        
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">角色名稱:</span> {character.角色名稱}</div>
          <div><span className="font-medium">暱稱:</span> {character.暱稱 || '未設定'}</div>
          <div><span className="font-medium">位置:</span> {character.位置}</div>
          <div><span className="font-medium">屬性:</span> {character.屬性 || '未設定'}</div>
          <div><span className="font-medium">角色定位:</span> {character.角色定位 || '未設定'}</div>
          <div><span className="font-medium">常駐/限定:</span> {character['常駐/限定'] || '未設定'}</div>
          <div><span className="font-medium">競技場進攻:</span> {character.競技場進攻 || '未設定'}</div>
          <div><span className="font-medium">競技場防守:</span> {character.競技場防守 || '未設定'}</div>
          <div><span className="font-medium">戰隊戰:</span> {character.戰隊戰等抄作業場合 || '未設定'}</div>
          {character.說明 && (
            <div><span className="font-medium">說明:</span> {character.說明}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterInfoModal;