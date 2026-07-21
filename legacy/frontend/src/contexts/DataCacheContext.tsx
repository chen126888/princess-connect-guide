import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  arenaCommonApi, 
  trialCharactersApi, 
  sixstarPriorityApi, 
  ue1PriorityApi, 
  ue2PriorityApi, 
  nonSixstarCharactersApi,
  clanBattleCommonApi,
  clanBattleCompensationApi 
} from '../services/api';

// 定義所有可能的資料類型
interface ArenaCommonCharacter {
  id: number;
  character_name: string;
}

interface TrialCharacter {
  id: number;
  character_name: string;
  category: string;
}

interface SixstarPriorityCharacter {
  id: number;
  character_name: string;
  priority: string;
}

interface Ue1PriorityCharacter {
  id: number;
  character_name: string;
  priority: string;
}

interface Ue2PriorityCharacter {
  id: number;
  character_name: string;
  priority: string;
}

interface NonSixstarCharacter {
  id: number;
  character_name: string;
  description: string;
  acquisition_method: string;
}

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

// 緩存資料結構
interface CacheData {
  arenaCommonCharacters: ArenaCommonCharacter[];
  trialCharacters: TrialCharacter[];
  sixstarPriorityCharacters: SixstarPriorityCharacter[];
  ue1PriorityCharacters: Ue1PriorityCharacter[];
  ue2PriorityCharacters: Ue2PriorityCharacter[];
  nonSixstarCharacters: NonSixstarCharacter[];
  clanBattleCommonCharacters: ClanBattleCommonCharacter[];
  clanBattleCompensationCharacters: ClanBattleCompensationCharacter[];
}

// 載入狀態結構
interface LoadingState {
  arenaCommonCharacters: boolean;
  trialCharacters: boolean;
  sixstarPriorityCharacters: boolean;
  ue1PriorityCharacters: boolean;
  ue2PriorityCharacters: boolean;
  nonSixstarCharacters: boolean;
  clanBattleCommonCharacters: boolean;
  clanBattleCompensationCharacters: boolean;
}

// Context 類型定義
interface DataCacheContextType {
  cache: CacheData;
  loading: LoadingState;
  error: string | null;
  
  // 獲取資料方法 (自動緩存)
  getArenaCommonCharacters: () => Promise<ArenaCommonCharacter[]>;
  getTrialCharacters: () => Promise<TrialCharacter[]>;
  getSixstarPriorityCharacters: () => Promise<SixstarPriorityCharacter[]>;
  getUe1PriorityCharacters: () => Promise<Ue1PriorityCharacter[]>;
  getUe2PriorityCharacters: () => Promise<Ue2PriorityCharacter[]>;
  getNonSixstarCharacters: () => Promise<NonSixstarCharacter[]>;
  getClanBattleCommonCharacters: () => Promise<ClanBattleCommonCharacter[]>;
  getClanBattleCompensationCharacters: () => Promise<ClanBattleCompensationCharacter[]>;
  
  // 手動刷新方法
  refreshArenaCommonCharacters: () => Promise<void>;
  refreshTrialCharacters: () => Promise<void>;
  refreshSixstarPriorityCharacters: () => Promise<void>;
  refreshUe1PriorityCharacters: () => Promise<void>;
  refreshUe2PriorityCharacters: () => Promise<void>;
  refreshNonSixstarCharacters: () => Promise<void>;
  refreshClanBattleCommonCharacters: () => Promise<void>;
  refreshClanBattleCompensationCharacters: () => Promise<void>;
  
  // 清除所有緩存
  clearCache: () => void;
}

// 初始緩存資料
const initialCacheData: CacheData = {
  arenaCommonCharacters: [],
  trialCharacters: [],
  sixstarPriorityCharacters: [],
  ue1PriorityCharacters: [],
  ue2PriorityCharacters: [],
  nonSixstarCharacters: [],
  clanBattleCommonCharacters: [],
  clanBattleCompensationCharacters: [],
};

// 初始載入狀態
const initialLoadingState: LoadingState = {
  arenaCommonCharacters: false,
  trialCharacters: false,
  sixstarPriorityCharacters: false,
  ue1PriorityCharacters: false,
  ue2PriorityCharacters: false,
  nonSixstarCharacters: false,
  clanBattleCommonCharacters: false,
  clanBattleCompensationCharacters: false,
};

// 創建 Context
const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined);

// Provider 組件
interface DataCacheProviderProps {
  children: ReactNode;
}

