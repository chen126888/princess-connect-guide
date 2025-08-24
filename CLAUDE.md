# 公主連結攻略網站開發指南

## 專案概述
- **目標**: 建立公主連結遊戲攻略網站
- **技術棧**: React + TypeScript + Tailwind CSS (前端), Node.js + Express + PostgreSQL (後端)
- **目前階段**: 所有主要頁面已完成，包含拖拽評級系統、新人指南、戰隊戰、深域、角色養成、回鍋玩家指南等功能，並具備完整的資料庫管理系統
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
│   │   │   │   ├── DragRatingManager.tsx      # ✅ 拖拽評級主管理器
│   │   │   │   ├── DragRatingNavigation.tsx   # ✅ 分類導航
│   │   │   │   ├── SingleCategoryRating.tsx   # ✅ 單分類評級管理
│   │   │   │   └── modals/     # 編輯用對話框
│   │   │   │       ├── AddCharacterModal.tsx
│   │   │   │       ├── CharacterInfoModal.tsx
│   │   │   │       ├── DeleteConfirmModal.tsx
│   │   │   │       ├── DeleteSearchModal.tsx
│   │   │   │       └── EditCharacterModal.tsx
│   │   │   ├── Arena/          # 競技場頁面元件
│   │   │   │   ├── ArenaNavigation.tsx
│   │   │   │   └── ArenaContent.tsx
│   │   │   ├── ClanBattle/     # ✅ 戰隊戰元件
│   │   │   │   ├── AttributeSelector.tsx
│   │   │   │   ├── CommonCharactersSection.tsx
│   │   │   │   ├── CompensationKnifeContentSection.tsx
│   │   │   │   └── YoutubeChannelsSection.tsx
│   │   │   ├── CharacterDevelopment/ # ✅ 角色養成元件
│   │   │   │   ├── CharacterDevelopmentTabs.tsx     # 養成分類標籤頁
│   │   │   │   ├── CharacterDevelopmentDescription.tsx # 養成描述說明
│   │   │   │   ├── PriorityTierSection.tsx         # 優先度分級顯示
│   │   │   │   └── CharacterCard.tsx               # 角色卡片元件
│   │   │   ├── Newbie/         # ✅ 新人指南元件
│   │   │   │   ├── MustRead.tsx
│   │   │   │   ├── ItemOverview.tsx
│   │   │   │   ├── CharacterSystem.tsx
│   │   │   │   └── EventIntro.tsx
│   │   │   ├── ReturnPlayer/   # ✅ 回鍋玩家指南元件
│   │   │   │   ├── CharacterPlanningSection.tsx    # 角色與資源規劃
│   │   │   │   ├── DailyStrategySection.tsx        # 日常與副本攻略
│   │   │   │   └── NewbieBoostSection.tsx          # 同步與屬性
│   │   │   ├── Shop/           # 商店頁面元件
│   │   │   │   ├── ShopNavigation.tsx
│   │   │   │   ├── ShopItemCard.tsx
│   │   │   │   ├── CurrencyIcon.tsx
│   │   │   │   ├── PriorityBadge.tsx
│   │   │   │   ├── ShopTitleTooltip.tsx
│   │   │   │   └── ManualResetButton.tsx
│   │   │   └── Common/         # 通用元件
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── FilterButton.tsx
│   │   │       ├── PageContainer.tsx
│   │   │       ├── CharacterTooltip.tsx
│   │   │       ├── MarkdownText.tsx
│   │   │       ├── UnifiedCharacterCard.tsx     # ✅ 統一角色卡片元件
│   │   │       ├── TabNavigation.tsx            # ✅ 標籤頁導航元件
│   │   │       ├── TeamLineup.tsx               # ✅ 隊伍編成元件
│   │   │       └── CharacterAvatar.tsx          # ✅ 角色頭像元件
│   │   ├── hooks/              # 自定義 React Hooks
│   │   │   ├── useCharacterFilters.ts
│   │   │   ├── useCharacters.ts
│   │   │   ├── useImageErrorHandler.ts
│   │   │   └── useTooltip.ts
│   │   ├── pages/              # 頁面元件
│   │   │   ├── Characters/     # 角色圖鑑頁面
│   │   │   ├── CharacterEditor/ # 角色編輯頁面
│   │   │   ├── Home/           # ✅ 首頁
│   │   │   ├── CharacterDevelopment/ # ✅ 角色養成頁面
│   │   │   ├── Shop/           # 商店攻略頁面
│   │   │   ├── Arena/          # 競技場頁面
│   │   │   ├── ClanBattle/     # ✅ 戰隊戰頁面
│   │   │   ├── Dungeon/        # ✅ 深域頁面
│   │   │   ├── Newbie/         # ✅ 新人指南頁面
│   │   │   └── ReturnPlayer/   # ✅ 回鍋玩家指南頁面
│   │   ├── services/           # API 服務
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript 類型定義
│   │   │   ├── index.ts
│   │   │   ├── arena.ts
│   │   │   └── shop.ts
│   │   ├── shopData/           # 商店資料配置
│   │   ├── arenaData/          # 競技場資料配置
│   │   ├── clanBattleData/     # ✅ 戰隊戰資料配置
│   │   ├── dungeonData/        # ✅ 深域資料配置
│   │   ├── characterDevelopmentData/ # ✅ 角色養成資料配置
│   │   ├── newbieData/         # ✅ 新人指南資料配置
│   │   ├── returnPlayerData/   # ✅ 回鍋玩家指南資料配置
│   │   ├── config/             # ✅ 通用配置
│   │   ├── utils/              # ✅ 工具函數
│   │   ├── App.tsx             # 主應用 (含導航)
│   │   └── main.tsx
│   ├── tailwind.config.cjs     # Tailwind 配置
│   └── package.json
├── backend/                     # Node.js 後端
│   ├── src/
│   │   ├── routes/             # API 路由
│   │   │   ├── auth.ts         # 認證相關 API
│   │   │   ├── characters.ts   # 角色 CRUD API
│   │   │   ├── arenaCommon.ts  # 競技場常用角色 API
│   │   │   ├── trialCharacters.ts # 戰鬥試煉場角色 API
│   │   │   ├── sixstarPriority.ts # 六星優先度 API
│   │   │   ├── ue1Priority.ts  # 專用裝備1優先度 API
│   │   │   ├── ue2Priority.ts  # 專用裝備2優先度 API
│   │   │   ├── nonSixstarCharacters.ts # 非六星角色 API
│   │   │   └── upload.ts       # 檔案上傳 API
│   │   ├── utils/              # 工具函數
│   │   │   └── database.ts     # 資料庫連接與操作
│   │   └── simple-server.ts    # 主服務器
│   ├── prisma/
│   │   ├── migrations/         # 資料庫遷移檔案
│   │   └── schema.prisma       # 資料庫 schema (PostgreSQL)
│   ├── .env                    # 環境變數配置
│   └── package.json
├── data/
│   ├── images/
│   │   ├── characters/         # 角色圖片資料夾 (305+ 角色圖片)
│   │   ├── icons/              # ✅ 各類圖標資源
│   │   │   ├── 商店圖標/       # 商店相關圖標
│   │   │   ├── 道具圖標/       # 各種遊戲道具圖標
│   │   │   └── 屬性圖標/       # 角色屬性圖標
│   │   └── ArenaAndRem/        # ✅ 競技場和追憶相關圖片
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
- **已實現頁面**: 角色圖鑑、商店攻略、競技場、戰隊戰、深域、角色養成、新人指南、回鍋玩家指南

