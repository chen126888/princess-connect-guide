import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/future-predictions - 獲取所有預測
router.get('/', async (req, res) => {
  try {
    const predictions = await prisma.futureCharacterPrediction.findMany({
      orderBy: [
        { predicted_year: 'asc' },
        { predicted_month: 'asc' },
        { character_name: 'asc' }
      ]
    });
    res.json(predictions);
  } catch (error) {
    console.error('獲取未來視預測失敗:', error);
    res.status(500).json({ error: '獲取未來視預測失敗' });
  }
});

// GET /api/future-predictions/:id - 獲取單一預測
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prediction = await prisma.futureCharacterPrediction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!prediction) {
      return res.status(404).json({ error: '找不到該預測記錄' });
    }

    res.json(prediction);
  } catch (error) {
    console.error('獲取預測記錄失敗:', error);
    res.status(500).json({ error: '獲取預測記錄失敗' });
  }
});

// POST /api/future-predictions - 新增預測
router.post('/', async (req, res) => {
  try {
    const { character_name, prediction_type, predicted_year, predicted_month, notes } = req.body;

    // 驗證必填欄位
    if (!character_name || !prediction_type || !predicted_year || !predicted_month) {
      return res.status(400).json({ error: '缺少必填欄位' });
    }

    // 驗證預測類型
    const validTypes = ['六星開花', '專一', '專二', '新出'];
    if (!validTypes.includes(prediction_type)) {
      return res.status(400).json({ error: '無效的預測類型' });
    }

    // 驗證年月份
    if (predicted_year < 2020 || predicted_year > 2030) {
      return res.status(400).json({ error: '年份必須在2020-2030之間' });
    }
    if (predicted_month < 1 || predicted_month > 12) {
      return res.status(400).json({ error: '月份必須在1-12之間' });
    }

    const newPrediction = await prisma.futureCharacterPrediction.create({
      data: {
        character_name,
        prediction_type,
        predicted_year: parseInt(predicted_year),
        predicted_month: parseInt(predicted_month),
        notes: notes || null
      }
    });

    res.status(201).json(newPrediction);
  } catch (error) {
    console.error('新增預測失敗:', error);
    res.status(500).json({ error: '新增預測失敗' });
  }
});

// PUT /api/future-predictions/:id - 更新預測
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { character_name, prediction_type, predicted_year, predicted_month, notes } = req.body;

    // 驗證預測是否存在
    const existing = await prisma.futureCharacterPrediction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: '找不到該預測記錄' });
    }

    // 驗證必填欄位
    if (!character_name || !prediction_type || !predicted_year || !predicted_month) {
      return res.status(400).json({ error: '缺少必填欄位' });
    }

    // 驗證預測類型
    const validTypes = ['六星開花', '專一', '專二', '新出'];
    if (!validTypes.includes(prediction_type)) {
      return res.status(400).json({ error: '無效的預測類型' });
    }

    // 驗證年月份
    if (predicted_year < 2020 || predicted_year > 2030) {
      return res.status(400).json({ error: '年份必須在2020-2030之間' });
    }
    if (predicted_month < 1 || predicted_month > 12) {
      return res.status(400).json({ error: '月份必須在1-12之間' });
    }

    const updatedPrediction = await prisma.futureCharacterPrediction.update({
      where: { id: parseInt(id) },
      data: {
        character_name,
        prediction_type,
        predicted_year: parseInt(predicted_year),
        predicted_month: parseInt(predicted_month),
        notes: notes || null
      }
    });

    res.json(updatedPrediction);
  } catch (error) {
    console.error('更新預測失敗:', error);
    res.status(500).json({ error: '更新預測失敗' });
  }
});

// DELETE /api/future-predictions/:id - 刪除預測
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 驗證預測是否存在
    const existing = await prisma.futureCharacterPrediction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      return res.status(404).json({ error: '找不到該預測記錄' });
    }

    await prisma.futureCharacterPrediction.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: '預測記錄已刪除' });
  } catch (error) {
    console.error('刪除預測失敗:', error);
    res.status(500).json({ error: '刪除預測失敗' });
  }
});

// GET /api/future-predictions/by-type/:type - 按類型獲取預測
router.get('/by-type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['六星開花', '專一', '專二', '新出'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: '無效的預測類型' });
    }

    const predictions = await prisma.futureCharacterPrediction.findMany({
      where: { prediction_type: type },
      orderBy: [
        { predicted_year: 'asc' },
        { predicted_month: 'asc' },
        { character_name: 'asc' }
      ]
    });

    res.json(predictions);
  } catch (error) {
    console.error('獲取預測失敗:', error);
    res.status(500).json({ error: '獲取預測失敗' });
  }
});

export default router;