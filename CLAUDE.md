# 公主連結攻略網站開發指南

## 專案概述
- **目標**: 建立公主連結遊戲攻略網站
- **技術棧**: React + TypeScript + Tailwind CSS (前端), Node.js + Express + SQLite (後端)
- **目前階段**: 角色圖鑑、商店系統、競技場頁面已完成，正在開發拖拽評級系統
- **開發環境**: Ubuntu 22.04 LTS, VS Code, Claude Code

## 專案結構
```
princess-connect-guide/
├── frontend/                    # React 前端應用
│   ├── public/
│   ├── src/
│   │   ├── components/         # 可複用 UI 元件
│   │   │   ├── Character/      # 角色相關元件
│   │   │   │   ├── CharacterImageCard.tsx
│   │   │   │   ├── CharacterInfoCard.tsx
│   │   │   │   ├── CharacterSearch.tsx
│   │   │   │   ├── CharacterSortControls.tsx
│   │   │   │   └── CharacterTierGroup.tsx
│   │   │   ├── CharacterEditor/ # 角色編輯相關元件
│   │   │   │   ├── EditModeSelector.tsx
│   │   │   │   ├── DragRatingSystem/ # 🚧 開發中
│   │   │   │   │   ├── DragRatingSystem.tsx
│   │   │   │   │   ├── RatingCategory.tsx
│   │   │   │   │   ├── RatingTierBlock.tsx
│   │   │   │   │   ├── CharacterAvatar.tsx
│   │   │   │   │   └── hooks/
│   │   │   │   │       ├── useDragAndDrop.ts
│   │   │   │   │       └── useRatingData.ts
│   │   │   │   └── modals/     # 編輯用對話框
│   │   │   │       ├── AddCharacterModal.tsx
│   │   │   │       ├── CharacterInfoModal.tsx
│   │   │   │       ├── DeleteConfirmModal.tsx
│   │   │   │       ├── DeleteSearchModal.tsx
│   │   │   │       └── EditCharacterModal.tsx
│   │   │   ├── Arena/          # 競技場頁面元件
│   │   │   │   ├── ArenaNavigation.tsx
│   │   │   │   └── ArenaContent.tsx
│   │   │   ├── Shop/           # 商店頁面元件
│   │   │   └── Common/         # 通用元件
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── FilterButton.tsx
│   │   │       ├── PageContainer.tsx
│   │   │       └── CharacterTooltip.tsx
│   │   ├── hooks/              # 自定義 React Hooks
│   │   │   ├── useCharacterFilters.ts
│   │   │   └── useCharacters.ts
│   │   ├── pages/              # 頁面元件
│   │   │   ├── Characters/     # 角色圖鑑頁面
│   │   │   ├── CharacterEditor/ # 角色編輯頁面
│   │   │   ├── Shop/           # 商店攻略頁面
│   │   │   └── Arena/          # 競技場頁面
│   │   ├── services/           # API 服務
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript 類型定義
│   │   │   ├── index.ts
│   │   │   └── arena.ts
│   │   ├── shopData/           # 商店資料配置
│   │   ├── arenaData/          # 競技場資料配置
│   │   ├── App.tsx             # 主應用 (含導航)
│   │   └── main.tsx
│   ├── tailwind.config.cjs     # Tailwind 配置
│   └── package.json
├── backend/                     # Node.js 後端
│   ├── src/
│   │   ├── routes/             # API 路由
│   │   │   ├── auth.ts         # 認證相關 API
│   │   │   ├── characters.ts   # 角色 CRUD API
│   │   │   └── upload.ts       # 檔案上傳 API
│   │   ├── utils/              # 工具函數
│   │   │   └── database.ts     # 資料庫連接與操作
│   │   └── simple-server.ts    # 主服務器
│   ├── prisma/
│   │   ├── database.db         # SQLite 資料庫
│   │   └── schema.prisma       # 資料庫 schema
│   └── package.json
├── data/
│   ├── images/
│   │   ├── characters/         # 角色圖片資料夾
│   │   ├── shop_icon/          # 商店圖標
│   │   └── data_icon/          # 資料圖標
└── CLAUDE.md                   # 本檔案
```

