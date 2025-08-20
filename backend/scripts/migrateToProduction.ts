/**
 * 資料遷移腳本：從本地 SQLite 遷移到生產環境 PostgreSQL
 * 通過 API 端點批次新增角色資料
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fetch from 'node-fetch';

// 生產環境 API 端點
const API_BASE_URL = 'https://princess-connect-guide.onrender.com/api';

// 管理員認證資訊 (從環境變數讀取)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'PrincessConnect2025!'
};

// SQLite 資料庫路徑
const SQLITE_DB_PATH = './prisma/database.db';

// 全域認證 token
let authToken: string | null = null;

// 介面定義
interface Character {
  id: string;
  角色名稱: string;
  暱稱?: string;
  位置: string;
  角色定位?: string;
  '常駐/限定'?: string;
  屬性?: string;
  能力偏向?: string;
  競技場進攻?: string;
  競技場防守?: string;
  戰隊戰?: string;
  '深域及抄作業'?: string;
  說明?: string;
  頭像檔名?: string;
  六星頭像檔名?: string;
  createdAt: string;
  updatedAt: string;
}

async function authenticate(): Promise<string> {
  try {
    console.log('🔐 嘗試管理員登入...');
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });

    if (response.ok) {
      const result: any = await response.json();
      authToken = result.token;
      console.log('✅ 管理員登入成功');
      return result.token;
    } else {
      const error = await response.text();
      throw new Error(`登入失敗: ${error}`);
    }
  } catch (error) {
    throw new Error(`認證錯誤: ${error}`);
  }
}

async function readFromSQLite(): Promise<Character[]> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(SQLITE_DB_PATH);
    
    db.all(`
      SELECT 
        id,
        [角色名稱],
        [暱稱],
        [位置],
        [角色定位],
        [常駐/限定],
        [屬性],
        [能力偏向],
        [競技場進攻],
        [競技場防守],
        [戰隊戰],
        [深域及抄作業],
        [說明],
        [頭像檔名],
        [六星頭像檔名],
        createdAt,
        updatedAt
      FROM characters
      ORDER BY [角色名稱]
    `, (err, rows: Character[]) => {
      db.close();
      
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function createCharacterViaAPI(character: Character): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        id: character.id,
        角色名稱: character.角色名稱,
        暱稱: character.暱稱,
        位置: character.位置,
        角色定位: character.角色定位,
        '常駐/限定': character['常駐/限定'],
        屬性: character.屬性,
        能力偏向: character.能力偏向,
        競技場進攻: character.競技場進攻,
        競技場防守: character.競技場防守,
        戰隊戰: character.戰隊戰,
        '深域及抄作業': character['深域及抄作業'],
        說明: character.說明,
        頭像檔名: character.頭像檔名,
        六星頭像檔名: character.六星頭像檔名
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ 成功新增: ${character.角色名稱}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ 新增失敗: ${character.角色名稱}`, error);
      return false;
    }
  } catch (error) {
    console.error(`❌ API 錯誤: ${character.角色名稱}`, error);
    return false;
  }
}

async function batchMigrate(characters: Character[], batchSize: number = 1) {
  const total = characters.length;
  let successful = 0;
  let failed = 0;

  console.log(`🚀 開始遷移 ${total} 筆角色資料...`);
  console.log(`📦 批次大小: ${batchSize}`);
  console.log('');

  for (let i = 0; i < characters.length; i += batchSize) {
    const batch = characters.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(characters.length / batchSize);

    console.log(`📦 處理批次 ${batchNumber}/${totalBatches} (${batch.length} 筆)`);

    // 並行處理批次內的角色
    const results = await Promise.all(
      batch.map(character => createCharacterViaAPI(character))
    );

    successful += results.filter(Boolean).length;
    failed += results.filter(r => !r).length;

    // 批次間暫停 1 秒，避免過度請求
    if (i + batchSize < characters.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('');
  console.log('🎉 遷移完成！');
  console.log(`✅ 成功: ${successful} 筆`);
  console.log(`❌ 失敗: ${failed} 筆`);
  console.log(`📊 成功率: ${((successful / total) * 100).toFixed(1)}%`);
}

async function main() {
  try {
    console.log('🔍 檢查生產環境狀態...');
    
    // 檢查API健康狀態
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ API狀態:', health);
    } else {
      console.error('❌ API健康檢查失敗');
      return;
    }
    
    // 先進行管理員認證
    await authenticate();
    
    console.log('📖 讀取本地 SQLite 資料...');
    const characters = await readFromSQLite();
    console.log(`📊 找到 ${characters.length} 筆角色資料`);
    console.log('');

    // 開始遷移
    await batchMigrate(characters);

  } catch (error) {
    console.error('💥 遷移過程發生錯誤:', error);
    process.exit(1);
  }
}

// 執行遷移
main();