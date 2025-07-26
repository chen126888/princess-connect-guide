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
    "戰隊戰等抄作業場合" TEXT,
    "說明" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "character_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "角色名稱" TEXT NOT NULL,
    "頭像檔名" TEXT NOT NULL,
    "六星頭像檔名" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
CREATE TABLE "guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_角色名稱_key" ON "characters"("角色名稱");

-- CreateIndex
CREATE UNIQUE INDEX "character_images_角色名稱_key" ON "character_images"("角色名稱");

-- CreateIndex
CREATE UNIQUE INDEX "shop_items_name_shopType_key" ON "shop_items"("name", "shopType");
