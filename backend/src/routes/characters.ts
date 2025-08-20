import express from 'express';
import { prisma } from '../utils/database';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = express.Router();

// 轉換函數：將 Prisma 查詢結果轉換為前端期望的中文欄位名
const transformCharacterForFrontend = (character: any) => {
  return {
    id: character.id,
    角色名稱: character.name,
    暱稱: character.nickname,
    位置: character.position,
    角色定位: character.role,
    '常駐/限定': character.rarity,
    屬性: character.element,
    能力偏向: character.ability,
    競技場進攻: character.arena_atk,
    競技場防守: character.arena_def,
    戰隊戰: character.clan_battle,
    深域及抄作業: character.dungeon,
    說明: character.description,
    頭像檔名: character.avatar,
    六星頭像檔名: character.avatar_6,
    createdAt: character.createdAt,
    updatedAt: character.updatedAt
  };
};

// 取得所有角色 (公開 API)
router.get('/', async (req, res) => {
  try {
    const { 位置, 屬性, 競技場進攻, 競技場防守, 戰隊戰, 深域及抄作業, page = 1, limit = 100 } = req.query;
    
    // 建立篩選條件 (使用 Prisma 的 where 條件)
    const where: any = {};
    
    if (位置) where.position = 位置 as string;
    if (屬性) where.element = 屬性 as string;
    if (競技場進攻) where.arena_atk = 競技場進攻 as string;
    if (競技場防守) where.arena_def = 競技場防守 as string;
    if (戰隊戰) where.clan_battle = 戰隊戰 as string;
    if (深域及抄作業) where.dungeon = 深域及抄作業 as string;
    
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // 查詢角色列表和總數
    const [characters, total] = await Promise.all([
      prisma.character.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.character.count({ where })
    ]);
    
    // 轉換角色資料為前端期望的格式
    const transformedCharacters = characters.map(transformCharacterForFrontend);
    
    res.json({
      characters: transformedCharacters,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// 批次更新角色評級 (需要管理員權限)
router.patch('/batch-ratings', requireAuth, async (req, res) => {
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
        // 映射分類到資料庫欄位
        const fieldMap: Record<string, string> = {
          '競技場進攻': 'arena_atk',
          '競技場防守': 'arena_def',
          '戰隊戰': 'clan_battle',
          '深域及抄作業': 'dungeon'
        };
        
        const field = fieldMap[update.category];
        const updateData: any = {};
        updateData[field] = update.value || null;
        
        await prisma.character.update({
          where: { id: update.characterId },
          data: updateData
        });
        
        results.push({
          characterId: update.characterId,
          category: update.category,
          success: true
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

// 取得單一角色 (公開 API)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const character = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // 轉換角色資料為前端期望的格式
    const transformedCharacter = transformCharacterForFrontend(character);
    
    res.json(transformedCharacter);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// 更新角色資料 (需要管理員權限)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('Update request for ID:', id);
    console.log('Update data received:', updateData);
    
    // 建立更新資料，映射中文欄位到資料庫欄位
    const mappedData: any = {};
    
    if (updateData.暱稱 !== undefined) mappedData.nickname = updateData.暱稱 || null;
    if (updateData.位置 !== undefined) mappedData.position = updateData.位置;
    if (updateData.屬性 !== undefined) mappedData.element = updateData.屬性 || null;
    if (updateData.角色定位 !== undefined) mappedData.role = updateData.角色定位 || null;
    if (updateData['常駐/限定'] !== undefined) mappedData.rarity = updateData['常駐/限定'] || null;
    if (updateData.能力偏向 !== undefined) mappedData.ability = updateData.能力偏向 || null;
    if (updateData.競技場進攻 !== undefined) mappedData.arena_atk = updateData.競技場進攻 || null;
    if (updateData.競技場防守 !== undefined) mappedData.arena_def = updateData.競技場防守 || null;
    if (updateData.戰隊戰 !== undefined) mappedData.clan_battle = updateData.戰隊戰 || null;
    if (updateData.深域及抄作業 !== undefined) mappedData.dungeon = updateData.深域及抄作業 || null;
    if (updateData.說明 !== undefined) mappedData.description = updateData.說明 || null;
    if (updateData.頭像檔名 !== undefined) mappedData.avatar = updateData.頭像檔名 || null;
    
    if (Object.keys(mappedData).length === 0) {
      console.log('No valid fields to update');
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    console.log('Mapped update data:', mappedData);
    
    const updatedCharacter = await prisma.character.update({
      where: { id },
      data: mappedData
    });
    
    // 轉換角色資料為前端期望的格式
    const transformedCharacter = transformCharacterForFrontend(updatedCharacter);
    
    res.json(transformedCharacter);
  } catch (error: any) {
    console.error('Error updating character:', error);
    res.status(500).json({ error: 'Failed to update character', details: error.message });
  }
});

// 新增角色 (需要管理員權限)
router.post('/', requireAuth, async (req, res) => {
  try {
    const characterData = req.body;
    
    console.log('Creating new character:', characterData);
    
    // 檢查必要欄位
    if (!characterData.角色名稱 || !characterData.位置) {
      return res.status(400).json({ error: 'Character name and position are required' });
    }
    
    // 檢查角色名稱是否已存在
    const existingCharacter = await prisma.character.findUnique({
      where: { name: characterData.角色名稱 }
    });
    
    if (existingCharacter) {
      return res.status(400).json({ error: 'Character with this name already exists' });
    }
    
    // 建立新角色
    const id = 'char_' + Date.now(); // 簡單的 ID 生成
    
    const newCharacter = await prisma.character.create({
      data: {
        id,
        name: characterData.角色名稱,
        nickname: characterData.暱稱 || null,
        position: characterData.位置,
        role: characterData.角色定位 || null,
        rarity: characterData['常駐/限定'] || null,
        element: characterData.屬性 || null,
        ability: characterData.能力偏向 || null,
        arena_atk: characterData.競技場進攻 || null,
        arena_def: characterData.競技場防守 || null,
        clan_battle: characterData.戰隊戰 || null,
        dungeon: characterData.深域及抄作業 || null,
        description: characterData.說明 || null,
        avatar: characterData.頭像檔名 || null
      }
    });
    
    // 轉換角色資料為前端期望的格式
    const transformedCharacter = transformCharacterForFrontend(newCharacter);
    
    res.status(201).json(transformedCharacter);
  } catch (error: any) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Failed to create character', details: error.message });
  }
});

// 刪除角色 (需要管理員權限)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting character with ID:', id);
    
    // 檢查角色是否存在
    const character = await prisma.character.findUnique({
      where: { id }
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // 刪除角色
    await prisma.character.delete({
      where: { id }
    });
    
    console.log('Character deleted successfully');
    
    res.json({ message: 'Character deleted successfully', deletedCharacter: character });
  } catch (error: any) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character', details: error.message });
  }
});

export default router;