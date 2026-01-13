import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { colorSchemes, type ColorSchemeName } from '../data/colorSchemes';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { mode, colorScheme, setMode, setColorScheme, currentColors } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 shadow-2xl"
            style={{
              backgroundColor: currentColors.card,
              borderLeft: `1px solid ${currentColors.border}`
            }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: currentColors.border }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: currentColors.text }}
                >
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                  style={{
                    color: currentColors.textSecondary,
                    backgroundColor: `${currentColors.primary}20`
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Theme Mode */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-4 flex items-center gap-2"
                    style={{ color: currentColors.textSecondary }}
                  >
                    <Sun className="w-4 h-4" />
                    THEME MODE
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light' as const, label: 'Light', icon: Sun },
                      { value: 'dark' as const, label: 'Dark', icon: Moon },
                      { value: 'system' as const, label: 'System', icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          if (value === 'system') {
                            localStorage.removeItem('theme-mode');
                            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                            setMode(systemPreference);
                          } else {
                            setMode(value);
                          }
                        }}
                        className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          (value === 'system' && !localStorage.getItem('theme-mode')) ||
                          (value !== 'system' && mode === value)
                            ? 'ring-2'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: `${currentColors.primary}10`,
                          color: currentColors.text,
                          '--tw-ring-color': currentColors.primary,
                        } as React.CSSProperties}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Schemes */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-4 flex items-center gap-2"
                    style={{ color: currentColors.textSecondary }}
                  >
                    <Palette className="w-4 h-4" />
                    COLOR SCHEME
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(colorSchemes).map(([key, scheme]) => {
                      const schemeKey = key as ColorSchemeName;
                      const colors = scheme[mode];
                      const isActive = colorScheme === schemeKey;

                      return (
                        <button
                          key={key}
                          onClick={() => setColorScheme(schemeKey)}
                          className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                            isActive ? 'ring-2 scale-[1.02]' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: `${currentColors.primary}10`,
                            '--tw-ring-color': currentColors.primary,
                          } as React.CSSProperties}
                        >
                          <div className="flex gap-1.5">
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: colors.primary }}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: colors.secondary }}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: colors.accent }}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: colors.tertiary }}
                            />
                          </div>
                          <span
                            className="font-medium"
                            style={{ color: currentColors.text }}
                          >
                            {scheme.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
