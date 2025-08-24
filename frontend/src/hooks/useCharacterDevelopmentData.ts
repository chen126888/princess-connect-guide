import { useMemo, useEffect } from 'react';
import { useDataCache } from '../contexts/DataCacheContext';
import type { PriorityTier, CharacterPriorityInfo } from '../characterDevelopmentData/types';

interface ApiCharacter {
  id: number;
  character_name: string;
  priority?: string;
  tier?: string;
  description?: string;
  acquisition_method?: string;
}

export const useCharacterDevelopmentData = () => {
  const {
    cache,
    loading,
    error,
    getSixstarPriorityCharacters,
    getUe1PriorityCharacters,
    getUe2PriorityCharacters,
    getNonSixstarCharacters,
    refreshSixstarPriorityCharacters,
    refreshUe1PriorityCharacters,
    refreshUe2PriorityCharacters,
    refreshNonSixstarCharacters
  } = useDataCache();

  // 自動載入資料
  useEffect(() => {
    getSixstarPriorityCharacters();
    getUe1PriorityCharacters();
    getUe2PriorityCharacters();
    getNonSixstarCharacters();
  }, [getSixstarPriorityCharacters, getUe1PriorityCharacters, getUe2PriorityCharacters, getNonSixstarCharacters]);

  const fetchAllData = async () => {
    await Promise.all([
      refreshSixstarPriorityCharacters(),
      refreshUe1PriorityCharacters(),
      refreshUe2PriorityCharacters(),
      refreshNonSixstarCharacters()
    ]);
  };

  // 將 API 資料轉換為前端需要的 PriorityTier[] 格式
  const convertToPriorityTiers = (data: ApiCharacter[], tierOrder: string[]): PriorityTier[] => {
    const tierColors: { [key: string]: string } = {
      'SS': 'bg-red-500',
      'S': 'bg-orange-500',
      'AA': 'bg-yellow-500',
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-purple-500'
    };

    return tierOrder.map(tierName => {
      const characters = data
        .filter(item => (item.tier || item.priority) === tierName)
        .map(item => ({ 
          name: item.character_name,
          ue2: '無' // 預設值，實際要根據具體邏輯調整
        }));

      return {
        tier: tierName,
        characters,
        color: tierColors[tierName] || 'bg-gray-500'
      };
    }).filter(tier => tier.characters.length > 0);
  };

  const convertToNonSixstarTiers = (data: ApiCharacter[]): PriorityTier[] => {
    const characters: CharacterPriorityInfo[] = data.map(item => ({
      name: item.character_name,
      description: item.description || ''
    }));

    return [{
      tier: '常用角色',
      characters
    }];
  };

  // 轉換後的資料
  const sixstarTiers = useMemo(() => 
    convertToPriorityTiers(cache.sixstarPriorityCharacters, ['SS', 'S', 'AA', 'A', 'B', 'C']), 
    [cache.sixstarPriorityCharacters]
  );
  
  const ue1Tiers = useMemo(() => 
    convertToPriorityTiers(cache.ue1PriorityCharacters, ['SS', 'S', 'A', 'B']), 
    [cache.ue1PriorityCharacters]
  );
  
  const ue2Tiers = useMemo(() => 
    convertToPriorityTiers(cache.ue2PriorityCharacters, ['SS', 'S', 'A']), 
    [cache.ue2PriorityCharacters]
  );
  
  const nonSixstarTiers = useMemo(() => 
    convertToNonSixstarTiers(cache.nonSixstarCharacters), 
    [cache.nonSixstarCharacters]
  );

  return {
    sixstarTiers,
    ue1Tiers,
    ue2Tiers,
    nonSixstarTiers,
    loading: loading.sixstarPriorityCharacters || loading.ue1PriorityCharacters || loading.ue2PriorityCharacters || loading.nonSixstarCharacters,
    error,
    refetch: fetchAllData
  };
};