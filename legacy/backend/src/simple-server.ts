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
import clanBattlesRoutes from './routes/clanBattles';
import arenaCommonRoutes from './routes/arenaCommon';
import trialCharactersRoutes from './routes/trialCharacters';
import sixstarPriorityRoutes from './routes/sixstarPriority';
import ue1PriorityRoutes from './routes/ue1Priority';
import ue2PriorityRoutes from './routes/ue2Priority';
import nonSixstarCharactersRoutes from './routes/nonSixstarCharacters';
import clanBattleCommonRoutes from './routes/clanBattleCommon';
import clanBattleCompensationRoutes from './routes/clanBattleCompensation';
import futurePredictionsRoutes from './routes/futurePredictions';
import abyssRaidsRoutes from './routes/abyssRaids';

// 載入環境變數 - 根據 NODE_ENV 選擇配置檔案
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  // 生產環境使用 Render 的環境變數，不需要 .env 檔案
  console.log('🚀 Production mode: Using Render environment variables');
}

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

// CORS 設定 (修正版)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']; // 如果沒有環境變數，預設只允許本地開發

console.log('🔧 NODE_ENV:', NODE_ENV);
console.log('🌐 Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // 允許 'null' origin 的請求 (例如 server-to-server, curl, mobile apps)
    // 或 請求的 origin 在我們的白名單中
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // 如果 origin 不在白名單中，則拒絕請求
      callback(new Error('This origin is not allowed by CORS'));
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
app.use('/api/clan-battles', clanBattlesRoutes);
app.use('/api/arena-common', arenaCommonRoutes);
app.use('/api/trial-characters', trialCharactersRoutes);
app.use('/api/sixstar-priority', sixstarPriorityRoutes);
app.use('/api/ue1-priority', ue1PriorityRoutes);
app.use('/api/ue2-priority', ue2PriorityRoutes);
app.use('/api/non-sixstar-characters', nonSixstarCharactersRoutes);
app.use('/api/clan-battle-common', clanBattleCommonRoutes);
app.use('/api/clan-battle-compensation', clanBattleCompensationRoutes);
app.use('/api/future-predictions', futurePredictionsRoutes);
app.use('/api/abyss-raids', abyssRaidsRoutes);

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
      upload: '/api/upload',
      clanBattles: '/api/clan-battles',
      arenaCommon: '/api/arena-common',
      trialCharacters: '/api/trial-characters',
      sixstarPriority: '/api/sixstar-priority',
      ue1Priority: '/api/ue1-priority',
      ue2Priority: '/api/ue2-priority',
      nonSixstarCharacters: '/api/non-sixstar-characters',
      futurePredictions: '/api/future-predictions'
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