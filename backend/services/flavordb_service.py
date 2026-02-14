import pickle
import os
import requests
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
        print(f"Error reading local flavor database: {e}")
    
    # Fallback to external API
    try:
        # Use the new API URL you provided
        api_url = "https://example.com/recipe2-api/ingredients/flavor/Herbs%20and%20Spices?page=1&limit=50"
        
        headers = {}
        if FOODOSCOPE_API_KEY != "your_api_key_here":
            headers["Authorization"] = f"Bearer {FOODOSCOPE_API_KEY}"
        
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Cache the response locally
        try:
            flavor_db_path = os.path.join(os.path.dirname(__file__), "..", "ml", "flavor_db.pkl")
            if os.path.exists(os.path.dirname(flavor_db_path)):
                with open(flavor_db_path, 'rb') as f:
                    flavor_db = pickle.load(f)
            else:
                flavor_db = {}
            
            flavor_db[ingredient] = data
            with open(flavor_db_path, 'wb') as f:
                pickle.dump(flavor_db, f)
        except Exception as e:
            print(f"Error caching flavor data: {e}")
        
        return data
        
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch flavor data: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}

def get_all_flavors():
    """
    Get all flavors from the external API
    """
    try:
        api_url = "https://example.com/recipe2-api/ingredients/flavor/Herbs%20and%20Spices?page=1&limit=50"
        
        headers = {}
        if FOODOSCOPE_API_KEY != "your_api_key_here":
            headers["Authorization"] = f"Bearer {FOODOSCOPE_API_KEY}"
        
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch flavor data: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}

# Return helpful message if no data found
available_ingredients = ["vanilla", "chocolate", "garlic", "lemon", "cinnamon", 
                           "coffee", "basil", "ginger", "honey", "mint"]
    
return {
    "error": f"No flavor data found for '{ingredient}'",
    "suggestion": f"Try one of these ingredients: {', '.join(available_ingredients)}",
    "available_ingredients": available_ingredients
}