### ✅ 角色編輯系統
- **完整 CRUD 操作**: 新增、查看、編輯、刪除角色
- **四種編輯模式**: 完整編輯、評價編輯、補充資料、拖拽評級
- **批次搜尋刪除**: 支援按角色名稱搜尋後批次刪除
- **模組化 UI 元件**: 可複用的對話框和表單元件
- **檔案上傳功能**: 支援角色圖片上傳
- **管理員認證**: 基本的登入驗證系統

### ✅ 資料庫管理系統
- **六個新增資料表管理**: 
  - 競技場常用角色 (arena_common_characters)
  - 戰鬥試煉場角色 (trial_characters) - 包含推薦練/後期練分類
  - 六星優先度 (sixstar_priority) - SS/S/A/B/C 分級
  - 專用裝備1優先度 (ue1_priority) - SS/S/A/B 分級
  - 專用裝備2優先度 (ue2_priority) - SS/S/A 分級  
  - 非六星角色 (non_sixstar_characters) - 包含描述和取得方式
- **統一管理介面**: 使用 BaseModal 提供一致的管理體驗
- **頂部按鈕設計**: 保存/取消按鈕位於右上角，無需滾動操作
- **即時編輯功能**: 支援新增、修改、刪除資料
- **分類顯示**: 按優先度或類別自動分組顯示
- **批次操作**: 支援資料的批次變更和提交

### ✅ 拖拽評級調整系統
**完整實現**: 提供直觀的拖拽介面來快速調整角色評級，大幅提升管理效率

