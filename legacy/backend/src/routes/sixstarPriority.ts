import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const validTiers = ['SS', 'S', 'AA', 'A', 'B', 'C'];

// 獲取所有六星優先度角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.sixstarPriority.findMany({
      orderBy: { id: 'asc' }
    });
    
    // 手動排序
    const tierOrder = { 'SS': 1, 'S': 2, 'AA': 3, 'A': 4, 'B': 5, 'C': 6 };
    const sortedCharacters = characters.sort((a, b) => {
      const orderA = tierOrder[a.tier as keyof typeof tierOrder] || 999;
      const orderB = tierOrder[b.tier as keyof typeof tierOrder] || 999;
      return orderA - orderB;
    });
    
    res.json(sortedCharacters);
  } catch (error) {
    console.error('Error fetching sixstar priority:', error);
    res.status(500).json({ error: 'Failed to fetch sixstar priority' });
  }
});

// 新增六星優先度角色
router.post('/', async (req, res) => {
  try {
    const { character_name, tier } = req.body;
    
    if (!character_name || !tier) {
      return res.status(400).json({ error: 'character_name and tier are required' });
    }

    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: `tier must be one of: ${validTiers.join(', ')}` });
    }

    const character = await prisma.sixstarPriority.create({
      data: {
        character_name,
        tier
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating sixstar priority:', error);
    res.status(500).json({ error: 'Failed to create sixstar priority' });
  }
});

// 更新六星優先度角色
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name, tier } = req.body;

    if (!character_name || !tier) {
      return res.status(400).json({ error: 'character_name and tier are required' });
    }

    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: `tier must be one of: ${validTiers.join(', ')}` });
    }

    const character = await prisma.sixstarPriority.update({
      where: { id: parseInt(id) },
      data: {
        character_name,
        tier
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating sixstar priority:', error);
    res.status(500).json({ error: 'Failed to update sixstar priority' });
  }
});

// 刪除六星優先度角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.sixstarPriority.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sixstar priority:', error);
    res.status(500).json({ error: 'Failed to delete sixstar priority' });
  }
});

export default router;