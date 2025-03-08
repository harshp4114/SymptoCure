import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Step 1: Load Data (Replace this with a real dataset)
data = {
    "fever": [1, 0, 1, 0, 1, 1, 0, 1],
    "cough": [1, 1, 0, 0, 1, 0, 1, 1],
    "fatigue": [1, 0, 1, 1, 0, 1, 0, 1],
    "disease": ["Flu", "Cold", "Flu", "Cold", "Flu", "Malaria", "Cold", "Flu"]
}

df = pd.DataFrame(data)

# Step 2: Encode the target variable
le = LabelEncoder()
df["disease"] = le.fit_transform(df["disease"])

# Step 3: Split Data
X = df.drop("disease", axis=1)
y = df["disease"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train the Model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Step 5: Save the Model and Label Encoder
joblib.dump(model, "disease_model.pkl")
joblib.dump(le, "label_encoder.pkl")

print("Model trained and saved successfully!")
