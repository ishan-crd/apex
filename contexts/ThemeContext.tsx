import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type Colors } from '@/constants/colors';

const ThemeContext = createContext<Colors>(darkColors);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  return (
    <ThemeContext.Provider value={scheme === 'light' ? lightColors : darkColors}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useColors = (): Colors => useContext(ThemeContext);
