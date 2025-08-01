import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
    // 使用角色名稱作為檔案名稱
    const characterName = req.body.characterName;
    const ext = path.extname(file.originalname);
    const filename = `${characterName}${ext}`;
    
    cb(null, filename);
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

// 上傳角色照片
router.post('/character-photo', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '沒有上傳檔案' });
    }

    const { characterName } = req.body;
    
    if (!characterName) {
      return res.status(400).json({ error: '缺少角色名稱' });
    }

    console.log('Photo uploaded successfully:', {
      filename: req.file.filename,
      path: req.file.path,
      characterName
    });

    res.json({
      message: '照片上傳成功',
      filename: req.file.filename,
      path: req.file.path,
      characterName
    });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: '照片上傳失敗', details: error.message });
  }
});

export default router;