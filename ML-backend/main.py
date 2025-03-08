from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

# Load the trained model and label encoder
model = joblib.load("model.pkl")
le = joblib.load("label_encoder.pkl")

# Initialize FastAPI
app = FastAPI()

# Request model
class SymptomInput(BaseModel):
    symptoms: list[str]  # Expecting a list of symptom names

@app.post("/predict")
def predict_disease(data: SymptomInput):
    try:
        # Prepare input data
        input_data = pd.DataFrame(np.zeros((1, len(model.feature_importances_))), 
                                  columns=model.feature_names_in_)
        
        for symptom in data.symptoms:
            if symptom in input_data.columns:
                input_data[symptom] = 1

        # Make prediction
        probabilities = model.predict_proba(input_data)[0]
        top_2_indices = np.argsort(probabilities)[-2:][::-1]

        results = []
        for i in top_2_indices:
            disease = le.inverse_transform([i])[0]
            prob = round(probabilities[i] * 100, 2)
            results.append({"disease": disease, "probability": prob})

        return {"predictions": results}

    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def home():
    return {"message": "FastAPI Disease Prediction API Running"}
