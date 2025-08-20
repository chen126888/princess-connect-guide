/**
 * 診斷資料庫狀態
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'https://princess-connect-guide.onrender.com/api';

async function debugDatabase() {
  try {
    console.log('🔍 診斷資料庫狀態...');
    
    // 測試 SQL 查詢
    const testQuery = `
      SELECT name FROM sqlite_master WHERE type='table';
    `;
    
    const response = await fetch(`${API_BASE_URL}/debug-db`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: testQuery })
    });

    console.log(`📡 回應狀態: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 資料庫查詢成功:', result);
    } else {
      const error = await response.text();
      console.error('❌ 查詢失敗:', error);
    }
  } catch (error) {
    console.error('💥 發生錯誤:', error);
  }
}

debugDatabase();