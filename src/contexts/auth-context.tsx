
"use client";

import type { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUserRole: UserRole | null;
  username: string | null;
  currentUserId: string | null; // Added
  isAuthenticated: boolean;
  login: (role: UserRole, username: string, userId: string) => void; // Modified
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // Added
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('currentUserRole') as UserRole | null;
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('currentUserId'); // Added
    if (storedRole && storedUsername && storedUserId) {
      setCurrentUserRole(storedRole);
      setUsername(storedUsername);
      setCurrentUserId(storedUserId); // Added
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (role: UserRole, loggedInUsername: string, userId: string) => { // Modified
    setCurrentUserRole(role);
    setUsername(loggedInUsername);
    setCurrentUserId(userId); // Added
    setIsAuthenticated(true);
    localStorage.setItem('currentUserRole', role);
    localStorage.setItem('username', loggedInUsername);
    localStorage.setItem('currentUserId', userId); // Added
    router.push('/');
  };

  const logout = () => {
    setCurrentUserRole(null);
    setUsername(null);
    setCurrentUserId(null); // Added
    setIsAuthenticated(false);
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('username');
    localStorage.removeItem('currentUserId'); // Added
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ currentUserRole, username, currentUserId, isAuthenticated, login, logout }}>
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
