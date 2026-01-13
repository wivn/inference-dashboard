import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { colorSchemes, type ColorSchemeName, type ThemeMode, type ColorScheme } from '../data/colorSchemes';

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
  currentColors: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorSchemeName) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [colorScheme, setColorSchemeState] = useState<ColorSchemeName>(() => {
    const saved = localStorage.getItem('color-scheme');
    if (saved && saved in colorSchemes) return saved as ColorSchemeName;
    return 'cyberpunk';
  });

  const currentColors = colorSchemes[colorScheme][mode];

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const setColorScheme = (scheme: ColorSchemeName) => {
    setColorSchemeState(scheme);
    localStorage.setItem('color-scheme', scheme);
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentColors.primary);
    root.style.setProperty('--color-secondary', currentColors.secondary);
    root.style.setProperty('--color-accent', currentColors.accent);
    root.style.setProperty('--color-tertiary', currentColors.tertiary);
    root.style.setProperty('--color-bg', currentColors.bg);
    root.style.setProperty('--color-card', currentColors.card);
    root.style.setProperty('--color-border', currentColors.border);
    root.style.setProperty('--color-text', currentColors.text);
    root.style.setProperty('--color-text-secondary', currentColors.textSecondary);

    // Update class for Tailwind
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentColors, mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        setModeState(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colorScheme,
        currentColors,
        setMode,
        setColorScheme,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
