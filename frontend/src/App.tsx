import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Beaker, Sparkles, Brain } from 'lucide-react';
import SubstitutionFinder from './components/SubstitutionFinder.tsx';
import FlavorAnalyzer from './components/FlavorAnalyzer.tsx';
import SmartAssistant from './components/SmartAssistant.tsx';
import Header from './components/Header.tsx';
import { Toaster } from 'react-hot-toast';

export type TabType = 'substitution' | 'flavor' | 'assistant';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('substitution');

  const tabs = [
    {
      id: 'substitution' as TabType,
      label: 'Ingredient Substitution',
      icon: ChefHat,
      description: 'Find perfect substitutes for any ingredient',
      gradient: 'substitution-gradient'
    },
    {
      id: 'flavor' as TabType,
      label: 'Flavor Analysis',
      icon: Beaker,
      description: 'Discover flavor profiles and combinations',
      gradient: 'flavor-gradient'
    },
    {
      id: 'assistant' as TabType,
      label: 'Smart Assistant',
      icon: Brain,
      description: 'AI-powered dietary analysis and recommendations',
      gradient: 'assistant-gradient'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            FlavoursVerse
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Your Culinary Intelligence Companion
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white shadow-2xl'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center gap-3">
                    <Icon size={24} />
                    <span className="text-lg">{tab.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <motion.p
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/60 max-w-md mx-auto"
          >
            {tabs.find(tab => tab.id === activeTab)?.description}
          </motion.p>
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === 'substitution' ? <SubstitutionFinder /> : activeTab === 'flavor' ? <FlavorAnalyzer /> : <SmartAssistant />}
        </motion.div>
      </main>
      
      <footer className="mt-16 pb-8 text-center text-white/60">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} />
          <span>Powered by Culinary AI</span>
          <Sparkles size={16} />
        </div>
        <p className="text-sm">
          Discover the art of flavor science
        </p>
      </footer>
    </div>
  );
}

export default App;
