import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('@PataAlerta:user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('@PataAlerta:token');
    if (!token) return;
    api.get('/auth/me').then((r) => {
      setUser(r.data);
      localStorage.setItem('@PataAlerta:user', JSON.stringify(r.data));
    }).catch(() => {
      localStorage.removeItem('@PataAlerta:token');
      localStorage.removeItem('@PataAlerta:user');
      setUser(null);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const r = await api.post('/auth/login', { email, password });
      const userData = {
        id: r.data.userId,
        name: r.data.name,
        email: r.data.email,
        plan: r.data.plan,
      };
      localStorage.setItem('@PataAlerta:token', r.data.token);
      localStorage.setItem('@PataAlerta:user', JSON.stringify(userData));
      setUser(userData);
      return r.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const r = await api.post('/auth/register', { name, email, password });
      const userData = {
        id: r.data.userId,
        name: r.data.name,
        email: r.data.email,
        plan: r.data.plan,
      };
      localStorage.setItem('@PataAlerta:token', r.data.token);
      localStorage.setItem('@PataAlerta:user', JSON.stringify(userData));
      setUser(userData);
      return r.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@PataAlerta:token');
    localStorage.removeItem('@PataAlerta:user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
