# 專案架構（v2 重構版）：公主連結攻略網站

> 本文件是大重構的目標架構與工具選型依據。舊版架構（React + Express 平鋪路由 + Render/Netlify）已淘汰。
>
> **狀態**: 設計定稿，Phase 1 進行中。實作順序見「§10 遷移路線圖」，施工細節見「§13」。

## 0. 重構前提：網站已停運

**本次重構期間網站全面停運，不需維持舊站運作。** 這個前提決定了整體策略，寫在最前面因為它推翻了
「漸進遷移」的常見預設：

- **不做「搬移 → 逐步替換」，改為「全新搭建 → 舊碼僅供參考」**。舊 React/Express 反正會被
  Vue/NestJS 完全取代，先花力氣讓它們在新 monorepo 裡跑得起來（catalog 化依賴、接上 turbo）
  是純浪費——那些工在 Phase 3/5 會整包丟掉。
- **舊程式碼移入 `legacy/`**：不進 workspace、不編譯、不維護，純粹作為改寫時的對照
  （篩選邏輯、拖拽評級、日期規則等細節仍需人工參考），Phase 8 收尾時刪除。
- **不需維持 API 路徑相容**。原本 Phase 3 綁著「舊 React 要能邊接邊驗」的限制，現已解除，
  API 可直接設計成最合理的形狀。
- **全功能對等才重新上線**：10+ 頁面全數移植完成後才部署，不維護「新舊並存」的過渡狀態。
- **不變的資產**（重構真正要繼承的東西）：Prisma schema、`db_backup/*.sql` 資料備份、
  `data/images/`、以及舊 route 裡累積的業務規則知識。

---

## 1. 目標與決策摘要

| 面向 | 舊版 | 新版 | 理由 |
|------|------|------|------|
| 前端框架 | React 19 + Vite | **Vue 3 + Vite** | 全面改寫，學習 Vue 生態 |
| 後端框架 | Express（14 支平鋪 CRUD route） | **NestJS** | 強制分層（Module/Controller/Service），消滅複製貼上；JWT、驗證、Swagger、Prometheus 都有官方生態 |
| ORM / DB | Prisma + Render 付費 Postgres | **Prisma + Supabase 免費 Postgres** | Supabase 只當託管 Postgres 用（不用它的 Auth/API），後端保持自主才能掛監控與自訂權限 |
| 版本管理 | 前後端各自 package.json，版本重複定義 | **pnpm workspace + catalog + Turborepo monorepo** | 套件版本單一來源，前後端＋共用套件統一管理 |
| 開發環境 | 手動啟兩個服務 | **Docker Compose** | 一鍵起 DB + API + Web + 監控，環境一致 |
| 監控 | 無 | **Prometheus + Grafana** | API 呼叫次數、延遲、錯誤率可視化 |
| 圖片 | 後端 redirect 到 R2 | **前端直連 Cloudflare R2 公開網址** | 省一跳 redirect 與後端流量 |
| 認證 | JWT 單一 admin | **JWT + RBAC（角色權限）** | 特定頁面只給特定人看 |
| Changelog | 無 | **網站更新日誌（DB）＋開發者 CHANGELOG.md（自動生成）** | 兩者都要 |
| 部署 | Render 後端 + Render DB + Netlify | **Cloudflare Pages（前端）+ Supabase（DB）+ R2（圖片）；後端容器先本地，之後再選免費容器平台** | 全免費方案，見 §9 額度評估 |

---

## 2. Monorepo 結構（pnpm workspace + catalog + Turborepo)

### 2.1 回答核心問題：後端有沒有類似 pnpm workspace 的工具？

**有，而且就是同一套。** 後端（NestJS）、前端（Vue）、共用型別、Prisma schema 全部都是 Node package，
pnpm workspace 一視同仁。DB 本身沒有「套件版本」概念，但它的版本控制就是 **Prisma migration 檔**，
把 schema + migrations 抽成一個 workspace package（`packages/database`），前後端都從它 import
型別與 client，就達成「全端＋DB 單一版本來源」。

三個工具各司其職：

- **pnpm workspace**：讓多個 package 共存一個 repo、互相引用（`workspace:*`）、共用 lockfile。
- **pnpm catalog**（pnpm ≥ 9.5）：在 `pnpm-workspace.yaml` 集中定義依賴版本，各 package 的
  `package.json` 只寫 `"typescript": "catalog:"`。**版本只寫一個地方**，不會出現前後端 TS 版本漂移。
- **Turborepo**：任務編排與快取。`turbo dev` 依依賴順序起服務、`turbo build` 只重建有變動的 package。
  （Nx 功能更多但更重，個人專案 Turborepo 足夠。）

### 2.2 目錄結構

```
princess-connect-guide/
├── pnpm-workspace.yaml          # workspace 定義 + catalog（版本單一來源）
├── package.json                 # 根：只有 turbo、husky、commitlint 等 repo 級工具
├── turbo.json                   # 任務管線定義（dev/build/lint/test）
├── docker-compose.yml           # 本地全套環境（見 §6）
├── .env.example                 # 環境變數樣板
├── CHANGELOG.md                 # 開發者版本紀錄（git-cliff 自動生成）
├── apps/
│   ├── web/                     # Vue 3 前端（見 §3）
│   └── api/                     # NestJS 後端（見 §4）
├── packages/
│   ├── database/                # Prisma schema + migrations + 匯出的 PrismaClient
│   ├── shared/                  # 前後端共用：API DTO 型別、常數（屬性/評級枚舉等）
│   └── config/                  # 共用 tsconfig、eslint config
├── infra/
│   ├── docker/                  # 各 app 的 Dockerfile
│   └── monitoring/              # prometheus.yml、grafana provisioning + dashboards
├── data/
│   └── images/                  # 靜態圖片源檔（上傳到 R2 的來源，不進部署）
├── db_backup/                   # 本地 DB 備份（.gitignore，Phase 2 用來灌本地 Postgres）
└── legacy/                      # ★ 舊實作，僅供改寫時對照（見 §0）
    ├── backend/                 # 舊 Express + 14 支平鋪 route
    └── frontend/                # 舊 React 實作
```

