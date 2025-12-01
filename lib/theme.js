import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({});

export const lightTheme = {
  isDark: false,
  colors: {
    background: '#ffffff',
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#3b82f6',
    primaryLight: '#eff6ff',
    danger: '#ef4444',
    success: '#10b981',
    headerBg: '#ffffff',
    inputBg: '#f9fafb',
    shadowColor: '#000',
    heroGradientStart: '#ffffff',
    heroGradientEnd: '#f9fafb',
  }
};

export const darkTheme = {
  isDark: true,
  colors: {
    background: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
    primary: '#60a5fa',
    primaryLight: '#1e3a5f',
    danger: '#f87171',
    success: '#34d399',
    headerBg: '#1f2937',
    inputBg: '#374151',
    shadowColor: '#000',
    heroGradientStart: '#1f2937',
    heroGradientEnd: '#111827',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      } else {
        // Default to dark mode if no saved preference
        setIsDark(true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    isDark,
    toggleTheme,
    loading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
