import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { characterApi } from '../services/api';
import type { Character } from '../types';

interface CharactersContextType {
  characters: Character[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CharactersContext = createContext<CharactersContextType | null>(null);

export const CharactersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const contextValue: CharactersContextType = {
    characters,
    loading,
    error,
    refetch: fetchCharacters
  };

  return (
    <CharactersContext.Provider value={contextValue}>
      {children}
    </CharactersContext.Provider>
  );
};

export const useCharactersContext = (): CharactersContextType => {
  const context = useContext(CharactersContext);
  if (!context) {
    throw new Error('useCharactersContext must be used within a CharactersProvider');
  }
  return context;
};