`legacy/` **不列在 `pnpm-workspace.yaml` 的 packages 裡**，因此不被 pnpm 安裝、不被 turbo 編譯、
不被 lint。它就是一份放在手邊的參考資料，Phase 8 刪除。

`pnpm-workspace.yaml` 範例：

```yaml
packages:
  - "apps/*"
  - "packages/*"
catalog:
  typescript: ^5.8.3
  vue: ^3.5.0
  "@nestjs/common": ^11.0.0
  prisma: ^6.12.0
  "@prisma/client": ^6.12.0
  # ...所有依賴版本都只寫在這裡
```

---

## 3. 前端：Vue 3（apps/web）

### 3.1 技術棧

| 用途 | 工具 | 對應舊版 | 理由 |
|------|------|----------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） | React 19 | — |
| 建置 | Vite | Vite（沿用） | — |
| 路由 | Vue Router | react-router-dom | 官方標配，路由守衛做頁面權限 |
| 狀態 | Pinia | zustand | Vue 官方推薦，API 跟 zustand 一樣輕 |
| 伺服器狀態 | **TanStack Query（@tanstack/vue-query）** | 手寫 useCharacters hook | 快取、去重、loading/error 狀態全自動，取代大部分手寫 hooks，也順便解掉「API 快取」這條未來優化 |
| HTTP | axios（沿用）或 ofetch | axios | 差異不大，沿用 axios 降低改寫成本 |
| 樣式 | Tailwind CSS v4 | Tailwind v4（沿用） | class 幾乎可直接搬 |
| 圖標 | lucide-vue-next | lucide-react | 同一套圖標的 Vue 版 |
| 表單/驗證 | 原生 + shared 套件的 zod schema | 手寫 | 前後端共用同一份驗證規則 |

### 3.2 結構與改寫對應

沿用現有的功能分區（已經劃分得不錯），只換寫法：

```
apps/web/src/
├── pages/                  # 一頁一資料夾，只做「組版」：組合元件 + 呼叫 composable，不含業務邏輯
│   └── characters/
│       ├── CharactersPage.vue
│       └── components/     # 只有這一頁用的元件（跨頁才升級到全域 components/）
├── components/
│   ├── ui/                 # 無業務的基礎元件：Button、Card、Modal、TabNav、Tooltip
│   └── domain/             # 有業務語意的共用元件：CharacterAvatar、TeamLineup、
│                           #   CharacterAutocomplete（依領域再分子資料夾）
├── layouts/                # 頁面骨架：DefaultLayout（導航列）、AdminLayout
├── composables/            # 有狀態的可複用邏輯（useTooltip、useDragRating、useCharacterFilters）
├── stores/                 # Pinia：auth（登入/角色）、ui（跨頁 UI 狀態）——只放「真的跨頁」的狀態
├── api/                    # HTTP 層（元件永遠不直接 import axios）
│   ├── http.ts             # axios 實例 + interceptors（帶 token、統一錯誤處理、401 導登入）
│   └── modules/            # 按領域一檔：characters.api.ts、recommendations.api.ts...
│                           #   （只包請求，回傳型別來自 packages/shared）
├── queries/                # TanStack Query 封裝：useCharactersQuery 等（快取 key 集中管理）
├── utils/                  # 純函數，無狀態無副作用：formatters、sorters、圖片 URL 組裝
├── constants/              # 前端專屬常數（路由名稱、顏色對映）；跨端常數放 packages/shared
├── content/                # 靜態配置資料（原 shopData、arenaData 等合併到一處，按領域分檔）
├── router/                 # 路由表 + 權限守衛（meta.requiredRole）
└── assets/                 # 樣式、字型、本地圖示
```

**前端的資料流分層**（元件不碰 axios，是這裡的鐵律）：

```
Page/Component → queries/（TanStack Query）→ api/modules/ → api/http.ts → 後端
      │                    │
      └── stores/（跨頁狀態） └── 快取、重試、loading/error 都在這層解決
```

`utils` vs `composables` 的分界（實務常見的判斷法）：**用到 `ref`/`watch` 等響應式就是
composable，純輸入輸出就是 util**。util 可以獨立單元測試，不需要掛 Vue。

改寫心法（React → Vue 對照）：

- `useState` → `ref`/`reactive`；`useEffect` → `watch`/`onMounted`；`useMemo` → `computed`
- 自定義 hooks → composables（大多可近乎逐行翻譯）
- Context（AuthContext）→ Pinia store
- Portal（下拉選單）→ `<Teleport>`
- HTML5 Drag & Drop（拖拽評級）→ API 相同，事件綁定改 `@dragstart` 等

---

## 4. 後端：NestJS(apps/api）

### 4.1 現況問題

