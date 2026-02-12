import pickle
import os

# Create comprehensive flavor database
flavor_data = {
    "vanilla": {
        "primary_flavors": ["sweet", "creamy", "floral"],
        "secondary_flavors": ["woody", "smoky", "spicy"],
        "aroma_compounds": ["vanillin", "eugenol", "p-hydroxybenzaldehyde"],
        "taste_profile": {
            "sweetness": 9,
            "bitterness": 2,
            "acidity": 1,
            "umami": 1,
            "intensity": 7
        },
        "pairing_suggestions": ["chocolate", "coffee", "caramel", "berries", "cream"],
        "categories": ["spice", "aromatic", "sweet"],
        "chemical_notes": "Contains vanillin (4-hydroxy-3-methoxybenzaldehyde) as primary flavor compound",
        "common_uses": ["baking", "desserts", "beverages", "perfumes"]
    },
    "chocolate": {
        "primary_flavors": ["sweet", "bitter", "rich"],
        "secondary_flavors": ["nutty", "fruity", "spicy"],
        "aroma_compounds": ["theobromine", "phenylethylamine", "vanillin"],
        "taste_profile": {
            "sweetness": 6,
            "bitterness": 7,
            "acidity": 3,
            "umami": 2,
            "intensity": 8
        },
        "pairing_suggestions": ["vanilla", "coffee", "nuts", "berries", "caramel"],
        "categories": ["sweet", "bitter", "rich"],
        "chemical_notes": "Contains theobromine and phenylethylamine compounds",
        "common_uses": ["desserts", "baking", "beverages", "confectionery"]
    },
    "garlic": {
        "primary_flavors": ["pungent", "savory", "spicy"],
        "secondary_flavors": ["sweet", "earthy", "metallic"],
        "aroma_compounds": ["allicin", "diallyl disulfide", "ajoene"],
        "taste_profile": {
            "sweetness": 2,
            "bitterness": 3,
            "acidity": 1,
            "umami": 6,
            "intensity": 9
        },
        "pairing_suggestions": ["onion", "herbs", "tomato", "lemon", "olive oil"],
        "categories": ["allium", "pungent", "savory"],
        "chemical_notes": "Allicin provides characteristic pungent flavor and aroma",
        "common_uses": ["cooking", "sauces", "seasoning", "medicine"]
    },
    "lemon": {
        "primary_flavors": ["citrus", "sour", "fresh"],
        "secondary_flavors": ["sweet", "floral", "tangy"],
        "aroma_compounds": ["limonene", "citral", "linalool"],
        "taste_profile": {
            "sweetness": 3,
            "bitterness": 2,
            "acidity": 9,
            "umami": 1,
            "intensity": 7
        },
        "pairing_suggestions": ["herbs", "fish", "chicken", "vegetables", "tea"],
        "categories": ["citrus", "sour", "fresh"],
        "chemical_notes": "High in citric acid and limonene compounds",
        "common_uses": ["beverages", "cooking", "baking", "cleaning"]
    },
    "cinnamon": {
        "primary_flavors": ["sweet", "spicy", "warm"],
        "secondary_flavors": ["woody", "earthy", "slightly bitter"],
        "aroma_compounds": ["cinnamaldehyde", "eugenol", "coumarin"],
        "taste_profile": {
            "sweetness": 6,
            "bitterness": 3,
            "acidity": 2,
            "umami": 2,
            "intensity": 7
        },
        "pairing_suggestions": ["apple", "coffee", "chocolate", "vanilla", "nuts"],
        "categories": ["spice", "warm", "sweet"],
        "chemical_notes": "Cinnamaldehyde provides characteristic spicy-sweet flavor",
        "common_uses": ["baking", "beverages", "curries", "desserts"]
    },
    "coffee": {
        "primary_flavors": ["bitter", "rich", "roasted"],
        "secondary_flavors": ["chocolate", "nutty", "fruity"],
        "aroma_compounds": ["caffeine", "chlorogenic acids", "furans"],
        "taste_profile": {
            "sweetness": 2,
            "bitterness": 8,
            "acidity": 4,
            "umami": 3,
            "intensity": 9
        },
        "pairing_suggestions": ["chocolate", "vanilla", "nuts", "caramel", "cream"],
        "categories": ["bitter", "beverage", "roasted"],
        "chemical_notes": "Contains caffeine and chlorogenic acid compounds",
        "common_uses": ["beverages", "desserts", "flavoring"]
    },
    "basil": {
        "primary_flavors": ["herbal", "sweet", "peppery"],
        "secondary_flavors": ["minty", "clovelike", "anise"],
        "aroma_compounds": ["linalool", "eugenol", "methyl chavicol"],
        "taste_profile": {
            "sweetness": 4,
            "bitterness": 3,
            "acidity": 2,
            "umami": 2,
            "intensity": 6
        },
        "pairing_suggestions": ["tomato", "mozzarella", "olive oil", "garlic", "lemon"],
        "categories": ["herb", "fresh", "aromatic"],
        "chemical_notes": "Linalool and eugenol provide characteristic aroma",
        "common_uses": ["cooking", "salads", "sauces", "pesto"]
    },
    "ginger": {
        "primary_flavors": ["spicy", "pungent", "warm"],
        "secondary_flavors": ["sweet", "earthy", "citrus"],
        "aroma_compounds": ["gingerol", "shogaol", "zingerone"],
        "taste_profile": {
            "sweetness": 3,
            "bitterness": 4,
            "acidity": 2,
            "umami": 3,
            "intensity": 8
        },
        "pairing_suggestions": ["garlic", "soy sauce", "lemon", "honey", "vegetables"],
        "categories": ["spice", "pungent", "warm"],
        "chemical_notes": "Gingerol compounds provide spicy warming sensation",
        "common_uses": ["cooking", "tea", "medicine", "baking"]
    },
    "honey": {
        "primary_flavors": ["sweet", "floral", "fruity"],
        "secondary_flavors": ["earthy", "herbal", "spicy"],
        "aroma_compounds": ["fructose", "glucose", "volatile organic compounds"],
        "taste_profile": {
            "sweetness": 10,
            "bitterness": 1,
            "acidity": 2,
            "umami": 1,
            "intensity": 6
        },
        "pairing_suggestions": ["tea", "lemon", "yogurt", "nuts", "fruits"],
        "categories": ["sweet", "natural", "golden"],
        "chemical_notes": "Complex mixture of sugars and floral compounds",
        "common_uses": ["sweetener", "baking", "beverages", "medicine"]
    },
    "mint": {
        "primary_flavors": ["cool", "fresh", "herbal"],
        "secondary_flavors": ["sweet", "spicy", "slightly bitter"],
        "aroma_compounds": ["menthol", "menthone", "limonene"],
        "taste_profile": {
            "sweetness": 3,
            "bitterness": 2,
            "acidity": 1,
            "umami": 1,
            "intensity": 7
        },
        "pairing_suggestions": ["chocolate", "lemon", "tea", "lamb", "vegetables"],
        "categories": ["herb", "cool", "fresh"],
        "chemical_notes": "Menthol provides cooling sensation",
        "common_uses": ["beverages", "desserts", "garnish", "medicine"]
    }
}

# Save the flavor database
def save_flavor_database():
    """Save the flavor database to a pickle file"""
    model_path = os.path.join(os.path.dirname(__file__), "flavor_db.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(flavor_data, f)
    print(f"Flavor database saved to {model_path}")

# Load the flavor database
def load_flavor_database():
    """Load the flavor database from a pickle file"""
    model_path = os.path.join(os.path.dirname(__file__), "flavor_db.pkl")
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    return flavor_data

# Create and save the database
if __name__ == "__main__":
    save_flavor_database()
    print("Flavor database created successfully!")
    print(f"Total ingredients: {len(flavor_data)}")
    print("Available ingredients:", list(flavor_data.keys()))
