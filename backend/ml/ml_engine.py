import joblib
import os

try:
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError as e:
    print(f"Warning: sklearn not available: {e}")
    SKLEARN_AVAILABLE = False

MODEL_PATH = os.path.join(os.path.dirname(__file__), "flavor_model.pkl")

def predict_substitute(ingredient_name):
    """
    Predict ingredient substitutes using ML model
    """
    if not SKLEARN_AVAILABLE:
        return {"error": "ML dependencies not available - please check environment"}
    
    try:
        model_data = joblib.load(MODEL_PATH)
        
        vectorizer = model_data["vectorizer"]
        X = model_data["flavor_matrix"]
        df = model_data["dataframe"]
        
        if ingredient_name not in df["ingredient"].values:
            return {"error": "Ingredient not found"}
        
        idx = df[df["ingredient"] == ingredient_name].index[0]
        similarity_scores = cosine_similarity(X[idx], X)[0]
        similar_indices = similarity_scores.argsort()[::-1][1:4]
        
        results = []
        for i in similar_indices:
            results.append({
                "ingredient": df.iloc[i]["ingredient"],
                "score": round(float(similarity_scores[i]) * 100, 2)
            })
        
        return results
        
    except Exception as e:
        return {"error": f"Model loading failed: {str(e)}"}