- 14 支 route 檔中有 **8 支是幾乎相同的小表 CRUD**（arenaCommon、trialCharacters、sixstarPriority、
  ue1Priority、ue2Priority、nonSixstarCharacters、clanBattleCommon、clanBattleCompensation），
  只差表名和一兩個欄位。
- 無 controller/service 分層，Prisma 呼叫、驗證、HTTP 處理全混在 route handler。
- 無統一的請求驗證與錯誤格式。

### 4.2 模組設計

```
apps/api/src/
├── main.ts                    # bootstrap：helmet、CORS、全域 ValidationPipe、Swagger
├── app.module.ts
├── modules/
│   ├── auth/                  # JWT 簽發/驗證、登入、RBAC Guard（見 §7）
│   ├── characters/            # 角色 CRUD + 批次評級（業務最複雜，獨立模組）
│   ├── recommendations/       # ★ 合併 8 支小表 CRUD（見下）
│   ├── clan-battles/          # 戰隊戰未來視（期間 + 隊伍，有巢狀關係）
│   ├── abyss-raids/           # 深淵討伐未來視
│   ├── future-predictions/    # 角色預測
│   ├── update-logs/           # ★ 新增：網站更新日誌（見 §8）
│   └── upload/                # R2 上傳（presigned 或 server 中轉）
├── common/                    # 橫切面（見 §4.3 的細分）
├── metrics/                   # Prometheus 模組（見 §5）
└── prisma/                    # PrismaService（注入用，client 來自 packages/database）
```

### 4.2.1 模組內部三層架構（Controller → Service → Repository）

這就是實務上「API 不直接寫 DB」的標準分層。每個 module 內部長這樣（以 characters 為例）：

```
modules/characters/
├── characters.module.ts       # 組裝：宣告 controller/service/repository 的依賴注入
├── characters.controller.ts   # HTTP 層：路由、DTO 驗證、呼叫 service、決定 status code
├── characters.service.ts      # 業務層：規則與流程（例：批次評級要包在一個 transaction）
├── characters.repository.ts   # 資料存取層：唯一允許 import Prisma 的地方
├── dto/                       # 請求/回應的資料形狀（zod schema 來自 packages/shared）
│   ├── create-character.dto.ts
│   ├── query-characters.dto.ts
│   └── batch-ratings.dto.ts
└── mappers/                   # DTO ↔ DB 格式互轉（欄位改名、中文欄位對映、組合欄位拆解）
    └── character.mapper.ts
```

請求的完整旅程：

```
HTTP 請求
  → Controller   驗證 DTO（格式錯直接 400，業務層永遠拿到乾淨資料）
  → Service      業務規則、跨 repository 組合、transaction 邊界
  → Mapper       DTO → Prisma input 格式（你印象中「轉成 DB 格式」的那一步）
  → Repository   實際呼叫 Prisma 讀寫 DB
  → Mapper       DB 結果 → 回應 DTO（不把 DB 內部欄位裸露給前端）
  → Controller   回應
```

每層的鐵律（分層存在的意義就在這些約束）：

| 層 | 只能做 | 不准做 |
|----|--------|--------|
| Controller | 解析 HTTP、驗證、呼叫 service | 寫業務邏輯、碰 Prisma |
| Service | 業務規則、編排、transaction | import Prisma、知道 HTTP 存在（不碰 req/res） |
| Repository | 查詢與寫入 DB | 寫業務判斷（它不知道「為什麼」要查） |

好處：換 ORM 只動 repository；測 service 時 mock repository 就好，不用起 DB；
簡單表（如 recommendations）三層各自都很薄，但**結構一致性比省行數重要**——
每個模組長得一樣，半年後回來看不用重新理解。

**8 合 1 的關鍵重構**：這 8 張表本質都是「某個分類下的角色推薦清單」，schema 合併為一張表：

```prisma
model CharacterRecommendation {
  id          String   @id @default(cuid())
  category    String   // arena_common | trial | sixstar | ue1 | ue2 | non_sixstar
                       // | clan_battle_common | clan_battle_compensation
  characterId String?  // 關聯 Character（可為 null，容納未入圖鑑角色）
  name        String   // 顯示名稱
  tier        String?  // SS/S/A/B/C 或 核心/重要/普通（依 category 解讀）
  attribute   String?  // 屬性（戰隊戰用）
  damageType  String?  // 物理/法術（戰隊戰用）
  description String?
  acquisition String?  // 取得方式（非六星用）
  sortOrder   Int      @default(0)
  @@index([category])
}
```

API 從 8 組變 1 組：`GET/POST/PUT/DELETE /api/recommendations?category=sixstar`。
一個 module、一個 service、一個 controller 就取代原本 8 支檔案；前端管理介面也能共用同一個編輯元件。
（遷移時寫一支 script 把 8 張舊表資料灌進來。）

### 4.3 橫切面（common/ 的細分）

```
common/
├── filters/            # all-exceptions.filter.ts：統一錯誤回應格式
├── interceptors/       # logging.interceptor.ts（請求日誌）、metrics 計時
├── guards/             # 跨模組共用的守衛（JwtAuthGuard、RolesGuard 本體放 auth 模組，這裡 re-export）
├── decorators/         # @CurrentUser()、@Roles()、@Public()
├── pipes/              # 自訂轉換（例：query string 的分頁參數解析）
└── utils/              # 純函數（日期計算如「10 號分界」、分頁計算）——和前端 utils 同標準：無狀態可單測
```

