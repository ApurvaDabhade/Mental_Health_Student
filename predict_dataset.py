import pickle
import pandas as pd
import numpy as np

# We can reuse the exact same preprocessing function from the main model!
from high_accuracy_model import load_data

print("1. Loading and preprocessing dataset.csv exactly as the model expects...")
df, X, y, feature_names = load_data()

print("\n2. Loading Model & Scaler...")
with open("models/sota_stress_scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("models/catboost_optuna_stress.pkl", "rb") as f:
    model = pickle.load(f)

print("3. Scaling data and running Batch Inference on all {} rows...".format(len(df)))
X_scaled = scaler.transform(X)
predictions = model.predict(X_scaled)
probabilities = model.predict_proba(X_scaled)

# Add the AI's outputs directly into the original dataframe
df["Predicted_Stress_Level"] = predictions.flatten().astype(int)
df["AI_Confidence"] = [f"{p:.1%}" for p in probabilities.max(axis=1)]

# You can also add all raw probability breakdowns if you wish
df["Prob_Level_1"] = probabilities[:, 0]
df["Prob_Level_2"] = probabilities[:, 1]
df["Prob_Level_3"] = probabilities[:, 2]
df["Prob_Level_4"] = probabilities[:, 3]
df["Prob_Level_5"] = probabilities[:, 4]

output_file = "dataset_with_predictions.csv"
df.to_csv(output_file, index=False)

print(f"\n✅ Done! The model's outputs have been appended to '{output_file}'")
print(f"Open '{output_file}' in Excel, VSCode or Notepad to see the results side-by-side with your data.")
