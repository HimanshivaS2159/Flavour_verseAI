import pickle
import os
from app.config import FOODOSCOPE_API_KEY

def get_flavor_data(ingredient):
    """
    Get flavor data from local database or fallback to external API
    """
    if not ingredient:
        return {"error": "Ingredient name is required"}
    
    ingredient = ingredient.lower().strip()
    
    # Try local database first
    try:
        flavor_db_path = os.path.join(os.path.dirname(__file__), "..", "ml", "flavor_db.pkl")
        if os.path.exists(flavor_db_path):
            with open(flavor_db_path, 'rb') as f:
                flavor_db = pickle.load(f)
            
            if ingredient in flavor_db:
                return flavor_db[ingredient]
    except Exception as e:
        print(f"Error loading local flavor database: {e}")
    
    # Fallback to external API if API key is available
    if FOODOSCOPE_API_KEY and FOODOSCOPE_API_KEY != "your_api_key_here":
        try:
            import requests
            HEADERS = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {FOODOSCOPE_API_KEY}"
            }
            url = "https://api.foodoscope.com/flavordb/properties/by-naturalOccurrence"
            params = {"occurrence": ingredient}
            response = requests.get(url, headers=HEADERS, params=params)
            return response.json()
        except Exception as e:
            print(f"External API failed: {e}")
    
    # Return helpful message if no data found
    available_ingredients = ["vanilla", "chocolate", "garlic", "lemon", "cinnamon", 
                           "coffee", "basil", "ginger", "honey", "mint"]
    
    return {
        "error": f"No flavor data found for '{ingredient}'",
        "suggestion": f"Try one of these ingredients: {', '.join(available_ingredients)}",
        "available_ingredients": available_ingredients
    }
