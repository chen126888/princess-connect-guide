import express from 'express';
import { dbGet, dbAll, dbRun } from '../utils/database';

const router = express.Router();

// 取得所有角色
router.get('/', async (req, res) => {
  try {
    const { 位置, 屬性, 競技場進攻, 競技場防守, 戰隊戰, 深域及抄作業, page = 1, limit = 100 } = req.query;
    
    // 建立篩選條件
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (位置) {
      conditions.push('位置 = ?');
      params.push(位置);
    }
    if (屬性) {
      conditions.push('屬性 = ?');
      params.push(屬性);
    }
    if (競技場進攻) {
      conditions.push('競技場進攻 = ?');
      params.push(競技場進攻);
    }
    if (競技場防守) {
      conditions.push('競技場防守 = ?');
      params.push(競技場防守);
    }
    if (戰隊戰) {
      conditions.push('戰隊戰 = ?');
      params.push(戰隊戰);
    }
    if (深域及抄作業) {
      conditions.push('深域及抄作業 = ?');
      params.push(深域及抄作業);
    }
    
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (Number(page) - 1) * Number(limit);
    
    // 查詢角色列表
    const charactersQuery = `
      SELECT * FROM characters 
      ${whereClause}
      ORDER BY 角色名稱 ASC
      LIMIT ? OFFSET ?
    `;
    const charactersParams = [...params, Number(limit), offset];
    
    // 查詢總數
    const countQuery = `
      SELECT COUNT(*) as total FROM characters 
      ${whereClause}
    `;
    
    const [characters, countResult] = await Promise.all([
      dbAll(charactersQuery, charactersParams),
      dbGet(countQuery, params)
    ]);
    
    const total = countResult.total;
    
    res.json({
      characters: characters,
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

// 批次更新角色評級 - 必須在 /:id 路由之前
router.patch('/batch-ratings', async (req, res) => {
  try {
    const { updates } = req.body;
    
    console.log('Batch rating updates:', updates);
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required and cannot be empty' });
    }
    
    // 驗證更新資料格式
    const allowedCategories = ['競技場進攻', '競技場防守', '戰隊戰', '深域及抄作業'];
    const allowedValues = ['T0', 'T1', 'T2', 'T3', 'T4', '倉管', '']; // 添加空字符串作為有效值
    
    for (const update of updates) {
      if (!update.characterId || !update.category || update.value === undefined) {
        return res.status(400).json({ error: 'Each update must have characterId, category, and value' });
      }
      
      if (!allowedCategories.includes(update.category)) {
        return res.status(400).json({ error: `Invalid category: ${update.category}` });
      }
      
      if (update.value !== '' && !allowedValues.includes(update.value)) {
        return res.status(400).json({ error: `Invalid rating value: ${update.value}` });
      }
    }
    
    // 執行批次更新
    const results = [];
    for (const update of updates) {
      try {
        const updateQuery = `
          UPDATE characters 
          SET [${update.category}] = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        
        const result = await dbRun(updateQuery, [update.value || null, update.characterId]);
        results.push({
          characterId: update.characterId,
          category: update.category,
          success: true,
          changes: result.changes
        });
      } catch (error: any) {
        console.error(`Error updating character ${update.characterId}:`, error);
        results.push({
          characterId: update.characterId,
          category: update.category,
          success: false,
          error: error.message
        });
      }
    }
    
    // 檢查是否有失敗的更新
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.warn('Some updates failed:', failures);
    }
    
    res.json({
      message: 'Batch update completed',
      totalUpdates: updates.length,
      successful: results.filter(r => r.success).length,
      failed: failures.length,
      results
    });
    
  } catch (error: any) {
    console.error('Error in batch rating update:', error);
    res.status(500).json({ error: 'Failed to perform batch update', details: error.message });
  }
});

// 取得單一角色
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const character = await dbGet(
      'SELECT * FROM characters WHERE id = ?', 
      [id]
    );
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// 更新角色資料
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('Update request for ID:', id);
    console.log('Update data received:', updateData);
    
    // 建立更新欄位
    const updateFields: string[] = [];
    const params: any[] = [];
    
    // 支援的更新欄位 (使用中文欄位名)
    const allowedFields = ['暱稱', '位置', '屬性', '角色定位', '常駐/限定', '能力偏向', '競技場進攻', '競技場防守', '戰隊戰', '深域及抄作業', '說明', '頭像檔名'];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        // 特殊處理含有斜線的欄位名
        const columnName = field === '常駐/限定' ? '[常駐/限定]' : `[${field}]`;
        updateFields.push(`${columnName} = ?`);
        params.push(updateData[field] || null); // 空字符串轉為 null
      }
    }
    
    if (updateFields.length === 0) {
      console.log('No valid fields to update');
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    params.push(id); // WHERE 條件的 id
    
    const updateQuery = `
      UPDATE characters 
      SET ${updateFields.join(', ')}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    console.log('Update query:', updateQuery);
    console.log('Query params:', params);
    
    const result = await dbRun(updateQuery, params);
    console.log('Update result:', result);
    
    // 返回更新後的角色資料
    const updatedCharacter = await dbGet('SELECT * FROM characters WHERE id = ?', [id]);
    
    res.json(updatedCharacter);
  } catch (error: any) {
    console.error('Error updating character:', error);
    res.status(500).json({ error: 'Failed to update character', details: error.message });
  }
});

// 新增角色
router.post('/', async (req, res) => {
  try {
    const characterData = req.body;
    
    console.log('Creating new character:', characterData);
    
    // 檢查必要欄位
    if (!characterData.角色名稱 || !characterData.位置) {
      return res.status(400).json({ error: 'Character name and position are required' });
    }
    
    // 檢查角色名稱是否已存在
    const existingCharacter = await dbGet(
      'SELECT * FROM characters WHERE [角色名稱] = ?',
      [characterData.角色名稱]
    );
    
    if (existingCharacter) {
      return res.status(400).json({ error: 'Character with this name already exists' });
    }
    
    // 建立新角色
    const id = 'char_' + Date.now(); // 簡單的 ID 生成
    
    const insertQuery = `
      INSERT INTO characters (
        id, [角色名稱], [暱稱], [位置], [角色定位], [常駐/限定], 
        [屬性], [能力偏向], [競技場進攻], [競技場防守], [戰隊戰], 
        [深域及抄作業], [說明], createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    const params = [
      id,
      characterData.角色名稱,
      characterData.暱稱 || null,
      characterData.位置,
      characterData.角色定位 || null,
      characterData['常駐/限定'] || null,
      characterData.屬性 || null,
      characterData.能力偏向 || null,
      characterData.競技場進攻 || null,
      characterData.競技場防守 || null,
      characterData.戰隊戰 || null,
      characterData.深域及抄作業 || null,
      characterData.說明 || null
    ];
    
    await dbRun(insertQuery, params);
    
    // 返回新建立的角色資料
    const newCharacter = await dbGet('SELECT * FROM characters WHERE id = ?', [id]);
    
    res.status(201).json(newCharacter);
  } catch (error: any) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Failed to create character', details: error.message });
  }
});

// 刪除角色
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting character with ID:', id);
    
    // 檢查角色是否存在
    const character = await dbGet('SELECT * FROM characters WHERE id = ?', [id]);
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // 刪除角色
    const result = await dbRun('DELETE FROM characters WHERE id = ?', [id]);
    
    console.log('Delete result:', result);
    
    res.json({ message: 'Character deleted successfully', deletedCharacter: character });
  } catch (error: any) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character', details: error.message });
  }
});

export default router;