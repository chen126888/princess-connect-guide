import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

// 擴展 Request 類型以包含 admin 信息
declare global {
  namespace Express {
    interface Request {
      admin?: JWTPayload;
    }
  }
}

// 基礎認證中間件 - 驗證是否為有效管理員
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前綴
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 將管理員信息附加到請求對象
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// 超級管理員權限檢查中間件
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  // 先檢查基礎認證
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    
    // 檢查是否為超級管理員
    if (req.admin?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    
    next();
  });
};

// 可選認證中間件 - 如果有 token 就驗證，沒有就跳過
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded) {
        req.admin = decoded;
      }
    }
    
    // 無論是否有 token 都繼續
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // 錯誤時也繼續，不阻斷請求
    next();
  }
};