- **驗證**: `nestjs-zod` —— zod schema 放在 `packages/shared`，前端表單和後端 DTO 用同一份。
  （NestJS 傳統是 class-validator，但 zod 能前後端共用，更符合 monorepo 目標。）
- **API 文件**: `@nestjs/swagger`，dev 環境開 `/api/docs`。
- **設定**: `@nestjs/config` + zod 驗證環境變數，啟動時缺漏直接 fail-fast。
- **錯誤格式**: 全域 exception filter，統一 `{ statusCode, message, error }`。
- **日誌**: `nestjs-pino`（結構化 JSON log，之後可接 Grafana Loki；取代 morgan）。

### 4.4 頁面內容進 DB 還是靜態檔？共用模組怎麼設計？

**判斷標準是「誰改、多常改」，不是「未來可能要改」**：

| 內容型態 | 放哪 | 理由 |
|----------|------|------|
| 管理員後台頻繁維護的結構化資料（角色、評級、推薦、未來視、更新日誌） | DB | 現況已是如此，維持 |
| 長篇攻略文字（新人/回鍋指南的文章本體等） | 靜態 `content/` 檔 | 改動頻率低、改的人是開發者自己，git diff 就是版本控制，零維運；先別為了「以後方便」建 CMS |
| **各頁的小 header／分類區塊**（每頁下的標籤分類＋標題＋說明文字，各頁形狀高度相似） | DB，走下面的共用 `page-sections` 模組 | 形狀一致又想後台可改，正是共用模組的甜蜜點 |

**共用模組的設計原則：模組對應「資料形狀」，不是「頁面」。** 形狀相同的東西共用一個模組，
頁面用 key 區分。本專案有兩個這樣的共用模組：

1. **recommendations**（§4.2 的 8 合 1）：「某分類下的角色推薦清單」這個形狀。
   內部就是「一組」controller/service/repository 服務所有 category——**不會**per category
   再各開一套，category 只是查詢參數。
2. **page-sections**（★ 你說的小 header）：「某頁某區塊的標題＋說明內容」這個形狀：

```prisma
model PageSection {
  id         String   @id @default(cuid())
  pageKey    String   // newbie | return-player | shop | arena ...
  sectionKey String   // must-read | item-overview | daily ...
  title      String
  content    String   // markdown 或 JSON
  sortOrder  Int      @default(0)
  updatedAt  DateTime @updatedAt
  @@unique([pageKey, sectionKey])
}
```

   同樣一組 controller/service/repository 服務所有頁面：`GET /api/page-sections?page=newbie`。
   之後加新頁面，這個模組零改動，只是多一個 pageKey 的資料。

（各頁面實際用了哪些 pageKey/category，屬於實作細節，不在本文件維護——文件記模式，
資料庫本身就是清單。）

**跨模組共用邏輯的擺放**（NestJS 標準機制，依情況三選一）：

1. **A 模組要用 B 模組的能力** → B 把 service 放進 `exports`，A import 後由 DI 注入。
   **不准**繞過 service 直接戳別人的 repository——業務規則會被跳過。
2. **純函數** → `common/utils/`。
3. **多個 repository 出現重複樣板** → 抽 `BaseRepository<T>` 泛型基底。但等重複真的
   出現第三次再抽，不要預先抽象（錯的抽象比重複更貴）。

### 4.5 Character schema 重整（Phase 2 施工規格）

以下決策依據 **2026-06-30 備份的 314 筆實測資料**（非文件推測）。舊 schema 把多個正交維度
擠在同一個字串欄位，導致值域失控（`常駐/限定` 長出 12 種值、`角色定位` 長出 12+ 種）。

#### 4.5.1 角色定位：改為 enum 陣列（一個角色可多個定位）

新角色普遍是多功能的，舊的單一字串欄位只能靠 `妨礙兼破防`、`破防兼輸出`、`加速跟補TP`
這種複合字串硬湊。改為**固定 6 值的 enum 陣列**：

```prisma
enum CharacterRole {
  DPS        @map("輸出")
  BREAKER    @map("破防")
  HEALER     @map("補師")
  BUFFER     @map("增益")
  DEBUFFER   @map("妨礙")
  TP_SUPPORT @map("補TP")
}
```

**為何用 enum 陣列而非關聯表**：6 個固定標籤、無 per-relation 額外欄位，關聯表是過度設計。
Postgres 原生陣列 + GIN 索引即可高效篩選。**enum 在 DB 層強制值域**，正是用來根治
「值域從 6 種失控成 12+ 種」的病根——代價是新增第 7 種定位需要一次 migration，而這正是想要的約束。

（Prisma enum 名稱僅允許 ASCII，中文顯示值靠 `@map`。）

#### 4.5.2 `常駐/限定` 拆成三個正交欄位

舊欄位混了「卡池類別 / 獲取來源 / 初始星級 / 是否絕版」四件事，拆解為：

| 新欄位 | 型別 | 說明 |
|--------|------|------|
| `gachaPool` 卡池 | enum | 常駐 / 限定 / FES限定(公主祭典) / 聯名限定 |
| `acquisitionSource` 獲取來源 | enum | 轉蛋 / 活動(支線可農) / 兌換 等（確切值域 Phase 2 全量盤點後定案）|
| `initialRarity` 初始星級 | Int | 僅 1 / 2 / 3 |

**`isDiscontinued` 不儲存**——絕版可由 `gachaPool === 聯名限定` 推導，不存可推導的資料。

