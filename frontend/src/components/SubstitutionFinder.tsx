import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChefHat, AlertCircle, CheckCircle, Clock, TrendingUp, Filter, Star, Zap, Award, Sparkles, ArrowUpDown } from 'lucide-react';
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
  const [minScore, setMinScore] = useState(0);

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
        
        // Apply minimum score filter
        sortedResults = sortedResults.filter((result: SubstitutionResult) => result.score >= minScore);
        
        // Sort results based on selected criteria
        if (sortBy === 'score') {
          sortedResults.sort((a, b) => b.score - a.score);
        } else {
          sortedResults.sort((a, b) => a.ingredient.localeCompare(b.ingredient));
        }
        
        setResults(sortedResults);
        
        // Add to search history
        if (!searchHistory.includes(ingredient.toLowerCase())) {
          setSearchHistory(prev => [ingredient.toLowerCase(), ...prev.slice(0, 4)]);
        }
        
        if (sortedResults.length > 0) {
          toast.success(`Found ${sortedResults.length} substitutes for ${ingredient}`);
        } else {
          toast.info(`No substitutes found for ${ingredient} with current filters`);
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (score >= 40) return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Possible Match';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-4 h-4" />;
    if (score >= 60) return <Star className="w-4 h-4" />;
    if (score >= 40) return <Zap className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getPopularIngredients = () => [
    'milk', 'butter', 'cheese', 'eggs', 'flour', 'sugar', 'dairy',
    'chicken', 'beef', 'rice', 'pasta', 'broccoli', 'tomato', 'onion', 'garlic'
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
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
            <ChefHat className="text-white" size={32} />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Smart Ingredient Substitution
        </h2>
        <p className="text-white/70">
          Find the perfect substitutes for any ingredient with AI-powered matching
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative mb-4">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Enter an ingredient (e.g., milk, butter, cheese, eggs, flour, sugar)..."
            className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
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
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200"
        >
          <Filter size={16} />
          <span className="text-white text-sm">Filters</span>
          <ArrowUpDown size={14} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('score')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        sortBy === 'score'
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <TrendingUp className="inline-block mr-1" size={12} />
                      Score
                    </button>
                    <button
                      onClick={() => setSortBy('name')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        sortBy === 'name'
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <Filter className="inline-block mr-1" size={12} />
                      Name
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm block mb-2">
                    Minimum Score: {minScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={minScore}
                    onChange={(e) => setMinScore(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-200 text-sm font-medium">
              🔍 Recent Searches:
            </p>
            <button
              onClick={clearHistory}
              className="text-blue-300 hover:text-blue-200 text-xs transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => loadFromHistory(item)}
                className="px-3 py-1 bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 rounded-lg text-sm transition-colors duration-200"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Popular Ingredients */}
      {results.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl"
        >
          <p className="text-blue-200 text-sm font-medium mb-2">
            💡 Try these popular ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {getPopularIngredients().map((ing) => (
              <button
                key={ing}
                onClick={() => setIngredient(ing)}
                className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/40 hover:to-cyan-500/40 text-blue-200 rounded-lg text-sm transition-all duration-200"
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

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <CheckCircle className="text-green-400" size={24} />
                Found {results.length} Substitutes
              </h3>
              <div className="text-white/50 text-sm">
                Sorted by {sortBy === 'score' ? 'match score' : 'name'}
              </div>
            </div>
            
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getScoreBgColor(result.score)} bg-opacity-20`}>
                      <div className={getScoreColor(result.score)}>
                        {getScoreIcon(result.score)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">
                        {result.ingredient}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {getScoreLabel(result.score)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </div>
                    <div className="text-white/50 text-xs">Match Score</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                        className={`h-full rounded-full ${getScoreBgColor(result.score)}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`${
                          i < Math.floor(result.score / 20)
                            ? 'text-yellow-400 fill-current'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubstitutionFinder;
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
