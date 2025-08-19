import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dbRun } from '../utils/database';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// 設置照片儲存位置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../data/images/characters');
    
    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 先使用臨時檔名，稍後在處理時重新命名
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const tempFilename = `temp_${timestamp}${ext}`;
    
    cb(null, tempFilename);
  }
});

const upload = multer({ 
  storage,
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

    // 重新命名檔案為角色名稱，只保留中文字符
    const ext = path.extname(req.file.originalname);
    // 移除括號、&等符號，只保留中文字符和數字
    const cleanCharacterName = characterName.replace(/[()（）&\s]/g, '');
    const finalFilename = `${cleanCharacterName}${ext}`;
    const oldPath = req.file.path;
    const newPath = path.join(path.dirname(oldPath), finalFilename);

    // 重新命名檔案
    try {
      fs.renameSync(oldPath, newPath);
    } catch (renameError: any) {
      console.error('Failed to rename file:', renameError);
      return res.status(500).json({ error: '檔案重新命名失敗' });
    }

    console.log('Photo uploaded successfully:', {
      originalName: characterName,
      cleanedName: cleanCharacterName,
      filename: finalFilename,
      path: newPath
    });

    // 更新角色的頭像檔名
    try {
      await dbRun(
        'UPDATE characters SET [頭像檔名] = ? WHERE [角色名稱] = ?',
        [finalFilename, characterName]
      );
      console.log('Updated character avatar filename in database');
    } catch (dbError: any) {
      console.error('Failed to update avatar filename in database:', dbError);
      // 不要因為資料庫更新失敗而導致整個上傳失敗
    }

    res.json({
      message: '照片上傳成功',
      filename: finalFilename,
      path: newPath,
      characterName
    });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: '照片上傳失敗', details: error.message });
  }
});

export default router;