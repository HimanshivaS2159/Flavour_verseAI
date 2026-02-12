from ml.nlp_engine import nlp_engine

def parse_user_query(query: str):
    """
    Parse user query to extract allergies, tastes, and dietary preferences
    
    Args:
        query: User input string
        
    Returns:
        Dictionary containing parsed information
    """
    if not query or not query.strip():
        return {"error": "Query is required"}
    
    try:
        result = nlp_engine.analyze_dietary_preferences(query)
        return result
    except Exception as e:
        return {"error": f"NLP processing failed: {str(e)}"}

def get_smart_suggestions(query: str):
    """
    Get smart ingredient suggestions based on user query
    
    Args:
        query: User input string
        
    Returns:
        Dictionary containing suggestions and analysis
    """
    if not query or not query.strip():
        return {"error": "Query is required"}
    
    try:
        # Parse the query
        parsed = nlp_engine.analyze_dietary_preferences(query)
        
        # Get suggestions
        suggestions = nlp_engine.get_ingredient_suggestions(
            query, parsed['allergies'], parsed['tastes']
        )
        
        return {
            "query": query,
            "parsed_info": parsed,
            "suggestions": suggestions,
            "allergy_count": len(parsed['allergies']),
            "taste_count": len(parsed['tastes']),
            "dietary_preferences": parsed['dietary_preferences']
        }
    except Exception as e:
        return {"error": f"Smart suggestions failed: {str(e)}"}

def analyze_ingredients_for_allergies(ingredients: list, user_allergies: list):
    """
    Analyze a list of ingredients for potential allergens
    
    Args:
        ingredients: List of ingredient names
        user_allergies: List of user allergies
        
    Returns:
        Dictionary with allergy analysis
    """
    if not ingredients:
        return {"error": "Ingredients list is required"}
    
    try:
        # Basic ingredient allergen database
        allergen_db = {
            'milk': ['dairy', 'lactose'],
            'cheese': ['dairy', 'lactose'],
            'butter': ['dairy', 'lactose'],
            'cream': ['dairy', 'lactose'],
            'yogurt': ['dairy', 'lactose'],
            'almond': ['nuts'],
            'walnut': ['nuts'],
            'cashew': ['nuts'],
            'pecan': ['nuts'],
            'hazelnut': ['nuts'],
            'peanut': ['nuts'],
            'wheat': ['gluten'],
            'flour': ['gluten'],
            'bread': ['gluten'],
            'pasta': ['gluten'],
            'egg': ['egg'],
            'eggs': ['egg'],
            'soy': ['soy'],
            'tofu': ['soy'],
            'soybean': ['soy'],
            'fish': ['fish'],
            'salmon': ['fish'],
            'tuna': ['fish'],
            'shrimp': ['shellfish'],
            'crab': ['shellfish'],
            'lobster': ['shellfish']
        }
        
        user_allergies_lower = [allergy.lower() for allergy in user_allergies]
        
        analysis = {
            "safe_ingredients": [],
            "allergen_containing": [],
            "warnings": []
        }
        
        for ingredient in ingredients:
            ingredient_lower = ingredient.lower()
            ingredient_allergens = allergen_db.get(ingredient_lower, [])
            
            # Check for allergen conflicts
            conflicts = []
            for allergen in ingredient_allergens:
                if allergen in user_allergies_lower or allergen.replace('-', '_') in user_allergies_lower:
                    conflicts.append(allergen)
            
            if conflicts:
                analysis["allergen_containing"].append({
                    "ingredient": ingredient,
                    "allergens": conflicts,
                    "severity": "high" if len(conflicts) > 1 else "medium"
                })
                analysis["warnings"].append(f"⚠️ {ingredient} contains {', '.join(conflicts)}")
            else:
                analysis["safe_ingredients"].append(ingredient)
        
        return analysis
        
    except Exception as e:
        return {"error": f"Allergy analysis failed: {str(e)}"}

def get_taste_based_recommendations(taste_preferences: list, exclude_allergies: list = None):
    """
    Get ingredient recommendations based on taste preferences
    
    Args:
        taste_preferences: List of taste keywords
        exclude_allergies: List of allergens to exclude
        
    Returns:
        Dictionary with taste-based recommendations
    """
    if not taste_preferences:
        return {"error": "Taste preferences are required"}
    
    try:
        # Get suggestions using NLP engine
        suggestions = nlp_engine.get_ingredient_suggestions(
            "I like " + " and ".join(taste_preferences),
            exclude_allergies or [],
            taste_preferences
        )
        
        # Categorize suggestions by taste
        categorized_suggestions = {
            "sweet": [],
            "savory": [],
            "spicy": [],
            "creamy": [],
            "fresh": [],
            "other": []
        }
        
        for suggestion in suggestions:
            suggestion_lower = suggestion.lower()
            categorized = False
            
            for taste in taste_preferences:
                if taste.lower() in suggestion_lower:
                    if taste.lower() in categorized_suggestions:
                        categorized_suggestions[taste.lower()].append(suggestion)
                        categorized = True
                        break
            
            if not categorized:
                categorized_suggestions["other"].append(suggestion)
        
        return {
            "taste_preferences": taste_preferences,
            "all_suggestions": suggestions,
            "categorized": categorized_suggestions,
            "total_suggestions": len(suggestions)
        }
        
    except Exception as e:
        return {"error": f"Taste recommendations failed: {str(e)}"}
