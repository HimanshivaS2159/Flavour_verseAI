import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChefHat, AlertCircle, CheckCircle, Clock, TrendingUp, Filter, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubstitution } from '../services/api.ts';

interface SubstitutionResult {
  ingredient: string;
  score: number;
}

const SubstitutionFinder: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SubstitutionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  const handleSearch: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!ingredient.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await getSubstitution(ingredient);
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        let sortedResults = Array.isArray(data) ? data : data.substitutes || [];
        
        // Sort results based on selected criteria
        if (sortBy === 'score') {
          sortedResults.sort((a, b) => b.score - a.score);
        } else {
          sortedResults.sort((a, b) => a.ingredient.localeCompare(b.ingredient));
        }
        
        setResults(sortedResults);
        
        // Add to search history
        if (!searchHistory.includes(ingredient.toLowerCase())) {
          setSearchHistory(prev => [ingredient.toLowerCase(), ...prev.slice(0, 9)]);
        }
        
        if (sortedResults.length > 0) {
          toast.success(`Found ${sortedResults.length} substitutes for ${ingredient}`);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch substitutions');
      setError('Failed to fetch substitutions');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    toast.success('Search history cleared');
  };

  const loadFromHistory = (item: string) => {
    setIngredient(item);
  };

  const getPopularIngredients = () => [
    'milk', 'butter', 'cheese', 'eggs', 'flour', 'sugar', 'dairy',
    'chicken', 'beef', 'rice', 'pasta', 'broccoli', 'tomato', 'onion', 'garlic'
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Possible Match';
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
          <ChefHat className="text-white" size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Ingredient Substitution
        </h2>
        <p className="text-white/70">
          Find the perfect substitutes for any ingredient
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Enter an ingredient (e.g., milk, butter, cheese, eggs, flour, sugar)..."
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
          className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="loading-spinner" />
              <span>Finding Substitutes...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Find Substitutes</span>
            </>
          )}
        </motion.button>
      </form>

      {results.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl"
        >
          <p className="text-blue-200 text-sm font-medium mb-2">
            💡 Try these ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {['milk', 'butter', 'cheese', 'eggs', 'flour', 'sugar', 'dairy'].map((ing) => (
              <button
                key={ing}
                onClick={() => setIngredient(ing)}
                className="px-3 py-1 bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 rounded-lg text-sm transition-colors duration-200"
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
          className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-200">{error}</p>
        </motion.div>
      )}

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={24} />
            Found {results.length} Substitutes
          </h3>
          
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-1">
                    {result.ingredient}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {getScoreLabel(result.score)}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </div>
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        result.score >= 80 ? 'bg-green-400' :
                        result.score >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubstitutionFinder;
