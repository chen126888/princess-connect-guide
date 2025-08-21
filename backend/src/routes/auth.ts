import express from 'express';
import { prisma } from '../utils/database';
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
    const admin = await prisma.admin.findFirst({
      where: {
        username,
        isActive: true
      }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成 JWT Token
    const userRole = admin.role === 'superadmin' ? 'superadmin' : 'admin';
    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
      role: userRole
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
    const adminCount = await prisma.admin.count({
      where: { isActive: true }
    });
    
    res.json({
      needsInit: adminCount === 0
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
    const adminCount = await prisma.admin.count({
      where: { isActive: true }
    });
    
    if (adminCount > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 12);
    const adminId = 'admin_' + Date.now();

    // 創建超級管理員
    const admin = await prisma.admin.create({
      data: {
        id: adminId,
        username,
        password: hashedPassword,
        name: name || 'Super Admin',
        role: 'superadmin',
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Super admin created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 創建管理員 (需要超級管理員權限)
router.post('/create-admin', requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, name, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // 檢查用戶名是否已存在
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 12);
    const adminId = 'admin_' + Date.now();

    // 創建管理員
    const admin = await prisma.admin.create({
      data: {
        id: adminId,
        username,
        password: hashedPassword,
        name: name || username,
        role,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 取得管理員列表 (需要超級管理員權限)
router.get('/admins', requireSuperAdmin, async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      where: { isActive: true },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 重置密碼 (需要超級管理員權限)
router.post('/reset-password', requireSuperAdmin, async (req, res) => {
  try {
    const { adminId, newPassword } = req.body;

    if (!adminId || !newPassword) {
      return res.status(400).json({ error: 'Admin ID and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 切換管理員狀態 (需要超級管理員權限)
router.post('/toggle-admin', requireSuperAdmin, async (req, res) => {
  try {
    const { adminId, isActive } = req.body;

    if (!adminId || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Admin ID and status are required' });
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: { isActive }
    });

    res.json({
      success: true,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      admin: {
        id: admin.id,
        username: admin.username,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 停用管理員 (需要超級管理員權限) - 保留原有路由作為兼容
router.patch('/admins/:id/deactivate', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await prisma.admin.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Admin deactivated successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error deactivating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 取得目前登入管理員資訊
router.get('/me', requireAuth, async (req, res) => {
  try {
    const adminId = (req as any).admin.adminId;

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;