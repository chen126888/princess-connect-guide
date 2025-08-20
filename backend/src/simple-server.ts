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
  : NODE_ENV === 'production'
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173']  // 生產環境也允許本地開發
    : [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175',
        'http://127.0.0.1:5173'
      ];

console.log('🌐 CORS Origins:', corsOrigins);
console.log('🔧 NODE_ENV:', NODE_ENV);

app.use(cors({
  origin: function (origin, callback) {
    // 允許沒有 origin 的請求 (例如 mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (NODE_ENV === 'production') {
      // 生產環境允許所有 localhost 和一些常見的開發端口
      if (origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') ||
          corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      // 也可以允許所有來源 (不安全但方便測試)
      return callback(null, true);
    } else {
      // 開發環境檢查白名單
      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 圖片服務 - 環境變數控制
if (NODE_ENV === 'development') {
  console.log('📁 Using local image files for development');
  app.use('/images', express.static(path.join(__dirname, '../../data/images')));
} else {
  // 生產環境：重導向到 R2
  const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
  if (R2_PUBLIC_URL) {
    console.log('🔗 Using R2 redirect for production');
    app.use('/images', (req, res, next) => {
      const r2Url = `${R2_PUBLIC_URL}${req.path}`;
      console.log(`🔗 Redirecting ${req.path} to ${r2Url}`);
      res.redirect(301, r2Url);
    });
  } else {
    console.log('❌ Production environment but R2_PUBLIC_URL not configured');
    app.use('/images', (req, res, next) => {
      res.status(404).json({ error: 'Image service not configured for production' });
    });
  }
}

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