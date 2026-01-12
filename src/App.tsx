import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Network, Activity, Sparkles } from 'lucide-react';
import CostBreakdown from './components/CostBreakdown';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import { getMockBudgetData, getMockArchitectureData } from './data/mockData';

type Tab = 'costs' | 'architecture';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('costs');
  const [budgetData] = useState(getMockBudgetData());
  const [architectureData] = useState(getMockArchitectureData());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'costs' as Tab, label: 'Cost Analytics', icon: DollarSign },
    { id: 'architecture' as Tab, label: 'Architecture', icon: Network },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-cyber-blue/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyber-pink/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-dark-border backdrop-blur-xl bg-dark-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <Activity className="w-10 h-10 text-cyber-purple" />
                  <Sparkles className="w-4 h-4 text-cyber-pink absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-purple via-cyber-blue to-cyber-pink bg-clip-text text-transparent">
                    AWS Inference Dashboard
                  </h1>
                  <p className="text-xs text-gray-400">Real-time monitoring & analytics</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="System Online" />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="border-b border-dark-border backdrop-blur-xl bg-dark-card/20">
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
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-6 py-3 rounded-xl font-medium transition-all duration-300
                      flex items-center gap-2
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-dark-card/50'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CostBreakdown data={budgetData} />
              </motion.div>
            )}
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ArchitectureDiagram data={architectureData} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-dark-border backdrop-blur-xl bg-dark-card/20 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between text-sm text-gray-400">
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
    </div>
  );
}

export default App;
