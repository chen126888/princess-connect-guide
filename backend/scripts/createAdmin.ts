/**
 * 一次性創建管理員帳號腳本
 * 執行完請立即刪除此檔案
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'https://princess-connect-guide.onrender.com/api';

const ADMIN_DATA = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'PrincessConnect2025!',
  name: '系統管理員'
};

async function createAdmin() {
  try {
    console.log('🔐 創建管理員帳號...');
    console.log(`📧 帳號: ${ADMIN_DATA.username}`);
    
    const response = await fetch(`${API_BASE_URL}/auth/create-first-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ADMIN_DATA)
    });

    console.log(`📡 回應狀態: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json() as any;
      console.log('✅ 管理員創建成功!');
      console.log(`👤 管理員 ID: ${result.admin?.id || '未知'}`);
      console.log(`📧 帳號: ${result.admin?.username || ADMIN_DATA.username}`);
      console.log('');
      console.log('🔥 重要: 請立即刪除此腳本檔案以確保安全!');
      console.log('rm scripts/createAdmin.ts');
    } else {
      const error = await response.text();
      console.error('❌ 創建失敗:', error);
    }
  } catch (error) {
    console.error('💥 發生錯誤:', error);
  }
}

createAdmin();