import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 獲取所有非六星角色
router.get('/', async (req, res) => {
  try {
    const characters = await prisma.nonSixstarCharacter.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching non-sixstar characters:', error);
    res.status(500).json({ error: 'Failed to fetch non-sixstar characters' });
  }
});

// 新增非六星角色
router.post('/', async (req, res) => {
  try {
    const { character_name, description, acquisition_method } = req.body;
    
    if (!character_name || !description || !acquisition_method) {
      return res.status(400).json({ 
        error: 'character_name, description, and acquisition_method are required' 
      });
    }

    const character = await prisma.nonSixstarCharacter.create({
      data: {
        character_name,
        description,
        acquisition_method
      }
    });
    
    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating non-sixstar character:', error);
    res.status(500).json({ error: 'Failed to create non-sixstar character' });
  }
});

// 更新非六星角色
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name, description, acquisition_method } = req.body;

    if (!character_name || !description || !acquisition_method) {
      return res.status(400).json({ 
        error: 'character_name, description, and acquisition_method are required' 
      });
    }

    const character = await prisma.nonSixstarCharacter.update({
      where: { id: parseInt(id) },
      data: {
        character_name,
        description,
        acquisition_method
      }
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error updating non-sixstar character:', error);
    res.status(500).json({ error: 'Failed to update non-sixstar character' });
  }
});

// 刪除非六星角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.nonSixstarCharacter.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting non-sixstar character:', error);
    res.status(500).json({ error: 'Failed to delete non-sixstar character' });
  }
});

export default router;