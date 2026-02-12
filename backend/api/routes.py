from fastapi import APIRouter
from services.substitution import get_substitution
from services.flavordb_service import get_flavor_data
from services.nlp_service import parse_user_query, get_smart_suggestions, analyze_ingredients_for_allergies, get_taste_based_recommendations

router = APIRouter()

@router.get("/substitute")
def substitute(ingredient: str):
    """Get ingredient substitutions"""
    return get_substitution(ingredient)

@router.get("/flavor")
def flavor(ingredient: str):
    """Get flavor analysis for an ingredient"""
    return get_flavor_data(ingredient)

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
