/**
 * 初始化資料庫腳本：確保所有必要的表格存在
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'https://princess-connect-guide.onrender.com/api';

async function testDatabaseConnection() {
  try {
    console.log('🔍 測試資料庫連接...');
    
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ 健康檢查:', health);
      return true;
    } else {
      console.error('❌ 健康檢查失敗');
      return false;
    }
  } catch (error) {
    console.error('💥 連接錯誤:', error);
    return false;
  }
}

async function testCharactersEndpoint() {
  try {
    console.log('🔍 測試角色端點...');
    
    const response = await fetch(`${API_BASE_URL}/characters?limit=1`);
    const data = await response.text();
    
    console.log('📊 角色端點回應:', data);
    
    if (data.includes('Failed to fetch characters')) {
      console.log('❌ 角色表格不存在或查詢失敗');
      return false;
    } else {
      console.log('✅ 角色端點正常');
      return true;
    }
  } catch (error) {
    console.error('💥 角色端點錯誤:', error);
    return false;
  }
}

async function testLogin() {
  try {
    console.log('🔐 測試登入功能...');
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'PrincessConnect2025!'
      })
    });
    
    const data = await response.text();
    console.log('🔐 登入回應:', data);
    
    if (response.ok) {
      console.log('✅ 登入成功');
      return true;
    } else {
      console.log('❌ 登入失敗');
      return false;
    }
  } catch (error) {
    console.error('💥 登入錯誤:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 開始資料庫初始化檢查...');
  console.log('');
  
  // 1. 測試基本連接
  const healthOk = await testDatabaseConnection();
  console.log('');
  
  // 2. 測試角色端點
  const charactersOk = await testCharactersEndpoint();
  console.log('');
  
  // 3. 測試登入
  const loginOk = await testLogin();
  console.log('');
  
  // 總結
  console.log('📋 檢查結果總結:');
  console.log(`   健康檢查: ${healthOk ? '✅' : '❌'}`);
  console.log(`   角色端點: ${charactersOk ? '✅' : '❌'}`);
  console.log(`   登入功能: ${loginOk ? '✅' : '❌'}`);
  
  if (healthOk && charactersOk && loginOk) {
    console.log('');
    console.log('🎉 資料庫已正確初始化，可以執行遷移！');
  } else {
    console.log('');
    console.log('⚠️  需要修復問題後才能執行遷移');
  }
}

// 執行檢查
main();