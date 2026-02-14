from fastapi import APIRouter, Body
from services.substitution import get_substitution
from services.flavordb_service import get_flavor_data, get_all_flavors, get_flavor_categories, get_flavor_pairings, analyze_flavor_profile
from services.nlp_service import parse_user_query, get_smart_suggestions, analyze_ingredients_for_allergies, get_taste_based_recommendations
from services.calorie_service import get_calorie_data, calculate_recipe_calories

router = APIRouter()

@router.get("/substitute")
def substitute(ingredient: str):
    """Get ingredient substitutions"""
    return get_substitution(ingredient)

@router.get("/flavor")
def flavor(ingredient: str):
    """Get flavor analysis for an ingredient"""
    return get_flavor_data(ingredient)

@router.get("/flavors")
def flavors():
    """Get all available flavors from database"""
    return get_all_flavors()

@router.get("/flavor-categories")
def flavor_categories():
    """Get all flavor categories and descriptions"""
    return get_flavor_categories()

@router.get("/flavor-pairings/{flavor_category}")
def flavor_pairings(flavor_category: str):
    """Get recommended pairings for a flavor category"""
    return get_flavor_pairings(flavor_category)

@router.post("/flavor-profile")
def flavor_profile(ingredients: list[str]):
    """Analyze flavor profile of multiple ingredients"""
    return analyze_flavor_profile(ingredients)

@router.post("/nlp/parse")
def parse_query(query: str):
    """Parse user query for allergies and tastes"""
    return parse_user_query(query)

@router.post("/nlp/suggestions")
def smart_suggestions(query: str):
    """Get smart ingredient suggestions based on query"""
    return get_smart_suggestions(query)

@router.post("/nlp/allergy-check")
def allergy_check(ingredients: list, user_allergies: list):
    """Check ingredients for allergens"""
    return analyze_ingredients_for_allergies(ingredients, user_allergies)

@router.post("/nlp/taste-recommendations")
def taste_recommendations(taste_preferences: list, exclude_allergies: list = None):
    """Get recommendations based on taste preferences"""
    return get_taste_based_recommendations(taste_preferences, exclude_allergies)

@router.get("/calories")
def calories(ingredient: str):
    """Get calorie information for an ingredient"""
    return get_calorie_data(ingredient)

@router.post("/calories/recipe")
def recipe_calories(ingredients: list = Body(...)):
    """Calculate total calories for a recipe"""
    return calculate_recipe_calories(ingredients)
