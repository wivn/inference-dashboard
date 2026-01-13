// Professional color schemes following design principles:
// - Cool slate foundations for trust & data focus
// - Color used semantically, not decoratively
// - Consistent contrast hierarchy: foreground → secondary → muted → faint

export const colorSchemes = {
  slate: {
    name: 'Slate',
    light: {
      primary: '#0f172a',      // Slate 900 - primary actions
      secondary: '#475569',     // Slate 600 - secondary text
      accent: '#3b82f6',       // Blue 500 - semantic actions only
      tertiary: '#64748b',     // Slate 500 - muted
      bg: '#f8fafc',           // Slate 50
      card: '#ffffff',
      border: '#e2e8f0',       // Slate 200 - subtle borders
      text: '#0f172a',         // Slate 900
      textSecondary: '#64748b', // Slate 500
      success: '#10b981',      // Emerald 500
      warning: '#f59e0b',      // Amber 500
      error: '#ef4444',        // Red 500
    },
    dark: {
      primary: '#f1f5f9',      // Slate 100
      secondary: '#94a3b8',     // Slate 400
      accent: '#60a5fa',       // Blue 400
      tertiary: '#64748b',     // Slate 500
      bg: '#0f172a',           // Slate 900
      card: '#1e293b',         // Slate 800
      border: '#334155',       // Slate 700 - borders in dark
      text: '#f1f5f9',         // Slate 100
      textSecondary: '#94a3b8', // Slate 400
      success: '#34d399',      // Emerald 400
      warning: '#fbbf24',      // Amber 400
      error: '#f87171',        // Red 400
    },
  },
  ocean: {
    name: 'Ocean',
    light: {
      primary: '#0c4a6e',
      secondary: '#0369a1',
      accent: '#0284c7',
      tertiary: '#0891b2',
      bg: '#f0f9ff',
      card: '#ffffff',
      border: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      primary: '#e0f2fe',
      secondary: '#7dd3fc',
      accent: '#38bdf8',
      tertiary: '#0891b2',
      bg: '#0c4a6e',
      card: '#164e63',
      border: '#155e75',
      text: '#e0f2fe',
      textSecondary: '#7dd3fc',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
  },
  forest: {
    name: 'Forest',
    light: {
      primary: '#14532d',
      secondary: '#166534',
      accent: '#16a34a',
      tertiary: '#22c55e',
      bg: '#f0fdf4',
      card: '#ffffff',
      border: '#dcfce7',
      text: '#14532d',
      textSecondary: '#166534',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      primary: '#dcfce7',
      secondary: '#86efac',
      accent: '#4ade80',
      tertiary: '#22c55e',
      bg: '#14532d',
      card: '#166534',
      border: '#15803d',
      text: '#dcfce7',
      textSecondary: '#86efac',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
  },
  trust: {
    name: 'Trust',
    light: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#6366f1',
      tertiary: '#8b5cf6',
      bg: '#f8fafc',
      card: '#ffffff',
      border: '#e2e8f0',
      text: '#1e3a8a',
      textSecondary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      primary: '#dbeafe',
      secondary: '#93c5fd',
      accent: '#a5b4fc',
      tertiary: '#c4b5fd',
      bg: '#1e3a8a',
      card: '#1e40af',
      border: '#3730a3',
      text: '#dbeafe',
      textSecondary: '#93c5fd',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
  },
  monochrome: {
    name: 'Monochrome',
    light: {
      primary: '#000000',
      secondary: '#525252',
      accent: '#171717',
      tertiary: '#737373',
      bg: '#fafafa',
      card: '#ffffff',
      border: '#e5e5e5',
      text: '#000000',
      textSecondary: '#525252',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      primary: '#fafafa',
      secondary: '#a3a3a3',
      accent: '#e5e5e5',
      tertiary: '#737373',
      bg: '#000000',
      card: '#171717',
      border: '#262626',
      text: '#fafafa',
      textSecondary: '#a3a3a3',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
  },
} as const;

export type ColorSchemeName = keyof typeof colorSchemes;
export type ThemeMode = 'light' | 'dark';
export type ColorScheme = typeof colorSchemes[ColorSchemeName][ThemeMode];
