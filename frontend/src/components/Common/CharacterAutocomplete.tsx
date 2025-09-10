import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useCharacters } from '../../hooks/useCharacters';
import type { Character } from '../../types';

interface CharacterAutocompleteProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSuggestions?: number;
}

const CharacterAutocomplete: React.FC<CharacterAutocompleteProps> = ({
  value,
  onChange,
  onKeyPress,
  placeholder = "輸入角色名稱",
  disabled = false,
  className = "",
  maxSuggestions = 8
}) => {
  const { characters, loading } = useCharacters();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 過濾建議項目 (復用角色圖鑑的搜索邏輯)
  const suggestions = React.useMemo(() => {
    if (!value.trim() || loading) return [];
    
    const searchTerm = value.toLowerCase();
    const filtered = characters.filter((char: Character) => {
      const nameMatch = char.角色名稱.toLowerCase().includes(searchTerm);
      const nicknameMatch = char.暱稱?.toLowerCase().includes(searchTerm);
      return nameMatch || nicknameMatch;
    });

    return filtered.slice(0, maxSuggestions);
  }, [value, characters, loading, maxSuggestions]);

  // 處理輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  // 選擇建議項目
  const selectSuggestion = (character: Character) => {
    const syntheticEvent = {
      target: { value: character.角色名稱 }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // 處理鍵盤操作
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      onKeyPress?.(e);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(suggestions[highlightedIndex]);
        } else {
          onKeyPress?.(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        onKeyPress?.(e);
        break;
    }
  };

  // 處理失焦
  const handleBlur = () => {
    // 延遲隱藏建議，允許點擊建議項目
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  // 處理聚焦
  const handleFocus = () => {
    if (value.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // 點擊外部關閉建議
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 高亮匹配文字
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-800 font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pr-8 ${className}`}
        />
        <Search 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
        />
      </div>

      {/* 建議下拉選單 */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((character, index) => (
            <div
              key={character.id}
              onClick={() => selectSuggestion(character)}
              className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === highlightedIndex 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">
                {highlightMatch(character.角色名稱, value)}
              </div>
              {character.暱稱 && character.暱稱 !== character.角色名稱 && (
                <div className="text-sm text-gray-500 mt-1">
                  暱稱: {highlightMatch(character.暱稱, value)}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1 flex gap-2">
                <span>{character.位置}</span>
                <span>{character.屬性}</span>
                {character['常駐/限定'] && <span>{character['常駐/限定']}</span>}
              </div>
            </div>
          ))}
          
          {/* 載入中提示 */}
          {loading && (
            <div className="px-3 py-2 text-gray-500 text-sm text-center">
              載入角色資料中...
            </div>
          )}
          
          {/* 建議數量提示 */}
          {suggestions.length === maxSuggestions && (
            <div className="px-3 py-1 text-xs text-gray-400 text-center bg-gray-50">
              顯示前 {maxSuggestions} 個結果，輸入更多字元以縮小範圍
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterAutocomplete;