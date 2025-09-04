import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  initialMode?: ThemeMode;
};

export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps) {
  const systemScheme: ColorSchemeName = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const isDark = useMemo(() => {
    if (mode === 'system') return systemScheme === 'dark';
    return mode === 'dark';
  }, [mode, systemScheme]);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      theme: isDark ? darkTheme : lightTheme,
      mode,
      isDark,
      setMode,
    };
  }, [isDark, mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}


