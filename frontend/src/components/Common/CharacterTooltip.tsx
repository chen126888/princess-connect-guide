import React, { useLayoutEffect, useRef, useState } from 'react';
import type { Character } from '../../types';

interface CharacterTooltipProps {
  character: Character;
  className?: string;
}

const TooltipRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-between">{children}</div>
);

const TooltipItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="w-1/2">
    <span className="text-gray-500">{label}：</span>
    <span className="text-gray-800 font-medium">{value || '(無)'}</span>
  </div>
);

/**
 * 共用的角色懸停工具提示組件，具備邊界偵測功能
 */
const CharacterTooltip: React.FC<CharacterTooltipProps> = ({ 
  character, 
  className = '' 
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [positionClass, setPositionClass] = useState('left-1/2 -translate-x-1/2');

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      if (rect.right > screenWidth) {
        // Tooltip is overflowing the right edge of the screen
        setPositionClass('right-0');
      } else if (rect.left < 0) {
        // Tooltip is overflowing the left edge of the screen
        setPositionClass('left-0');
      }
      // Default is centered, which is already set
    }
  }, []);

  return (
    <div 
      ref={tooltipRef}
      className={`absolute z-50 bottom-full mb-2 w-80 bg-white p-3 border border-gray-200 text-left ${positionClass} ${className}`}
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <h3 className="text-gray-900 font-bold text-base mb-2">{character.角色名稱}</h3>
      
      <div className="space-y-1.5 text-xs">
        <TooltipRow>
          <TooltipItem label="暱稱" value={character.暱稱} />
          <TooltipItem label="位置" value={character.位置} />
        </TooltipRow>
        <TooltipRow>
          <TooltipItem label="定位" value={character.角色定位} />
          <TooltipItem label="獲得" value={character['常駐/限定']} />
        </TooltipRow>
        <TooltipRow>
          <TooltipItem label="屬性" value={character.屬性} />
          <TooltipItem label="能力偏向" value={character.能力偏向} />
        </TooltipRow>
        
        <hr className="my-1 border-t border-gray-200" />

        <TooltipRow>
          <TooltipItem label="競技場進攻" value={character.競技場進攻} />
          <TooltipItem label="防守" value={character.競技場防守} />
        </TooltipRow>
        <TooltipRow>
          <TooltipItem label="戰隊戰" value={character.戰隊戰} />
          <TooltipItem label="深域/抄作業" value={character.深域及抄作業} />
        </TooltipRow>
      </div>

      {character.說明 && (
        <p className="text-gray-700 text-xs mt-2 leading-relaxed border-t border-gray-200 pt-2">
          <span className="text-gray-500">說明：</span>{character.說明}
        </p>
      )}
    </div>
  );
};

export default CharacterTooltip;
