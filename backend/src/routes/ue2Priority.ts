import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const validTiers = ['SS', 'S', 'A'];

// 獲取所有專用裝備2優先度角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.ue2Priority.findMany({
      orderBy: { id: 'asc' }
    });
    
    // 手動排序
    const tierOrder = { 'SS': 1, 'S': 2, 'A': 3 };
    const sortedCharacters = characters.sort((a, b) => {
      const orderA = tierOrder[a.tier as keyof typeof tierOrder] || 999;
      const orderB = tierOrder[b.tier as keyof typeof tierOrder] || 999;
      return orderA - orderB;
    });
    
    res.json(sortedCharacters);
  } catch (error) {
    console.error('Error fetching ue2 priority:', error);
    res.status(500).json({ error: 'Failed to fetch ue2 priority' });
  }
});

// 新增專用裝備2優先度角色
router.post('/', async (req, res) => {
  try {
    const { character_name, tier } = req.body;
    
    if (!character_name || !tier) {
      return res.status(400).json({ error: 'character_name and tier are required' });
    }

    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: `tier must be one of: ${validTiers.join(', ')}` });
    }

    const character = await prisma.ue2Priority.create({
      data: {
        character_name,
        tier
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating ue2 priority:', error);
    res.status(500).json({ error: 'Failed to create ue2 priority' });
  }
});

// 更新專用裝備2優先度角色
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

    const character = await prisma.ue2Priority.update({
      where: { id: parseInt(id) },
      data: {
        character_name,
        tier
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating ue2 priority:', error);
    res.status(500).json({ error: 'Failed to update ue2 priority' });
  }
});

// 刪除專用裝備2優先度角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.ue2Priority.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ue2 priority:', error);
    res.status(500).json({ error: 'Failed to delete ue2 priority' });
  }
});

export default router;