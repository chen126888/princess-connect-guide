import jwt from 'jsonwebtoken';

const getJWTSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  return JWT_SECRET;
};

export interface JWTPayload {
  adminId: string;
  username: string;
  role: 'admin' | 'superadmin';
  iat?: number;
  exp?: number;
}

// 生成 JWT Token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, getJWTSecret(), { expiresIn: '24h' });
};

// 驗證 JWT Token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

// 解析 Token（不驗證，用於獲取過期信息）
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
};