## 已完成功能

### ✅ 角色圖鑑系統
- **完整的角色資料庫**: 305 個角色資料，含中文欄位名稱
- **精確評級系統**: 拆分為四個獨立評級欄位
  - 競技場進攻評級
  - 競技場防守評級  
  - 戰隊戰評級
  - 深域及抄作業評級
- **多維度篩選系統**:
  - 位置篩選 (前衛、中衛、後衛)
  - 屬性篩選 (火屬、水屬、風屬、光屬、闇屬)
  - 用途篩選 (競技場進攻/防守、戰隊戰、深域及抄作業)
  - 定位篩選 (輸出、破防、補師、增益、妨礙、補TP)
  - 獲得方式篩選 (常駐、限定)
- **智能搜索**: 支援角色名稱和暱稱搜索
- **評級排序**: T0→倉管 或 倉管→T0 排序
- **分組顯示**: 按競技場進攻評級分組展示
- **懸停詳情**: 滑鼠懸停顯示完整角色資訊

### ✅ 商店攻略系統
- **9個商店類型**: 地下城、競技場、戰隊戰、女神的秘石、大師、EX裝備、巡遊商店
- **智能推薦系統**: 基於優先級的角色碎片推薦
- **懸停提示**: 商店名稱懸停顯示貨幣獲取方式
- **詳細說明**: 每個商店的購買建議和注意事項

### ✅ 競技場/試煉/追憶頁面
- **三個功能分類**: 競技場、試煉、追憶
- **導航系統**: 類似商店頁面的分類導航
- **詳細內容**: 每個分類的完整攻略說明

### ✅ 導航系統
- **主導航**: 8 個功能按鈕（新人、回鍋玩家、角色圖鑑、商店攻略、競技場、戰隊戰、深域、角色養成）
- **單頁應用**: 切換頁面無需重新載入
- **已實現頁面**: 角色圖鑑、商店攻略、競技場

### ✅ 角色編輯系統
- **完整 CRUD 操作**: 新增、查看、編輯、刪除角色
- **三種編輯模式**: 完整編輯、評價編輯、補充資料
- **批次搜尋刪除**: 支援按角色名稱搜尋後批次刪除
- **模組化 UI 元件**: 可複用的對話框和表單元件
- **檔案上傳功能**: 支援角色圖片上傳
- **管理員認證**: 基本的登入驗證系統

## 🚧 開發中功能

### 拖拽評級調整系統
**目標**: 提供直觀的拖拽介面來快速調整角色評級，取代繁瑣的逐一點擊編輯

#### 系統設計
- **四個評級分類**: 競技場進攻、競技場防守、戰隊戰、深域及抄作業
- **六個評級區塊**: T0、T1、T2、T3、T4、倉管
- **拖拽操作**: 角色頭像可在不同評級區塊間自由拖拽
- **手動提交**: 批次儲存變更，避免頻繁API呼叫

#### 技術實現計劃

**階段一: 新編輯模式與頁面結構**
1. 擴展 EditMode 類型: `'complete' | 'rating' | 'missing' | 'drag-rating'`
2. 修改 EditModeSelector: 新增「拖拽評級」按鈕
3. 設計響應式布局: 4分類 × 6評級的網格系統

**階段二: 組件架構**
```
DragRatingSystem/
├── DragRatingSystem.tsx          # 主組件：整體布局和狀態管理
├── RatingCategory.tsx             # 單個分類容器（如競技場進攻）
├── RatingTierBlock.tsx            # 單個評級區塊（如T0區塊）
├── CharacterAvatar.tsx            # 可拖拽的角色頭像組件
└── hooks/
    ├── useDragAndDrop.ts          # 拖拽邏輯和狀態管理
    └── useRatingData.ts           # 評級資料處理和API整合
```

**階段三: 拖拽功能實現**
- **技術選擇**: HTML5 Drag & Drop API（原生，輕量級）
- **拖拽流程**:
  1. `onDragStart`: 記錄被拖拽角色和原始評級
  2. `onDragOver`: 驗證放置目標有效性
  3. `onDrop`: 更新本地狀態，記錄變更

