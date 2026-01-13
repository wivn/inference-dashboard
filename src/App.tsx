import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Network, Activity, Sparkles, Settings } from 'lucide-react';
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
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: currentColors.bg, color: currentColors.text }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none gpu-accelerated">
        <div className="absolute top-0 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse-slow" style={{ backgroundColor: `${currentColors.primary}20`, transform: 'translateZ(0)' }} />
        <div className="absolute top-40 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse-slow" style={{ backgroundColor: `${currentColors.secondary}20`, animationDelay: '0.7s', transform: 'translateZ(0)' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse-slow" style={{ backgroundColor: `${currentColors.accent}20`, animationDelay: '1.4s', transform: 'translateZ(0)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b backdrop-blur-xl" style={{ borderColor: currentColors.border, backgroundColor: `${currentColors.card}30` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Activity className="w-10 h-10" style={{ color: currentColors.primary }} />
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" style={{ color: currentColors.accent }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{
                    backgroundImage: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary}, ${currentColors.accent})`
                  }}>
                    AWS Inference Dashboard
                  </h1>
                  <p className="text-xs" style={{ color: currentColors.textSecondary }}>Real-time monitoring & analytics</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex items-center gap-4"
              >
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ backgroundColor: `${currentColors.primary}20`, color: currentColors.primary }}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="System Online" />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="border-b backdrop-blur-xl" style={{ borderColor: currentColors.border, backgroundColor: `${currentColors.card}20` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 py-4">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.05, ease: 'easeOut' }}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                    style={{
                      color: isActive ? currentColors.text : currentColors.textSecondary,
                      backgroundColor: isActive ? 'transparent' : 'transparent'
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                          transform: 'translateZ(0)'
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <footer className="border-t backdrop-blur-xl mt-12" style={{ borderColor: currentColors.border, backgroundColor: `${currentColors.card}20` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between text-sm" style={{ color: currentColors.textSecondary }}>
              <div>
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
