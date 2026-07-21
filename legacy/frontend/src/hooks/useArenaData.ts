import { useMemo, useEffect } from 'react';
import { useDataCache } from '../contexts/DataCacheContext';

export const useArenaData = () => {
  const {
    cache,
    loading,
    error,
    getArenaCommonCharacters,
    getTrialCharacters,
    refreshArenaCommonCharacters,
    refreshTrialCharacters
  } = useDataCache();

  // 自動載入資料
  useEffect(() => {
    getArenaCommonCharacters();
    getTrialCharacters();
  }, [getArenaCommonCharacters, getTrialCharacters]);

  // 將戰鬥試煉場角色按分類分組
  const trialCharactersByCategory = useMemo(() => ({
    推薦練: cache.trialCharacters.filter(c => c.category === '推薦練').map(c => c.character_name),
    後期練: cache.trialCharacters.filter(c => c.category === '後期練').map(c => c.character_name)
  }), [cache.trialCharacters]);

  const fetchAllData = async () => {
    await Promise.all([
      refreshArenaCommonCharacters(),
      refreshTrialCharacters()
    ]);
  };

  return {
    arenaCommonCharacters: cache.arenaCommonCharacters,
    trialCharacters: cache.trialCharacters,
    trialCharactersByCategory,
    loading: loading.arenaCommonCharacters || loading.trialCharacters,
    error,
    refetch: fetchAllData
  };
};