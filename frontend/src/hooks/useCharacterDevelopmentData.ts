import { useState, useEffect } from 'react';
import { 
  sixstarPriorityApi, 
  ue1PriorityApi, 
  ue2PriorityApi, 
  nonSixstarCharactersApi 
} from '../services/api';
import type { PriorityTier, CharacterPriorityInfo } from '../characterDevelopmentData/types';

interface ApiCharacter {
  id: number;
  character_name: string;
  tier?: string;
  description?: string;
  acquisition_method?: string;
}

export const useCharacterDevelopmentData = () => {
  const [sixstarData, setSixstarData] = useState<ApiCharacter[]>([]);
  const [ue1Data, setUe1Data] = useState<ApiCharacter[]>([]);
  const [ue2Data, setUe2Data] = useState<ApiCharacter[]>([]);
  const [nonSixstarData, setNonSixstarData] = useState<ApiCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [sixstar, ue1, ue2, nonSixstar] = await Promise.all([
        sixstarPriorityApi.getAll(),
        ue1PriorityApi.getAll(),
        ue2PriorityApi.getAll(),
        nonSixstarCharactersApi.getAll()
      ]);

      setSixstarData(sixstar);
      setUe1Data(ue1);
      setUe2Data(ue2);
      setNonSixstarData(nonSixstar);
    } catch (err) {
      console.error('Failed to fetch character development data:', err);
      setError('無法載入角色養成資料');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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
        .filter(item => item.tier === tierName)
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
  const sixstarTiers = convertToPriorityTiers(sixstarData, ['SS', 'S', 'AA', 'A', 'B', 'C']);
  const ue1Tiers = convertToPriorityTiers(ue1Data, ['SS', 'S', 'A', 'B']);
  const ue2Tiers = convertToPriorityTiers(ue2Data, ['SS', 'S', 'A']);
  const nonSixstarTiers = convertToNonSixstarTiers(nonSixstarData);

  return {
    sixstarTiers,
    ue1Tiers,
    ue2Tiers,
    nonSixstarTiers,
    loading,
    error,
    refetch: fetchAllData
  };
};