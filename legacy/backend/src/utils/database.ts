import { PrismaClient } from '@prisma/client';

// Prisma 客戶端
export const prisma = new PrismaClient();

// 初始化連接並記錄
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('❌ Error connecting to database:', err);
  });

// Promise 包裝器 - 保持相同的 API 介面
export const dbGet = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const result = await prisma.$queryRawUnsafe(sql, ...params);
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    throw error;
  }
};

export const dbAll = async (sql: string, params: any[] = []): Promise<any[]> => {
  try {
    const result = await prisma.$queryRawUnsafe(sql, ...params);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    throw error;
  }
};

export const dbRun = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const result = await prisma.$executeRawUnsafe(sql, ...params);
    return { changes: result };
  } catch (error) {
    throw error;
  }
};

// 關閉資料庫連接
export const closeDatabase = async () => {
  await prisma.$disconnect();
};