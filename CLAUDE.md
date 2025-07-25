# 公主連結攻略網站開發指南

## 專案概述
- **目標**: 建立公主連結遊戲攻略網站（專注於角色圖鑑功能）
- **技術棧**: React + TypeScript + Tailwind CSS (前端), Node.js + Express + SQLite (後端)
- **目前階段**: 角色圖鑑功能已完成
- **開發環境**: Ubuntu 22.04 LTS, VS Code, Claude Code

## 專案結構
```
princess-connect-guide/
├── frontend/                    # React 前端應用
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Characters/     # 角色圖鑑頁面
│   │   ├── types/              # TypeScript 類型定義
│   │   ├── services/           # API 服務 (角色相關)
│   │   └── App.tsx             # 主應用 (含導航)
│   ├── tailwind.config.cjs     # Tailwind 配置
│   └── package.json
├── backend/                     # Node.js 後端
│   ├── src/
│   │   ├── routes/
│   │   │   └── characters.ts   # 角色 API 路由
│   │   └── simple-server.ts    # 主服務器
│   ├── prisma/
│   │   ├── database.db         # SQLite 資料庫
│   │   └── schema.prisma       # 資料庫 schema
│   └── package.json
├── data/
│   └── images/
│       └── characters/         # 角色圖片資料夾
└── CLAUDE.md                   # 本檔案
```

## 已完成功能

### ✅ 角色圖鑑系統
- **完整的角色資料庫**: 300 個角色資料，含中文欄位名稱
- **多維度篩選系統**:
  - 位置篩選 (前衛、中衛、後衛)
  - 屬性篩選 (火屬、水屬、風屬、光屬、闇屬)
  - 用途篩選 (競技場進攻/防守、戰隊戰)
  - 定位篩選 (輸出、破防、補師、增益、妨礙、補TP)
  - 獲得方式篩選 (常駐、限定)
- **智能搜索**: 支援角色名稱和暱稱搜索
- **評級排序**: T0→倉管 或 倉管→T0 排序
- **分組顯示**: 按競技場進攻評級分組展示
- **懸停詳情**: 滑鼠懸停顯示完整角色資訊

### ✅ 導航系統
- **主導航**: 8 個功能按鈕（新人、回鍋玩家、角色圖鑑、商店攻略、競技場、戰隊戰、深域、角色養成）
- **單頁應用**: 切換頁面無需重新載入
- **開發中頁面**: 除角色圖鑑外其他頁面顯示開發中狀態

## 技術實現

### 前端技術棧
- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **HTTP 客戶端**: Axios
- **圖標**: Lucide React
- **UI 設計**: 圓形 checkbox, 漸層背景, 懸停效果

### 後端技術棧
- **執行環境**: Node.js + TypeScript
- **框架**: Express.js
- **資料庫**: SQLite (本地檔案)
- **ORM**: Prisma
- **CORS**: 支援前端跨域請求

### 資料庫 Schema
```prisma
model Character {
  id          String   @id @default(cuid())
  角色名稱      String   @unique
  暱稱         String?
  位置         String   // 前衛、中衛、後衛
  角色定位      String?
  常駐限定      String?  @map("常駐/限定")
  屬性         String?
  能力偏向      String?
  競技場進攻    String?
  競技場防守    String?
  戰隊戰等抄作業場合 String?
  說明         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@map("characters")
}
```

## 開發環境設定

### 啟動服務
```bash
# 後端服務 (port 3000)
cd backend
npm install
npx ts-node src/simple-server.ts

# 前端服務 (port 5173)
cd frontend
npm install
npm run dev
```

### API 端點
- `GET /api/health` - 健康檢查
- `GET /api/characters` - 獲取角色列表 (支援篩選參數)
- `GET /api/characters/:id` - 獲取單一角色

### 篩選參數
- `位置`: 前衛、中衛、後衛
- `屬性`: 火屬、水屬、風屬、光屬、闇屬
- `競技場進攻`: T0、T1、T2、T3、T4、倉管
- `競技場防守`: T0、T1、T2、T3、T4、倉管
- `戰隊戰等抄作業場合`: 戰隊戰相關評級
- `page`: 頁數 (預設 1)
- `limit`: 每頁數量 (預設 100)

## 資料來源
- Excel 檔案: `2025公主連結角色簡略介紹表_converted.xlsx`
- 工作表: 前衛、中衛、後衛角色資料
- 圖片資料夾: `data/images/characters/`

## 未來開發計畫
其他頁面功能將重新設計開發：
- 新人指南
- 回鍋玩家建議
- 商店攻略
- 競技場攻略
- 戰隊戰攻略
- 深域攻略
- 角色養成指南

## 使用方式
1. 訪問 `http://localhost:5173`
2. 點擊「角色圖鑑」按鈕
3. 使用左側搜索框和排序選項
4. 使用右側格子內的圓形 checkbox 進行多維度篩選
5. 將滑鼠懸停在角色圖片上查看詳細資訊
6. 結果按評級分組顯示

---

**最後更新**: 2025年7月25日
**負責人**: 開發者
**專案狀態**: 角色圖鑑功能完成，其他功能待開發