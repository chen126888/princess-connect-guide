# 專案架構概覽：公主連結攻略網站

## 1. 系統總覽

本專案旨在建立一個功能豐富的《超異域公主連結☆Re:Dive》遊戲攻略網站。它採用前後端分離的架構，前端負責使用者介面與互動，後端提供資料服務與業務邏輯。

## 2. 技術棧

*   **前端**: React 18 + TypeScript, Vite (建置工具), Tailwind CSS (樣式), Axios (HTTP 客戶端)。
*   **後端**: Node.js + TypeScript, Express.js (Web 框架), SQLite (輕量級資料庫), Prisma (ORM)。
*   **資料庫**: SQLite (本地檔案 `database.db`)。
*   **圖片服務**: 後端 Express 伺服器負責靜態圖片檔案的提供。

## 3. 系統架構圖

```
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|     前端 (React)    |       |     後端 (Node.js)    |       |     資料庫 (SQLite)   |
|                   |       |                   |       |                   |
| - 頁面/組件         | <-----> | - RESTful API       | <-----> | - 角色資料          |
| - 狀態管理          |       | - 認證/授權         |       | - 管理員資料        |
| - 路由              |       | - 檔案上傳          |       |                   |
| - 樣式 (Tailwind)   |       | - 靜態檔案服務        |       |                   |
+-------------------+       +-------------------+       +-------------------+
          ^                           ^
          |                           |
          |                           |
          +---------------------------+
                圖片檔案 (data/images)
```

## 4. 關鍵資料流

### 4.1 角色資料獲取與顯示

1.  **前端請求**: 使用者訪問「角色圖鑑」頁面 (`/characters`) 或「戰隊戰」頁面 (`/clanBattle`)。
2.  **API 呼叫**: 前端透過 Axios 向後端發送 `GET /api/characters` 請求，可包含篩選參數。
3.  **後端處理**:
    *   Express 路由接收請求。
    *   使用 Prisma 從 SQLite 資料庫查詢角色資料。
    *   將查詢結果以 JSON 格式返回給前端。
4.  **前端渲染**:
    *   前端接收角色資料。
    *   根據篩選、排序和分組邏輯處理資料。
    *   使用 `CharacterImageCard` 等組件渲染角色頭像和資訊。
    *   對於戰隊戰頁面，會根據屬性、物理/法術類型和分級顯示角色。

### 4.2 管理員操作 (角色編輯)

1.  **管理員登入**: 管理員在前端輸入帳號密碼，發送 `POST /api/auth/login` 請求至後端進行驗證。
2.  **後端驗證**: 後端驗證憑證，成功則返回成功狀態。
3.  **前端啟用管理員模式**: 登入成功後，前端啟用管理員模式，顯示「角色編輯」頁面入口。
4.  **角色 CRUD 操作**: 
    *   **新增**: 管理員在前端填寫角色資料，發送 `POST /api/characters` 請求。若包含圖片，則先發送 `POST /api/upload/character-photo` 上傳圖片。
    *   **編輯**: 管理員修改角色資料，發送 `PUT /api/characters/:id` 請求。
    *   **刪除**: 管理員選擇角色，發送 `DELETE /api/characters/:id` 請求。
    *   **批次更新**: (開發中) 預計發送 `PUT /api/characters/batch` 請求。
5.  **後端處理**: 後端接收請求，使用 Prisma 對資料庫進行相應的增、刪、改操作。

### 4.3 圖片服務

*   **圖片儲存**: 角色圖片、商店圖標、屬性圖標等靜態資源儲存在 `data/images/` 目錄下。
*   **後端提供**: 後端 Express 伺服器配置為靜態檔案服務，將 `data/images` 目錄映射到 `/images` 路徑。
*   **前端引用**: 前端組件直接透過 `http://localhost:3000/images/...` 的 URL 引用這些圖片。

## 5. 模組結構與職責

*   **`frontend/`**: React 應用程式的根目錄。
    *   `pages/`: 各個主要頁面組件 (e.g., `Characters.tsx`, `ClanBattle.tsx`, `Dungeon.tsx`)。
    *   `components/`: 可複用 UI 組件 (e.g., `Card.tsx`, `CharacterImageCard.tsx`, `AttributeSelector.tsx`)。
    *   `services/`: 封裝與後端 API 互動的邏輯 (e.g., `api.ts`)。
    *   `hooks/`: 自定義 React Hooks (e.g., `useCharacters.ts`)。
    *   `types/`: TypeScript 類型定義。
    *   `clanBattleData/`, `dungeonData/`, `shopData/`, `arenaData/`: 各功能模組的靜態配置資料。
