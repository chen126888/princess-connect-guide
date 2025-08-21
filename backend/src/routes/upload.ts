import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dbRun } from '../utils/database';
import { requireAuth } from '../middleware/auth';
import { uploadToR2, validateR2Config } from '../utils/r2Storage';

const router = express.Router();

// 使用記憶體儲存，不儲存到本地磁碟
const upload = multer({ 
  storage: multer.memoryStorage(), // 儲存在記憶體中
  fileFilter: (req, file, cb) => {
    // 只允許圖片格式
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 限制
  }
});

// 上傳角色照片 (需要管理員權限)
router.post('/character-photo', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有上傳檔案' });
    }

    const { characterName } = req.body;
    
    if (!characterName) {
      return res.status(400).json({ error: '缺少角色名稱' });
    }

    // 檢查 R2 配置
    const r2Config = validateR2Config();
    if (!r2Config.valid) {
      console.error('R2 配置不完整:', r2Config.missing);
      return res.status(500).json({ 
        error: 'R2 儲存配置不完整', 
        missing: r2Config.missing 
      });
    }

    // 清理角色名稱，移除括號、&等符號，只保留中文字符和數字
    const ext = path.extname(req.file.originalname);
    const cleanCharacterName = characterName.replace(/[()（）&\s]/g, '');
    const finalFilename = `${cleanCharacterName}${ext}`;

    console.log('開始上傳照片到 R2:', {
      originalName: characterName,
      cleanedName: cleanCharacterName,
      filename: finalFilename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    // 上傳到 R2
    const uploadResult = await uploadToR2(
      req.file.buffer,
      finalFilename,
      req.file.mimetype,
      'characters'
    );

    if (!uploadResult.success) {
      console.error('R2 上傳失敗:', uploadResult.error);
      return res.status(500).json({ 
        error: 'R2 上傳失敗', 
        details: uploadResult.error 
      });
    }

    console.log('✅ R2 上傳成功:', uploadResult.publicUrl);

    // 更新角色的頭像檔名
    try {
      await dbRun(
        'UPDATE characters SET "頭像檔名" = $1 WHERE "角色名稱" = $2',
        [finalFilename, characterName]
      );
      console.log('✅ 資料庫頭像檔名更新成功');
    } catch (dbError: any) {
      console.error('❌ 資料庫頭像檔名更新失敗:', dbError);
      // 不要因為資料庫更新失敗而導致整個上傳失敗
    }

    res.json({
      success: true,
      message: '照片上傳成功',
      filename: finalFilename,
      publicUrl: uploadResult.publicUrl,
      characterName,
      r2Upload: true
    });
  } catch (error: any) {
    console.error('❌ 照片上傳錯誤:', error);
    res.status(500).json({ error: '照片上傳失敗', details: error.message });
  }
});

// 檢查 R2 配置狀態 (需要管理員權限)
router.get('/r2-status', requireAuth, async (req, res) => {
  try {
    const r2Config = validateR2Config();
    
    res.json({
      r2Available: r2Config.valid,
      missing: r2Config.missing,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    console.error('檢查 R2 狀態錯誤:', error);
    res.status(500).json({ error: '檢查 R2 狀態失敗', details: error.message });
  }
});

export default router;