import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Beaker, Sparkles, Brain, Flame, Utensils, Palette, Zap, TrendingUp } from 'lucide-react';
import SubstitutionFinder from './components/SubstitutionFinder.tsx';
import FlavorAnalyzer from './components/FlavorAnalyzer.tsx';
import SmartAssistant from './components/SmartAssistant.tsx';
import CalorieAnalyzer from './components/CalorieAnalyzer.tsx';
import Header from './components/Header.tsx';
import { Toaster } from 'react-hot-toast';

export type TabType = 'substitution' | 'flavor' | 'assistant' | 'calories';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('substitution');

  const tabs = [
    {
      id: 'substitution' as TabType,
      label: 'Smart Substitution',
      icon: ChefHat,
      description: 'AI-powered ingredient replacements',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'bg-gradient-to-r from-emerald-500/10 to-teal-600/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'flavor' as TabType,
      label: 'Flavor Science',
      icon: Beaker,
      description: 'Advanced flavor profiling & pairing',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'bg-gradient-to-r from-purple-500/10 to-pink-600/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'assistant' as TabType,
      label: 'AI Assistant',
      icon: Brain,
      description: 'Intelligent culinary guidance',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'bg-gradient-to-r from-blue-500/10 to-cyan-600/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'calories' as TabType,
      label: 'Nutrition Lab',
      icon: Flame,
      description: 'Calorie analysis & tracking',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'bg-gradient-to-r from-orange-500/10 to-red-600/10',
      borderColor: 'border-orange-500/30'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-2xl"
            >
              <Utensils size={32} className="text-white" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-4"
          >
            FlavoursVerse AI
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Advanced Culinary Intelligence System
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-6 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Zap className="text-orange-400" size={20} />
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-sm">Scientific</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="text-purple-400" size={20} />
              <span className="text-sm">Flavor Science</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border ${
                  isActive
                    ? `${tab.bgGradient} text-white shadow-2xl ${tab.borderColor} border-2 shadow-lg`
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl opacity-20`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'text-white' : 'text-current'} />
                  <span className="text-base">{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Active Tab Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/30">
              <activeTabData?.icon && (
                <activeTabData.icon size={18} className="text-orange-400" />
              )}
              <p className="text-gray-300 text-sm md:text-base">
                {activeTabData?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'substitution' && <SubstitutionFinder />}
              {activeTab === 'flavor' && <FlavorAnalyzer />}
              {activeTab === 'assistant' && <SmartAssistant />}
              {activeTab === 'calories' && <CalorieAnalyzer />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
      
      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-20 pb-12 text-center border-t border-slate-800/50"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg"
              >
                <Sparkles size={20} className="text-white" />
              </motion.div>
              <div>
                <h3 className="text-white font-semibold">FlavoursVerse AI</h3>
                <p className="text-gray-400 text-sm">Advanced Culinary Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="text-orange-400" size={16} />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="text-blue-400" size={16} />
                <span>Smart Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="text-purple-400" size={16} />
                <span>Flavor Science</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-6 pt-6 border-t border-slate-700/50"
          >
            <p className="text-gray-500 text-xs">
              © 2024 FlavoursVerse AI. Where culinary intelligence meets modern technology.
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
