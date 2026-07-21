import { useEffect } from 'react';
import { useDataCache } from '../contexts/DataCacheContext';

export const useClanBattleData = () => {
  const {
    cache,
    loading,
    error,
    getClanBattleCommonCharacters,
    getClanBattleCompensationCharacters,
    refreshClanBattleCommonCharacters,
    refreshClanBattleCompensationCharacters
  } = useDataCache();

  // 自動載入資料
  useEffect(() => {
    getClanBattleCommonCharacters();
    getClanBattleCompensationCharacters();
  }, [getClanBattleCommonCharacters, getClanBattleCompensationCharacters]);

  const fetchAllData = async () => {
    await Promise.all([
      refreshClanBattleCommonCharacters(),
      refreshClanBattleCompensationCharacters()
    ]);
  };

  return {
    clanBattleCommonCharacters: cache.clanBattleCommonCharacters,
    clanBattleCompensationCharacters: cache.clanBattleCompensationCharacters,
    loading: loading.clanBattleCommonCharacters || loading.clanBattleCompensationCharacters,
    error,
    refetch: fetchAllData
  };
};