實測驗證：資料中 8 筆標記「絕版」的角色（卯月、未央、凜、拉姆、雷姆、雷姆(夏日)、
愛蜜莉雅、愛蜜莉雅(夏日)）**全部是偶像大師與 Re:Zero 聯名角**；另有 1 筆花凜(煉金術)
標為「聯動限定活動角」。共 9 個聯名角、歷史標記不一致，但「只有聯名會絕版」的規則完全成立。
→ **Phase 2 資料遷移時，這 8 筆需重新歸類為 `聯名限定`。**

#### 4.5.3 待清理的髒資料

| 欄位 | 髒值 | 處理 |
|------|------|------|
| 評級（四個維度）| `T3.5`（1 筆）、`不知道`（1 筆）、null | 遷移時就近歸入合法級距（往上或往下皆可，後續會再調整）|
| `常駐/限定` | 見 4.5.2 的 8 筆絕版標記 | 改歸 `聯名限定` |

乾淨且值域封閉的欄位（位置 3 值、屬性 5 值、評級 6 值）已於 Phase 1 定義於
`packages/shared/src/constants/character.ts`。注意**屬性沒有「土屬」**——是「風屬」，舊型別註解有誤。

---

## 5. 監控：Prometheus + Grafana + Exporters + Alerting

### 5.1 指標來源（API 自報 + Exporters）

| 來源 | 工具 | 看什麼 |
|------|------|--------|
| API 應用指標 | `@willsoto/nestjs-prometheus`（包 prom-client），暴露 `/metrics` | `http_requests_total{method,route,status}` 呼叫次數、`http_request_duration_seconds` histogram（p95 延遲）、Node.js process 指標（記憶體、event loop lag、GC） |
| DB 指標 | **postgres-exporter**（prometheuscommunity/postgres-exporter） | 連線數、transaction 率、cache hit ratio、資料表大小、鎖等待 |
| 容器指標 | **cAdvisor** | 各容器的 CPU / 記憶體 / 網路（哪個服務吃資源一目了然） |
| 主機指標 | node-exporter（可選） | 主機層 CPU/磁碟/記憶體；本地開發價值低，上自管 VM 才必要 |
| DB 慢查詢 | Prisma middleware 自記 histogram（掛在 PrismaService） | 每個 model+action 的查詢耗時 |

這個組合就是實務標配：**應用自報業務指標，基礎設施用現成 exporter**，不要自己寫 DB/容器的採集。

### 5.2 Prometheus / Grafana

- **Prometheus**: docker-compose 服務，scrape 上述四個目標（`infra/monitoring/prometheus.yml`）。
- **Grafana**: dashboard 與資料源全部用 provisioning 寫成 JSON/YAML 進版控
  （`infra/monitoring/grafana/`），重建容器不掉設定。首發三塊 dashboard：
  1. **API 總覽**：請求率（按 route）、延遲 p50/p95/p99、錯誤率（4xx/5xx）
  2. **DB**：postgres-exporter 有現成社群 dashboard 可直接 import，再加 Prisma 慢查詢面板
  3. **資源**：cAdvisor 的容器 CPU/記憶體

### 5.3 告警（Alerting）

用 **Grafana 統一告警**（Grafana 8+ 內建：規則評估、通知路由、告警頁面一站包辦），
不另架 Alertmanager——Alertmanager 是大型多叢集 Prometheus 環境的標配，單人專案多一個服務
只多維運成本，Grafana alerting 的概念（rule → evaluation → contact point → notification policy）
與它一致，學到的東西可轉移。

- **告警規則**（存 provisioning 進版控）：
  | 規則 | 條件（初始值，可調） |
  |------|------|
  | API 掛了 | `up == 0` 持續 1 分鐘 |
  | 錯誤率 | 5xx 比率 > 5% 持續 5 分鐘 |
  | 延遲惡化 | p95 > 1s 持續 5 分鐘 |
  | DB 連線逼近上限 | 連線數 > 上限的 80%（Supabase 免費版連線少，特別重要） |
  | 記憶體洩漏徵兆 | process 記憶體持續上升超過閾值 |
- **通知管道（contact point）**: Discord webhook（免費、設定最快）；要 email 也可加。
- **告警頁面——「目前 alert」和「alert log」是兩個東西，Grafana 都內建，不用自己開發**：
  - **目前 alert（現在有什麼在燒）**: Grafana「Alerting → Alert rules」頁即時顯示每條規則
    firing/pending/normal 狀態；再於 API 總覽 dashboard 頂部放一個 **Alert list panel**，
    開儀表板第一眼就看到當下狀態。
  - **alert log（歷史紀錄）**: 開啟 Grafana **alert state history**（Alerting → History，
    時間軸顯示每條規則何時觸發、何時恢復）。另外 Discord 通知頻道天然就是一份不會被
    清掉的告警流水帳——小團隊實務上常直接把通知頻道當 alert log 用。

### 5.4 上雲之路

免費容器平台不方便自架 Prometheus，屆時改用 **Grafana Cloud 免費版**（10k series，
含 alerting 與通知），API 端程式碼不用改，exporter 改為 Grafana Agent remote-write 或
直接放棄基礎設施指標只留應用指標（Supabase/Render 自帶平台監控可補）。

---

## 6. Docker 與本地開發

`docker-compose.yml` 服務：

