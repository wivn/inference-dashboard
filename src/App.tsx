import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Network, Activity, Settings } from 'lucide-react';
import CostBreakdown from './components/CostBreakdown';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import SettingsPanel from './components/SettingsPanel';
import { getMockBudgetData, getMockArchitectureData } from './data/mockData';
import { useTheme } from './contexts/ThemeContext';

type Tab = 'costs' | 'architecture';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('costs');
  const [budgetData] = useState(getMockBudgetData());
  const [architectureData] = useState(getMockArchitectureData());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { currentColors } = useTheme();

  const tabs = [
    { id: 'costs' as Tab, label: 'Cost Analytics', icon: DollarSign },
    { id: 'architecture' as Tab, label: 'Architecture', icon: Network },
  ];

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: currentColors.bg, color: currentColors.text }}>
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="border-b" style={{ borderColor: currentColors.border, backgroundColor: currentColors.card }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
              >
                <div className="p-1.5 sm:p-2 rounded-md border flex-shrink-0" style={{ borderColor: currentColors.border, backgroundColor: currentColors.bg }}>
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: currentColors.primary }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg md:text-xl font-semibold tracking-tight truncate" style={{ color: currentColors.text }}>
                    AWS Inference Dashboard
                  </h1>
                  <p className="text-xs hidden sm:block" style={{ color: currentColors.textSecondary }}>Real-time monitoring & analytics</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
              >
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-1.5 sm:p-2 rounded-md border transition-all duration-150 hover:bg-opacity-50"
                  style={{
                    borderColor: currentColors.border,
                    color: currentColors.textSecondary,
                    backgroundColor: 'transparent'
                  }}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium" style={{
                  borderColor: currentColors.border,
                  color: currentColors.success,
                  backgroundColor: `${currentColors.success}08`
                }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentColors.success }} />
                  <span style={{ color: currentColors.textSecondary }}>Online</span>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="border-b" style={{ borderColor: currentColors.border, backgroundColor: currentColors.card }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex gap-1 py-1.5 sm:py-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1, delay: index * 0.03, ease: [0.25, 1, 0.5, 1] }}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm transition-all duration-150 flex items-center gap-1.5 sm:gap-2 rounded-md border"
                    style={{
                      color: isActive ? currentColors.text : currentColors.textSecondary,
                      backgroundColor: isActive ? currentColors.bg : 'transparent',
                      borderColor: isActive ? currentColors.border : 'transparent'
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'costs' && (
              <motion.div
                key="costs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ transform: 'translateZ(0)' }}
              >
                <CostBreakdown data={budgetData} />
              </motion.div>
            )}
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ transform: 'translateZ(0)' }}
              >
                <ArchitectureDiagram data={architectureData} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t mt-8 sm:mt-12" style={{ borderColor: currentColors.border, backgroundColor: currentColors.card }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: currentColors.textSecondary }}>
              <div className="text-center sm:text-left">
                Built with React + TypeScript + Tailwind CSS
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;
