import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Create a more comprehensive dataset with common ingredients
ingredients_data = [
    # Dairy and alternatives
    "milk", "almond milk", "soy milk", "coconut milk", "oat milk", "rice milk", "cashew milk",
    "butter", "coconut oil", "olive oil", "margarine", "ghee", "avocado oil",
    "cheese", "nutritional yeast", "cashew cheese", "tofu", "mozzarella", "cheddar", "parmesan",
    "yogurt", "coconut yogurt", "greek yogurt", "plant-based yogurt",
    "cream", "coconut cream", "cashew cream", "heavy cream",
    
    # Eggs and alternatives
    "eggs", "flax eggs", "chia eggs", "applesauce", "banana", "silken tofu",
    
    # Flours and alternatives
    "flour", "almond flour", "coconut flour", "oat flour", "whole wheat flour", "rice flour",
    "all-purpose flour", "bread flour", "cake flour", "gluten-free flour",
    
    # Sweeteners
    "sugar", "honey", "maple syrup", "stevia", "coconut sugar", "brown sugar", "powdered sugar",
    
    # General categories
    "dairy", "plant-based milk", "lactose-free", "vegan cheese", "dairy-free", "vegan",
    "gluten", "gluten-free", "wheat-free", "grain-free",
    
    # Common cooking ingredients
    "salt", "pepper", "garlic", "onion", "tomato", "potato", "carrot",
    "chicken", "beef", "pork", "fish", "tofu", "tempeh", "seitan"
]

# Create simple feature matrix
vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
X = vectorizer.fit_transform(ingredients_data)

# Create DataFrame
df = pd.DataFrame({
    'ingredient': ingredients_data
})

def predict_substitute(ingredient_name):
    """
    Simple substitution prediction using TF-IDF and cosine similarity
    """
    if not ingredient_name:
        return {"error": "Ingredient name is required"}
    
    ingredient_name = ingredient_name.lower().strip()
    
    # Check if ingredient exists in our dataset
    if ingredient_name not in df['ingredient'].values:
        return {"error": "Ingredient not found"}
    
    # Find the index of the ingredient
    idx = df[df['ingredient'] == ingredient_name].index[0]
    
    # Calculate cosine similarity
    ingredient_vector = vectorizer.transform([ingredient_name])
    similarity_scores = cosine_similarity(ingredient_vector, X)[0]
    
    # Get top 3 most similar (excluding itself)
    similar_indices = similarity_scores.argsort()[::-1][1:4]
    
    results = []
    for i in similar_indices:
        score = similarity_scores[i]
        if score > 0.1:  # Only return meaningful matches
            results.append({
                "ingredient": df.iloc[i]["ingredient"],
                "score": round(float(score * 100), 2)
            })
    
    return results if results else {"error": "No good substitutes found"}
