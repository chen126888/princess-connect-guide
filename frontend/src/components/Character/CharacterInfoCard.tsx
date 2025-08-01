import React from 'react';
import type { Character } from '../../types';

interface CharacterInfoCardProps {
  character: Character;
  onEdit: () => void;
}

const CharacterInfoCard: React.FC<CharacterInfoCardProps> = ({ character, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{character.角色名稱}</h3>
      <div className="space-y-1 text-sm">
        {/* 第一行：暱稱和位置 */}
        <div className="grid grid-cols-2">
          <span><span className="font-medium">暱稱:</span> {character.暱稱 || '未設定'}</span>
          <span><span className="font-medium">位置:</span> {character.位置}</span>
        </div>
        
        {/* 第二行：屬性和常駐/限定 */}
        <div className="grid grid-cols-2">
          <span><span className="font-medium">屬性:</span> {character.屬性 || '未設定'}</span>
          <span><span className="font-medium">取得:</span> {character['常駐/限定'] || '未設定'}</span>
        </div>
        
        {/* 第三行：戰隊戰 */}
        <div>
          <span className="font-medium">戰隊戰:</span> {character.戰隊戰等抄作業場合 || '未設定'}
        </div>
        
        {/* 第四行：競技場進攻/防守 */}
        <div className="grid grid-cols-2">
          <span><span className="font-medium">進攻:</span> {character.競技場進攻 || '未設定'}</span>
          <span><span className="font-medium">防守:</span> {character.競技場防守 || '未設定'}</span>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        編輯
      </button>
    </div>
  );
};

export default CharacterInfoCard;