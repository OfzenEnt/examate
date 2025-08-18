import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [storedUser, refreshToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('refreshToken')
      ]);

      if (storedUser && refreshToken) {
        try {
          const response = await authAPI.refresh(refreshToken);
          await AsyncStorage.setItem('accessToken', response.accessToken);
          await AsyncStorage.setItem('refreshToken', response.refreshToken);
          setUser(JSON.parse(storedUser));
        } catch {
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
      ['user', JSON.stringify(userData)],
      ['accessToken', accessToken],
      ['refreshToken', refreshToken]
    ]);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuth();
    }
  };

  const clearAuth = async () => {
    await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};