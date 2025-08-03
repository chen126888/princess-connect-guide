import React, { useState, useCallback } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import type { Character } from '../../types';

type RatingCategory = '競技場進攻' | '競技場防守' | '戰隊戰' | '深域及抄作業';
type RatingTier = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | '倉管' | '無資料';

interface LocalChange {
  characterId: string;
  oldValue: string | undefined;
  newValue: string;
}

interface SingleCategoryRatingProps {
  category: RatingCategory;
  characters: Character[];
  onSaveChanges: (category: RatingCategory, changes: LocalChange[]) => Promise<void>;
}

const SingleCategoryRating: React.FC<SingleCategoryRatingProps> = ({
  category,
  characters,
  onSaveChanges
}) => {
  // 本地狀態管理
  const [localRatings, setLocalRatings] = useState<Record<string, string>>({});
  const [pendingChanges, setPendingChanges] = useState<LocalChange[]>([]);
  const [draggedCharacter, setDraggedCharacter] = useState<Character | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 動態計算需要顯示的評級等級
  const getVisibleTiers = useCallback((): RatingTier[] => {
    const baseTiers: RatingTier[] = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管'];
    
    // 檢查是否有無資料的角色
    const hasUnratedCharacters = characters.some(character => {
      const rating = character[category];
      return !rating || rating.trim() === '';
    });
    
    // 如果有無資料的角色，則顯示「無資料」區塊
    return hasUnratedCharacters ? [...baseTiers, '無資料'] : baseTiers;
  }, [characters, category]);

  const ratingTiers = getVisibleTiers();

  // 獲取角色的當前評級（包含本地修改）
  const getCharacterRating = useCallback((character: Character): string => {
    if (localRatings[character.id] !== undefined) {
      return localRatings[character.id];
    }
    const rating = character[category];
    // 如果評級為空、null或undefined，則歸類為「無資料」
    return rating && rating.trim() !== '' ? rating : '無資料';
  }, [localRatings, category]);

  // 獲取特定評級區塊的角色列表
  const getCharactersInTier = useCallback((tier: RatingTier): Character[] => {
    return characters.filter(character => {
      const rating = getCharacterRating(character);
      return rating === tier;
    });
  }, [characters, getCharacterRating]);

  // 處理拖拽開始
  const handleDragStart = useCallback((e: React.DragEvent, character: Character) => {
    setDraggedCharacter(character);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', character.id);
  }, []);

  // 處理拖拽結束
  const handleDragEnd = useCallback(() => {
    setDraggedCharacter(null);
  }, []);

  // 處理放置
  const handleDrop = useCallback((e: React.DragEvent, tier: RatingTier) => {
    e.preventDefault();
    
    if (!draggedCharacter) return;

    const currentRating = getCharacterRating(draggedCharacter);
    
    // 如果評級沒有變化，不做任何操作
    if (currentRating === tier) {
      setDraggedCharacter(null);
      return;
    }

    // 更新本地狀態
    setLocalRatings(prev => ({
      ...prev,
      [draggedCharacter.id]: tier
    }));

    // 記錄變更
    const newChange: LocalChange = {
      characterId: draggedCharacter.id,
      oldValue: draggedCharacter[category],
      newValue: tier === '無資料' ? '' : tier  // 「無資料」保存為空字符串
    };

    setPendingChanges(prev => {
      // 移除舊的變更記錄
      const filtered = prev.filter(change => change.characterId !== draggedCharacter.id);
      return [...filtered, newChange];
    });

    // 清除拖拽狀態
    setDraggedCharacter(null);
  }, [draggedCharacter, getCharacterRating, category]);

  // 允許放置
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // 重置所有變更
  const handleReset = useCallback(() => {
    setLocalRatings({});
    setPendingChanges([]);
  }, []);

  // 保存變更
  const handleSave = useCallback(async () => {
    if (pendingChanges.length === 0) return;

    setIsSaving(true);
    try {
      await onSaveChanges(category, pendingChanges);
      setLocalRatings({});
      setPendingChanges([]);
      alert(`成功更新 ${pendingChanges.length} 個角色在「${category}」的評級`);
    } catch (error: any) {
      console.error('保存失敗:', error);
      alert(`保存失敗: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [pendingChanges, onSaveChanges, category]);

  // 渲染角色頭像
  const renderCharacterAvatar = useCallback((character: Character) => {
    const imagePath = character.六星頭像檔名 || character.頭像檔名;
    const imageUrl = imagePath 
      ? `http://localhost:3000/images/characters/${imagePath}`
      : '/placeholder-character.png';

    return (
      <div
        key={character.id}
        draggable
        onDragStart={(e) => handleDragStart(e, character)}
        onDragEnd={handleDragEnd}
        className={`
          relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden 
          border-2 border-white shadow-md cursor-move
          transition-transform hover:scale-110 hover:shadow-lg
          ${draggedCharacter?.id === character.id ? 'opacity-50' : 'opacity-100'}
        `}
        title={character.角色名稱}
      >
        <img
          src={imageUrl}
          alt={character.角色名稱}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-character.png';
          }}
        />
      </div>
    );
  }, [draggedCharacter, handleDragStart, handleDragEnd]);

  // 渲染評級區塊
  const renderRatingBlock = useCallback((tier: RatingTier) => {
    const charactersInTier = getCharactersInTier(tier);
    const isDropTarget = draggedCharacter !== null;
    
    // 特殊樣式處理「無資料」
    const tierColor = tier === '無資料' ? 'text-orange-600' : 'text-gray-700';
    const borderColor = tier === '無資料' ? 'border-orange-300' : 'border-gray-300';
    const bgColor = tier === '無資料' ? 'bg-orange-50' : 'bg-gray-50';
    
    return (
      <div
        key={tier}
        className={`
          min-h-[120px] p-1 rounded-lg border-2 border-dashed transition-all duration-200
          ${isDropTarget 
            ? 'border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 hover:shadow-md' 
            : `${borderColor} ${bgColor} hover:bg-gray-100`
          }
        `}
        onDrop={(e) => handleDrop(e, tier)}
        onDragOver={handleDragOver}
      >
        <div className="text-center mb-1">
          <div className={`text-xs sm:text-sm font-bold ${tierColor}`}>{tier}</div>
          <div className="text-xs text-gray-500">({charactersInTier.length})</div>
        </div>
        <div className={`${tier === 'T0' ? 'flex flex-col gap-1 items-center' : 'flex flex-wrap gap-1 justify-center'}`}>
          {charactersInTier.map(character => renderCharacterAvatar(character))}
          {charactersInTier.length === 0 && (
            <div className="text-gray-400 text-xs italic">拖拽角色到此</div>
          )}
        </div>
      </div>
    );
  }, [getCharactersInTier, draggedCharacter, handleDrop, handleDragOver, renderCharacterAvatar]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 操作按鈕 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {category === '競技場進攻' && '⚔️'} 
          {category === '競技場防守' && '🛡️'} 
          {category === '戰隊戰' && '👥'} 
          {category === '深域及抄作業' && '🏛️'} 
          {category} 評級調整
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          {pendingChanges.length > 0 && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                disabled={isSaving}
              >
                <RotateCcw className="w-3 h-3" />
                重置 ({pendingChanges.length})
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                disabled={isSaving}
              >
                <Save className="w-3 h-3" />
                {isSaving ? '保存中...' : `保存變更 (${pendingChanges.length})`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 評級網格 - 自定義列寬 */}
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: ratingTiers.map(tier => 
            (tier === 'T0' || tier === 'T1') ? 'minmax(0, 0.5fr)' : 'minmax(0, 1fr)'
          ).join(' ')
        }}
      >
        {ratingTiers.map(tier => renderRatingBlock(tier))}
      </div>

      {/* 變更摘要 */}
      {pendingChanges.length > 0 && (
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="text-sm font-medium text-yellow-800 mb-2">待保存的變更 ({pendingChanges.length})：</h5>
          <div className="max-h-24 overflow-y-auto">
            <ul className="text-xs text-yellow-700 space-y-1">
              {pendingChanges.slice(0, 5).map((change, index) => {
                const character = characters.find(c => c.id === change.characterId);
                const oldDisplay = change.oldValue || '無資料';
                const newDisplay = change.newValue || '無資料';
                return (
                  <li key={index}>
                    • {character?.角色名稱}: {oldDisplay} → {newDisplay}
                  </li>
                );
              })}
              {pendingChanges.length > 5 && (
                <li className="text-yellow-600">... 還有 {pendingChanges.length - 5} 個變更</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 使用說明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-800 mb-2">使用說明：</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 拖拽角色頭像到不同的評級區塊來調整該角色在「{category}」的評價</li>
          <li>• 修改會暫存在本地，點擊「保存變更」後才會更新到資料庫</li>
          <li>• 可以隨時點擊「重置」來取消所有未保存的修改</li>
          <li>• 此頁面的修改只影響「{category}」評級，不會影響其他類別</li>
        </ul>
      </div>
    </div>
  );
};

export default SingleCategoryRating;