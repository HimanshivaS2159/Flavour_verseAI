import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, AlertTriangle, CheckCircle, Utensils, Heart } from 'lucide-react';
import * as api from '../services/api.ts';

interface ParsedInfo {
  allergies: string[];
  tastes: string[];
  dietary_preferences: {
    vegan: boolean;
    vegetarian: boolean;
    gluten_free: boolean;
    dairy_free: boolean;
    nut_free: boolean;
    low_sugar: boolean;
    low_sodium: boolean;
  };
}

interface SmartSuggestions {
  query: string;
  parsed_info: ParsedInfo;
  suggestions: string[];
  allergy_count: number;
  taste_count: number;
}

const SmartAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SmartSuggestions | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.getSmartSuggestions(query);
      if (response.error) {
        setError(response.error);
      } else {
        setResults(response);
      }
    } catch (err) {
      setError('Failed to analyze query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDietaryBadges = (preferences: ParsedInfo['dietary_preferences']) => {
    const badges = [];
    if (preferences.vegan) badges.push({ label: 'Vegan', color: 'bg-green-500' });
    if (preferences.vegetarian) badges.push({ label: 'Vegetarian', color: 'bg-green-400' });
    if (preferences.gluten_free) badges.push({ label: 'Gluten-Free', color: 'bg-yellow-500' });
    if (preferences.dairy_free) badges.push({ label: 'Dairy-Free', color: 'bg-blue-500' });
    if (preferences.nut_free) badges.push({ label: 'Nut-Free', color: 'bg-orange-500' });
    if (preferences.low_sugar) badges.push({ label: 'Low-Sugar', color: 'bg-purple-500' });
    if (preferences.low_sodium) badges.push({ label: 'Low-Sodium', color: 'bg-red-500' });
    return badges;
  };

  const exampleQueries = [
    "I'm allergic to nuts and dairy, but I like sweet creamy things",
    "I need gluten-free options that are savory and flavorful",
    "I want vegan spicy food recommendations",
    "No eggs or soy, looking for something sweet and fresh",
    "I prefer low-sodium vegetarian meals with herbs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500/20 rounded-full backdrop-blur-md border border-purple-400/30">
              <Brain className="text-purple-300" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Smart Culinary Assistant</h1>
          <p className="text-purple-200 text-lg">
            AI-powered dietary analysis and personalized recommendations
          </p>
        </motion.div>

        {/* Query Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-8"
        >
          <form onSubmit={handleAnalyze}>
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Describe your dietary preferences and restrictions
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., I'm allergic to nuts and dairy, but I like sweet and creamy things..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300 resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain size={20} />
                  <span>Analyze & Get Recommendations</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Example Queries */}
          <div className="mt-6">
            <p className="text-purple-200 text-sm font-medium mb-2">💡 Try these examples:</p>
            <div className="space-y-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="block w-full text-left px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg text-sm transition-colors duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center gap-3"
          >
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analysis Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={24} />
                Analysis Results
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Allergies */}
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Detected Allergies ({results.allergy_count})
                  </h3>
                  {results.parsed_info.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.parsed_info.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-500/30 text-red-200 rounded-lg text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No allergies detected</p>
                  )}
                </div>

                {/* Taste Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                    <Heart size={18} />
                    Taste Preferences ({results.taste_count})
                  </h3>
                  {results.parsed_info.tastes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.parsed_info.tastes.map((taste, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-500/30 text-green-200 rounded-lg text-sm"
                        >
                          {taste}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No specific taste preferences</p>
                  )}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {getDietaryBadges(results.parsed_info.dietary_preferences).map((badge, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 ${badge.color} text-white rounded-lg text-sm font-medium`}
                    >
                      {badge.label}
                    </span>
                  ))}
                  {Object.values(results.parsed_info.dietary_preferences).every(v => !v) && (
                    <p className="text-gray-400">No specific dietary preferences</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Utensils className="text-purple-400" size={24} />
                Smart Recommendations
              </h2>

              {results.suggestions.length > 0 ? (
                <div className="grid gap-4">
                  {results.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-purple-500/20 rounded-xl border border-purple-400/30"
                    >
                      <CheckCircle className="text-green-400" size={20} />
                      <span className="text-purple-100 font-medium">{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No recommendations available based on your criteria</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SmartAssistant;
