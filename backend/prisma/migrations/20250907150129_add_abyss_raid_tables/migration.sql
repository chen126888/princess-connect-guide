-- CreateTable
CREATE TABLE "abyss_raids" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "source_url" VARCHAR,

    CONSTRAINT "abyss_raids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abyss_teams" (
    "id" SERIAL NOT NULL,
    "characters" JSONB NOT NULL,
    "boss_position" TEXT NOT NULL,
    "abyss_raid_id" INTEGER NOT NULL,

    CONSTRAINT "abyss_teams_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "abyss_teams" ADD CONSTRAINT "abyss_teams_abyss_raid_id_fkey" FOREIGN KEY ("abyss_raid_id") REFERENCES "abyss_raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
