# 專案概述：公主連結攻略網站

## 專案目標
本專案旨在建立一個全面的《超異域公主連結☆Re:Dive》（Princess Connect! Re:Dive）遊戲攻略網站，提供玩家角色圖鑑、商店攻略、競技場資訊及其他實用工具。

## 技術棧
*   **前端**: React 18 + TypeScript, Vite, Tailwind CSS, Axios, Lucide React
*   **後端**: Node.js + TypeScript, Express.js, SQLite (使用 Prisma ORM 管理), CORS
*   **資料庫**: SQLite (本地檔案 `database.db`)

## 專案架構
專案分為前端和後端兩個主要部分：
*   **`frontend/`**: 負責使用者介面和互動邏輯，透過 API 與後端溝通。
*   **`backend/`**: 提供 RESTful API 服務，處理資料庫操作、認證和檔案上傳。
*   **`data/`**: 存放遊戲相關的圖片資源（角色頭像、商店圖標等）和原始資料（Excel 檔案）。

## 已完成功能

### 1. 角色圖鑑系統
*   **資料庫**: 包含 305 個角色資料，支援中文欄位名稱。
*   **評級系統**: 針對競技場進攻、競技場防守、戰隊戰、深域及抄作業提供四個獨立評級欄位。
*   **多維度篩選**: 支援位置（前衛、中衛、後衛）、屬性（火、水、風、光、闇）、用途、定位（輸出、破防、補師、增益、妨礙、補TP）、獲得方式（常駐、限定）等篩選條件。
*   **智能搜索**: 可依角色名稱和暱稱進行搜索。
*   **排序與顯示**: 支援評級排序（T0↔倉管），並按競技場進攻評級分組顯示。
*   **懸停詳情**: 滑鼠懸停顯示完整角色資訊。

### 2. 商店攻略系統
*   **商店類型**: 涵蓋地下城、競技場、戰隊戰、女神的秘石、大師、EX裝備、巡遊商店等 9 種商店。
*   **智能推薦**: 基於優先級的角色碎片購買推薦。
*   **互動提示**: 商店名稱懸停顯示貨幣獲取方式，並提供詳細購買建議和注意事項。

### 3. 競技場/試煉/追憶頁面
*   提供競技場、試煉、追憶三個功能分類的攻略內容。
*   具備類似商店頁面的分類導航系統。
*   **詳細攻略內容**: 每個分類都提供了完整的攻略說明，特別是競技場部分，包含了**詳細的常用角色推薦和新手推薦隊伍配置，並能視覺化顯示推薦角色頭像，支援角色替代選項（例如「角色A 或 角色B」）**。試煉和追憶部分則提供了各類型的攻略要點和獎勵說明。

### 4. 導航系統
*   主導航包含 8 個功能按鈕（新人、回鍋玩家、角色圖鑑、商店攻略、競技場、戰隊戰、深域、角色養成）。
*   採用單頁應用（SPA）模式，頁面切換無需重新載入。
*   目前已實現「角色圖鑑」、「商店攻略」、「競技場」頁面。

### 5. 角色編輯系統 (管理員功能)
*   **CRUD 操作**: 提供完整的角色新增、查看、編輯、刪除功能。
*   **編輯模式**: 支援完整編輯、評價編輯、補充資料三種模式。
*   **批次操作**: 可按角色名稱搜索後進行批次刪除。
*   **檔案上傳**: 支援角色圖片上傳。
*   **認證機制**: 具備基本的管理員登入驗證系統。

### 6. 拖拽評級調整系統
此功能提供一個直觀的拖拽介面，讓管理員能快速調整角色在不同評級分類（競技場進攻、競技場防守、戰隊戰、深域及抄作業）中的評級（T0至倉管）。
*   **設計**: 包含四個評級分類和六個評級區塊，角色頭像可在區塊間自由拖拽。
*   **提交機制**: 支援手動批次提交變更，減少 API 呼叫頻率。
*   **技術實現**: 已使用 HTML5 Drag & Drop API，並設計專門的 React 組件（`DragRatingSystem`, `RatingCategory`, `RatingTierBlock`, `CharacterAvatar`）和自定義 Hooks（`useDragAndDrop`, `useRatingData`）來管理拖拽邏輯和資料狀態。
*   **API 支援**: 已新增批次更新 API (`PUT /api/characters/batch`) 以優化效能。
*   **UI/UX 優化**: 包含視覺設計、拖拽反饋、變更提示、響應式設計等。

## 開發中功能

目前沒有正在開發中的功能。

## 資料庫 Schema (`characters` 表)
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

## API 端點 (部分)
*   `GET /api/health`
*   `GET /api/characters` (支援篩選參數)
*   `GET /api/characters/:id`
*   `POST /api/characters`
*   `PUT /api/characters/:id`
*   `PUT /api/characters/batch` (開發中)
*   `DELETE /api/characters/:id`
*   `POST /api/auth/login`
*   `POST /api/auth/create-admin`
*   `POST /api/upload/character-photo`

## 資料來源
*   Excel 檔案: `2025公主連結角色簡略介紹表_converted.xlsx` (用於匯入角色資料)
*   圖片資料夾: `data/images/characters/`, `data/images/shop_icon/`, `data/images/data_icon/`

## 未來開發計畫
*   重新設計並開發其他頁面功能，包括新人指南、回鍋玩家建議、戰隊戰攻略、深域攻略、角色養成指南等。

## 如何啟動專案
1.  **啟動後端服務 (port 3000)**:
    ```bash
    cd backend
    npm install
    npx ts-node src/simple-server.ts
    ```
2.  **啟動前端服務 (port 5173)**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  **訪問網站**: 在瀏覽器中訪問 `http://localhost:5173`。

---
**備註**: 本文件內容主要基於專案中提供的 `CLAUDE.md` 文件整理而成。
