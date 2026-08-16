import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 獲取所有戰隊戰補償刀角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.clanBattleCompensationCharacter.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching clan battle compensation characters:', error);
    res.status(500).json({ error: 'Failed to fetch clan battle compensation characters' });
  }
});

// 新增戰隊戰補償刀角色
router.post('/', async (req, res) => {
  try {
    const { character_name } = req.body;
    
    if (!character_name) {
      return res.status(400).json({ error: 'character_name is required' });
    }

    const character = await prisma.clanBattleCompensationCharacter.create({
      data: {
        character_name
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating clan battle compensation character:', error);
    res.status(500).json({ error: 'Failed to create clan battle compensation character' });
  }
});

// 更新戰隊戰補償刀角色
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name } = req.body;

    if (!character_name) {
      return res.status(400).json({ error: 'character_name is required' });
    }

    const character = await prisma.clanBattleCompensationCharacter.update({
      where: { id: parseInt(id) },
      data: {
        character_name
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating clan battle compensation character:', error);
    res.status(500).json({ error: 'Failed to update clan battle compensation character' });
  }
});

// 刪除戰隊戰補償刀角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.clanBattleCompensationCharacter.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting clan battle compensation character:', error);
    res.status(500).json({ error: 'Failed to delete clan battle compensation character' });
  }
});

export default router;