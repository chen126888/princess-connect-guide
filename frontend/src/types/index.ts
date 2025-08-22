// 角色資料類型 (使用後端中文欄位名)
export interface Character {
  id: string;
  角色名稱: string;
  暱稱?: string;
  位置: string; // 前衛、中衛、後衛
  角色定位?: string;
  '常駐/限定'?: string; // 常駐/限定
  屬性?: string; // 火屬、水屬、土屬、光屬、闇屬等
  能力偏向?: string;
  競技場進攻?: string; // T0、T1、T2、T3、T4、倉管等
  競技場防守?: string;
  戰隊戰?: string; // T0、T1、T2、T3、T4、倉管等
  深域及抄作業?: string; // T0、T1、T2、T3、T4、倉管等
  說明?: string;
  // 圖片欄位
  頭像檔名?: string; // 普通頭像檔名
  六星頭像檔名?: string; // 六星頭像檔名
  createdAt?: string;
  updatedAt?: string;
}

// 其他常用類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CharacterListResponse {
  characters: Character[];
  total: number;
  page: number;
  limit: number;
}

export interface FilterOptions {
  位置?: string[];
  屬性?: string[];
  競技場進攻?: string[];
  競技場防守?: string[];
  戰隊戰?: string[];
  深域及抄作業?: string[];
  角色定位?: string[];
  '常駐/限定'?: string[];
}