#!/usr/bin/env node

/**
 * 批次上傳圖片到 Cloudflare R2 (最終版)
 * 直接使用 AWS S3 SDK，不再依賴 Wrangler CLI
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// --- 配置 ---
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const IMAGES_DIR = path.resolve(__dirname, '../../data/images');
const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
const MAX_CONCURRENT = 5; // 可以調整並發數量

let S3; // S3 Client 將在 main 函式中初始化

/**
 * 檢查環境變數
 */
function checkEnvironment() {
  console.log('🔧 檢查環境設定...');
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !BUCKET_NAME) {
    console.error('❌ .env 檔案中的 R2 設定不完整！');
    return false;
  }
  console.log('✅ 環境設定檢查完畢\n');
  return true;
}

/**
 * 初始化 S3 Client
 */
function initializeS3Client() {
  S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('☁️  S3 Client 初始化完成');
}


/**
 * 獲取所有圖片檔案
 */
function getAllImageFiles() {
  // ... (這個函式和您之前的版本一樣，保持不變)
  console.log('📁 掃描圖片檔案...\n');
  const allFiles = [];
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
      if (fs.statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath, itemRelativePath);
      } else if (item.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
        allFiles.push({
          fileName: item,
          localPath: path.resolve(fullPath),
          remotePath: itemRelativePath.replace(/\\/g, '/'),
          directory: relativePath || 'root'
        });
      }
    }
  }
  if (fs.existsSync(IMAGES_DIR)) {
    scanDirectory(IMAGES_DIR);
  } else {
    throw new Error(`圖片目錄不存在: ${IMAGES_DIR}`);
  }
  // ... 統計部分也保持不變 ...
  const stats = {};
  allFiles.forEach(file => {
    stats[file.directory] = (stats[file.directory] || 0) + 1;
  });
  console.log('📊 檔案統計:');
  Object.entries(stats).forEach(([dir, count]) => {
    console.log(`   ${dir}: ${count} 個檔案`);
  });
  console.log(`   總計: ${allFiles.length} 個檔案\n`);
  return allFiles;
}

/**
 * 上傳單個檔案 (使用 S3 SDK)
 */
async function uploadSingleFile(file, index, total) {
  const progress = `[${index}/${total}]`;
  console.log(`${progress} 📤 上傳: ${file.fileName}`);

  try {
    const fileStream = fs.createReadStream(file.localPath);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file.remotePath,
      Body: fileStream,
      // 可以根據副檔名自動判斷 ContentType，這裡為求簡單先統一
      ContentType: 'image/png' 
    });

    await S3.send(command);
    console.log(`   ✅ 上傳成功: ${file.fileName}`);
    return { success: true, fileName: file.fileName };

  } catch (error) {
    console.error(`   ❌ 上傳失敗: ${file.fileName}`, error);
    return { success: false, fileName: file.fileName, error: error.message };
  }
}

/**
 * 批次上傳 (控制並發數量)
 */
async function uploadBatch(files) {
  const results = [];
  for (let i = 0; i < files.length; i += MAX_CONCURRENT) {
    const batch = files.slice(i, i + MAX_CONCURRENT);
    console.log(`\n📦 處理批次 ${Math.floor(i / MAX_CONCURRENT) + 1}/${Math.ceil(files.length / MAX_CONCURRENT)} (${batch.length} 個檔案)`);
    
    const batchPromises = batch.map((file, index) => 
        uploadSingleFile(file, i + index + 1, files.length)
    );
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    const completed = results.length;
    const success = results.filter(r => r.success).length;
    console.log(`📊 進度: ${completed}/${files.length} | 成功: ${success}`);
  }
  return results;
}

/**
 * 主函數
 */
async function main() {
  console.log('🚀 R2 圖片上傳工具 (AWS S3 SDK 版)\n');
  console.log('='.repeat(50));
  
  try {
    if (!checkEnvironment()) process.exit(1);
    
    initializeS3Client();

    const allFiles = getAllImageFiles();
    if (allFiles.length === 0) {
      console.log('⚠️  沒有找到圖片檔案');
      process.exit(0);
    }
    
    const startTime = Date.now();
    const results = await uploadBatch(allFiles);
    const endTime = Date.now();

    // 最終統計
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 上傳完成統計');
    console.log('='.repeat(50));
    console.log(`⏱️  總耗時: ${duration} 秒`);
    console.log(`✅ 成功: ${successful.length} 個檔案`);
    console.log(`❌ 失敗: ${failed.length} 個檔案`);
    
    if (failed.length > 0) {
      console.log('\n❌ 失敗的檔案:');
      failed.forEach(result => {
        console.log(`   - ${result.fileName}: ${result.error}`);
      });
    }

    console.log('\n🎉 遷移完成！');
    console.log('\n💡 下一步: 在 Cloudflare Dashboard 檢查檔案，並設定 Bucket 公開訪問。');
    
  } catch (error) {
    console.error('\n💥 執行過程中發生致命錯誤:', error);
    process.exit(1);
  }
}

// 執行主函數
main();