try:
    from ml.ml_engine import predict_substitute
    ML_ENGINE_AVAILABLE = True
except ImportError as e:
    print(f"ML engine not available: {e}")
    ML_ENGINE_AVAILABLE = False

def get_substitution(ingredient: str):
    """
    Get ingredient substitutions using ML model or fallback data
    """
    if not ingredient:
        return {"error": "Ingredient name is required"}
    
    # Try ML engine first
    if ML_ENGINE_AVAILABLE:
        try:
            result = predict_substitute(ingredient)
            if not result.get("error"):
                return result
        except Exception as e:
            print(f"ML engine failed: {e}")
    
    # Try simple ML model
    try:
        from ml.simple_model import predict_substitute as simple_predict
        result = simple_predict(ingredient)
        if not result.get("error"):
            return result
    except Exception as e:
        print(f"Simple model failed: {e}")
    
    # Fallback to predefined substitutions
    fallback_substitutions = get_fallback_substitutions(ingredient.lower())
    if fallback_substitutions:
        return fallback_substitutions
    
    return {"error": f"No substitutes found for '{ingredient}'. Try specific ingredients like 'milk', 'butter', or 'cheese'."}

def get_fallback_substitutions(ingredient: str):
    """
    Fallback substitution database for common ingredients with ML-like scores
    """
    substitutions = {
        "milk": [
            {"ingredient": "almond milk", "score": 90},
            {"ingredient": "soy milk", "score": 85},
            {"ingredient": "coconut milk", "score": 80},
            {"ingredient": "oat milk", "score": 82},
            {"ingredient": "cashew milk", "score": 83}
        ],
        "butter": [
            {"ingredient": "coconut oil", "score": 88},
            {"ingredient": "olive oil", "score": 75},
            {"ingredient": "margarine", "score": 92},
            {"ingredient": "ghee", "score": 85},
            {"ingredient": "avocado oil", "score": 80}
        ],
        "cheese": [
            {"ingredient": "nutritional yeast", "score": 78},
            {"ingredient": "cashew cheese", "score": 85},
            {"ingredient": "tofu", "score": 70},
            {"ingredient": "mozzarella", "score": 88}
        ],
        "eggs": [
            {"ingredient": "flax eggs", "score": 82},
            {"ingredient": "chia eggs", "score": 82},
            {"ingredient": "applesauce", "score": 75},
            {"ingredient": "banana", "score": 70},
            {"ingredient": "silken tofu", "score": 78}
        ],
        "flour": [
            {"ingredient": "almond flour", "score": 88},
            {"ingredient": "coconut flour", "score": 80},
            {"ingredient": "oat flour", "score": 85},
            {"ingredient": "whole wheat flour", "score": 90},
            {"ingredient": "gluten-free flour", "score": 82}
        ],
        "sugar": [
            {"ingredient": "honey", "score": 88},
            {"ingredient": "maple syrup", "score": 85},
            {"ingredient": "stevia", "score": 75},
            {"ingredient": "coconut sugar", "score": 82},
            {"ingredient": "brown sugar", "score": 90}
        ],
        "dairy": [
            {"ingredient": "almond milk", "score": 90},
            {"ingredient": "coconut yogurt", "score": 85},
            {"ingredient": "nutritional yeast", "score": 78},
            {"ingredient": "dairy-free", "score": 88},
            {"ingredient": "plant-based milk", "score": 86}
        ]
    }
    
    return substitutions.get(ingredient, None)
