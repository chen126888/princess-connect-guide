import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// 基本中間件
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 角色列表
app.get('/api/characters', async (req, res) => {
  try {
    console.log('🔍 API called - checking database...');
    
    const { 位置, 屬性, 競技場進攻, 競技場防守, 戰隊戰等抄作業場合, page = 1, limit = 100 } = req.query;
    
    const where: any = {};
    if (位置) where.位置 = 位置;
    if (屬性) where.屬性 = 屬性;
    if (競技場進攻) where.競技場進攻 = 競技場進攻;
    if (競技場防守) where.競技場防守 = 競技場防守;
    if (戰隊戰等抄作業場合) where.戰隊戰等抄作業場合 = 戰隊戰等抄作業場合;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [characters, total] = await Promise.all([
      prisma.character.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { 角色名稱: 'asc' }
      }),
      prisma.character.count({ where })
    ]);
    
    console.log('📊 Query result sample:', characters[0]);
    console.log('📊 Total characters:', total);
    
    res.json({
      data: characters,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// 錯誤處理
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});