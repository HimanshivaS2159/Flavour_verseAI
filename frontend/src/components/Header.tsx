import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-effect sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <ChefHat className="text-white" size={32} />
              <Sparkles 
                className="text-yellow-300 absolute -top-1 -right-1" 
                size={16}
              />
            </div>
            <h1 className="text-2xl font-bold text-white">
              FlavoursVerse
            </h1>
          </motion.div>
          
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-6"
          >
            <span className="text-white/80 text-sm">
              Culinary Intelligence Platform
            </span>
          </motion.nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
