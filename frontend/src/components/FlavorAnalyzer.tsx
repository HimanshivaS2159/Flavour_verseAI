import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Beaker, AlertCircle, Info, Sparkles, TrendingUp, Activity, Zap, Palette } from 'lucide-react';
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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setFlavorData(data);
        
        // Add to search history
        if (!searchHistory.includes(ingredient.toLowerCase())) {
          setSearchHistory(prev => [ingredient.toLowerCase(), ...prev.slice(0, 4)]);
        }
        
        toast.success(`Flavor analysis complete for ${ingredient}!`);
      }
    } catch (error) {
      toast.error('Failed to analyze flavor');
      setError('Failed to analyze flavor');
    } finally {
      setLoading(false);
    }
  };

  const getFlavorColor = (value: number) => {
    if (value >= 8) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (value >= 6) return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    if (value >= 4) return 'bg-gradient-to-r from-orange-400 to-red-400';
    return 'bg-gradient-to-r from-red-400 to-pink-500';
  };

  const getFlavorIcon = (flavor: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      sweet: <Sparkles className="w-4 h-4" />,
      sour: <Zap className="w-4 h-4" />,
      bitter: <Activity className="w-4 h-4" />,
      salty: <Beaker className="w-4 h-4" />,
      umami: <TrendingUp className="w-4 h-4" />,
      spicy: <Palette className="w-4 h-4" />
    };
    return icons[flavor] || <Info className="w-4 h-4" />;
  };

  const getPopularIngredients = () => [
    'lemon', 'garlic', 'vanilla', 'chocolate', 'honey', 'basil', 'ginger', 'cinnamon'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/10"
    >
      <div className="text-center mb-8">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
            <Beaker className="text-white" size={32} />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Advanced Flavor Analysis
        </h2>
        <p className="text-white/70">
          Discover the scientific flavor profile of any ingredient
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Enter an ingredient (e.g., lemon, garlic, vanilla, chocolate)..."
            className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
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
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Flavor...</span>
            </>
          ) : (
            <>
              <Beaker size={20} />
              <span>Analyze Flavor Profile</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl"
        >
          <p className="text-purple-200 text-sm font-medium mb-2">
            🔍 Recent Searches:
          </p>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => setIngredient(item)}
                className="px-3 py-1 bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 rounded-lg text-sm transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Popular Ingredients */}
      {flavorData === null && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl"
        >
          <p className="text-purple-200 text-sm font-medium mb-2">
            💡 Try these popular ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {getPopularIngredients().map((ing) => (
              <button
                key={ing}
                onClick={() => setIngredient(ing)}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 text-purple-200 rounded-lg text-sm transition-all duration-200"
              >
                {ing}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flavor Results */}
      <AnimatePresence>
        {flavorData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Flavor Profile: {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
              </h3>
              <p className="text-white/70">{flavorData.description}</p>
            </div>

            {/* Flavor Profile Bars */}
            {flavorData.flavor_profile && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Taste Analysis</h4>
                {Object.entries(flavorData.flavor_profile).map(([flavor, value]) => (
                  <motion.div
                    key={flavor}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-purple-400">
                          {getFlavorIcon(flavor)}
                        </div>
                        <span className="text-white font-medium capitalize">
                          {flavor}
                        </span>
                      </div>
                      <span className="text-white/70 text-sm">
                        {value}/10
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(value as number) * 10}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${getFlavorColor(value as number)}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flavorData.aroma && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
                >
                  <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Activity className="text-purple-400" size={16} />
                    Aroma
                  </h5>
                  <p className="text-white/70 text-sm">{flavorData.aroma}</p>
                </motion.div>
              )}

              {flavorData.categories && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
                >
                  <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Palette className="text-purple-400" size={16} />
                    Categories
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {flavorData.categories.map((cat: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Pairings */}
            {flavorData.pairings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
              >
                <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="text-purple-400" size={16} />
                  Recommended Pairings
                </h5>
                <div className="flex flex-wrap gap-2">
                  {flavorData.pairings.map((pairing: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 rounded-lg text-sm"
                    >
                      {pairing}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlavorAnalyzer;
      
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
