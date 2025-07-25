import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 取得所有角色
router.get('/', async (req, res) => {
  try {
    const { 位置, 屬性, 競技場進攻, 競技場防守, 戰隊戰等抄作業場合, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (位置) where.位置 = 位置;
    if (屬性) where.屬性 = 屬性;
    if (競技場進攻) where.競技場進攻 = 競技場進攻;
    if (競技場防守) where.競技場防守 = 競技場防守;
    if (戰隊戰等抄作業場合) where.戰隊戰等抄作業場合 = 戰隊戰等抄作業場合;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [characters, total] = await Promise.all([
      prisma.character.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { 角色名稱: 'asc' }
      }),
      prisma.character.count({ where })
    ]);
    
    res.json({
      data: characters,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// 取得單一角色
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const character = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});


export default router;