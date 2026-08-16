/**
 * 推送 Prisma schema 到生產環境資料庫
 */

import { execSync } from 'child_process';

function pushSchemaToProduction() {
  try {
    console.log('🚀 開始推送 Prisma schema 到生產環境...');
    
    // 設定資料庫 URL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL 環境變數未設定');
    }
    
    console.log('🔗 使用資料庫 URL:', dbUrl.replace(/:[^:@]*@/, ':***@'));
    
    // 生成 Prisma Client
    console.log('⚙️  生成 Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // 推送 schema 到資料庫
    console.log('📤 推送 schema 到資料庫...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Schema 推送完成！');
    
  } catch (error) {
    console.error('💥 推送過程發生錯誤:', error);
    process.exit(1);
  }
}

// 執行推送
pushSchemaToProduction();