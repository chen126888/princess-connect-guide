import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentAdmin, isSuperAdmin, type AdminInfo } from '../utils/auth';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuthStatus = () => {
    try {
      const authenticated = isAuthenticated();
      const admin = authenticated ? getCurrentAdmin() : null;
      
      setIsLoggedIn(authenticated);
      setCurrentAdmin(admin);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setCurrentAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    
    // 監聽 storage 變化（例如在其他tab登入/登出）
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    isLoggedIn,
    isAdmin: isLoggedIn,
    isSuperAdmin: isLoggedIn && isSuperAdmin(),
    currentAdmin,
    loading,
    refetch: checkAuthStatus
  };
};