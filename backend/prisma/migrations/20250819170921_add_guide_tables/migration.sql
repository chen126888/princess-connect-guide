-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "角色名稱" TEXT NOT NULL,
    "暱稱" TEXT,
    "位置" TEXT NOT NULL,
    "角色定位" TEXT,
    "常駐/限定" TEXT,
    "屬性" TEXT,
    "能力偏向" TEXT,
    "競技場進攻" TEXT,
    "競技場防守" TEXT,
    "戰隊戰" TEXT,
    "深域及抄作業" TEXT,
    "說明" TEXT,
    "頭像檔名" TEXT,
    "六星頭像檔名" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
    "updatedAt" TEXT NOT NULL DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "shop_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shopType" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "shop_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "currencyIcon" TEXT NOT NULL,
    "currencyName" TEXT NOT NULL,
    "currencySource" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "arena_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "arenaType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clan_battle_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'main',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dungeon_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "character_development_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "newbie_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "return_player_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_角色名稱_key" ON "characters"("角色名稱");

-- CreateIndex
CREATE UNIQUE INDEX "shop_items_name_shopType_key" ON "shop_items"("name", "shopType");

-- CreateIndex
CREATE UNIQUE INDEX "shop_guides_shopType_key" ON "shop_guides"("shopType");

-- CreateIndex
CREATE UNIQUE INDEX "arena_guides_arenaType_key" ON "arena_guides"("arenaType");

-- CreateIndex
CREATE UNIQUE INDEX "character_development_guides_category_key" ON "character_development_guides"("category");

-- CreateIndex
CREATE UNIQUE INDEX "newbie_guides_category_key" ON "newbie_guides"("category");

-- CreateIndex
CREATE UNIQUE INDEX "return_player_guides_category_key" ON "return_player_guides"("category");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