| 服務 | 映像 | 用途 |
|------|------|------|
| `db` | postgres:16-alpine | 本地開發 DB（**不直接開發打 Supabase**，遠端只當 staging/prod） |
| `api` | infra/docker/api.Dockerfile | NestJS，dev 模式掛 volume 熱重載 |
| `web` | infra/docker/web.Dockerfile | Vite dev server（或本機直接跑 pnpm dev，二選一） |
| `prometheus` | prom/prometheus | 指標收集 |
| `grafana` | grafana/grafana | 儀表板＋告警（掛 provisioning volume） |
| `postgres-exporter` | prometheuscommunity/postgres-exporter | DB 指標（見 §5.1） |
| `cadvisor` | gcr.io/cadvisor/cadvisor | 容器資源指標 |

監控相關服務用 compose 的 `profiles: [monitoring]` 分組——日常開發 `docker compose up db`
就好，要看儀表板才 `--profile monitoring` 全開，避免每天多跑四個容器。

- Dockerfile 用 **multi-stage + `turbo prune`**：只複製該 app 需要的 workspace 子集，image 不會塞整個 monorepo。
- 日常開發也可以只 `docker compose up db prometheus grafana`，API/前端在本機跑 `turbo dev`（迭代最快）。
- DB 備份：script 定期 `pg_dump`（取代現在手動的 `db_backup/`），上雲後對 Supabase 一樣適用。

---

## 7. 認證與權限（JWT + RBAC）

需求：部分頁面只給特定人看。

- **DB**: `User { id, username, passwordHash, role }`，`role` 枚舉：
  - `admin` —— 全部功能＋資料編輯
  - `member` —— 可看受限頁面（例如未來視）
  - 未登入 —— 只看公開頁
- **後端**: `@nestjs/jwt` + Passport JWT strategy；`@Roles('admin')` decorator + RolesGuard 掛在
  controller 上。Access token 短效（15 分鐘）+ refresh token（httpOnly cookie），比現在的長效 token 安全。
- **前端**: Pinia auth store 存登入狀態與角色；Vue Router 守衛讀 `route.meta.requiredRole`，
  未達權限導回首頁。**前端守衛只是 UX，真正的防線在後端 Guard**（受限資料的 API 一律驗 token）。
- 沿用現有的 bcrypt 雜湊與 init-superadmin 流程概念，加上建立 member 帳號的管理介面。

---

## 8. Changelog（兩套）

1. **網站更新日誌（給訪客）**：
   - `UpdateLog { id, date, title, content(markdown), category }` 表 + `update-logs` 模組 CRUD
   - 前端：首頁顯示最近 N 筆＋獨立完整頁；管理員後台可增刪改（把現有 React 的
     `UpdateLogManager` 概念移植成 Vue）。
2. **開發者 CHANGELOG.md（給自己）**：
   - **Conventional Commits**（`feat:`/`fix:`/`refactor:`...）+ **commitlint + husky** 強制格式
   - **git-cliff** 從 commit 歷史自動生成 `CHANGELOG.md`（比 changesets 適合——changesets 是為了
     「發布 npm 套件」設計的，網站應用用 commit 驅動的 git-cliff 更順）。
   - **生成時機（重構期間）**：`CHANGELOG.md` 是生成物，開發期間放著不管；
     **Phase branch 合回 `main` 前**跑 `pnpm changelog`，以 `chore(release): 更新 CHANGELOG` 提交。
     `cliff.toml` 已將 `chore(release)` 設為 skip，故該 commit 不會污染 CHANGELOG 本身。
     （每次 commit 都自動生成會有雞生蛋問題：生成後的提交又要再生成一次。）
   - **重構完成後**：改為 **tag 驅動**的發版流程（`v[0-9]*`，`cliff.toml` 的 `tag_pattern` 已預留），
     由版本標籤劃分 CHANGELOG 區塊。屆時再評估 GitHub Actions 自動化
     （打 tag → 生成 CHANGELOG → 建立 Release），此部分待 Phase 7 上雲後一併設計。

---

## 9. 部署與免費額度評估

### 9.1 目標拓撲

```
使用者 ── Cloudflare Pages（Vue 靜態站，自訂網域）
   │            │
   │            ├──圖片──> Cloudflare R2（公開 bucket / 自訂子網域 img.xxx）
   │            │
   │            └──API───> 後端容器（先本地 Docker；上雲候選：Render free / Fly.io / Koyeb）
   │                            │
   │                            └──> Supabase Postgres（免費版）
   └─ 監控（上雲後）：Grafana Cloud free
```

### 9.2 免費額度 vs 你的流量（攻略站、預估日訪 < 幾百人）

| 服務 | 免費額度 | 評估 |
|------|----------|------|
| Cloudflare Pages | **頻寬無上限**、500 次建置/月 | 完全夠，這是選它勝過 Netlify（100GB/月）的主因 |
| Cloudflare R2 | 10GB 儲存、**輸出流量免費**、Class B 讀取 1000 萬次/月 | 圖片才 6MB/382 張，讀取量遠低於上限，最不用擔心的一環 |
| Supabase | 500MB DB、5GB egress/月、**7 天無活動會暫停專案** | 資料量僅幾 MB，額度綽綽有餘；唯一要處理的是暫停——用 GitHub Actions 排程每 2-3 天 ping 一次 health check 即可 |
| Render free（後端候選） | 750 小時/月、15 分鐘閒置會休眠（冷啟動 ~30 秒） | 攻略站可接受；若嫌冷啟動慢再評估 Fly.io/Koyeb |
| Grafana Cloud free | 10k series、14 天保留 | 個人專案夠用 |

