import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/auth';

// 環境變數配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('🔗 API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 請求攔截器 - 自動添加 JWT Token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器 - 處理 Token 過期
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除本地 token 並重定向到登入
      removeAuthToken();
      // 可以在這裡觸發全域登入狀態更新
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

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

  // 新增角色 (需要管理員權限)
  create: async (characterData: any) => {
    const response = await api.post('/characters', characterData);
    return response.data;
  },

  // 刪除角色 (需要管理員權限)
  delete: async (id: string) => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },
};

// 管理員 API 服務
export const adminApi = {
  // 登入
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // 檢查初始化
  checkInit: async () => {
    const response = await api.get('/auth/check-init');
    return response.data;
  },

  // 初始化超級管理員
  initSuperAdmin: async (adminData: { username: string; password: string; name?: string }) => {
    const response = await api.post('/auth/init-superadmin', adminData);
    return response.data;
  },

  // 獲取管理員列表 (需要超級管理員權限)
  getAdmins: async () => {
    const response = await api.get('/auth/admins');
    return response.data;
  },

  // 創建管理員 (需要超級管理員權限)
  createAdmin: async (adminData: { username: string; password: string; name?: string }) => {
    const response = await api.post('/auth/create-admin', adminData);
    return response.data;
  },

  // 重置密碼 (需要超級管理員權限)
  resetPassword: async (adminId: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { adminId, newPassword });
    return response.data;
  },

  // 啟用/停用管理員 (需要超級管理員權限)
  toggleAdmin: async (adminId: string, isActive: boolean) => {
    const response = await api.post('/auth/toggle-admin', { adminId, isActive });
    return response.data;
  },

  // 刪除管理員 (需要超級管理員權限)
  deleteAdmin: async (adminId: string) => {
    const response = await api.delete('/auth/delete-admin', { data: { adminId } });
    return response.data;
  },
};

// 文件上傳 API 服務
export const uploadApi = {
  // 上傳角色照片 (需要管理員權限)
  uploadCharacterPhoto: async (file: File, characterName: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('characterName', characterName);
    
    const response = await api.post('/upload/character-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 檢查 R2 配置狀態 (需要管理員權限)
  checkR2Status: async () => {
    const response = await api.get('/upload/r2-status');
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