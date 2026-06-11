'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── Start with null = unknown (not false = logged out) ──
  const [token,   setToken]   = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (stored === 'null' || stored === 'undefined' || !stored) {
      setToken(null);
    } else {
      setToken(stored);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    if (!newToken) return;
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      login,
      logout,
      loading,
      // strictly authenticated only if token is a valid string
      isAuth: typeof token === 'string' && token.length > 0,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Check if you have wrapped your layout/page with <AuthProvider>.');
  }
  return context;
};