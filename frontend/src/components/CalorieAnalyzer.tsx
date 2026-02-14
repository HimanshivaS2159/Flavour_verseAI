import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, TrendingUp, Flame, Apple, Coffee, Search, Filter, Download, BarChart3, Zap, Target, Award, Activity } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'single' | 'recipe'>('single');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredient.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }

    setLoading(true);
    setCalorieData(null);

    try {
      const data = await getCalorieInfo(ingredient.trim());
      if (data.error) {
        toast.error(data.error);
      } else {
        setCalorieData(data);
        
        // Add to search history
        if (!searchHistory.includes(ingredient.toLowerCase())) {
          setSearchHistory(prev => [ingredient.toLowerCase(), ...prev.slice(0, 4)]);
        }
        
        toast.success(`Nutritional data found for ${ingredient}!`);
      }
    } catch (error) {
      toast.error('Failed to fetch nutritional data');
    } finally {
      setLoading(false);
    }
  };

  const addToRecipe = () => {
    if (calorieData) {
      setRecipeIngredients([...recipeIngredients, { 
        ingredient: calorieData.ingredient, 
        amount: 100 
      }]);
      toast.success(`${calorieData.ingredient} added to recipe!`);
    }
  };

  const removeFromRecipe = (index: number) => {
    const newIngredients = recipeIngredients.filter((_, i) => i !== index);
    setRecipeIngredients(newIngredients);
    toast.success('Ingredient removed from recipe');
  };

  const calculateRecipe = async () => {
    if (recipeIngredients.length === 0) {
      toast.error('Please add ingredients to the recipe first');
      return;
    }

    setRecipeLoading(true);
    try {
      const result = await calculateRecipeCalories(recipeIngredients);
      setRecipeCalories(result);
      toast.success('Recipe calories calculated successfully!');
    } catch (error) {
      toast.error('Failed to calculate recipe calories');
    } finally {
      setRecipeLoading(false);
    }
  };

  const exportRecipe = () => {
    if (!recipeCalories) {
      toast.error('Please calculate recipe calories first');
      return;
    }

    const data = {
      ingredients: recipeIngredients,
      nutrition: recipeCalories,
      servingSize: servingSize,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipe-nutrition-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Recipe data exported successfully!');
  };

  const getNutrientColor = (value: number, type: string) => {
    const colors = {
      calories: value > 300 ? 'text-red-400' : value > 150 ? 'text-yellow-400' : 'text-green-400',
      protein: value > 25 ? 'text-green-400' : 'text-blue-400',
      carbs: value > 50 ? 'text-orange-400' : 'text-yellow-400',
      fat: value > 20 ? 'text-red-400' : 'text-purple-400'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
  };

  const getPopularIngredients = () => [
    'apple', 'banana', 'chicken', 'rice', 'broccoli', 'eggs', 'milk', 'bread'
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
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
            <Calculator className="text-white" size={32} />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Advanced Calorie Calculator
        </h2>
        <p className="text-white/70">
          Track nutritional information and calculate recipe calories
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-white/10 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'single'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Flame className="inline-block mr-2" size={16} />
          Single Ingredient
        </button>
        <button
          onClick={() => setActiveTab('recipe')}
          className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'recipe'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <BarChart3 className="inline-block mr-2" size={16} />
          Recipe Calculator
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'single' ? (
          <motion.div
            key="single"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  placeholder="Enter an ingredient (e.g., apple, chicken, rice, broccoli)..."
                  className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300"
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
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Nutrition...</span>
                  </>
                ) : (
                  <>
                    <Calculator size={20} />
                    <span>Get Nutritional Info</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl"
              >
                <p className="text-green-200 text-sm font-medium mb-2">
                  🔍 Recent Searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setIngredient(item)}
                      className="px-3 py-1 bg-green-500/30 hover:bg-green-500/40 text-green-200 rounded-lg text-sm transition-colors duration-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Popular Ingredients */}
            {calorieData === null && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl"
              >
                <p className="text-green-200 text-sm font-medium mb-2">
                  💡 Try these popular ingredients:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getPopularIngredients().map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setIngredient(ing)}
                      className="px-3 py-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/40 hover:to-emerald-500/40 text-green-200 rounded-lg text-sm transition-all duration-200"
                    >
                      {ing}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Calorie Results */}
            <AnimatePresence>
              {calorieData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">
                        {calorieData.ingredient.charAt(0).toUpperCase() + calorieData.ingredient.slice(1)}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addToRecipe}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add to Recipe
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        <div className={`text-3xl font-bold ${getNutrientColor(calorieData.calories, 'calories')}`}>
                          {calorieData.calories}
                        </div>
                        <div className="text-white/70 text-sm">Calories</div>
                        <div className="text-white/50 text-xs">{calorieData.unit}</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <div className={`text-3xl font-bold ${getNutrientColor(calorieData.protein, 'protein')}`}>
                          {calorieData.protein}g
                        </div>
                        <div className="text-white/70 text-sm">Protein</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                      >
                        <div className={`text-3xl font-bold ${getNutrientColor(calorieData.carbs, 'carbs')}`}>
                          {calorieData.carbs}g
                        </div>
                        <div className="text-white/70 text-sm">Carbs</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center"
                      >
                        <div className={`text-3xl font-bold ${getNutrientColor(calorieData.fat, 'fat')}`}>
                          {calorieData.fat}g
                        </div>
                        <div className="text-white/70 text-sm">Fat</div>
                      </motion.div>
                    </div>

                    {/* Visual Nutrition Bars */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Flame className="text-orange-400" size={16} />
                        <span className="text-white/70 text-sm w-16">Calories</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((calorieData.calories / 500) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Target className="text-blue-400" size={16} />
                        <span className="text-white/70 text-sm w-16">Protein</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((calorieData.protein / 50) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Zap className="text-yellow-400" size={16} />
                        <span className="text-white/70 text-sm w-16">Carbs</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((calorieData.carbs / 100) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Activity className="text-purple-400" size={16} />
                        <span className="text-white/70 text-sm w-16">Fat</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((calorieData.fat / 50) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="recipe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Recipe Calculator */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="text-green-400" size={24} />
                  Recipe Ingredients
                </h3>
                
                {recipeIngredients.length === 0 ? (
                  <div className="text-center py-8">
                    <Apple className="text-white/30 mx-auto mb-4" size={48} />
                    <p className="text-white/70">No ingredients added yet</p>
                    <p className="text-white/50 text-sm mt-2">Search for ingredients and add them to your recipe</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recipeIngredients.map((ing, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">{ing.ingredient}</span>
                          <span className="text-white/50 text-sm">{ing.amount}g</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromRecipe(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={calculateRecipe}
                    disabled={recipeLoading || recipeIngredients.length === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {recipeLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <Calculator size={16} />
                        <span>Calculate Recipe</span>
                      </>
                    )}
                  </motion.button>
                  
                  {recipeCalories && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exportRecipe}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Recipe Results */}
              <AnimatePresence>
                {recipeCalories && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Award className="text-yellow-400" size={24} />
                      Recipe Nutrition Summary
                    </h3>
                    
                    <div className="mb-6">
                      <label className="text-white/70 text-sm block mb-2">Serving Size Multiplier</label>
                      <input
                        type="range"
                        min="0.5"
                        max="4"
                        step="0.5"
                        value={servingSize}
                        onChange={(e) => setServingSize(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-white/50 text-sm mt-1">Current: {servingSize}x serving</div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {Math.round(recipeCalories.total_calories * servingSize)}
                        </div>
                        <div className="text-white/70 text-sm">Total Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(recipeCalories.total_protein * servingSize)}g
                        </div>
                        <div className="text-white/70 text-sm">Total Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {Math.round(recipeCalories.total_carbs * servingSize)}g
                        </div>
                        <div className="text-white/70 text-sm">Total Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {Math.round(recipeCalories.total_fat * servingSize)}g
                        </div>
                        <div className="text-white/70 text-sm">Total Fat</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalorieAnalyzer;
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
