const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function cleanupDuplicates() {
  console.log('開始清理重複資料...');
  
  try {
    // 1. 清理競技場常用角色重複
    console.log('清理競技場常用角色重複資料...');
    const arenaResponse = await axios.get(`${API_BASE}/arena-common`);
    const arenaCharacters = arenaResponse.data;
    
    // 找出重複的角色名稱
    const seen = new Set();
    const duplicates = [];
    
    for (const char of arenaCharacters) {
      if (seen.has(char.character_name)) {
        duplicates.push(char.id);
      } else {
        seen.add(char.character_name);
      }
    }
    
    console.log(`發現 ${duplicates.length} 個重複的競技場角色`);
    for (const id of duplicates) {
      try {
        await axios.delete(`${API_BASE}/arena-common/${id}`);
        console.log(`✅ 已刪除重複的競技場角色 ID: ${id}`);
      } catch (error) {
        console.log(`❌ 刪除失敗 ID: ${id}`, error.message);
      }
    }
    
    // 2. 清理六星優先度重複
    console.log('清理六星優先度重複資料...');
    const sixstarResponse = await axios.get(`${API_BASE}/sixstar-priority`);
    const sixstarCharacters = sixstarResponse.data;
    
    const sixstarSeen = new Set();
    const sixstarDuplicates = [];
    
    for (const char of sixstarCharacters) {
      const key = `${char.character_name}-${char.tier}`;
      if (sixstarSeen.has(key)) {
        sixstarDuplicates.push(char.id);
      } else {
        sixstarSeen.add(key);
      }
    }
    
    console.log(`發現 ${sixstarDuplicates.length} 個重複的六星角色`);
    for (const id of sixstarDuplicates) {
      try {
        await axios.delete(`${API_BASE}/sixstar-priority/${id}`);
        console.log(`✅ 已刪除重複的六星角色 ID: ${id}`);
      } catch (error) {
        console.log(`❌ 刪除失敗 ID: ${id}`, error.message);
      }
    }
    
    // 3. 清理試煉角色重複
    console.log('清理試煉角色重複資料...');
    const trialResponse = await axios.get(`${API_BASE}/trial-characters`);
    const trialCharacters = trialResponse.data;
    
    const trialSeen = new Set();
    const trialDuplicates = [];
    
    for (const char of trialCharacters) {
      const key = `${char.character_name}-${char.category}`;
      if (trialSeen.has(key)) {
        trialDuplicates.push(char.id);
      } else {
        trialSeen.add(key);
      }
    }
    
    console.log(`發現 ${trialDuplicates.length} 個重複的試煉角色`);
    for (const id of trialDuplicates) {
      try {
        await axios.delete(`${API_BASE}/trial-characters/${id}`);
        console.log(`✅ 已刪除重複的試煉角色 ID: ${id}`);
      } catch (error) {
        console.log(`❌ 刪除失敗 ID: ${id}`, error.message);
      }
    }
    
    console.log('🎉 清理重複資料完成！');
    
  } catch (error) {
    console.error('❌ 清理過程中發生錯誤:', error.message);
  }
}

cleanupDuplicates();