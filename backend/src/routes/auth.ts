import express from 'express';
import { dbGet, dbRun } from '../utils/database';
import bcrypt from 'bcrypt';

const router = express.Router();

// 管理員登入
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 查找管理員
    const admin = await dbGet(
      'SELECT * FROM admins WHERE username = ? AND isActive = 1',
      [username]
    );

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 成功登入
    res.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 創建管理員 (僅用於初始設定)
router.post('/create-admin', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 檢查是否已存在
    const existingAdmin = await dbGet(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建管理員
    const result = await dbRun(
      `INSERT INTO admins (id, username, password, name, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        'admin_' + Date.now(), // 簡單的 ID 生成
        username,
        hashedPassword,
        name || username
      ]
    );

    // 取得新建立的管理員資料
    const newAdmin = await dbGet(
      'SELECT id, username, name FROM admins WHERE rowid = ?',
      [result.lastID]
    );

    res.json({
      success: true,
      admin: newAdmin
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

export default router;