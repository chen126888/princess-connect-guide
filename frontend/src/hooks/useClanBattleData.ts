import { useState, useEffect } from 'react';
import { clanBattleCommonApi, clanBattleCompensationApi } from '../services/api';

interface ClanBattleCommonCharacter {
  id: number;
  character_name: string;
  attribute: string;
  damage_type: string;
  importance: string;
}

interface ClanBattleCompensationCharacter {
  id: number;
  character_name: string;
}

export const useClanBattleData = () => {
  const [clanBattleCommonCharacters, setClanBattleCommonCharacters] = useState<ClanBattleCommonCharacter[]>([]);
  const [clanBattleCompensationCharacters, setClanBattleCompensationCharacters] = useState<ClanBattleCompensationCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClanBattleCommonCharacters = async () => {
    try {
      const data = await clanBattleCommonApi.getAll();
      setClanBattleCommonCharacters(data);
    } catch (err) {
      console.error('Failed to fetch clan battle common characters:', err);
      setError('無法載入戰隊戰常用角色資料');
    }
  };

  const fetchClanBattleCompensationCharacters = async () => {
    try {
      const data = await clanBattleCompensationApi.getAll();
      setClanBattleCompensationCharacters(data);
    } catch (err) {
      console.error('Failed to fetch clan battle compensation characters:', err);
      setError('無法載入戰隊戰補償刀角色資料');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchClanBattleCommonCharacters(),
        fetchClanBattleCompensationCharacters()
      ]);
    } catch (err) {
      setError('載入戰隊戰資料失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    clanBattleCommonCharacters,
    clanBattleCompensationCharacters,
    loading,
    error,
    refetch: fetchAllData
  };
};