*   **`backend/`**: Node.js Express 應用程式的根目錄。
    *   `src/routes/`: 定義各 API 端點的路由處理邏輯 (e.g., `characters.ts`, `auth.ts`, `upload.ts`)。
    *   `src/utils/`: 工具函數和模組 (e.g., `database.ts`)。
    *   `prisma/`: Prisma ORM 的相關配置和資料庫 schema。
*   **`data/`**: 存放專案使用的原始資料和靜態資源。
    *   `excel/`: 原始 Excel 資料檔案。
    *   `images/`: 各類圖片資源。

### 5.3 關鍵檔案用途

以下列出專案中一些關鍵檔案及其主要用途：

*   **`frontend/src/App.tsx`**: 前端應用程式的根組件，負責設定主要路由、導航邏輯以及管理員模式的切換。
*   **`frontend/src/main.tsx`**: 前端應用程式的入口點，負責將 React 應用程式掛載到 DOM 上。
*   **`frontend/src/pages/`**: 存放各個主要頁面的組件。
    *   **`frontend/src/pages/Characters/Characters.tsx`**: 角色圖鑑頁面，顯示所有角色資料並提供篩選、排序功能。
    *   **`frontend/src/pages/Shop/Shop.tsx`**: 商店攻略頁面，提供各商店的購買建議。
    *   **`frontend/src/pages/Arena/Arena.tsx`**: 競技場/試煉/追憶頁面，顯示相關攻略內容。
    *   **## 5. 模組結構與職責

本專案的程式碼組織清晰，主要分為 `frontend/`、`backend/` 和 `data/` 三大模組，每個模組內部再細分為不同的職責區域。

*   **`frontend/`**: React 應用程式的根目錄，負責所有使用者介面和前端邏輯。
    *   **`frontend/public/`**: 存放靜態資源，如 `index.html` 和應用程式圖標。
    *   **`frontend/src/`**: 包含前端應用程式的原始碼。
        *   **`frontend/src/pages/`**: 存放各個主要頁面的 React 組件，每個子資料夾通常代表一個獨立的功能頁面（如角色圖鑑、商店攻略、戰隊戰、深域等）。
        *   **`frontend/src/components/`**: 存放可複用的 React UI 組件，這些組件可以在多個頁面或功能模組中共享。例如，通用的卡片組件、角色頭像顯示組件、屬性選擇器等。
        *   **`frontend/src/services/`**: 封裝了與後端 API 互動的邏輯，例如 `api.ts` 負責定義和發送 HTTP 請求。
        *   **`frontend/src/hooks/`**: 存放自定義 React Hooks，用於封裝可複用的狀態邏輯和副作用，例如 `useCharacters.ts` 用於獲取角色資料。
        *   **`frontend/src/types/`**: 集中存放前端應用程式中使用的 TypeScript 類型定義，確保資料結構的一致性。
        *   **`frontend/src/arenaData/`**: 存放競技場相關的靜態配置資料，如競技場、試煉、追憶頁面的內容配置。
        *   **`frontend/src/clanBattleData/`**: 存放戰隊戰相關的靜態配置資料，如 YouTube 頻道推薦、常用角色列表等。
        *   **`frontend/src/dungeonData/`**: 存放深域相關的靜態配置資料，如深域簡介、強化介紹及外部 Excel 連結。
        *   **`frontend/src/shopData/`**: 存放商店相關的靜態配置資料。
        *   **`frontend/src/App.tsx`**: 前端應用程式的根組件，負責設定主要路由、導航邏輯以及管理員模式的切換。
        *   **`frontend/src/main.tsx`**: 前端應用程式的入口點，負責將 React 應用程式掛載到 DOM 上。