#### 系統特色
- **四個評級分類**: 競技場進攻、競技場防守、戰隊戰、深域及抄作業
- **六個評級區塊**: T0、T1、T2、T3、T4、倉管
- **屬性篩選**: 支援按火、水、風、光、闇屬性篩選角色
- **拖拽操作**: 角色頭像可在不同評級區塊間自由拖拽
- **批次提交**: 手動批次儲存變更，避免頻繁API呼叫

#### 技術實現
- **組件架構**: 
  - `DragRatingManager.tsx`: 主管理組件
  - `DragRatingNavigation.tsx`: 分類導航
  - `SingleCategoryRating.tsx`: 單分類評級管理
  - `AttributeSelector.tsx`: 屬性篩選器
- **HTML5 Drag & Drop API**: 原生拖拽支援
- **本地狀態管理**: 即時預覽，手動提交
- **批次API**: `PATCH /api/characters/batch-ratings` 端點

#### 用戶體驗
- **視覺反饋**: 拖拽時半透明效果，有效區域高亮
- **變更追蹤**: 顯示待儲存變更數量
- **錯誤處理**: 詳細的錯誤回報機制
- **響應式設計**: 支援各種螢幕尺寸

### ✅ 戰隊戰攻略頁面
- **完整攻略系統**: 戰隊戰簡介、階段建議、等級參考
- **YouTube 頻道推薦**: 精選戰隊戰攻略頻道
- **角色推薦系統**: 
  - 按屬性分類 (火、水、風、光、闇)
  - 按傷害類型分類 (物理、法術)
  - 角色重要性分級 (核心、重要、普通)
- **補償刀專區**: 專門的補償刀角色推薦
- **視覺化角色頭像**: 整合角色圖片展示

### ✅ 深域攻略頁面  
- **深域系統介紹**: 完整的深域機制說明
- **強化系統詳解**: 
  - 屬性等級系統
  - 屬性等級節點
  - 大師技能
  - 職階專精
- **道具圖示整合**: 各種強化道具的視覺化展示
- **外部資源連結**: 提供詳細的Excel攻略連結

### ✅ 角色養成指南
- **四大養成分類**: 六星、專用裝備1、專用裝備2、非六星
- **優先度系統**: S級、A級、B級、C級分級推薦
- **非六星角色推薦**: 9個常用非六星角色的詳細說明
  - 碧(工作服/插班生)、魔霞、優妮(聖學祭)、霞(夏日)
  - 七七香(夏日)、空花(大江戶)、香織(夏日)、真步(灰姑娘)
  - 優先度指導: 開專>升五星的養成策略
- **角色搜尋**: 支援角色名稱搜尋功能
- **詳細養成資訊**: 每個角色的養成建議和重要性說明
- **圖片整合**: 角色頭像和六星頭像展示，非六星角色左圖右文顯示
- **懸停提示**: 完整角色資訊展示

### ✅ 新人指南系統
- **四大指南分類**: 
  - 新人必看: 基礎遊戲概念和建議
  - 道具總覽: 各種遊戲道具說明
  - 角色系統: 角色養成相關介紹  
  - 活動介紹: 各類活動機制說明
- **分頁導航**: 清晰的標籤頁切換
- **豐富內容**: 詳細的文字說明和建議
- **視覺化展示**: 整合相關圖示和說明

### ✅ 回鍋玩家指南系統
- **三大指南分類**:
  - 養成與抽角: 角色培養和抽卡策略
  - 同步與屬性: 等級同步和屬性強化
  - 日常與副本攻略: 日常任務和副本推進
- **角色與資源規劃**:
  - 六星角色確認和養成建議
  - 非六星常用角色刷取策略
  - 善用未來視抽角規劃
  - 跟隨加倍活動資源優化
- **專業建議**: 針對回鍋玩家的具體情況提供建議
- **優先度指導**: 清晰的養成和資源分配優先順序

## 🚧 進行中的開發

### 戰隊戰管理系統 (開發中)
- **戰隊戰常用角色表**: 
  - 角色名稱、屬性(火水風光闇)、傷害類型(物理/法術)、重要程度(核心/重要/普通)
- **戰隊戰補償刀角色表**: 
  - 專門管理補償刀角色名單
- **管理員編輯介面**: 可手動編輯戰隊戰角色推薦名單
- **前端整合**: 與現有戰隊戰頁面整合顯示

## 🚧 未來優化計劃

### 效能優化
- **虛擬化滾動**: 處理大量角色資料時的效能提升
- **圖片懶載入**: 減少初始載入時間
- **API 快取**: 減少重複網路請求

### 功能增強
- **角色比較功能**: 並排比較多個角色數據
- **個人化設定**: 使用者偏好設定儲存
- **匯出功能**: 支援將資料匯出為各種格式

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
- **資料庫**: PostgreSQL (使用 Prisma ORM)
- **ORM**: Prisma Client
- **認證**: JWT + bcrypt 密碼雜湊
- **CORS**: 支援前端跨域請求