export const DataCacheProvider: React.FC<DataCacheProviderProps> = ({ children }) => {
  const [cache, setCache] = useState<CacheData>(initialCacheData);
  const [loading, setLoading] = useState<LoadingState>(initialLoadingState);
  const [error, setError] = useState<string | null>(null);

  // 通用的資料獲取邏輯
  const fetchData = async <T,>(
    cacheKey: keyof CacheData,
    apiCall: () => Promise<T[]>,
    forceRefresh = false
  ): Promise<T[]> => {
    // 如果已有緩存且不強制刷新，直接返回
    if (!forceRefresh && cache[cacheKey].length > 0) {
      return cache[cacheKey] as T[];
    }

    // 如果正在載入中，等待完成
    if (loading[cacheKey as keyof LoadingState]) {
      // 等待載入完成後返回緩存資料
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!loading[cacheKey as keyof LoadingState]) {
            resolve(cache[cacheKey] as T[]);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    try {
      // 設定載入狀態
      setLoading(prev => ({ ...prev, [cacheKey]: true }));
      setError(null);

      // 呼叫 API
      const data = await apiCall();

      // 更新緩存
      setCache(prev => ({ ...prev, [cacheKey]: data }));
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入資料失敗';
      setError(errorMessage);
      console.error(`Failed to fetch ${cacheKey}:`, err);
      
      // 如果有舊的緩存資料，返回舊資料
      if (cache[cacheKey].length > 0) {
        return cache[cacheKey] as T[];
      }
      
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [cacheKey]: false }));
    }
  };

  // 資料獲取方法
  const getArenaCommonCharacters = () => 
    fetchData<ArenaCommonCharacter>('arenaCommonCharacters', arenaCommonApi.getAll);

  const getTrialCharacters = () => 
    fetchData<TrialCharacter>('trialCharacters', trialCharactersApi.getAll);

  const getSixstarPriorityCharacters = () => 
    fetchData<SixstarPriorityCharacter>('sixstarPriorityCharacters', sixstarPriorityApi.getAll);

  const getUe1PriorityCharacters = () => 
    fetchData<Ue1PriorityCharacter>('ue1PriorityCharacters', ue1PriorityApi.getAll);

  const getUe2PriorityCharacters = () => 
    fetchData<Ue2PriorityCharacter>('ue2PriorityCharacters', ue2PriorityApi.getAll);

  const getNonSixstarCharacters = () => 
    fetchData<NonSixstarCharacter>('nonSixstarCharacters', nonSixstarCharactersApi.getAll);

  const getClanBattleCommonCharacters = () => 
    fetchData<ClanBattleCommonCharacter>('clanBattleCommonCharacters', clanBattleCommonApi.getAll);

  const getClanBattleCompensationCharacters = () => 
    fetchData<ClanBattleCompensationCharacter>('clanBattleCompensationCharacters', clanBattleCompensationApi.getAll);

  // 刷新方法
  const refreshArenaCommonCharacters = () => 
    fetchData<ArenaCommonCharacter>('arenaCommonCharacters', arenaCommonApi.getAll, true).then(() => {});

  const refreshTrialCharacters = () => 
    fetchData<TrialCharacter>('trialCharacters', trialCharactersApi.getAll, true).then(() => {});

  const refreshSixstarPriorityCharacters = () => 
    fetchData<SixstarPriorityCharacter>('sixstarPriorityCharacters', sixstarPriorityApi.getAll, true).then(() => {});

  const refreshUe1PriorityCharacters = () => 
    fetchData<Ue1PriorityCharacter>('ue1PriorityCharacters', ue1PriorityApi.getAll, true).then(() => {});

  const refreshUe2PriorityCharacters = () => 
    fetchData<Ue2PriorityCharacter>('ue2PriorityCharacters', ue2PriorityApi.getAll, true).then(() => {});

  const refreshNonSixstarCharacters = () => 
    fetchData<NonSixstarCharacter>('nonSixstarCharacters', nonSixstarCharactersApi.getAll, true).then(() => {});

  const refreshClanBattleCommonCharacters = () => 
    fetchData<ClanBattleCommonCharacter>('clanBattleCommonCharacters', clanBattleCommonApi.getAll, true).then(() => {});

  const refreshClanBattleCompensationCharacters = () => 
    fetchData<ClanBattleCompensationCharacter>('clanBattleCompensationCharacters', clanBattleCompensationApi.getAll, true).then(() => {});

  // 清除緩存
  const clearCache = () => {
    setCache(initialCacheData);
    setError(null);
  };

  const value: DataCacheContextType = {
    cache,
    loading,
    error,
    
    // 獲取方法
    getArenaCommonCharacters,
    getTrialCharacters,
    getSixstarPriorityCharacters,
    getUe1PriorityCharacters,
    getUe2PriorityCharacters,
    getNonSixstarCharacters,
    getClanBattleCommonCharacters,
    getClanBattleCompensationCharacters,
    
    // 刷新方法
    refreshArenaCommonCharacters,
    refreshTrialCharacters,
    refreshSixstarPriorityCharacters,
    refreshUe1PriorityCharacters,
    refreshUe2PriorityCharacters,
    refreshNonSixstarCharacters,
    refreshClanBattleCommonCharacters,
    refreshClanBattleCompensationCharacters,
    
    clearCache,
  };

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
};

// Hook 來使用 Context
export const useDataCache = (): DataCacheContextType => {
  const context = useContext(DataCacheContext);
  if (context === undefined) {
    throw new Error('useDataCache must be used within a DataCacheProvider');
  }
  return context;
};