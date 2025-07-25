# 🌸 公主連結攻略網站

一個專注於角色圖鑑功能的公主連結遊戲攻略網站，提供完整的角色資料查詢和多維度篩選功能。

## ✨ 主要功能

### 🔍 角色圖鑑系統
- **完整角色資料庫**: 300+ 個角色的詳細資訊
- **多維度篩選**: 位置、屬性、用途、定位、獲得方式
- **智能搜索**: 支援角色名稱和暱稱搜索
- **評級排序**: T0→倉管 或反向排序
- **分組顯示**: 按競技場進攻評級分組展示
- **懸停詳情**: 滑鼠懸停顯示完整角色資訊

### 🎮 導航系統
- 新人指南 (開發中)
- 回鍋玩家建議 (開發中)
- **角色圖鑑** ✅
- 商店攻略 (開發中)
- 競技場攻略 (開發中)
- 戰隊戰攻略 (開發中)
- 深域攻略 (開發中)
- 角色養成指南 (開發中)

## 🛠️ 技術棧

### 前端
- **React 18** + TypeScript
- **Vite** 建置工具
- **Tailwind CSS** 樣式框架
- **Axios** HTTP 客戶端
- **Lucide React** 圖標庫

### 後端
- **Node.js** + TypeScript
- **Express.js** Web 框架
- **SQLite** 資料庫
- **Prisma** ORM

## 🚀 快速開始

### 前置需求
- Node.js 18+
- npm 或 yarn

### 安裝與啟動

1. **複製專案**
```bash
git clone https://github.com/chen126888/princess-connect-guide.git
cd princess-connect-guide
```

2. **啟動後端服務** (端口 3000)
```bash
cd backend
npm install
npx ts-node src/simple-server.ts
```

3. **啟動前端服務** (端口 5173)
```bash
cd frontend
npm install
npm run dev
```

4. **訪問應用**
   - 前端: http://localhost:5173
   - 後端 API: http://localhost:3000/api

## 📋 API 文檔

### 端點列表
- `GET /api/health` - 健康檢查
- `GET /api/characters` - 獲取角色列表
- `GET /api/characters/:id` - 獲取單一角色

### 篩選參數
| 參數 | 類型 | 說明 | 可選值 |
|------|------|------|--------|
| `位置` | string | 角色位置 | 前衛, 中衛, 後衛 |
| `屬性` | string | 角色屬性 | 火屬, 水屬, 風屬, 光屬, 闇屬 |
| `競技場進攻` | string | 競技場進攻評級 | T0, T1, T2, T3, T4, 倉管 |
| `競技場防守` | string | 競技場防守評級 | T0, T1, T2, T3, T4, 倉管 |
| `page` | number | 頁數 | 預設 1 |
| `limit` | number | 每頁數量 | 預設 100 |

### 使用範例
```bash
# 獲取所有前衛角色
curl "http://localhost:3000/api/characters?位置=前衛"

# 獲取 T0 級別的光屬角色
curl "http://localhost:3000/api/characters?競技場進攻=T0&屬性=光屬"
```

## 📁 專案結構

```
princess-connect-guide/
├── frontend/                    # React 前端應用
│   ├── src/
│   │   ├── pages/Characters/   # 角色圖鑑頁面
│   │   ├── types/              # TypeScript 類型定義
│   │   ├── services/           # API 服務
│   │   └── App.tsx             # 主應用
│   └── package.json
├── backend/                     # Node.js 後端
│   ├── src/
│   │   ├── routes/characters.ts # 角色 API 路由
│   │   └── simple-server.ts    # 主服務器
│   ├── prisma/
│   │   └── schema.prisma       # 資料庫 schema
│   └── package.json
├── data/
│   └── images/characters/      # 角色圖片
└── CLAUDE.md                   # 開發文檔
```

## 🗄️ 資料庫 Schema

```prisma
model Character {
  id          String   @id @default(cuid())
  角色名稱      String   @unique
  暱稱         String?
  位置         String   // 前衛、中衛、後衛
  角色定位      String?
  常駐限定      String?
  屬性         String?
  能力偏向      String?
  競技場進攻    String?
  競技場防守    String?
  戰隊戰等抄作業場合 String?  
  說明         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🎯 使用方式

1. 訪問 http://localhost:5173
2. 點擊「角色圖鑑」按鈕
3. 使用左側搜索框和排序選項
4. 使用右側的圓形 checkbox 進行多維度篩選
5. 將滑鼠懸停在角色圖片上查看詳細資訊
6. 結果會按評級分組顯示

## 🎨 UI 特色

- **圓形 Checkbox**: 自訂圓形選擇框設計
- **漸層背景**: 藍紫粉漸層背景
- **毛玻璃效果**: 半透明毛玻璃卡片
- **懸停動畫**: 平滑的懸停過渡效果
- **響應式設計**: 支援各種螢幕尺寸

## 📊 資料來源

- Excel 檔案: `2025公主連結角色簡略介紹表_converted.xlsx`
- 包含前衛、中衛、後衛三個工作表的角色資料
- 所有欄位名稱保持原始中文格式

## 🔮 未來計畫

- [ ] 新人指南頁面
- [ ] 回鍋玩家建議
- [ ] 商店攻略系統
- [ ] 競技場隊伍配置
- [ ] 戰隊戰攻略
- [ ] 深域攻略
- [ ] 角色養成指南
- [ ] 角色圖片整合
- [ ] 行動裝置優化

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📝 授權

本專案僅供學習和個人使用，遊戲相關資料版權歸原廠商所有。

---

**開發狀態**: 角色圖鑑功能完成 ✅  
**最後更新**: 2025年7月25日
