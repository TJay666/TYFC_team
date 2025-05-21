
"use client";

import { USER_ROLES } from '@/lib/types';
import { loginUser, refreshToken, verifyToken } from '@/lib/api/auth-api';
import { fetchCurrentUser } from '@/lib/api/admin-api';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Helper function to decode JWT token payload
const decodeToken = (token: string): any | null => {
  try {
    // The payload is the second part of the token, base64 encoded
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64 string
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

interface AuthContextType {
  currentUserRole: USER_ROLES | null;
  username: string | null;
  currentUserId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  accessToken: string | null;
  authToken: string | null; // 添加這個屬性
  refreshAuthToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<USER_ROLES | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  // Load tokens and user info from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      const decodedAccess = decodeToken(storedAccessToken);
      // Basic check for token validity
      if (decodedAccess && decodedAccess.exp * 1000 > Date.now()) {
        // Token is likely valid and not expired
        setAccessToken(storedAccessToken);
        setRefreshTokenValue(storedRefreshToken);
        // Assuming user info is in the token payload
        setCurrentUserId(decodedAccess.user_id ? String(decodedAccess.user_id) : null);
        setUsername(decodedAccess.username || null);
        setCurrentUserRole(decodedAccess.role as USER_ROLES || null);
        setIsAuthenticated(true);
      } else {
        // Token is expired, try to refresh it
        refreshAuthToken().then(success => {
          if (!success) {
            // If refresh fails, log out
            logout();
          }
        });
      }
    }
    setLoading(false);
  }, []);

  // New login function that uses the updated API
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await loginUser(username, password);
      
      if (response.data && response.status === 200) {
        const { access, refresh } = response.data;
        
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setAccessToken(access);
        setRefreshTokenValue(refresh);
        
        const decodedAccess = decodeToken(access);
        if (decodedAccess) {
          setCurrentUserId(decodedAccess.user_id ? String(decodedAccess.user_id) : null);
          setUsername(decodedAccess.username || null);
          setCurrentUserRole(decodedAccess.role as USER_ROLES || null);
          setIsAuthenticated(true);
          
          // 獲取更多使用者信息
          const userResponse = await fetchCurrentUser(access);
          if (userResponse.data) {
            setUsername(userResponse.data.username);
            setCurrentUserRole(userResponse.data.role);
          }
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Token refresh function
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      if (!refreshTokenValue) {
        return false;
      }
      
      const response = await refreshToken(refreshTokenValue);
      
      if (response.data && response.status === 200) {
        const { access } = response.data;
        
        localStorage.setItem('accessToken', access);
        setAccessToken(access);
        
        const decodedAccess = decodeToken(access);
        if (decodedAccess) {
          setCurrentUserId(decodedAccess.user_id ? String(decodedAccess.user_id) : null);
          setUsername(decodedAccess.username || null);
          setCurrentUserRole(decodedAccess.role as USER_ROLES || null);
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshTokenValue(null);
    setCurrentUserRole(null);
    setUsername(null);
    setCurrentUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };
  return (
    <AuthContext.Provider value={{ 
      currentUserRole, 
      username, 
      currentUserId, 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      accessToken,
      authToken: accessToken, // 添加 authToken 屬性，指向 accessToken
      refreshAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
