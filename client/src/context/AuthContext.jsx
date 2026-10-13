import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useAccessibility } from './AccessibilityContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('signbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('signbridge_token') || null);
  const [loading, setLoading] = useState(true);
  const { setFontSize, setHighContrast, setReducedMotion, setLanguage } = useAccessibility();

  // Validate session on app launch
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('signbridge_user', JSON.stringify(res.user));

            // Sync user saved accessibility preferences if present
            if (res.user.accessibilityPreferences) {
              const prefs = res.user.accessibilityPreferences;
              if (prefs.fontSize) setFontSize(prefs.fontSize);
              if (typeof prefs.highContrast === 'boolean') setHighContrast(prefs.highContrast);
              if (typeof prefs.reducedMotion === 'boolean') setReducedMotion(prefs.reducedMotion);
            }
            if (res.user.preferredLanguage) {
              setLanguage(res.user.preferredLanguage);
            }
          }
        } catch (err) {
          console.warn('Session verification failed, continuing in guest mode');
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('signbridge_token', res.token);
      localStorage.setItem('signbridge_user', JSON.stringify(res.user));

      if (res.user.accessibilityPreferences) {
        const prefs = res.user.accessibilityPreferences;
        if (prefs.fontSize) setFontSize(prefs.fontSize);
        if (typeof prefs.highContrast === 'boolean') setHighContrast(prefs.highContrast);
        if (typeof prefs.reducedMotion === 'boolean') setReducedMotion(prefs.reducedMotion);
      }
      if (res.user.preferredLanguage) {
        setLanguage(res.user.preferredLanguage);
      }
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('signbridge_token', res.token);
      localStorage.setItem('signbridge_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('signbridge_token');
    localStorage.removeItem('signbridge_user');
  };

  const updatePreferences = async (newPrefs) => {
    if (!token) return;
    try {
      const res = await authApi.updatePreferences(newPrefs);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('signbridge_user', JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      console.error('Failed to update remote preferences:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
