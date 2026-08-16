import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/abyss-raids - 獲取所有深淵討伐資料
router.get('/', async (req, res) => {
  try {
    const abyssRaids = await prisma.abyssRaid.findMany({
      include: {
        teams: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });
    
    res.json(abyssRaids);
  } catch (error) {
    console.error('獲取深淵討伐資料失敗:', error);
    res.status(500).json({ error: '獲取深淵討伐資料失敗' });
  }
});

// GET /api/abyss-raids/:year/:month - 獲取特定年月的深淵討伐資料
router.get('/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const abyssRaid = await prisma.abyssRaid.findFirst({
      where: {
        year: parseInt(year),
        month: parseInt(month)
      },
      include: {
        teams: true
      }
    });
    
    if (!abyssRaid) {
      return res.status(404).json({ error: '找不到該期間的深淵討伐資料' });
    }
    
    res.json(abyssRaid);
  } catch (error) {
    console.error('獲取深淵討伐資料失敗:', error);
    res.status(500).json({ error: '獲取深淵討伐資料失敗' });
  }
});

// POST /api/abyss-raids - 新增深淵討伐期間 (需要認證)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { year, month, source_url } = req.body;
    
    // 驗證必填欄位
    if (!year || !month) {
      return res.status(400).json({ error: '年份和月份為必填欄位' });
    }
    
    // 檢查是否已存在該年月的資料
    const existingRaid = await prisma.abyssRaid.findFirst({
      where: {
        year: parseInt(year),
        month: parseInt(month)
      }
    });
    
    if (existingRaid) {
      return res.status(400).json({ error: '該年月的深淵討伐資料已存在' });
    }
    
    const newAbyssRaid = await prisma.abyssRaid.create({
      data: {
        year: parseInt(year),
        month: parseInt(month),
        source_url: source_url || null
      },
      include: {
        teams: true
      }
    });
    
    res.status(201).json(newAbyssRaid);
  } catch (error) {
    console.error('新增深淵討伐期間失敗:', error);
    res.status(500).json({ error: '新增深淵討伐期間失敗' });
  }
});

// PUT /api/abyss-raids/:id - 更新深淵討伐期間 (需要認證)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, source_url } = req.body;
    
    // 檢查該期間是否存在
    const existingRaid = await prisma.abyssRaid.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingRaid) {
      return res.status(404).json({ error: '找不到該深淵討伐期間' });
    }
    
    const updatedAbyssRaid = await prisma.abyssRaid.update({
      where: { id: parseInt(id) },
      data: {
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
        source_url: source_url !== undefined ? (source_url || null) : undefined
      },
      include: {
        teams: true
      }
    });
    
    res.json(updatedAbyssRaid);
  } catch (error) {
    console.error('更新深淵討伐期間失敗:', error);
    res.status(500).json({ error: '更新深淵討伐期間失敗' });
  }
});

// DELETE /api/abyss-raids/:id - 刪除深淵討伐期間 (需要認證)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 檢查該期間是否存在
    const existingRaid = await prisma.abyssRaid.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingRaid) {
      return res.status(404).json({ error: '找不到該深淵討伐期間' });
    }
    
    await prisma.abyssRaid.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: '深淵討伐期間已刪除' });
  } catch (error) {
    console.error('刪除深淵討伐期間失敗:', error);
    res.status(500).json({ error: '刪除深淵討伐期間失敗' });
  }
});

// POST /api/abyss-raids/:id/teams - 新增隊伍到指定期間 (需要認證)
router.post('/:id/teams', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { characters, boss_position, source_url } = req.body;
    
    // 驗證必填欄位
    if (!characters || !boss_position) {
      return res.status(400).json({ error: '隊伍配置和王位置為必填欄位' });
    }
    
    // 驗證王位置
    const validPositions = ['left', 'middle', 'right'];
    if (!validPositions.includes(boss_position)) {
      return res.status(400).json({ error: '無效的王位置，必須是 left、middle 或 right' });
    }
    
    // 檢查深淵討伐期間是否存在
    const abyssRaid = await prisma.abyssRaid.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!abyssRaid) {
      return res.status(404).json({ error: '找不到該深淵討伐期間' });
    }
    
    const newTeam = await prisma.abyssTeam.create({
      data: {
        characters: characters,
        boss_position: boss_position,
        source_url: source_url || null,
        abyss_raid_id: parseInt(id)
      }
    });
    
    res.status(201).json(newTeam);
  } catch (error) {
    console.error('新增深淵討伐隊伍失敗:', error);
    res.status(500).json({ error: '新增深淵討伐隊伍失敗' });
  }
});

// PUT /api/abyss-teams/:id - 更新深淵討伐隊伍 (需要認證)
router.put('/teams/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { characters, boss_position, source_url } = req.body;
    
    // 檢查隊伍是否存在
    const existingTeam = await prisma.abyssTeam.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingTeam) {
      return res.status(404).json({ error: '找不到該隊伍' });
    }
    
    // 驗證王位置（如果有提供）
    if (boss_position) {
      const validPositions = ['left', 'middle', 'right'];
      if (!validPositions.includes(boss_position)) {
        return res.status(400).json({ error: '無效的王位置，必須是 left、middle 或 right' });
      }
    }
    
    const updatedTeam = await prisma.abyssTeam.update({
      where: { id: parseInt(id) },
      data: {
        characters: characters !== undefined ? characters : undefined,
        boss_position: boss_position !== undefined ? boss_position : undefined,
        source_url: source_url !== undefined ? (source_url || null) : undefined
      }
    });
    
    res.json(updatedTeam);
  } catch (error) {
    console.error('更新深淵討伐隊伍失敗:', error);
    res.status(500).json({ error: '更新深淵討伐隊伍失敗' });
  }
});

// DELETE /api/abyss-teams/:id - 刪除深淵討伐隊伍 (需要認證)
router.delete('/teams/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 檢查隊伍是否存在
    const existingTeam = await prisma.abyssTeam.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingTeam) {
      return res.status(404).json({ error: '找不到該隊伍' });
    }
    
    await prisma.abyssTeam.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: '深淵討伐隊伍已刪除' });
  } catch (error) {
    console.error('刪除深淵討伐隊伍失敗:', error);
    res.status(500).json({ error: '刪除深淵討伐隊伍失敗' });
  }
});

export default router;