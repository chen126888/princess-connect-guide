import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import characterRoutes from './routes/characters';
import uploadRoutes from './routes/upload';
import guidesRoutes from './routes/guides';

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const prisma = new PrismaClient();

// 安全性中間件
if (NODE_ENV === 'production') {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
}

// 日誌中間件
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS 設定
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://127.0.0.1:5173'
    ];

console.log('🌐 CORS Origins:', corsOrigins);

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 圖片服務 - 使用本地檔案 (本地測試環境)
console.log('📁 Using local image files for development');
app.use('/images', express.static(path.join(__dirname, '../../data/images')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/guides', guidesRoutes);

// 健康檢查端點
app.get('/api/health', async (req, res) => {
  try {
    // 檢查資料庫連接
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: '1.0.0',
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      version: '1.0.0',
      database: 'disconnected',
      uptime: process.uptime(),
      error: 'Database connection failed'
    });
  }
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    name: 'Princess Connect Guide API',
    version: '1.0.0',
    environment: NODE_ENV,
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      characters: '/api/characters',
      upload: '/api/upload'
    }
  });
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