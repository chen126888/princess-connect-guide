/**
 * 測試單筆資料新增
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'https://princess-connect-guide.onrender.com/api';

const testCharacter = {
  id: 'test-001',
  角色名稱: '測試角色',
  暱稱: '測試',
  位置: '前衛',
  角色定位: '坦克',
  '常駐/限定': '常駐',
  屬性: '火屬',
  能力偏向: 'PVP',
  競技場進攻: 'T1',
  競技場防守: 'T1',
  戰隊戰: 'T1', 
  '深域及抄作業': 'T1',
  說明: '這是測試角色',
  頭像檔名: 'test.png',
  六星頭像檔名: 'test_6.png'
};

async function testSingleInsert() {
  try {
    console.log('🧪 測試單筆新增...');
    
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCharacter)
    });

    console.log(`📡 回應狀態: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 成功:', result);
    } else {
      const error = await response.text();
      console.error('❌ 失敗:', error);
    }
  } catch (error) {
    console.error('💥 錯誤:', error);
  }
}

testSingleInsert();