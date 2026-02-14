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

def get_flavor_categories():
    """
    Get flavor categories and their descriptions
    """
    return {
        "sweet": {
            "description": "Sweet flavors like sugar, honey, vanilla",
            "ingredients": ["sugar", "honey", "vanilla", "maple syrup", "agave"],
            "pairings": ["citrus", "nuts", "spices"]
        },
        "sour": {
            "description": "Sour flavors like lemon, vinegar, yogurt",
            "ingredients": ["lemon", "lime", "vinegar", "yogurt", "tamarind"],
            "pairings": ["sweet", "herbs", "fatty"]
        },
        "salty": {
            "description": "Salty flavors like salt, soy sauce, cheese",
            "ingredients": ["salt", "soy sauce", "cheese", "bacon", "olives"],
            "pairings": ["sweet", "acidic", "herbs"]
        },
        "bitter": {
            "description": "Bitter flavors like coffee, dark chocolate, greens",
            "ingredients": ["coffee", "dark chocolate", "kale", "broccoli", "grapefruit"],
            "pairings": ["sweet", "fatty", "creamy"]
        },
        "umami": {
            "description": "Umami flavors like mushrooms, soy, aged cheese",
            "ingredients": ["mushrooms", "soy sauce", "parmesan", "tomato", "seaweed"],
            "pairings": ["salty", "acidic", "fatty"]
        },
        "spicy": {
            "description": "Spicy flavors like chili, pepper, ginger",
            "ingredients": ["chili", "black pepper", "ginger", "wasabi", "horseradish"],
            "pairings": ["cooling", "creamy", "sweet"]
        }
    }

def get_flavor_pairings(flavor_category):
    """
    Get recommended pairings for a specific flavor category
    """
    categories = get_flavor_categories()
    if flavor_category in categories:
        return categories[flavor_category]["pairings"]
    return {"error": f"Unknown flavor category: {flavor_category}"}

def analyze_flavor_profile(ingredients):
    """
    Analyze the flavor profile of multiple ingredients
    """
    if not ingredients:
        return {"error": "Ingredients list is required"}
    
    categories = get_flavor_categories()
    profile = {
        "ingredients": ingredients,
        "flavor_breakdown": {},
        "dominant_flavors": [],
        "pairing_suggestions": []
    }
    
    flavor_counts = {}
    for ingredient in ingredients:
        ingredient_lower = ingredient.lower()
        for category, data in categories.items():
            if ingredient_lower in [ing.lower() for ing in data["ingredients"]]:
                flavor_counts[category] = flavor_counts.get(category, 0) + 1
                profile["flavor_breakdown"][category] = profile["flavor_breakdown"].get(category, 0) + 1
    
    # Determine dominant flavors
    if flavor_counts:
        max_count = max(flavor_counts.values())
        profile["dominant_flavors"] = [flavor for flavor, count in flavor_counts.items() if count == max_count]
        
        # Get pairings for dominant flavors
        for dominant_flavor in profile["dominant_flavors"]:
            if dominant_flavor in categories:
                profile["pairing_suggestions"].extend(categories[dominant_flavor]["pairings"])
        
        # Remove duplicates
        profile["pairing_suggestions"] = list(set(profile["pairing_suggestions"]))
    
    return profile
