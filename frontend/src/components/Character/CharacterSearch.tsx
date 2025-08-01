import React from 'react';
import { Search } from 'lucide-react';

interface CharacterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showButton?: boolean;
}

const CharacterSearch: React.FC<CharacterSearchProps> = ({ 
  value, 
  onChange, 
  placeholder = "輸入角色名稱或暱稱...",
  showButton = true 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-gray-700 font-medium mb-3 text-base">搜索角色</h3>
      <div className="flex gap-2">
        {/* 搜索輸入框 */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
          style={{ borderRadius: '0.5rem' }}
        />
        {/* 搜索按鈕 */}
        {showButton && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 transition-colors duration-200 flex items-center justify-center"
            style={{ borderRadius: '0.5rem' }}
          >
            <Search style={{ width: '1rem', height: '1rem' }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterSearch;