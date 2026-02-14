import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles, Zap, Brain, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl opacity-20 blur-sm" />
              <ChefHat className="relative text-white drop-shadow-lg" size={32} />
              <Sparkles 
                className="text-yellow-300 absolute -top-1 -right-1 animate-pulse" 
                size={16}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Flavour Verse
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                Advanced Culinary Intelligence
              </p>
            </div>
          </motion.div>
          
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex items-center gap-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/30">
              <Zap className="text-orange-400" size={16} />
              <span className="text-white text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/30">
              <Brain className="text-blue-400" size={16} />
              <span className="text-white text-sm font-medium">Smart Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/30">
              <Menu className="text-purple-400" size={16} />
              <span className="text-white text-sm font-medium">Flavor Science</span>
            </div>
          </motion.nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 bg-slate-800/50 rounded-lg border border-slate-700/30"
          >
            <Menu className="text-gray-300" size={24} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
