import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();

// 延遲創建 PrismaClient，確保環境變數已正確載入
let prisma: PrismaClient;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
    console.log('🔗 Creating PrismaClient with DATABASE_URL:', process.env.DATABASE_URL);
  }
  return prisma;
};

// ============= ClanBattle CRUD =============

// GET /api/clan-battles - 獲取所有戰隊戰
router.get('/', async (req: Request, res: Response) => {
  try {
    const clanBattles = await getPrismaClient().clanBattle.findMany({
      include: {
        teams: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: clanBattles
    });
  } catch (error) {
    console.error('Error fetching clan battles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clan battles'
    });
  }
});

// GET /api/clan-battles/:id - 獲取單一戰隊戰
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clanBattle = await getPrismaClient().clanBattle.findUnique({
      where: { id: parseInt(id) },
      include: {
        teams: {
          orderBy: { boss_number: 'asc' }
        }
      }
    });

    if (!clanBattle) {
      return res.status(404).json({
        success: false,
        error: 'Clan battle not found'
      });
    }

    res.json({
      success: true,
      data: clanBattle
    });
  } catch (error) {
    console.error('Error fetching clan battle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clan battle'
    });
  }
});

// POST /api/clan-battles - 創建新戰隊戰 (需要管理員權限)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { year, month } = req.body;

    // 驗證必填欄位
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        error: 'Year and month are required'
      });
    }

    // 檢查是否已存在相同年月的戰隊戰
    const existing = await getPrismaClient().clanBattle.findFirst({
      where: { year, month }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Clan battle for ${year}/${month} already exists`
      });
    }

    const clanBattle = await getPrismaClient().clanBattle.create({
      data: { year, month },
      include: {
        teams: true
      }
    });

    res.status(201).json({
      success: true,
      data: clanBattle
    });
  } catch (error) {
    console.error('Error creating clan battle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create clan battle'
    });
  }
});

// PUT /api/clan-battles/:id - 更新戰隊戰 (需要管理員權限)
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { year, month } = req.body;

    // 驗證必填欄位
    if (!year || !month) {
      return res.status(400).json({
        success: false,
        error: 'Year and month are required'
      });
    }

    // 檢查戰隊戰是否存在
    const existing = await getPrismaClient().clanBattle.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Clan battle not found'
      });
    }

    // 檢查是否與其他戰隊戰衝突
    const conflict = await getPrismaClient().clanBattle.findFirst({
      where: {
        year,
        month,
        id: { not: parseInt(id) }
      }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        error: `Another clan battle for ${year}/${month} already exists`
      });
    }

    const clanBattle = await getPrismaClient().clanBattle.update({
      where: { id: parseInt(id) },
      data: { year, month },
      include: {
        teams: true
      }
    });

    res.json({
      success: true,
      data: clanBattle
    });
  } catch (error) {
    console.error('Error updating clan battle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update clan battle'
    });
  }
});

// DELETE /api/clan-battles/:id - 刪除戰隊戰 (需要管理員權限)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 檢查戰隊戰是否存在
    const existing = await getPrismaClient().clanBattle.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Clan battle not found'
      });
    }

    // 刪除戰隊戰 (會自動級聯刪除相關隊伍)
    await getPrismaClient().clanBattle.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Clan battle deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting clan battle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete clan battle'
    });
  }
});

// ============= Team CRUD =============

// GET /api/clan-battles/:clanBattleId/teams - 獲取特定戰隊戰的所有隊伍
router.get('/:clanBattleId/teams', async (req: Request, res: Response) => {
  try {
    const { clanBattleId } = req.params;
    const { boss_number } = req.query;

    const whereClause: any = {
      clan_battle_id: parseInt(clanBattleId)
    };

    // 如果有指定 boss_number，則篩選特定王的隊伍
    if (boss_number) {
      whereClause.boss_number = parseInt(boss_number as string);
    }

    const teams = await getPrismaClient().team.findMany({
      where: whereClause,
      orderBy: [
        { boss_number: 'asc' },
        { id: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch teams'
    });
  }
});

// POST /api/clan-battles/:clanBattleId/teams - 新增隊伍 (需要管理員權限)
router.post('/:clanBattleId/teams', requireAuth, async (req: Request, res: Response) => {
  try {
    const { clanBattleId } = req.params;
    const { characters, source_url, boss_number } = req.body;

    // 驗證必填欄位
    if (!characters || !boss_number) {
      return res.status(400).json({
        success: false,
        error: 'Characters and boss_number are required'
      });
    }

    // 驗證戰隊戰是否存在
    const clanBattle = await getPrismaClient().clanBattle.findUnique({
      where: { id: parseInt(clanBattleId) }
    });

    if (!clanBattle) {
      return res.status(404).json({
        success: false,
        error: 'Clan battle not found'
      });
    }

    // 驗證 boss_number 範圍
    if (boss_number < 1 || boss_number > 5) {
      return res.status(400).json({
        success: false,
        error: 'Boss number must be between 1 and 5'
      });
    }

    const team = await getPrismaClient().team.create({
      data: {
        characters,
        source_url,
        boss_number,
        clan_battle_id: parseInt(clanBattleId)
      }
    });

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create team'
    });
  }
});

// PUT /api/clan-battles/teams/:teamId - 更新隊伍 (需要管理員權限)
router.put('/teams/:teamId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { characters, source_url, boss_number } = req.body;

    // 檢查隊伍是否存在
    const existing = await getPrismaClient().team.findUnique({
      where: { id: parseInt(teamId) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // 驗證 boss_number 範圍
    if (boss_number && (boss_number < 1 || boss_number > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Boss number must be between 1 and 5'
      });
    }

    const updateData: any = {};
    if (characters !== undefined) updateData.characters = characters;
    if (source_url !== undefined) updateData.source_url = source_url;
    if (boss_number !== undefined) updateData.boss_number = boss_number;

    const team = await getPrismaClient().team.update({
      where: { id: parseInt(teamId) },
      data: updateData
    });

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update team'
    });
  }
});

// DELETE /api/clan-battles/teams/:teamId - 刪除隊伍 (需要管理員權限)
router.delete('/teams/:teamId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    // 檢查隊伍是否存在
    const existing = await getPrismaClient().team.findUnique({
      where: { id: parseInt(teamId) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    await getPrismaClient().team.delete({
      where: { id: parseInt(teamId) }
    });

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete team'
    });
  }
});

// POST /api/clan-battles/batch-teams - 批次新增隊伍 (需要管理員權限)
router.post('/batch-teams', requireAuth, async (req: Request, res: Response) => {
  try {
    const { year, month, bossNumber, sourceUrl, teams } = req.body;

    // 驗證必填欄位
    if (!year || !month || !bossNumber || !teams || !Array.isArray(teams)) {
      return res.status(400).json({
        success: false,
        error: 'Year, month, bossNumber, and teams array are required'
      });
    }

    // 驗證 teams 格式
    if (teams.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one team is required'
      });
    }

    // 驗證 boss_number 範圍
    if (bossNumber < 1 || bossNumber > 5) {
      return res.status(400).json({
        success: false,
        error: 'Boss number must be between 1 and 5'
      });
    }

    // 查找或創建 ClanBattle
    let clanBattle = await getPrismaClient().clanBattle.findFirst({
      where: { year, month }
    });

    if (!clanBattle) {
      clanBattle = await getPrismaClient().clanBattle.create({
        data: { year, month }
      });
    }

    // 為每個隊伍創建獨立的 Team 記錄
    const createdTeams = [];
    for (const team of teams) {
      const charactersData = {
        teams: [{
          fixedCharacters: team.fixedCharacters || [],
          flexibleOptions: team.flexibleOptions || []
        }]
      };

      const newTeam = await getPrismaClient().team.create({
        data: {
          characters: charactersData,
          source_url: sourceUrl || null,
          boss_number: bossNumber,
          clan_battle_id: clanBattle.id
        }
      });
      
      createdTeams.push(newTeam);
    }

    res.status(201).json({
      success: true,
      data: {
        teams: createdTeams,
        clanBattle
      }
    });
  } catch (error) {
    console.error('Error creating batch teams:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create teams'
    });
  }
});

// POST /api/clan-battles/ensure-future-sight - 確保未來視所需的 ClanBattle 記錄存在
router.post('/ensure-future-sight', async (req: Request, res: Response) => {
  try {
    const { months } = req.body;

    // 驗證參數
    if (!months || !Array.isArray(months) || months.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Months array is required'
      });
    }

    // 驗證每個月份的格式
    for (const month of months) {
      if (!month.year || !month.month || month.year < 2024 || month.month < 1 || month.month > 12) {
        return res.status(400).json({
          success: false,
          error: 'Invalid month format. Each month must have valid year and month properties'
        });
      }
    }

    const createdBattles = [];
    const existingBattles = [];

    // 檢查每個月份並創建缺少的 ClanBattle
    for (const monthData of months) {
      const { year, month } = monthData;

      // 檢查是否已存在
      const existing = await getPrismaClient().clanBattle.findFirst({
        where: { year, month }
      });

      if (existing) {
        existingBattles.push(existing);
      } else {
        // 創建新的 ClanBattle
        const newBattle = await getPrismaClient().clanBattle.create({
          data: { year, month }
        });
        createdBattles.push(newBattle);
      }
    }

    res.json({
      success: true,
      data: {
        created: createdBattles,
        existing: existingBattles,
        total: createdBattles.length + existingBattles.length
      },
      message: `Ensured ${createdBattles.length + existingBattles.length} ClanBattle records (${createdBattles.length} created, ${existingBattles.length} existing)`
    });
  } catch (error) {
    console.error('Error ensuring future sight clan battles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to ensure clan battles'
    });
  }
});

export default router;