**階段四: 手動提交機制**
```typescript
interface DragRatingState {
  originalData: RatingData        // API載入的原始資料
  currentData: RatingData         // 當前編輯狀態
  hasUnsavedChanges: boolean      // 是否有未儲存變更
  pendingChanges: ChangeRecord[]  // 變更記錄
}
```

**操作流程**:
1. 載入所有角色資料到本地狀態
2. 拖拽操作僅更新本地狀態
3. 追蹤所有變更到 pendingChanges
4. 提供「儲存變更」按鈕進行批次提交
5. 成功後同步原始資料，失敗時保持編輯狀態

**階段五: UI/UX 優化**
- **視覺設計**: 分類區域明確分隔，評級區塊顏色區分
- **拖拽反饋**: 
  - 拖拽時半透明效果
  - 有效放置區域高亮
  - 無效區域禁用圖標
- **變更提示**: 未儲存角色加上視覺標記
- **響應式設計**: 桌面4列、平板2列、手機1列

**階段六: 效能優化**
- **大資料處理**: 虛擬化滾動（如有需要）
- **記憶化**: React.memo 防止不必要重渲染
- **批次API**: 設計批次更新端點減少網路請求

#### API 設計
**選項A: 現有API多次呼叫**
```typescript
const saveChanges = async () => {
  await Promise.allSettled(
    pendingChanges.map(change => 
      api.put(`/characters/${change.characterId}`, {
        [change.field]: change.newValue
      })
    )
  )
}
```

**選項B: 新增批次API（建議）**
```
PUT /api/characters/batch
{
  updates: [
    { id: 'char_123', 戰隊戰: 'T1' },
    { id: 'char_456', 競技場進攻: 'T0' }
  ]
}
```

#### 用戶體驗設計
- **控制按鈕**: 儲存變更(顯示變更數量)、重置變更、取消
- **變更摘要**: 可選顯示待儲存變更列表
- **離開保護**: 未儲存變更時的離開確認
- **快捷鍵**: Ctrl+S 快速儲存
- **錯誤處理**: 部分失敗時的詳細錯誤報告

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
- **資料庫**: SQLite (本地檔案，直接SQL操作)
- **CORS**: 支援前端跨域請求

### 資料庫 Schema
```sql
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  [角色名稱] TEXT UNIQUE NOT NULL,
  [暱稱] TEXT,
  [位置] TEXT NOT NULL,
  [角色定位] TEXT,
  [常駐/限定] TEXT,
  [屬性] TEXT,
  [能力偏向] TEXT,
  [競技場進攻] TEXT,
  [競技場防守] TEXT,
  [戰隊戰] TEXT,
  [深域及抄作業] TEXT,
  [說明] TEXT,
  [頭像檔名] TEXT,
  [六星頭像檔名] TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
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
- `POST /api/characters` - 新增角色
- `PUT /api/characters/:id` - 更新角色資料
- `PUT /api/characters/batch` - 🚧 批次更新角色（開發中）
- `DELETE /api/characters/:id` - 刪除角色
- `POST /api/auth/login` - 管理員登入
- `POST /api/auth/create-admin` - 創建管理員帳號
- `POST /api/upload/character-photo` - 上傳角色圖片

### 篩選參數
- `位置`: 前衛、中衛、後衛
- `屬性`: 火屬、水屬、風屬、光屬、闇屬
- `競技場進攻`: T0、T1、T2、T3、T4、倉管
- `競技場防守`: T0、T1、T2、T3、T4、倉管
- `戰隊戰`: T0、T1、T2、T3、T4、倉管
- `深域及抄作業`: T0、T1、T2、T3、T4、倉管
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
- 戰隊戰攻略
- 深域攻略
- 角色養成指南

## 使用方式
1. 訪問 `http://localhost:5173`
2. 點擊「角色圖鑑」查看角色資料
3. 點擊「商店攻略」查看購買建議
4. 點擊「競技場」查看相關攻略
5. 角色編輯器提供完整的角色資料管理功能

---

**最後更新**: 2025年8月3日  
**負責人**: 開發者  
**專案狀態**: 角色圖鑑、商店系統、競技場頁面完成，拖拽評級系統開發中