const { PrismaClient } = require('@prisma/client');

// 遠端資料庫連接
const remotePrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://princess_connect_guide_user:2Pqjj5ptqpjukp60v8fRy8gkaNAPbmRZ@dpg-d2ic66buibrs73euuqfg-a.singapore-postgres.render.com/princess_connect_guide"
    }
  }
});

// 本地資料庫連接
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/princess_connect_local"
    }
  }
});

async function syncDatabase() {
  try {
    console.log('🚀 開始同步遠端資料庫到本地...');

    // 清空本地資料庫所有表格
    console.log('🗑️  清空本地資料庫...');
    
    // 按照外鍵依賴順序刪除
    await localPrisma.team.deleteMany({});
    await localPrisma.clanBattle.deleteMany({});
    await localPrisma.clanBattleCompensationCharacter.deleteMany({});
    await localPrisma.clanBattleCommonCharacter.deleteMany({});
    await localPrisma.nonSixstarCharacter.deleteMany({});
    await localPrisma.ue2Priority.deleteMany({});
    await localPrisma.ue1Priority.deleteMany({});
    await localPrisma.sixstarPriority.deleteMany({});
    await localPrisma.trialCharacter.deleteMany({});
    await localPrisma.arenaCommonCharacter.deleteMany({});
    await localPrisma.character.deleteMany({});
    await localPrisma.admin.deleteMany({});

    // 同步各個表格
    console.log('📥 同步 Admin 資料...');
    const admins = await remotePrisma.admin.findMany();
    for (const admin of admins) {
      await localPrisma.admin.create({ data: admin });
    }

    console.log('📥 同步 Character 資料...');
    const characters = await remotePrisma.character.findMany();
    for (const character of characters) {
      await localPrisma.character.create({ data: character });
    }

    console.log('📥 同步 ArenaCommonCharacter 資料...');
    const arenaCommons = await remotePrisma.arenaCommonCharacter.findMany();
    for (const item of arenaCommons) {
      await localPrisma.arenaCommonCharacter.create({ data: item });
    }

    console.log('📥 同步 TrialCharacter 資料...');
    const trialCharacters = await remotePrisma.trialCharacter.findMany();
    for (const item of trialCharacters) {
      await localPrisma.trialCharacter.create({ data: item });
    }

    console.log('📥 同步 SixstarPriority 資料...');
    const sixstars = await remotePrisma.sixstarPriority.findMany();
    for (const item of sixstars) {
      await localPrisma.sixstarPriority.create({ data: item });
    }

    console.log('📥 同步 Ue1Priority 資料...');
    const ue1s = await remotePrisma.ue1Priority.findMany();
    for (const item of ue1s) {
      await localPrisma.ue1Priority.create({ data: item });
    }

    console.log('📥 同步 Ue2Priority 資料...');
    const ue2s = await remotePrisma.ue2Priority.findMany();
    for (const item of ue2s) {
      await localPrisma.ue2Priority.create({ data: item });
    }

    console.log('📥 同步 NonSixstarCharacter 資料...');
    const nonSixstars = await remotePrisma.nonSixstarCharacter.findMany();
    for (const item of nonSixstars) {
      await localPrisma.nonSixstarCharacter.create({ data: item });
    }

    console.log('📥 同步 ClanBattleCommonCharacter 資料...');
    const clanCommons = await remotePrisma.clanBattleCommonCharacter.findMany();
    for (const item of clanCommons) {
      await localPrisma.clanBattleCommonCharacter.create({ data: item });
    }

    console.log('📥 同步 ClanBattleCompensationCharacter 資料...');
    const clanCompensations = await remotePrisma.clanBattleCompensationCharacter.findMany();
    for (const item of clanCompensations) {
      await localPrisma.clanBattleCompensationCharacter.create({ data: item });
    }

    console.log('📥 同步 ClanBattle 資料...');
    const clanBattles = await remotePrisma.clanBattle.findMany();
    for (const item of clanBattles) {
      await localPrisma.clanBattle.create({ data: item });
    }

    console.log('📥 同步 Team 資料...');
    const teams = await remotePrisma.team.findMany();
    for (const item of teams) {
      await localPrisma.team.create({ data: item });
    }

    console.log('✅ 資料庫同步完成！');
    
    // 顯示統計
    const localCharacterCount = await localPrisma.character.count();
    const localClanBattleCount = await localPrisma.clanBattle.count();
    const localTeamCount = await localPrisma.team.count();
    
    console.log('📊 同步結果統計：');
    console.log(`   - 角色數量: ${localCharacterCount}`);
    console.log(`   - 戰隊戰數量: ${localClanBattleCount}`);
    console.log(`   - 隊伍數量: ${localTeamCount}`);
    console.log(`   - 管理員數量: ${admins.length}`);

  } catch (error) {
    console.error('❌ 同步失敗:', error);
  } finally {
    await remotePrisma.$disconnect();
    await localPrisma.$disconnect();
  }
}

syncDatabase();