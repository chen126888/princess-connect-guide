-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clan_battles" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "clan_battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "characters" JSONB NOT NULL,
    "source_url" VARCHAR,
    "boss_number" INTEGER NOT NULL,
    "clan_battle_id" INTEGER NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arena_common_characters" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,

    CONSTRAINT "arena_common_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trial_characters" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "trial_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sixstar_priority" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,

    CONSTRAINT "sixstar_priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ue1_priority" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,

    CONSTRAINT "ue1_priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ue2_priority" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,

    CONSTRAINT "ue2_priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_sixstar_characters" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "acquisition_method" TEXT NOT NULL,

    CONSTRAINT "non_sixstar_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clan_battle_common_characters" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "damage_type" TEXT NOT NULL,
    "importance" TEXT NOT NULL,

    CONSTRAINT "clan_battle_common_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clan_battle_compensation_characters" (
    "id" SERIAL NOT NULL,
    "character_name" TEXT NOT NULL,

    CONSTRAINT "clan_battle_compensation_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "future_character_predictions" (
    "id" SERIAL NOT NULL,
    "角色名稱" TEXT NOT NULL,
    "新增類型" TEXT NOT NULL,
    "預計年份" INTEGER NOT NULL,
    "預計月份" INTEGER NOT NULL,
    "備註" TEXT,

    CONSTRAINT "future_character_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_角色名稱_key" ON "characters"("角色名稱");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_clan_battle_id_fkey" FOREIGN KEY ("clan_battle_id") REFERENCES "clan_battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
