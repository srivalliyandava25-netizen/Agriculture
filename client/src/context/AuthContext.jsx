import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('mittimitra_token');
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.warn('[Auth] Token verification failed:', err.message);
      localStorage.removeItem('mittimitra_token');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (identifier, password) => {
    const data = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('mittimitra_token', data.token);
    setUser(data.user);
    await fetchCurrentUser();
    return data;
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    localStorage.setItem('mittimitra_token', data.token);
    setUser(data.user);
    await fetchCurrentUser();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mittimitra_token');
    setUser(null);
    setProfile(null);
  };

  const updateProfileData = async (fields) => {
    const data = await api.put('/auth/profile', fields);
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        updateProfile: updateProfileData,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isExpert: user?.role === 'expert'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

