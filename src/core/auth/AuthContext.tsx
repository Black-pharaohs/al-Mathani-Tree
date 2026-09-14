/**
 * السبع المثاني — Authentication Context & Hook
 * Client-side session and permission management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Permission, hasPermission, ROLE_PERMISSIONS } from './rbac';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  locale: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  can: (permission: Permission) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'almathani_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch current user on mount or token change
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetch('/api/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'فشل تسجيل الدخول');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
  };

  const register = async (name: string, email: string, password: string, role?: UserRole) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'فشل إنشاء الحساب');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
  };

  const logout = () => {
    if (token) {
      fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const can = (permission: Permission): boolean => {
    if (!user) return hasPermission('visitor', permission);
    return hasPermission(user.role, permission);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, can, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