結論：**你的流量規模全免費方案是安全的**，唯二要注意的是 Supabase 閒置暫停（排程 ping 解決）
與後端冷啟動（體驗問題，非故障）。

### 9.3 圖片流程調整

舊版後端在生產環境把 `/images/*` 301 到 R2——多一跳且吃後端流量。新版：

- 前端環境變數 `VITE_IMAGE_BASE_URL` 直接指向 R2 公開網址（本地開發指向本地靜態服務）。
- 上傳流程保留走後端（驗權限 → sharp 壓縮 → 傳 R2），沿用現有 `r2Storage.ts` 邏輯移植到 upload 模組。

---

## 10. 遷移路線圖（建議的實作順序）

> 本節是高階階段圖；每個 Phase 的細部施工步驟、分支策略與 multi-agent 用法見 **§13**。

因網站已停運（§0），各階段不必維持舊站運作；但每階段仍以「該階段產出能實際跑起來」為驗收標準，
避免累積無法驗證的半成品：

1. **Monorepo 骨架**：pnpm workspace + catalog + turbo + 根目錄工具鏈（husky、commitlint、git-cliff）。
   舊 `backend/`、`frontend/` 移入 `legacy/`，`apps/` 留給全新實作。
2. **packages/database**：Prisma schema 抽出並重整（含 8 合 1 的 `CharacterRecommendation`
   與 `PageSection` 新設計）；本地 Docker Postgres 起起來，`db_backup/*.sql` 灌入，
   寫資料轉換 script 把舊表資料搬進新結構。
3. **NestJS API**：按 §4 全新建置（`legacy/backend` 僅作業務規則參考），照 §4.2.1 三層架構，
   加 Swagger、zod 驗證、統一錯誤格式。**API 形狀重新設計，不受舊路徑約束**。
4. **監控**：Prometheus + Grafana + exporters 進 compose，API 掛 metrics 模組，建首發 dashboard 與告警規則。
5. **Vue 前端**：`apps/web` 從零 scaffold，逐頁改寫（`legacy/frontend` 作對照）。建議順序：
   公開內容頁（Newbie/ReturnPlayer/Shop 這類靜態配置頁最簡單）→ 角色圖鑑（篩選/排序核心）
   → 未來視 → 編輯器/管理後台（最複雜，拖拽評級與 autocomplete 最後做）。
   **本階段是 multi-agent 併行的主戰場**（見 §13.2）。
6. **RBAC + Changelog**：User/role 表與 Guard、update-logs 模組與頁面。
7. **上雲**（全功能對等後才進行）：R2 圖片同步 → Supabase 建庫跑 migration + 資料匯入 →
   Cloudflare Pages 接 repo 自動部署 → 後端容器上 Render free → DNS 切換 → Supabase keep-alive 排程。
8. **收尾**：刪除 `legacy/`、`data/excel`、舊 scripts，更新 CLAUDE.md 與本文件。

---

## 11. 之後要加新頁面/新功能怎麼辦？

**不需要預先討論，本架構就是為此設計的**——新功能只是照慣例填空，不會動到架構本身：

- **純內容頁**（如新的攻略文章頁）：`pages/` 加一個資料夾 + `content/` 加配置檔 + `router/` 加一條路由。不碰後端。
- **需要新資料的頁**（先比對現有共用模組的「形狀」，見 §4.4）：
  1. 是「某分類的角色推薦清單」→ **不用新表**，`CharacterRecommendation` 加一個 category 值即可。
  2. 是「頁面區塊的標題＋說明」（小 header 類）→ **不用新表**，`PageSection` 加一個 pageKey 的資料即可。
  3. 真的是新形狀的資料 → `packages/database` 加 model + migration、`apps/api/modules/` 照 §4.2.1 的三層樣板新增一個模組、前端照上面流程加頁。
- **需要權限的頁**：路由 `meta.requiredRole` + 後端 controller 掛 `@Roles()`，兩行的事。

只有一種情況值得回來改這份文件：新需求打破了現有分層或需要新的基礎設施
（例如即時推播要加 WebSocket、全文搜尋要加搜尋引擎）。那時再更新本文件對應章節。

---

## 12. 規劃中：截圖角色辨識服務（apps/recognizer）

**目的**：看網路攻略時截圖隊伍畫面，自動辨識圖中五個角色頭像對應哪些角色，
預填進管理後台的隊伍表單，取代逐一手動輸入。

### 12.1 放同一個 repo（monorepo 本來就可以多語言）

分 repo 的正當理由（不同團隊、不同發布節奏、跨專案重用）在此都不成立；
此服務與本專案強耦合（比對基準是本專案的角色頭像庫、輸出是本專案的角色 ID），
同 repo 共用 compose、部署與資料，成本最低。

- 技術棧：**Python + FastAPI + OpenCV**（影像生態在 Python；比對用感知雜湊
  perceptual hash 或模板比對——基準庫是已知的 382 張頭像，**不需要訓練模型**）。
- 依賴管理：Python 用 **uv**（自己的 lockfile）。pnpm catalog 只管 JS 生態，
  「版本單一來源」原則不變，只是每個語言生態各一份 lockfile。
- 接進工具鏈：`apps/recognizer/package.json` 放薄薄的 script（`"dev": "uv run fastapi dev"`），
  turbo 就能一起編排；有自己的 Dockerfile，compose 掛 `profiles: [recognizer]`。

