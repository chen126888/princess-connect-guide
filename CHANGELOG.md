# 更新紀錄

本檔由 git-cliff 依 Conventional Commits 自動產生，請勿手動編輯。

## 未發布

### 問題修正

- 修復 TypeScript 編譯錯誤，移除未使用的變數
- 修復管理介面表單元件寬度類別衝突問題
- 修復戰隊戰角色顯示問題
- **backend**: 修正 build 指令順序以解決 Prisma 型別錯誤
- Update SQL syntax for PostgreSQL compatibility in upload API
- Include isActive field in admin list API and show all admins
- Correct admin management button visibility logic
- Resolve admin management data loading and missing API routes
- Add missing six-star avatar field mapping in character APIs
- Resolve TypeScript compilation errors for production build
- Transform character data to Chinese field names in backend API
- Update CORS configuration with dynamic origin function
- Allow all origins in production CORS for Render deployment
- Resolve TypeScript role type error in auth.ts
- Update SQL syntax for PostgreSQL compatibility
- Add updatedAt field to admin INSERT statement
- Update auth routes for PostgreSQL compatibility
- Add updatedAt field to admin INSERT statement
- Update SQL syntax for PostgreSQL compatibility
- Replace SQLite with Prisma PostgreSQL client
- Move Prisma commands to build script
- Improve postbuild script reliability
- Improve error handling for create-first-admin endpoint
- Remove data folder from postbuild script for production deployment
- Relax TypeScript config for production deployment
- Resolve character image display issues in shop pages

### 安全性

- Improve CORS configuration with stricter origin checking
- Remove default JWT secret and enforce environment variable
- Remove sensitive files and environment configs from repository
- Add patterns to prevent future sensitive file commits
- Remove sensitive migration scripts and test files

### 文件

- 完成 v2 重構架構設計與施工計畫
- Update documentation files

### 新功能

- 實作全域資料緩存系統以優化API請求效能
- 修復戰隊戰角色圖片邏輯並清理靜態資料
- 新增戰隊戰角色管理系統
- 實作動態角色資料管理系統並優化API請求
- Add R2 status check API and update UI text for cloud storage
- Complete admin management system and fix UI text
- Support character updates by name fallback
- Author credits for Excel links in Dungeon page
- Author credit for video content in return player guide
- Netlify SPA redirect configuration for client-side routing
- Complete API and frontend environment variable configuration
- Transform character API responses to use Chinese field names
- Add create-first-admin endpoint for initial admin setup
- Migrate from SQLite to PostgreSQL
- Add database initialization to postbuild script
- Prepare for production deployment
- Complete modern architecture refactor with cloud deployment support
- Complete Home page with update log management system
- Add non-six-star characters section and enhance return player guidance
- Enhance Character Development page and UE2 data
- Optimize drag rating with attribute filtering and styling
- Implement Clan Battle and Dungeon pages

### 重構

- **monorepo**: 建立 pnpm workspace 骨架並將舊實作降級為 legacy
- 清理程式碼，移除除錯輸出和未使用代碼
- 簡化固定角色功能並清理 SQLite 相關代碼
- 簡化後端架構，移除攻略資料表

### 雜項

- 優化戰隊戰管理介面欄位寬度分布
- 清理臨時資料匯入腳本和敏感資訊
- Enhance newbie guidance for specialized weapon orb usage
- Add resource management guidance for newbie and return players
- Adjust character development priority rankings
- Add author credits and copyright notice
- Change header title to '公主連結新手向攻略網站'
- Change website title and add SEO meta tags

