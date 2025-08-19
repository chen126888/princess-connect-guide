# 部署指南

本文檔說明如何將公主連結攻略網站部署到生產環境。

## 架構概覽

- **前端**: Netlify
- **後端**: Render  
- **資料庫**: SQLite (隨後端部署)
- **圖片儲存**: 目前使用後端靜態服務，未來可整合 Cloudflare R2

## 部署步驟

### 1. 後端部署 (Render)

#### 準備工作
1. 推送代碼到 GitHub
2. 在 Render 創建新的 Web Service
3. 連接 GitHub repository

#### 環境變數設定
在 Render Dashboard 設定以下環境變數：

```bash
# 必要設定
NODE_ENV=production
PORT=10000
JWT_SECRET=d41f509e0e37fa9c9d21bd29e38074a50eaebf488abdf9a2ae1f658e36636c38

# CORS 設定（替換為你的實際域名）
CORS_ORIGINS=https://your-frontend-domain.netlify.app,https://your-custom-domain.com

# 資料庫
DATABASE_URL=file:./prisma/database.db

# 圖片基礎URL（替換為你的後端域名）
IMAGES_BASE_URL=https://your-backend-domain.onrender.com/images
```

#### Build & Deploy 設定
```bash
# Build Command
npm run build

# Start Command  
npm run start:prod

# Root Directory
backend
```

### 2. 前端部署 (Netlify)

#### 準備工作
1. 在 Netlify 創建新站點
2. 連接 GitHub repository

#### 環境變數設定
在 Netlify Site Settings > Environment variables 設定：

```bash
# API 基礎URL（替換為你的後端域名）
VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api

# 圖片基礎URL
VITE_IMAGES_BASE_URL=https://your-backend-domain.onrender.com/images
```

#### Build 設定
```bash
# Build Command
npm run build

# Publish Directory
dist

# Base Directory
frontend
```

## 安全性檢查清單

### JWT 配置
- [ ] 使用強隨機密鑰（32+ 字符）
- [ ] 不要將 JWT_SECRET 提交到版本控制
- [ ] 定期輪換密鑰

### CORS 配置
- [ ] 設定正確的前端域名
- [ ] 移除開發環境域名
- [ ] 啟用 credentials: true

### 環境變數
- [ ] 所有敏感資訊使用環境變數
- [ ] 檢查 .env.example 但不提交實際 .env
- [ ] 確認生產環境變數設定正確

## 部署後驗證

### 後端驗證
1. 訪問健康檢查端點: `https://your-backend-domain.onrender.com/api/health`
2. 檢查回應包含正確的環境資訊
3. 測試API端點功能

### 前端驗證  
1. 訪問部署的網站
2. 測試登入功能
3. 確認API調用正常
4. 檢查圖片載入

### 完整功能測試
- [ ] 管理員登入
- [ ] 角色CRUD操作
- [ ] 圖片上傳
- [ ] 拖拽評級功能
- [ ] 各攻略頁面

## 故障排除

### 常見問題

**CORS 錯誤**
- 檢查 CORS_ORIGINS 環境變數
- 確認域名格式正確（包含 https://）

**API 調用失敗**
- 檢查 VITE_API_BASE_URL 設定
- 確認後端服務正常運行

**JWT 錯誤**
- 檢查 JWT_SECRET 是否設定
- 確認密鑰長度足夠

**圖片無法載入**
- 檢查靜態檔案路徑
- 確認 IMAGES_BASE_URL 設定

### 日誌檢查
- Render: Dashboard > Logs
- Netlify: Site > Functions > View logs

## 資料庫遷移

SQLite 資料庫會隨代碼一起部署。如果需要更新資料庫結構：

1. 在本地測試 Prisma 遷移
2. 提交更新的 schema.prisma
3. 重新部署

## 監控和維護

### 建議監控項目
- 服務可用性
- API 回應時間
- 錯誤率
- 資料庫連接狀態

### 定期維護
- 更新依賴套件
- 輪換 JWT 密鑰
- 備份資料庫
- 檢查安全性更新

---

## 未來增強

### Cloudflare R2 整合
當準備好時，可以將圖片遷移到 Cloudflare R2：

1. 創建 R2 bucket
2. 配置 API token
3. 更新圖片上傳邏輯
4. 批次遷移現有圖片
5. 更新前端圖片URL

### CDN 配置
- 設定 Cloudflare CDN
- 優化靜態資源快取
- 啟用壓縮

### 監控整合
- 整合 Sentry 錯誤追蹤
- 設定 Uptime 監控
- 配置告警通知