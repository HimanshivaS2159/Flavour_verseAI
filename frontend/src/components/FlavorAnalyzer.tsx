import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Beaker, AlertCircle, Info, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFlavorData } from '../services/api.ts';

interface FlavorData {
  [key: string]: any;
}

const FlavorAnalyzer: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [loading, setLoading] = useState(false);
  const [flavorData, setFlavorData] = useState<FlavorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredient.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }

    setLoading(true);
    setError(null);
    setFlavorData(null);

    try {
      const data = await getFlavorData(ingredient.trim());
      
      if (data.statusCode === 404) {
        setError(`No flavor data found for "${ingredient}"`);
        toast.error(`No flavor data found for "${ingredient}"`);
      } else if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setFlavorData(data);
        toast.success(`Flavor analysis complete for ${ingredient}`);
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch flavor data. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderFlavorData = () => {
    if (!flavorData) return null;

    const entries = Object.entries(flavorData);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="text-yellow-400" size={24} />
          Flavor Profile Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300"
            >
              <h4 className="text-lg font-medium text-white mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className="text-white/80">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-effect rounded-3xl p-8 shadow-2xl"
    >
      <div className="text-center mb-8">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-4"
        >
          <Beaker className="text-white" size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Flavor Analysis
        </h2>
        <p className="text-white/70">
          Discover detailed flavor profiles and characteristics
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Enter an ingredient (e.g., vanilla, chocolate, garlic, lemon, cinnamon, coffee, basil, ginger, honey, mint)..."
            className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
            disabled={loading}
          />
          <Search
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50"
            size={24}
          />
        </div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="loading-spinner" />
              <span>Analyzing Flavor...</span>
            </>
          ) : (
            <>
              <Beaker size={20} />
              <span>Analyze Flavor</span>
            </>
          )}
        </motion.button>
      </form>

      {!flavorData && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl"
        >
          <p className="text-purple-200 text-sm font-medium mb-2">
            💡 Try these ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {['vanilla', 'chocolate', 'garlic', 'lemon', 'cinnamon', 'coffee', 'basil', 'ginger', 'honey', 'mint'].map((ing) => (
              <button
                key={ing}
                onClick={() => setIngredient(ing)}
                className="px-3 py-1 bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 rounded-lg text-sm transition-colors duration-200"
              >
                {ing}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-orange-500/20 border border-orange-400/30 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="text-orange-400" size={20} />
          <p className="text-orange-200">{error}</p>
        </motion.div>
      )}

      {flavorData && renderFlavorData()}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-start gap-3"
      >
        <Info className="text-blue-400 mt-1" size={20} />
        <div>
          <p className="text-blue-200 text-sm font-medium mb-1">
            Flavor Science Tip
          </p>
          <p className="text-blue-100/70 text-sm">
            Flavor analysis helps you understand the chemical compounds that give ingredients their unique taste. 
            Use this information to create better flavor combinations in your cooking.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlavorAnalyzer;