### 資料庫 Schema (PostgreSQL + Prisma)
```prisma
// 主要角色表
model Character {
  id          String @id
  name        String @unique @map("角色名稱")
  nickname    String? @map("暱稱")
  position    String @map("位置")
  role        String? @map("角色定位")
  rarity      String? @map("常駐/限定")
  element     String? @map("屬性")
  ability     String? @map("能力偏向")
  arena_atk   String? @map("競技場進攻")
  arena_def   String? @map("競技場防守")
  clan_battle String? @map("戰隊戰")
  dungeon     String? @map("深域及抄作業")
  description String? @map("說明")
  avatar      String? @map("頭像檔名")
  avatar_6    String? @map("六星頭像檔名")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@map("characters")
}

// 新增資料表
model ArenaCommonCharacter { ... }        // 競技場常用角色
model TrialCharacter { ... }               // 戰鬥試煉場角色
model SixstarPriority { ... }              // 六星優先度
model Ue1Priority { ... }                  // 專用裝備1優先度  
model Ue2Priority { ... }                  // 專用裝備2優先度
model NonSixstarCharacter { ... }          // 非六星角色

// 開發中
model ClanBattleCommonCharacter { ... }    // 戰隊戰常用角色
model ClanBattleCompensationCharacter { ... } // 戰隊戰補償刀角色
```

## 開發環境設定

### 環境變數設定
```bash
# backend/.env
DATABASE_URL="postgresql://username:password@localhost:5432/princess_connect_db"
JWT_SECRET="your-jwt-secret-key"
```

### 啟動服務
```bash
# 後端服務 (port 3000)
cd backend
npm install
npx prisma generate          # 生成 Prisma Client
npx prisma migrate dev       # 執行資料庫遷移
npx ts-node src/simple-server.ts

# 前端服務 (port 5173)
cd frontend
npm install
npm run dev
```

### API 端點

#### 角色管理
- `GET /api/characters` - 獲取角色列表 (支援篩選參數)
- `GET /api/characters/:id` - 獲取單一角色
- `POST /api/characters` - 新增角色
- `PUT /api/characters/:id` - 更新角色資料
- `PATCH /api/characters/batch-ratings` - 批次更新角色評級
- `DELETE /api/characters/:id` - 刪除角色

#### 認證系統
- `POST /api/auth/login` - 管理員登入
- `GET /api/auth/check-init` - 檢查是否需要初始化
- `POST /api/auth/init-superadmin` - 初始化超級管理員
- `POST /api/auth/create-admin` - 創建管理員帳號
- `GET /api/auth/me` - 獲取目前登入管理員資訊

#### 新增資料表管理
- `GET /api/arena-common` - 競技場常用角色
- `GET /api/trial-characters` - 戰鬥試煉場角色
- `GET /api/sixstar-priority` - 六星優先度
- `GET /api/ue1-priority` - 專用裝備1優先度
- `GET /api/ue2-priority` - 專用裝備2優先度
- `GET /api/non-sixstar-characters` - 非六星角色
- (各表支援 POST/PUT/DELETE 操作)

#### 檔案上傳
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
- 角色圖片: `data/images/characters/`
- 圖標資源: `data/images/icons/`

## 核心功能完成度

✅ **已完成的主要功能**:
- 角色圖鑑系統 (完整)
- 商店攻略系統 (完整)
- 競技場/試煉/追憶 (完整)
- 戰隊戰攻略 (完整)
- 深域攻略 (完整)
- 角色養成指南 (完整，含非六星角色)
- 新人指南 (完整)
- 回鍋玩家指南 (完整)
- 角色編輯系統 (完整，含拖拽評級)
- 資料庫管理系統 (完整，六個新增資料表)

🚧 **開發中功能**:
- 戰隊戰管理系統 (Schema 設計完成，待實作 API 和前端)

## 使用方式
1. 訪問 `http://localhost:5173`
2. 點擊「角色圖鑑」查看角色資料
3. 點擊「商店攻略」查看購買建議
4. 點擊「競技場」查看相關攻略
5. 角色編輯器提供完整的角色資料管理功能

---

**最後更新**: 2025年8月24日  
**負責人**: 開發者  
**專案狀態**: 所有主要功能已完成，包含完整的角色管理、攻略系統、拖拽評級、新人指南、回鍋玩家指南、非六星角色養成、六個新增資料表管理系統等全方位功能。目前正在開發戰隊戰管理系統，預計新增可編輯的戰隊戰常用角色和補償刀角色管理功能。