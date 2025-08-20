import express from 'express';
import { dbGet, dbRun, dbAll, prisma } from '../utils/database';
import { generateToken } from '../utils/jwt';
import { requireAuth, requireSuperAdmin } from '../middleware/auth';
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
      'SELECT * FROM admins WHERE username = $1 AND "isActive" = true',
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

    // 生成 JWT Token
    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
      role: admin.role
    });

    // 成功登入
    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 檢查是否需要初始化超級管理員
router.get('/check-init', async (req, res) => {
  try {
    const adminCount = await dbGet('SELECT COUNT(*) as count FROM admins WHERE "isActive" = true');
    res.json({
      needsInit: adminCount.count === 0
    });
  } catch (error) {
    console.error('Error checking admin count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 初始化超級管理員 (僅用於初次設定)
router.post('/init-superadmin', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    // 檢查是否已有管理員
    const adminCount = await dbGet('SELECT COUNT(*) as count FROM admins WHERE "isActive" = true');
    if (adminCount.count > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建超級管理員
    const result = await dbRun(
      `INSERT INTO admins (id, username, password, name, role, "isActive", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, 'superadmin', true, NOW(), NOW())`,
      [
        'superadmin_' + Date.now(),
        username,
        hashedPassword,
        name || username
      ]
    );

    res.json({
      success: true,
      message: 'Super admin created successfully'
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
    res.status(500).json({ error: 'Failed to create super admin' });
  }
});

// 創建第一個管理員 (僅在沒有任何管理員時允許)
router.post('/create-first-admin', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 檢查是否已有任何管理員
    const existingAdmins = await dbGet('SELECT COUNT(*) as count FROM admins');
    console.log('Existing admins check:', existingAdmins);
    
    const adminCount = parseInt(existingAdmins?.count) || 0;
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Admin already exists. Use /create-admin endpoint.' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立管理員資料
    const adminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await dbRun(
      `INSERT INTO admins (id, username, password, name, role, "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [adminId, username, hashedPassword, name || 'Super Admin', 'superadmin']
    );

    // 取得創建的管理員資料
    const newAdmin = await dbGet(
      'SELECT id, username, name, role, "isActive" FROM admins WHERE id = $1',
      [adminId]
    );

    res.status(201).json({
      message: 'First admin created successfully',
      admin: newAdmin
    });

  } catch (error) {
    console.error('Create first admin error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 創建管理員 (僅超級管理員可使用)
router.post('/create-admin', requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 創建者資訊已通過中間件驗證

    // 檢查是否已存在
    const existingAdmin = await dbGet(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建一般管理員
    const result = await dbRun(
      `INSERT INTO admins (id, username, password, name, role, "isActive", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, 'admin', true, NOW(), NOW())`,
      [
        'admin_' + Date.now(),
        username,
        hashedPassword,
        name || username
      ]
    );

    // 取得新建立的管理員資料
    const newAdmin = await dbGet(
      'SELECT id, username, name, role FROM admins WHERE username = $1',
      [username]
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

// 獲取管理員列表 (僅超級管理員)
router.get('/admins', requireSuperAdmin, async (req, res) => {
  try {
    
    // 獲取所有管理員
    const admins = await dbAll(
      'SELECT id, username, name, role, "isActive", "createdAt" FROM admins ORDER BY "createdAt" DESC',
      []
    );
    
    res.json({ admins: admins || [] });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 重置管理員密碼 (僅超級管理員)
router.post('/reset-password', requireSuperAdmin, async (req, res) => {
  try {
    const { adminId, newPassword } = req.body;
    
    if (!adminId || !newPassword) {
      return res.status(400).json({ error: 'Admin ID and new password are required' });
    }
    
    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 更新密碼
    await dbRun(
      'UPDATE admins SET password = $1, "updatedAt" = NOW() WHERE id = $2',
      [hashedPassword, adminId]
    );
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// 啟用/停用管理員 (僅超級管理員)
router.post('/toggle-admin', requireSuperAdmin, async (req, res) => {
  try {
    const { adminId, isActive } = req.body;
    
    if (!adminId || isActive === undefined) {
      return res.status(400).json({ error: 'Admin ID and status are required' });
    }
    
    // 防止停用自己
    if (adminId === req.admin?.adminId && !isActive) {
      return res.status(400).json({ error: 'Cannot deactivate yourself' });
    }
    
    // 更新狀態
    await dbRun(
      'UPDATE admins SET "isActive" = $1, "updatedAt" = NOW() WHERE id = $2',
      [isActive, adminId]
    );
    
    res.json({ success: true, message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Error toggling admin:', error);
    res.status(500).json({ error: 'Failed to update admin status' });
  }
});

// Debug endpoint to check database state (temporary)
router.get('/debug-tables', async (req, res) => {
  try {
    // Force Prisma to connect and potentially create tables
    await prisma.$connect();
    
    const tables = await dbAll('SELECT table_name FROM information_schema.tables WHERE table_schema = $1', ['public']);
    
    // Try to get admin count, which should work since we created the admin earlier
    let adminCount = '0';
    let sampleAdmin = null;
    
    try {
      const adminResult = await dbGet('SELECT COUNT(*)::text as count FROM admins');
      adminCount = adminResult?.count || '0';
      sampleAdmin = await dbGet('SELECT id, username, "isActive", role FROM admins LIMIT 1');
    } catch (adminError) {
      console.log('Admin table query error:', adminError);
    }
    
    res.json({
      tables: tables.map((t: any) => t.table_name),
      adminCount,
      sampleAdmin,
      prismaConnected: true
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Initialize schema endpoint (temporary)
router.post('/init-schema', async (req, res) => {
  try {
    console.log('Initializing database schema...');
    
    // Force Prisma to initialize the database by making a simple query
    await prisma.$connect();
    
    // Try to create any missing tables by doing a simple upsert operation
    // First check if Character table exists by attempting a simple query
    try {
      await prisma.character.findFirst();
      console.log('Character table exists');
    } catch (error) {
      console.log('Character table might not exist:', error);
    }
    
    // Check Admin table
    try {
      await prisma.admin.findFirst();
      console.log('Admin table exists');
    } catch (error) {
      console.log('Admin table might not exist:', error);
    }
    
    res.json({ 
      success: true, 
      message: 'Schema initialization attempted',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Schema initialization error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Schema initialization failed'
    });
  }
});

export default router;