import joblib
import pandas as pd


# ==========================================
# LOAD MODEL
# ==========================================

model_path = "model/career_model.pkl"

print("Loading trained model...")

model = joblib.load(model_path)

print("Model loaded successfully!")


# ==========================================
# TEST INPUT
# ==========================================

data = {

    "programming_level": "Advanced",

    "preferred_field": "Software Developer",

    "tenth_marks": 85,

    "twelfth_marks": 82,

    "graduation_marks": 78,

    "semester": 6,

    "backlogs": 0,

    "skill_score": 85,

    "assessment_score": 88

}


# ==========================================
# CREATE DATAFRAME
# ==========================================

input_data = pd.DataFrame([data])


print("\nInput:")
print(input_data)


# ==========================================
# PREDICTION
# ==========================================

prediction = model.predict(
    input_data
)


print(
    "\n=========================================="
)

print(
    "PREDICTED CAREER"
)

print(
    "=========================================="
)

print(
    prediction[0]
)


# ==========================================
# CONFIDENCE
# ==========================================

if hasattr(model, "predict_proba"):

    probabilities = model.predict_proba(
        input_data
    )

    confidence = max(
        probabilities[0]
    ) * 100


    print(
        "Confidence:",
        round(confidence, 2),
        "%"
    )