*   **`backend/`**: Node.js Express 應用程式的根目錄，負責提供 API 服務、資料庫操作和靜態檔案服務。
    *   **`backend/src/`**: 包含後端應用程式的原始碼。
        *   **`backend/src/routes/`**: 定義各 API 端點的路由處理邏輯，每個檔案通常對應一組相關的 API（如認證、角色資料、檔案上傳）。
        *   **`backend/src/utils/`**: 存放通用的工具函數和模組，例如 `database.ts` 負責資料庫連接和 Prisma 客戶端實例的初始化。
        *   **`backend/src/simple-server.ts`**: 後端 Express 伺服器的主入口檔案，負責啟動伺服器、設定路由和中間件。
    *   **`backend/prisma/`**: 存放 Prisma ORM 的相關配置和資料庫 schema (`schema.prisma`)，定義了資料庫中的表結構和關係。
*   **`data/`**: 存放專案使用的原始資料和靜態資源。
    *   **`data/excel/`**: 存放原始 Excel 資料檔案，主要用於資料導入。
    *   **`data/images/`**: 存放所有靜態圖片資源，如角色頭像、商店圖標、屬性圖標等，這些圖片透過後端伺服器提供給前端。**: 戰隊戰攻略頁面，包含戰隊戰簡介、YouTube 頻道推薦及常用角色列表。
    *   **`frontend/src/pages/Dungeon/Dungeon.tsx`**: 深域攻略頁面，提供深域簡介、強化介紹及外部 Excel 連結。
    *   **`frontend/src/pages/CharacterEditor/CharacterEditor.tsx`**: 角色編輯頁面，提供管理員對角色資料進行 CRUD 操作的介面。
*   **`frontend/src/components/`**: 存放可複用的 UI 組件。
    *   **`frontend/src/components/Common/Card.tsx`**: 通用卡片組件，用於內容的視覺化分組和呈現。
    *   **`frontend/src/components/Character/CharacterImageCard.tsx`**: 顯示單個角色頭像和基本資訊的組件。
    *   **`frontend/src/components/ClanBattle/AttributeSelector.tsx`**: 戰隊戰頁面中用於選擇屬性（或補償刀）的按鈕組件。
    *   **`frontend/src/components/ClanBattle/CommonCharactersSection.tsx`**: 戰隊戰頁面中顯示常用角色列表的組件，按屬性、物理/法術及分級展示。
    *   **`frontend/src/components/ClanBattle/YoutubeChannelsSection.tsx`**: 戰隊戰頁面中顯示推薦 YouTube 頻道列表的組件。
    *   **`frontend/src/components/ClanBattle/CompensationKnifeContentSection.tsx`**: 戰隊戰頁面中顯示補償刀常用角色列表的組件。
*   **`frontend/src/services/api.ts`**: 封裝了與後端 API 互動的 Axios 實例和相關請求方法。
*   **`frontend/src/hooks/useCharacters.ts`**: 自定義 React Hook，用於從後端獲取角色資料並管理其加載狀態。
*   **`frontend/src/types/`**: 存放前端應用程式中使用的 TypeScript 類型定義。
*   **`frontend/src/clanBattleData/clanBattleConfigs.ts`**: 戰隊戰頁面的靜態配置資料，包含 YouTube 頻道、常用角色列表等。
*   **`frontend/src/dungeonData/dungeonConfigs.ts`**: 深域頁面的靜態配置資料，包含簡介、強化介紹及外部連結。
*   **`backend/src/simple-server.ts`**: 後端 Express 伺服器的主入口檔案，負責啟動伺服器、設定路由和中間件。
*   **`backend/src/routes/`**: 存放後端 API 的路由處理邏輯。
    *   **`backend/src/routes/auth.ts`**: 處理管理員認證相關的 API 端點。
    *   **`backend/src/routes/characters.ts`**: 處理角色資料的 CRUD (創建、讀取、更新、刪除) API 端點。
    *   **`backend/src/routes/upload.ts`**: 處理檔案上傳相關的 API 端點。
*   **`backend/src/utils/database.ts`**: 包含資料庫連接和 Prisma 客戶端實例的初始化邏輯。
*   **`backend/prisma/schema.prisma`**: Prisma ORM 的資料庫模式定義檔案，定義了資料庫中的表結構和關係。
*   **`data/images/`**: 存放所有靜態圖片資源，如角色頭像、商店圖標、屬性圖標等。
*   **`data/excel/`**: 存放原始 Excel 資料檔案，用於資料導入。

## 6. 開發環境與啟動

請參考 `README.md` 或 `gemini.md` 中的「如何啟動專案」部分。

---
**最後更新**: 2025年8月14日
