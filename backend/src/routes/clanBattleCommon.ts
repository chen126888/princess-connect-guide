import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 獲取所有戰隊戰常用角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.clanBattleCommonCharacter.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching clan battle common characters:', error);
    res.status(500).json({ error: 'Failed to fetch clan battle common characters' });
  }
});

// 新增戰隊戰常用角色
router.post('/', async (req, res) => {
  try {
    const { character_name, attribute, damage_type, importance } = req.body;
    
    if (!character_name || !attribute || !damage_type || !importance) {
      return res.status(400).json({ error: 'character_name, attribute, damage_type and importance are required' });
    }

    const character = await prisma.clanBattleCommonCharacter.create({
      data: {
        character_name,
        attribute,
        damage_type,
        importance
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating clan battle common character:', error);
    res.status(500).json({ error: 'Failed to create clan battle common character' });
  }
});

// 更新戰隊戰常用角色
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name, attribute, damage_type, importance } = req.body;

    if (!character_name || !attribute || !damage_type || !importance) {
      return res.status(400).json({ error: 'character_name, attribute, damage_type and importance are required' });
    }

    const character = await prisma.clanBattleCommonCharacter.update({
      where: { id: parseInt(id) },
      data: {
        character_name,
        attribute,
        damage_type,
        importance
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating clan battle common character:', error);
    res.status(500).json({ error: 'Failed to update clan battle common character' });
  }
});

// 刪除戰隊戰常用角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.clanBattleCommonCharacter.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting clan battle common character:', error);
    res.status(500).json({ error: 'Failed to delete clan battle common character' });
  }
});

export default router;