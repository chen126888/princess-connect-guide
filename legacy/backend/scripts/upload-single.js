#!/usr/bin/env node

/**
 * 單一檔案上傳腳本
 * 用法: node scripts/upload-single.js <本地檔案路徑> <R2上的目標路徑>
 * 範例: node scripts/upload-single.js "C:\Downloads\new_char.png" "characters/new_char.png"
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

// --- 從 .env 讀取配置 ---
const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env;

// --- S3 Client 初始化 ---
let S3;
try {
  S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
} catch (error) {
  console.error('❌ S3 Client 初始化失敗:', error.message);
  process.exit(1);
}

/**
 * 主函數
 */
async function main() {
  console.log('🚀 啟動單一檔案上傳工具...');

  // 1. 解析指令行參數
  const localPath = process.argv[2];
  const remotePath = process.argv[3];

  if (!localPath || !remotePath) {
    console.error('\n❌ 錯誤：缺少必要的參數！');
    console.error('用法: node scripts/upload-single.js <本地檔案路徑> <R2上的目標路徑>');
    console.error('範例: node scripts/upload-single.js "C:\\Users\\User\\Desktop\\image.png" "characters/image.png"');
    process.exit(1);
  }

  // 2. 檢查本地檔案是否存在
  if (!fs.existsSync(localPath)) {
    console.error(`\n❌ 錯誤：本地檔案不存在於 '${localPath}'`);
    process.exit(1);
  }

  console.log(`\n📤 準備上傳:`);
  console.log(`   - 從 (本地): ${localPath}`);
  console.log(`   - 到 (R2):   ${R2_BUCKET_NAME}/${remotePath}`);

  try {
    const fileStream = fs.createReadStream(localPath);
    const contentType = mime.lookup(localPath) || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: remotePath,
      Body: fileStream,
      ContentType: contentType,
    });

    console.log('\n...正在上傳...');
    await S3.send(command);

    const finalUrl = `${R2_PUBLIC_URL}/${remotePath}`;

    console.log('\n🎉 上傳成功！');
    console.log(`✅ 檔案已上傳至 R2。`);
    console.log(`🌐 公開網址: ${finalUrl}`);

  } catch (error) {
    console.error('\n💥 上傳過程中發生錯誤！');
    console.error('   詳細資訊:', error);
    process.exit(1);
  }
}

// 執行主函數
main();