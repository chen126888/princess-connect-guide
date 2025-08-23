import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 獲取所有競技場常用角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.arenaCommonCharacter.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching arena common characters:', error);
    res.status(500).json({ error: 'Failed to fetch arena common characters' });
  }
});

// 新增競技場常用角色
router.post('/', async (req, res) => {
  try {
    const { character_name } = req.body;
    
    if (!character_name) {
      return res.status(400).json({ error: 'character_name is required' });
    }

    const character = await prisma.arenaCommonCharacter.create({
      data: {
        character_name
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating arena common character:', error);
    res.status(500).json({ error: 'Failed to create arena common character' });
  }
});

// 更新競技場常用角色
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name } = req.body;

    if (!character_name) {
      return res.status(400).json({ error: 'character_name is required' });
    }

    const character = await prisma.arenaCommonCharacter.update({
      where: { id: parseInt(id) },
      data: {
        character_name
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating arena common character:', error);
    res.status(500).json({ error: 'Failed to update arena common character' });
  }
});

// 刪除競技場常用角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.arenaCommonCharacter.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting arena common character:', error);
    res.status(500).json({ error: 'Failed to delete arena common character' });
  }
});

export default router;