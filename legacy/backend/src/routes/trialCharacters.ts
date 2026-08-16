import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 獲取所有戰鬥試煉場角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.trialCharacter.findMany({
      orderBy: [
        { category: 'asc' },
        { id: 'asc' }
      ]
    });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching trial characters:', error);
    res.status(500).json({ error: 'Failed to fetch trial characters' });
  }
});

// 新增戰鬥試煉場角色
router.post('/', async (req, res) => {
  try {
    const { character_name, category } = req.body;
    
    if (!character_name || !category) {
      return res.status(400).json({ error: 'character_name and category are required' });
    }

    if (!['推薦練', '後期練'].includes(category)) {
      return res.status(400).json({ error: 'category must be "推薦練" or "後期練"' });
    }

    const character = await prisma.trialCharacter.create({
      data: {
        character_name,
        category
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating trial character:', error);
    res.status(500).json({ error: 'Failed to create trial character' });
  }
});

// 更新戰鬥試煉場角色
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name, category } = req.body;

    if (!character_name || !category) {
      return res.status(400).json({ error: 'character_name and category are required' });
    }

    if (!['推薦練', '後期練'].includes(category)) {
      return res.status(400).json({ error: 'category must be "推薦練" or "後期練"' });
    }

    const character = await prisma.trialCharacter.update({
      where: { id: parseInt(id) },
      data: {
        character_name,
        category
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating trial character:', error);
    res.status(500).json({ error: 'Failed to update trial character' });
  }
});

// 刪除戰鬥試煉場角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.trialCharacter.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting trial character:', error);
    res.status(500).json({ error: 'Failed to delete trial character' });
  }
});

export default router;