import pickle
import numpy as np
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_model.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

FEATURE_NAMES = [
    "nitrogen",
    "phosphorus",
    "potassium",
    "temperature",
    "humidity",
    "rainfall",
    "ph"
]

def predict_crop_ml(n, p, k, temp, humidity, rainfall, ph):
    X = np.array([[n, p, k, temp, humidity, rainfall, ph]])

    crop = model.predict(X)[0]

    # Confidence
    proba = model.predict_proba(X)[0]
    confidence = float(max(proba))

    # Feature importance
    importances = model.feature_importances_
    feature_importance = {
        FEATURE_NAMES[i]: round(float(importances[i]), 4)
        for i in range(len(FEATURE_NAMES))
    }

    return crop, confidence, feature_importance
