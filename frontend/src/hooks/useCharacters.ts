import { useState, useEffect } from 'react';
import { characterApi } from '../services/api';
import type { Character } from '../types';

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await characterApi.getAll({ limit: 1000 });
      setCharacters(data.characters || []);
    } catch (err) {
      console.error('Failed to fetch characters:', err);
      setError('無法載入角色資料，請確認後端服務器是否運行');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return {
    characters,
    loading,
    error,
    fetchCharacters,
    setCharacters
  };
};