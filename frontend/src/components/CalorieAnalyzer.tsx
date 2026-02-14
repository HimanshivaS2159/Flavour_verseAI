import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, TrendingUp, Flame, Apple, Coffee, Search, Filter, Download, BarChart3 } from 'lucide-react';
import { getCalorieInfo, calculateRecipeCalories } from '../services/api.ts';
import toast from 'react-hot-toast';

interface CalorieData {
  ingredient: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
}

interface RecipeIngredient {
  ingredient: string;
  amount: number;
}

const CalorieAnalyzer: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [calorieData, setCalorieData] = useState<CalorieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeCalories, setRecipeCalories] = useState<any>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [servingSize, setServingSize] = useState(1);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSearch = async () => {
    if (!ingredient.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }

    setLoading(true);
    try {
      const data = await getCalorieInfo(ingredient);
      if (data.error) {
        toast.error(data.error);
        setCalorieData(null);
      } else {
        setCalorieData(data);
        toast.success(`Found calorie data for ${data.ingredient}`);
        
        // Add to search history
        if (!searchHistory.includes(ingredient.toLowerCase())) {
          setSearchHistory(prev => [ingredient.toLowerCase(), ...prev.slice(0, 9)]);
        }
      }
    } catch (error: any) {
      console.error('Calorie search error:', error);
      const errorMessage = error.message || 'Failed to fetch calorie data';
      toast.error(errorMessage);
      setCalorieData(null);
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
    setFilterCategory('all');
  };

  const addToRecipe = () => {
    if (!calorieData) return;
    
    const newIngredient: RecipeIngredient = {
      ingredient: calorieData.ingredient,
      amount: 100 // Default 100g
    };
    
    setRecipeIngredients([...recipeIngredients, newIngredient]);
    toast.success(`Added ${calorieData.ingredient} to recipe`);
  };

  const removeFromRecipe = (index: number) => {
    const updated = recipeIngredients.filter((_, i) => i !== index);
    setRecipeIngredients(updated);
  };

  const calculateRecipe = async () => {
    if (recipeIngredients.length === 0) {
      toast.error('Please add ingredients to the recipe first');
      return;
    }

    setRecipeLoading(true);
    try {
      const data = await calculateRecipeCalories(recipeIngredients);
      setRecipeCalories(data);
      toast.success('Recipe calories calculated successfully');
    } catch (error) {
      toast.error('Failed to calculate recipe calories');
      setRecipeCalories(null);
    } finally {
      setRecipeLoading(false);
    }
  };

  const exportRecipeData = () => {
    if (!recipeCalories) {
      toast.error('No recipe data to export');
      return;
    }

    const exportData = {
      recipe: {
        ingredients: recipeIngredients,
        serving_size: servingSize,
        total_calories: Math.round(recipeCalories.total_calories / servingSize),
        total_protein: Math.round(recipeCalories.total_protein / servingSize * 10) / 10,
        total_carbs: Math.round(recipeCalories.total_carbs / servingSize * 10) / 10,
        total_fat: Math.round(recipeCalories.total_fat / servingSize * 10) / 10,
        nutrition_per_100g: recipeCalories
      },
      generated_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recipe-nutrition-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Recipe data exported successfully');
  };

  const getPopularIngredients = () => [
    'chicken', 'beef', 'rice', 'pasta', 'broccoli', 'eggs', 'milk', 'bread', 'cheese', 'potatoes'
  ];

  const updateIngredientAmount = (index: number, amount: number) => {
    const updated = [...recipeIngredients];
    updated[index].amount = amount;
    setRecipeIngredients(updated);
  };

  return (
    <div className="space-y-8">
      {/* Single Ingredient Calorie Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Calorie Lookup</h2>
            <p className="text-gray-400">Find nutritional information for any ingredient</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter ingredient name (e.g., milk, chicken, rice)"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-600 bg-gray-700 text-white focus:border-orange-400 focus:outline-none transition-colors placeholder-gray-400"
            />
            {/* Search Suggestions Dropdown */}
            {ingredient && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
                {getPopularIngredients()
                  .filter(item => item.toLowerCase().includes(ingredient.toLowerCase()))
                  .slice(0, 5)
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white border-b border-gray-700 last:border-b-0"
                    >
                      <Search size={16} className="inline mr-2 text-gray-400" />
                      {item}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl font-medium disabled:opacity-50 transition-all"
          >
            {loading ? 'Searching...' : <><Search size={20} className="inline mr-2" />Search</>}
          </motion.button>
        </div>

        <AnimatePresence>
          {calorieData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-2xl p-6 border border-orange-700/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white capitalize mb-2">
                    {calorieData.ingredient}
                  </h3>
                  <p className="text-sm text-gray-400">{calorieData.unit}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={addToRecipe}
                  className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Plus size={20} />
                </motion.button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-2xl font-bold text-orange-400">{calorieData.calories}</div>
                  <div className="text-sm text-gray-300">Calories</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-2xl font-bold text-blue-400">{calorieData.protein}g</div>
                  <div className="text-sm text-gray-300">Protein</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-2xl font-bold text-green-400">{calorieData.carbs}g</div>
                  <div className="text-sm text-gray-300">Carbs</div>
                </div>
                <div className="text-center p-3 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-2xl font-bold text-yellow-400">{calorieData.fat}g</div>
                  <div className="text-sm text-gray-300">Fat</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Searches</h3>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => loadFromHistory(item)}
                className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recipe Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl">
            <Calculator className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recipe Calculator</h2>
            <p className="text-gray-400">Calculate total calories for your recipe</p>
          </div>
        </div>

        {recipeIngredients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Ingredients</h3>
            <div className="space-y-3">
              {recipeIngredients.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-700 rounded-xl border border-gray-600"
                >
                  <span className="flex-1 font-medium text-white capitalize">{item.ingredient}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateIngredientAmount(index, Number(e.target.value))}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-600 bg-gray-600 text-white focus:border-green-400 focus:outline-none"
                    />
                    <span className="text-sm text-gray-400">g</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromRecipe(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculateRecipe}
              disabled={recipeLoading}
              className="mt-4 w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl font-medium disabled:opacity-50 transition-all"
            >
              {recipeLoading ? 'Calculating...' : 'Calculate Recipe Calories'}
            </motion.button>

            {/* Serving Size Controls */}
            {recipeCalories && (
              <div className="mt-4 flex items-center gap-4">
                <label className="text-white text-sm">Serving Size:</label>
                <input
                  type="number"
                  min="1"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:border-orange-400 focus:outline-none"
                />
                <button
                  onClick={exportRecipeData}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            )}
          </div>
        )}

        {recipeIngredients.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Apple size={48} className="mx-auto mb-4 opacity-50 text-orange-400" />
            <p className="text-gray-400">Add ingredients from the search results above to calculate recipe calories</p>
          </div>
        )}

        <AnimatePresence>
          {recipeCalories && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-2xl p-6 border border-green-700/30"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Recipe Nutrition Summary</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-3xl font-bold text-green-400">{Math.round(recipeCalories.total_calories / servingSize)}</div>
                  <div className="text-sm text-gray-300">Calories/Serving</div>
                  <div className="text-xs text-gray-500 mt-1">Total: {recipeCalories.total_calories}</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-3xl font-bold text-blue-400">{Math.round(recipeCalories.total_protein / servingSize * 10) / 10}g</div>
                  <div className="text-sm text-gray-300">Protein/Serving</div>
                  <div className="text-xs text-gray-500 mt-1">Total: {recipeCalories.total_protein}g</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-3xl font-bold text-green-400">{Math.round(recipeCalories.total_carbs / servingSize * 10) / 10}g</div>
                  <div className="text-sm text-gray-300">Carbs/Serving</div>
                  <div className="text-xs text-gray-500 mt-1">Total: {recipeCalories.total_carbs}g</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-xl border border-gray-600">
                  <div className="text-3xl font-bold text-yellow-400">{Math.round(recipeCalories.total_fat / servingSize * 10) / 10}g</div>
                  <div className="text-sm text-gray-300">Fat/Serving</div>
                  <div className="text-xs text-gray-500 mt-1">Total: {recipeCalories.total_fat}g</div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                <TrendingUp className="inline mr-2 text-orange-400" size={16} />
                Per serving (serves {recipeCalories.serving_size}): <span className="text-orange-400">{Math.round(recipeCalories.total_calories / recipeCalories.serving_size)}</span> calories
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CalorieAnalyzer;
