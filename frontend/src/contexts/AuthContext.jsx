// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { setAuthToken } from '../api/api';

const AuthContext = createContext();

// The hook is defined normally:
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Sync token -> API headers + refresh user if needed
  useEffect(() => {
    setAuthToken(token);

    if (token && !user) {
      (async () => {
        try {
          setLoading(true);
          const { data } = await API.get('/api/auth/me');
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch (err) {
          console.error('Auth refresh failed', err);
          logout();
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [token]);

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// IMPORTANT: Do NOT re-export useAuth here again.
// Only export AuthContext:
export { AuthContext };
