
"use client";

import type { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUserRole: UserRole | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (role: UserRole, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // To prevent flicker on initial load
  const router = useRouter();

  useEffect(() => {
    // Try to load auth state from localStorage on initial mount
    const storedRole = localStorage.getItem('currentUserRole') as UserRole | null;
    const storedUsername = localStorage.getItem('username');
    if (storedRole && storedUsername) {
      setCurrentUserRole(storedRole);
      setUsername(storedUsername);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (role: UserRole, loggedInUsername: string) => {
    setCurrentUserRole(role);
    setUsername(loggedInUsername);
    setIsAuthenticated(true);
    localStorage.setItem('currentUserRole', role);
    localStorage.setItem('username', loggedInUsername);
    router.push('/'); // Redirect to main app page after login
  };

  const logout = () => {
    setCurrentUserRole(null);
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('username');
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ currentUserRole, username, isAuthenticated, login, logout }}>
      {!loading && children}
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