### 12.2 邊界：辨識服務不碰 DB

沿用 §4.2.1 的分層原則，它是純函數式的服務：**圖進、候選清單出**，寫入一律走既有 API：

```
管理後台（Vue）上傳截圖
  → NestJS upload/recognition endpoint（驗權限）
  → 轉發 recognizer（FastAPI）：偵測頭像框 → 與頭像庫比對
  → 回傳候選：[{characterId, confidence}, ...] × 5
  → 後台表單自動預填（信心低的標黃提醒）
  → 人工確認/修正 → 走既有隊伍 API 寫入
```

辨識必有錯誤率，**人工確認是流程的一部分**，所以它定位是「自動填表工具」——
錯了也不會產生髒資料，也因此不需要為它設計回滾機制。

### 12.3 頭像基準庫

`data/images/characters/` 就是基準庫。啟動時把每張頭像算好 hash 存記憶體
（382 張是小數字）；新增角色圖片後重啟或打 refresh endpoint 即可。

---

## 13. 施工計畫與分支策略

### 13.1 分支策略：一個 Phase 一條 branch

網站已停運（§0），`main` 不再背負「隨時可部署」的義務，因此分支策略純粹是為了**施工檢查點**
而非保護生產環境：

- **一個 Phase 一條 branch**，該階段驗收通過就合回 `main`（例：`refactor/phase-1-monorepo`）。
- **不開**單一長命 `refactor/v2` 拖數月——那會累積成一次難以審查的巨大 diff，出錯時也無法
  二分定位是哪個階段引入的問題。每階段合並讓 `main` 成為一連串可回溯的里程碑。
- 舊的 feature branch（`clanBattle`、`arena_tst` 等）本次用不到，全部完成後清除。
- 設計文件（本檔）永遠提交在 `main`，不隨 branch 走，確保各 branch 看到同一份「憲法」。

### 13.2 Multi-agent 用在哪：只在 Phase 5

- **Phase 1–4、6–8 基本循序**：地基、DB schema、API 框架、監控彼此強依賴，一次一件事，
  併行只會互相踩腳。這些階段單一 agent 逐步做、人工把關即可。
- **Phase 5（Vue 逐頁移植）是唯一的併行甜蜜點**：十幾個頁面彼此獨立，可一個 agent 一頁
  併行，用 **git worktree 隔離**避免檔案衝突。這才是 multi-agent 真正發光處。

### 13.3 Phase 1 細部步驟（monorepo 骨架）

Phase 1 是地基，幾乎全循序依賴。因網站已停運（§0），**不做「搬移舊 code 讓它繼續跑」**——
舊實作直接降級為 `legacy/` 參考資料，`apps/` 留白給後續 Phase 全新建置。

因此 Phase 1 的產出是**一個乾淨、可運作的空骨架**，而非「能跑舊站的 monorepo」：

| 步驟 | 做什麼 | 驗證 |
|------|--------|------|
| 1.1 | 建 `pnpm-workspace.yaml`（packages globs + catalog）、根 `package.json`、`turbo.json` | `pnpm install` 成功、`turbo --version` 可執行 |
| 1.2 | `backend/` `frontend/` → `legacy/`（不進 workspace）；建立空的 `apps/`、`packages/`、`infra/` 骨架 | `pnpm install` 不掃到 legacy、工作目錄結構符合 §2.2 |
| 1.3 | 建 `packages/config`：共用 `tsconfig` base（strict）、eslint flat config、prettier 設定 | 其他 package 可 extends、lint 與 format 可執行 |
| 1.4 | 建 `packages/shared` 空殼（zod schema 與共用常數的家，Phase 2/3 才填內容） | 可被 workspace 引用（`workspace:*`）|
| 1.5 | 根目錄工具鏈：husky + commitlint（Conventional Commits）+ git-cliff 設定檔 | 違規格式的 commit 被擋下、`git-cliff` 能產出 CHANGELOG |
| 1.6 | `.env.example`、`.gitignore` 補齊（`.turbo/`、`legacy/` 的 node_modules 等） | 乾淨的 `git status` |

**catalog 的內容**：只放**新技術棧**會用到的依賴。舊 React/Express 的依賴不進 catalog——
`legacy/` 不被 pnpm 安裝，列進去只是噪音。catalog 隨 Phase 2/3/5 逐步長出（加 NestJS 時補
NestJS 條目、加 Vue 時補 Vue 條目），而不是一次寫死。

### 13.4 各 Phase 對應 branch 一覽

| Phase | Branch | 對應 §10 |
|-------|--------|----------|
| 1 | `refactor/phase-1-monorepo` | Monorepo 骨架 |
| 2 | `refactor/phase-2-database` | packages/database + 8 合 1 schema |
| 3 | `refactor/phase-3-nestjs` | NestJS API 移植 |
| 4 | `refactor/phase-4-monitoring` | Prometheus + Grafana |
| 5 | `refactor/phase-5-vue-<page>` | Vue 逐頁移植（每頁可各自一條，multi-agent + worktree） |
| 6 | `refactor/phase-6-rbac-changelog` | RBAC + Changelog |
| 7 | `refactor/phase-7-deploy` | 上雲 |
| 8 | `refactor/phase-8-cleanup` | 收尾清理 |

---

**最後更新**: 2026-07-21
**狀態**: 架構定稿，Phase 1 進行中。重構前提見 §0（網站已停運，舊碼降級為 `legacy/` 參考），
分支策略與施工步驟見 §13。
