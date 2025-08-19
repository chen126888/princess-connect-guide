// Token 管理工具

const TOKEN_KEY = 'authToken';
const ADMIN_INFO_KEY = 'adminInfo';

export interface AdminInfo {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'superadmin';
}

// 儲存 Token 和管理員資訊
export const setAuthToken = (token: string, adminInfo?: AdminInfo): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  if (adminInfo) {
    sessionStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminInfo));
  }
};

// 獲取 Token
export const getAuthToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

// 移除 Token 和管理員資訊
export const removeAuthToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_INFO_KEY);
};

// 檢查是否已登入
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // 簡單檢查 token 格式和過期時間
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    return payload.exp > now;
  } catch {
    return false;
  }
};

// 獲取當前管理員資訊
export const getCurrentAdmin = (): AdminInfo | null => {
  if (!isAuthenticated()) return null;
  
  try {
    // 優先從 SessionStorage 中獲取完整的管理員資訊
    const adminInfoStr = sessionStorage.getItem(ADMIN_INFO_KEY);
    if (adminInfoStr) {
      return JSON.parse(adminInfoStr);
    }
    
    // 如果沒有存儲的管理員資訊，從 token 中解析
    const token = getAuthToken();
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.adminId,
      username: payload.username,
      name: payload.username, // 後備方案
      role: payload.role
    };
  } catch {
    return null;
  }
};

// 檢查是否為超級管理員
export const isSuperAdmin = (): boolean => {
  const admin = getCurrentAdmin();
  return admin?.role === 'superadmin';
};