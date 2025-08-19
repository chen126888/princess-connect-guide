import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 商店攻略 API
router.get('/shop', async (req, res) => {
  try {
    const shopGuides = await prisma.shopGuide.findMany({
      orderBy: { shopType: 'asc' }
    });
    res.json({ success: true, data: shopGuides });
  } catch (error) {
    console.error('獲取商店攻略失敗:', error);
    res.status(500).json({ success: false, error: '獲取商店攻略失敗' });
  }
});

router.post('/shop', requireAuth, async (req, res) => {
  try {
    const shopGuide = await prisma.shopGuide.create({
      data: req.body
    });
    res.json({ success: true, data: shopGuide });
  } catch (error) {
    console.error('創建商店攻略失敗:', error);
    res.status(500).json({ success: false, error: '創建商店攻略失敗' });
  }
});

router.put('/shop/:shopType', requireAuth, async (req, res) => {
  try {
    const { shopType } = req.params;
    const shopGuide = await prisma.shopGuide.upsert({
      where: { shopType },
      update: req.body,
      create: { shopType, ...req.body }
    });
    res.json({ success: true, data: shopGuide });
  } catch (error) {
    console.error('更新商店攻略失敗:', error);
    res.status(500).json({ success: false, error: '更新商店攻略失敗' });
  }
});

// 競技場攻略 API
router.get('/arena', async (req, res) => {
  try {
    const arenaGuides = await prisma.arenaGuide.findMany({
      orderBy: { arenaType: 'asc' }
    });
    res.json({ success: true, data: arenaGuides });
  } catch (error) {
    console.error('獲取競技場攻略失敗:', error);
    res.status(500).json({ success: false, error: '獲取競技場攻略失敗' });
  }
});

router.post('/arena', requireAuth, async (req, res) => {
  try {
    const arenaGuide = await prisma.arenaGuide.create({
      data: req.body
    });
    res.json({ success: true, data: arenaGuide });
  } catch (error) {
    console.error('創建競技場攻略失敗:', error);
    res.status(500).json({ success: false, error: '創建競技場攻略失敗' });
  }
});

router.put('/arena/:arenaType', requireAuth, async (req, res) => {
  try {
    const { arenaType } = req.params;
    const arenaGuide = await prisma.arenaGuide.upsert({
      where: { arenaType },
      update: req.body,
      create: { arenaType, ...req.body }
    });
    res.json({ success: true, data: arenaGuide });
  } catch (error) {
    console.error('更新競技場攻略失敗:', error);
    res.status(500).json({ success: false, error: '更新競技場攻略失敗' });
  }
});

// 戰隊戰攻略 API
router.get('/clan-battle', async (req, res) => {
  try {
    const clanBattleGuides = await prisma.clanBattleGuide.findMany({
      orderBy: { type: 'asc' }
    });
    res.json({ success: true, data: clanBattleGuides });
  } catch (error) {
    console.error('獲取戰隊戰攻略失敗:', error);
    res.status(500).json({ success: false, error: '獲取戰隊戰攻略失敗' });
  }
});

router.post('/clan-battle', requireAuth, async (req, res) => {
  try {
    const clanBattleGuide = await prisma.clanBattleGuide.create({
      data: req.body
    });
    res.json({ success: true, data: clanBattleGuide });
  } catch (error) {
    console.error('創建戰隊戰攻略失敗:', error);
    res.status(500).json({ success: false, error: '創建戰隊戰攻略失敗' });
  }
});

router.put('/clan-battle/:type', requireAuth, async (req, res) => {
  try {
    const { type } = req.params;
    const clanBattleGuide = await prisma.clanBattleGuide.upsert({
      where: { type },
      update: req.body,
      create: { type, ...req.body }
    });
    res.json({ success: true, data: clanBattleGuide });
  } catch (error) {
    console.error('更新戰隊戰攻略失敗:', error);
    res.status(500).json({ success: false, error: '更新戰隊戰攻略失敗' });
  }
});

// 深域攻略 API
router.get('/dungeon', async (req, res) => {
  try {
    const dungeonGuides = await prisma.dungeonGuide.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1 // 只取最新的一筆
    });
    res.json({ 
      success: true, 
      data: dungeonGuides.length > 0 ? dungeonGuides[0] : null 
    });
  } catch (error) {
    console.error('獲取深域攻略失敗:', error);
    res.status(500).json({ success: false, error: '獲取深域攻略失敗' });
  }
});

router.post('/dungeon', requireAuth, async (req, res) => {
  try {
    const dungeonGuide = await prisma.dungeonGuide.create({
      data: req.body
    });
    res.json({ success: true, data: dungeonGuide });
  } catch (error) {
    console.error('創建深域攻略失敗:', error);
    res.status(500).json({ success: false, error: '創建深域攻略失敗' });
  }
});

// 角色養成攻略 API
router.get('/character-development', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category: category as string } : {};
    
    const developmentGuides = await prisma.characterDevelopmentGuide.findMany({
      where,
      orderBy: { category: 'asc' }
    });
    res.json({ success: true, data: developmentGuides });
  } catch (error) {
    console.error('獲取角色養成攻略失敗:', error);
    res.status(500).json({ success: false, error: '獲取角色養成攻略失敗' });
  }
});

router.put('/character-development/:category', requireAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const developmentGuide = await prisma.characterDevelopmentGuide.upsert({
      where: { category },
      update: req.body,
      create: { category, ...req.body }
    });
    res.json({ success: true, data: developmentGuide });
  } catch (error) {
    console.error('更新角色養成攻略失敗:', error);
    res.status(500).json({ success: false, error: '更新角色養成攻略失敗' });
  }
});

// 新人指南 API
router.get('/newbie', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category: category as string } : {};
    
    const newbieGuides = await prisma.newbieGuide.findMany({
      where,
      orderBy: { category: 'asc' }
    });
    res.json({ success: true, data: newbieGuides });
  } catch (error) {
    console.error('獲取新人指南失敗:', error);
    res.status(500).json({ success: false, error: '獲取新人指南失敗' });
  }
});

router.put('/newbie/:category', requireAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const newbieGuide = await prisma.newbieGuide.upsert({
      where: { category },
      update: req.body,
      create: { category, ...req.body }
    });
    res.json({ success: true, data: newbieGuide });
  } catch (error) {
    console.error('更新新人指南失敗:', error);
    res.status(500).json({ success: false, error: '更新新人指南失敗' });
  }
});

// 回鍋玩家指南 API
router.get('/return-player', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category: category as string } : {};
    
    const returnPlayerGuides = await prisma.returnPlayerGuide.findMany({
      where,
      orderBy: { category: 'asc' }
    });
    res.json({ success: true, data: returnPlayerGuides });
  } catch (error) {
    console.error('獲取回鍋玩家指南失敗:', error);
    res.status(500).json({ success: false, error: '獲取回鍋玩家指南失敗' });
  }
});

router.put('/return-player/:category', requireAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const returnPlayerGuide = await prisma.returnPlayerGuide.upsert({
      where: { category },
      update: req.body,
      create: { category, ...req.body }
    });
    res.json({ success: true, data: returnPlayerGuide });
  } catch (error) {
    console.error('更新回鍋玩家指南失敗:', error);
    res.status(500).json({ success: false, error: '更新回鍋玩家指南失敗' });
  }
});

export default router;