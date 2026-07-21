# 公主連結攻略網站 — 開發指南

## ⚠️ 現況：v2 全面重構進行中

**這個專案正在被完全重寫，不是在維護一個完成品。**

- 舊版（React + Express，功能完整但已淘汰）現位於 `legacy/`，**僅供改寫時對照，不編譯、不維護**
- 新版是 pnpm monorepo：**Vue 3 + NestJS**，`apps/` 目前刻意留空，等各 Phase 陸續建置
- 網站目前**全面停運**，因此不需維持舊站可運作，可以大刀闊斧改

### 開工前必讀

**`ARCHITECTURE.md` 是本重構的唯一設計依據（「憲法」）。動任何程式碼之前先讀它**，特別是：

| 章節 | 內容 |
|------|------|
| §0 | 重構前提（為何舊碼降級為 legacy） |
| §2 | monorepo 結構與 pnpm catalog |
| §4.2.1 | **後端三層架構鐵律**（Controller → Service → Repository） |
| §4.5 | Character schema 重整規格（Phase 2 施工用） |
| §10 / §13 | 階段路線圖與施工計畫 |

---

## 目前結構

```
princess-connect-guide/
├── ARCHITECTURE.md      設計憲法（先讀這個）
├── pnpm-workspace.yaml  workspace + catalog（依賴版本單一來源）
├── turbo.json           任務管線
├── apps/                ← 留空。Phase 3 建 api(NestJS)、Phase 5 建 web(Vue)
├── packages/
│   ├── config/          共用 tsconfig(strict) / eslint / prettier
│   └── shared/          前後端共用領域常數、DTO、zod schema
├── infra/               ← 留空。Phase 4 放 docker / monitoring
├── data/images/         角色圖片（382 張，之後上 Cloudflare R2）
├── db_backup/           DB 備份 SQL（.gitignore；Phase 2 灌本地 Postgres 用）
└── legacy/              舊 React + Express，唯讀參考，Phase 8 刪除
```

## 常用指令

```bash
pnpm install          # 安裝（Node >= 22，pnpm 由 corepack 提供）
pnpm dev              # turbo dev：啟動所有 app
pnpm build            # turbo build
pnpm lint             # turbo lint
pnpm typecheck        # turbo typecheck
pnpm format           # prettier --write
pnpm changelog        # git-cliff 產生 CHANGELOG.md
```

---

## 開發慣例（請遵守）

1. **Commit 訊息用 Conventional Commits**，由 commitlint + husky 強制檢查。
   格式 `type(scope): 中文說明`，例：`refactor(api): 將角色路由改為三層架構`
   常用 scope：`api` `web` `database` `shared` `config` `infra` `deps` `monorepo`

2. **一個 Phase 一條 branch**：`refactor/phase-N-<名稱>`，驗收通過才合回 `main`。

3. **依賴版本一律寫在 `pnpm-workspace.yaml` 的 catalog**，各 package 只寫 `"套件": "catalog:"`。
   不要在個別 package.json 直接寫版本號——那正是重構要消滅的問題。

4. **後端分層鐵律**（詳見 §4.2.1）：
   - Controller 不寫業務邏輯、不碰 Prisma
   - Service 不 import Prisma、不碰 req/res
   - Repository 是唯一能碰 Prisma 的地方
   - 跨模組要用別人的能力 → 注入對方的 **service**，絕不直接戳別人的 repository

5. **`legacy/` 唯讀**。可以讀它理解舊行為，但不要修它、不要讓它進 build。

6. **不要為了「以後可能要改」就把靜態內容搬進 DB**——判斷標準是「誰改、多常改」（§4.4）。

---

## Phase 5 功能對等清單

目標是**全功能對等才重新上線**。以下是 `legacy/frontend` 現有頁面，Phase 5 需逐一改寫為 Vue：

| 頁面 | 內容 | 難度 |
|------|------|------|
| 首頁 | 網站簡介、更新日誌 | 低 |
| 新人指南 | 4 分頁：必看／道具／角色系統／活動 | 低（靜態內容） |
| 回鍋玩家 | 4 分頁：養成抽角／同步屬性／日常副本／滿等後 | 低（靜態內容） |
| 商店攻略 | 9 種商店的購買優先度建議 | 低（靜態內容） |
| 深域 | 系統介紹、強化說明、外部連結 | 低 |
| 競技場 | 競技場／試煉／追憶三分類 | 中 |
| 角色養成 | 六星／專武1／專武2／非六星，優先度分級 | 中 |
| 戰隊戰 | 攻略、YouTube 頻道、常用角色（依屬性/傷害類型分類）、補償刀 | 中 |
| **角色圖鑑** | 多維度篩選、搜尋、評級排序分組、懸停詳情 | **高**（核心） |
| **未來視** | 戰隊戰未來視、深淵討伐未來視、角色預測，含 CRUD | **高** |
| **角色編輯器** | 完整 CRUD、四種編輯模式、**拖拽評級**、圖片上傳 | **最高**（最後做） |
| 管理後台 | 各資料表的管理介面、角色自動完成輸入 | 高 |

---

## 領域資料要點（實測自 314 筆角色資料，非文件推測）

寫任何與角色資料相關的程式碼前請注意這些坑：

- **屬性只有 5 種：火屬／水屬／風屬／光屬／闇屬**。舊型別註解寫的「土屬」是錯的。
- **位置 3 種**：前衛／中衛／後衛。
- **評級 6 級**：T0 → T4 → 倉管。但舊資料含髒值 `T3.5`、`不知道`、null，Phase 2 遷移時清理。
- **角色定位**舊資料有 12+ 種（含複合值如「妨礙兼破防」）→ v2 改為固定 6 值的 **enum 陣列**（一角色可多定位）。
- **「常駐/限定」舊資料混了 3 個維度** → v2 拆為 `卡池` / `獲取來源` / `初始星級`。
  絕版狀態**由卡池推導**（只有聯名會絕版），不另存欄位。

以上乾淨值域已定義於 `packages/shared/src/constants/character.ts`，請直接引用，不要重新寫死字串。

---

**最後更新**: 2026-07-21 ｜ Phase 1（monorepo 地基）已完成
