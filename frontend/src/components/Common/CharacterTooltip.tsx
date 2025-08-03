import React from 'react';
import type { Character } from '../../types';

interface CharacterTooltipProps {
  character: Character;
  className?: string;
}

/**
 * 共用的角色懸停工具提示組件
 * 用於角色圖鑑和商店等地方顯示角色詳細資訊
 */
const CharacterTooltip: React.FC<CharacterTooltipProps> = ({ 
  character, 
  className = '' 
}) => {
  return (
    <div 
      className={`absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white p-4 border border-gray-200 ${className}`}
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <h3 className="text-gray-800 font-bold mb-1">{character.角色名稱}</h3>
      <p className="text-gray-600 text-sm mb-2">暱稱：{character.暱稱 || '(無資料)'}</p>
      <div className="space-y-1 text-xs">
        <p className="text-gray-700">位置：{character.位置}</p>
        <p className="text-gray-700">定位：{character.角色定位 || '(無資料)'}</p>
        <p className="text-gray-700">獲得：{character['常駐/限定'] || '(無資料)'}</p>
        <p className="text-gray-700">屬性：{character.屬性 || '(無資料)'}</p>
        <p className="text-gray-700">能力偏向：{character.能力偏向 || '(無資料)'}</p>
        <p className="text-gray-700">競技場進攻：{character.競技場進攻 || '(無資料)'}</p>
        <p className="text-gray-700">競技場防守：{character.競技場防守 || '(無資料)'}</p>
        <p className="text-gray-700">戰隊戰：{character.戰隊戰 || '(無資料)'}</p>
        <p className="text-gray-700">深域及抄作業：{character.深域及抄作業 || '(無資料)'}</p>
      </div>
      <p className="text-gray-600 text-xs mt-2 leading-relaxed border-t border-gray-200 pt-2">
        說明：{character.說明 || '(無資料)'}
      </p>
    </div>
  );
};

export default CharacterTooltip;