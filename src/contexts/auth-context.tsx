
"use client";

import type { UserRole } from '@/lib/types';
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
  currentUserRole: UserRole | null;
  username: string | null;
  currentUserId: string | null;
  isAuthenticated: boolean;
  loading: boolean; // Expose loading state
  login: (accessToken: string, refreshToken: string) => Promise<void>; // Modified to accept tokens
  logout: () => void;
  accessToken: string | null; // Expose access token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
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
      // Basic check for token validity (you might want a more robust check or token refresh logic here)
      if (decodedAccess && decodedAccess.exp * 1000 > Date.now()) {
        // Token is likely valid and not expired
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        // Assuming user info is in the token payload (user_id, username, role)
        setCurrentUserId(decodedAccess.user_id ? String(decodedAccess.user_id) : null); // Assuming user_id is numeric
        setUsername(decodedAccess.username || null); // Assuming username is in payload
        setCurrentUserRole(decodedAccess.role as UserRole || null); // Assuming role is in payload
        setIsAuthenticated(true);
      } else {
        // Token is expired or invalid, clear it
        logout(); // Use the logout function to clear invalid tokens
      }
    }
    setLoading(false);
  }, []); // Empty dependency array means this runs once on mount

  // Async login function to handle tokens
  const login = async (newAccessToken: string, newRefreshToken: string) => {
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    const decodedAccess = decodeToken(newAccessToken);
    if (decodedAccess) {
       setCurrentUserId(decodedAccess.user_id ? String(decodedAccess.user_id) : null);
       setUsername(decodedAccess.username || null);
       setCurrentUserRole(decodedAccess.role as UserRole || null); // Assuming role is in payload
       setIsAuthenticated(true);
       router.push('/'); // Redirect to homepage after successful login
    } else {
        // If token decoding fails, consider it a failed login
        logout();
        // Optionally, set an error state here
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setCurrentUserRole(null);
    setUsername(null);
    setCurrentUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUserRole'); // Remove old items as well
    localStorage.removeItem('username'); // Remove old items as well
    localStorage.removeItem('currentUserId'); // Remove old items as well
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ currentUserRole, username, currentUserId, isAuthenticated, loading, login, logout, accessToken }}>
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
