import spacy
from typing import Dict, List, Set

class NLPEngine:
    def __init__(self):
        """Initialize the NLP engine with spaCy model"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("spaCy model not found. Installing...")
            import subprocess
            import sys
            subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
        
        # Define allergy keywords
        self.allergy_keywords = {
            'nuts', 'peanut', 'almond', 'walnut', 'cashew', 'pecan', 'hazelnut',
            'dairy', 'milk', 'cheese', 'butter', 'cream', 'yogurt', 'lactose',
            'gluten', 'wheat', 'flour', 'bread', 'pasta', 'barley', 'rye',
            'egg', 'eggs',
            'soy', 'tofu', 'soybean', 'edamame',
            'fish', 'salmon', 'tuna', 'cod', 'trout',
            'shellfish', 'shrimp', 'crab', 'lobster', 'clam', 'mussel',
            'sesame', 'poppy', 'mustard'
        }
        
        # Define taste keywords
        self.taste_keywords = {
            'sweet', 'sugary', 'honeyed', 'candied', 'syrupy',
            'sour', 'tart', 'acidic', 'citrus', 'tangy',
            'bitter', 'sharp', 'pungent', 'acrid',
            'salty', 'savory', 'umami', 'briny',
            'spicy', 'hot', 'peppery', 'piquant', 'zesty',
            'creamy', 'smooth', 'rich', 'velvety',
            'crunchy', 'crispy', 'hard', 'firm',
            'soft', 'tender', 'chewy', 'gooey',
            'fresh', 'herbal', 'grassy', 'green',
            'fruity', 'juicy', 'ripe', 'tropical',
            'nutty', 'earthy', 'woody', 'mushroom',
            'floral', 'perfumed', 'aromatic',
            'smoky', 'roasted', 'toasted', 'grilled',
            'burnt', 'charred', 'caramelized'
        }
    
    def parse_query(self, query: str) -> Dict:
        """
        Parse a user query to extract allergies and taste preferences
        
        Args:
            query: User input string
            
        Returns:
            Dictionary containing extracted allergies and tastes
        """
        if not query:
            return {"allergies": [], "tastes": [], "entities": []}
        
        # Process the query with spaCy
        doc = self.nlp(query.lower())
        
        # Extract tokens and lemmas
        tokens = [token.text for token in doc]
        lemmas = [token.lemma_ for token in doc]
        
        # Find allergies
        allergies = self._find_allergies(tokens, lemmas)
        
        # Find taste preferences
        tastes = self._find_tastes(tokens, lemmas)
        
        # Extract named entities
        entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        
        return {
            "allergies": list(allergies),
            "tastes": list(tastes),
            "entities": entities,
            "tokens": tokens,
            "lemmas": lemmas
        }
    
    def _find_allergies(self, tokens: List[str], lemmas: List[str]) -> Set[str]:
        """Find allergy-related keywords in the query"""
        allergies = set()
        
        # Check tokens and lemmas against allergy keywords
        for token, lemma in zip(tokens, lemmas):
            if token in self.allergy_keywords or lemma in self.allergy_keywords:
                allergies.add(lemma)
        
        return allergies
    
    def _find_tastes(self, tokens: List[str], lemmas: List[str]) -> Set[str]:
        """Find taste-related keywords in the query"""
        tastes = set()
        
        # Check tokens and lemmas against taste keywords
        for token, lemma in zip(tokens, lemmas):
            if token in self.taste_keywords or lemma in self.taste_keywords:
                tastes.add(lemma)
        
        return tastes
    
    def get_ingredient_suggestions(self, query: str, allergies: List[str], tastes: List[str]) -> List[str]:
        """
        Get ingredient suggestions based on parsed query
        
        Args:
            query: Original user query
            allergies: List of identified allergies
            tastes: List of taste preferences
            
        Returns:
            List of suggested ingredients
        """
        # Basic ingredient database with allergy and taste information
        ingredient_db = {
            'milk': {'allergens': ['dairy', 'lactose'], 'tastes': ['creamy', 'sweet']},
            'almond milk': {'allergens': ['nuts'], 'tastes': ['nutty', 'creamy']},
            'coconut milk': {'allergens': [], 'tastes': ['creamy', 'sweet', 'tropical']},
            'soy milk': {'allergens': ['soy'], 'tastes': ['creamy', 'nutty']},
            'butter': {'allergens': ['dairy'], 'tastes': ['creamy', 'rich', 'salty']},
            'coconut oil': {'allergens': [], 'tastes': ['creamy', 'sweet']},
            'olive oil': {'allergens': [], 'tastes': ['fruity', 'peppery']},
            'cheese': {'allergens': ['dairy'], 'tastes': ['salty', 'savory', 'creamy']},
            'nutritional yeast': {'allergens': [], 'tastes': ['savory', 'nutty', 'cheesy']},
            'cashew cheese': {'allergens': ['nuts'], 'tastes': ['creamy', 'nutty', 'savory']},
            'eggs': {'allergens': ['egg'], 'tastes': ['rich', 'creamy']},
            'flax eggs': {'allergens': [], 'tastes': ['nutty', 'earthy']},
            'chia eggs': {'allergens': [], 'tastes': ['nutty', 'earthy']},
            'applesauce': {'allergens': [], 'tastes': ['sweet', 'fruity']},
            'flour': {'allergens': ['gluten', 'wheat'], 'tastes': ['neutral', 'earthy']},
            'almond flour': {'allergens': ['nuts'], 'tastes': ['nutty', 'sweet']},
            'coconut flour': {'allergens': [], 'tastes': ['sweet', 'tropical']},
            'sugar': {'allergens': [], 'tastes': ['sweet', 'sugary']},
            'honey': {'allergens': [], 'tastes': ['sweet', 'floral']},
            'maple syrup': {'allergens': [], 'tastes': ['sweet', 'woody']},
            'stevia': {'allergens': [], 'tastes': ['sweet', 'bitter']},
            'vanilla': {'allergens': [], 'tastes': ['sweet', 'floral', 'aromatic']},
            'chocolate': {'allergens': [], 'tastes': ['sweet', 'bitter', 'rich']},
            'cinnamon': {'allergens': [], 'tastes': ['sweet', 'spicy', 'warm']},
            'garlic': {'allergens': [], 'tastes': ['pungent', 'spicy', 'savory']},
            'lemon': {'allergens': [], 'tastes': ['sour', 'citrus', 'fresh']},
            'basil': {'allergens': [], 'tastes': ['fresh', 'herbal', 'slightly sweet']},
            'ginger': {'allergens': [], 'tastes': ['spicy', 'pungent', 'warm']},
            'mint': {'allergens': [], 'tastes': ['fresh', 'cool', 'slightly sweet']}
        }
        
        suggestions = []
        
        # Filter ingredients based on allergies and tastes
        for ingredient, info in ingredient_db.items():
            # Skip if ingredient contains allergens
            ingredient_allergens = set(info['allergens'])
            user_allergies = set(allergies)
            
            if ingredient_allergens & user_allergies:
                continue
            
            # Score based on taste preferences
            ingredient_tastes = set(info['tastes'])
            user_tastes = set(tastes)
            
            taste_score = len(ingredient_tastes & user_tastes)
            
            if taste_score > 0 or not user_tastes:  # Include if tastes match or no taste preference
                suggestions.append({
                    'ingredient': ingredient,
                    'taste_score': taste_score,
                    'taste_matches': list(ingredient_tastes & user_tastes),
                    'allergen_free': True
                })
        
        # Sort by taste score
        suggestions.sort(key=lambda x: x['taste_score'], reverse=True)
        
        return [s['ingredient'] for s in suggestions[:10]]  # Return top 10
    
    def analyze_dietary_preferences(self, query: str) -> Dict:
        """
        Analyze query for dietary preferences and restrictions
        
        Args:
            query: User input string
            
        Returns:
            Dictionary with dietary analysis
        """
        parsed = self.parse_query(query)
        
        dietary_preferences = {
            'vegan': any(word in parsed['tokens'] for word in ['vegan', 'plant-based', 'animal-free']),
            'vegetarian': any(word in parsed['tokens'] for word in ['vegetarian', 'meat-free']),
            'gluten_free': any(word in parsed['tokens'] for word in ['gluten-free', 'celiac', 'no-gluten']),
            'dairy_free': any(word in parsed['tokens'] for word in ['dairy-free', 'lactose-free', 'no-dairy']),
            'nut_free': any(word in parsed['tokens'] for word in ['nut-free', 'no-nuts']),
            'low_sugar': any(word in parsed['tokens'] for word in ['low-sugar', 'sugar-free', 'no-sugar']),
            'low_sodium': any(word in parsed['tokens'] for word in ['low-sodium', 'salt-free', 'no-salt'])
        }
        
        return {
            **parsed,
            'dietary_preferences': dietary_preferences
        }

# Initialize the NLP engine
nlp_engine = NLPEngine()

# Example usage
if __name__ == "__main__":
    test_queries = [
        "I'm allergic to nuts and dairy, but I like sweet and creamy things",
        "I need something gluten-free and savory",
        "I want vegan options that are spicy and flavorful",
        "No eggs or soy, looking for something sweet"
    ]
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        result = nlp_engine.analyze_dietary_preferences(query)
        print(f"Allergies: {result['allergies']}")
        print(f"Tastes: {result['tastes']}")
        print(f"Dietary preferences: {result['dietary_preferences']}")
        
        suggestions = nlp_engine.get_ingredient_suggestions(
            query, result['allergies'], result['tastes']
        )
        print(f"Suggestions: {suggestions}")
