import { useState, useEffect } from 'react';
import { arenaCommonApi, trialCharactersApi } from '../services/api';

interface ArenaCommonCharacter {
  id: number;
  character_name: string;
}

interface TrialCharacter {
  id: number;
  character_name: string;
  category: string;
}

export const useArenaData = () => {
  const [arenaCommonCharacters, setArenaCommonCharacters] = useState<ArenaCommonCharacter[]>([]);
  const [trialCharacters, setTrialCharacters] = useState<TrialCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArenaCommonCharacters = async () => {
    try {
      const data = await arenaCommonApi.getAll();
      setArenaCommonCharacters(data);
    } catch (err) {
      console.error('Failed to fetch arena common characters:', err);
      setError('無法載入競技場常用角色資料');
    }
  };

  const fetchTrialCharacters = async () => {
    try {
      const data = await trialCharactersApi.getAll();
      setTrialCharacters(data);
    } catch (err) {
      console.error('Failed to fetch trial characters:', err);
      setError('無法載入戰鬥試煉場角色資料');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchArenaCommonCharacters(),
        fetchTrialCharacters()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 將戰鬥試煉場角色按分類分組
  const trialCharactersByCategory = {
    推薦練: trialCharacters.filter(c => c.category === '推薦練').map(c => c.character_name),
    後期練: trialCharacters.filter(c => c.category === '後期練').map(c => c.character_name)
  };

  return {
    arenaCommonCharacters,
    trialCharacters,
    trialCharactersByCategory,
    loading,
    error,
    refetch: fetchAllData
  };
};