import { useCharactersContext } from '../contexts/CharactersContext';

export const useCharacters = () => {
  const { characters, loading, error, refetch } = useCharactersContext();
  
  return {
    characters,
    loading,
    error,
    fetchCharacters: refetch,
    setCharacters: () => {
      console.warn('setCharacters is deprecated when using CharactersContext. Use refetch() instead.');
    }
  };
};