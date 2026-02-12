import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSubstitution = async (ingredient: string) => {
  try {
    const response = await api.get('/substitute', { params: { ingredient } });
    return response.data;
  } catch (error) {
    console.error('Error fetching substitutes:', error);
    throw error;
  }
};

export const getFlavorData = async (ingredient: string) => {
  try {
    const response = await api.get('/flavor', { params: { ingredient } });
    return response.data;
  } catch (error) {
    console.error('Error fetching flavor data:', error);
    throw error;
  }
};

// NLP API functions
export const analyzeQuery = async (query: string) => {
  try {
    const response = await api.post('/nlp/parse', null, { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error analyzing query:', error);
    throw error;
  }
};

export const getSmartSuggestions = async (query: string) => {
  try {
    const response = await api.post('/nlp/suggestions', null, { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error getting smart suggestions:', error);
    throw error;
  }
};

export const checkAllergies = async (ingredients: string[], userAllergies: string[]) => {
  try {
    const response = await api.post('/nlp/allergy-check', {
      ingredients,
      user_allergies: userAllergies
    });
    return response.data;
  } catch (error) {
    console.error('Error checking allergies:', error);
    throw error;
  }
};

export const getTasteRecommendations = async (tastePreferences: string[], excludeAllergies?: string[]) => {
  try {
    const response = await api.post('/nlp/taste-recommendations', {
      taste_preferences: tastePreferences,
      exclude_allergies: excludeAllergies
    });
    return response.data;
  } catch (error) {
    console.error('Error getting taste recommendations:', error);
    throw error;
  }
};

export default api;
