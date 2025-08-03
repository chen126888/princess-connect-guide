import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 角色 API 服務
export const characterApi = {
  // 獲取所有角色
  getAll: async (params?: {
    位置?: string; // 前衛、中衛、後衛
    屬性?: string; // 火屬、水屬、土屬、光屬、闇屬
    競技場進攻?: string; // T0、T1、T2、T3、T4、倉管
    競技場防守?: string;
    戰隊戰?: string;
    深域及抄作業?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/characters', { params });
    return response.data;
  },

  // 獲取單一角色
  getById: async (id: string) => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  // 更新單一角色
  update: async (id: string, data: any) => {
    const response = await api.put(`/characters/${id}`, data);
    return response.data;
  },

  // 批次更新角色評級
  batchUpdateRatings: async (updates: Array<{characterId: string, category: string, value: string}>) => {
    const response = await api.patch('/characters/batch-ratings', { updates });
    return response.data;
  },
};

// 健康檢查 API
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;