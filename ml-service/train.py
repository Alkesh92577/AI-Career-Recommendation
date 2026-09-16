import os

import pandas as pd

import joblib

from sklearn.model_selection import train_test_split

from sklearn.metrics import accuracy_score

from preprocess import (
    load_dataset,
    create_model,
    FEATURES
)


# ==========================================
# LOAD DATASET
# ==========================================

print("\n==========================================")
print("LOADING DATASET")
print("==========================================")


df = load_dataset()


print("\nDataset loaded successfully.")
print("Total records:", len(df))


# ==========================================
# REQUIRED COLUMNS
# ==========================================

required_columns = FEATURES + ["career"]


# ==========================================
# CHECK COLUMNS
# ==========================================

print("\nChecking dataset columns...")


missing_columns = [

    column

    for column in required_columns

    if column not in df.columns

]


if missing_columns:

    print(
        "\nERROR: Dataset me ye columns missing hain:"
    )

    for column in missing_columns:

        print("-", column)

    raise ValueError(
        "Dataset columns incomplete hain."
    )


print("All required columns found.")


# ==========================================
# KEEP ONLY REQUIRED COLUMNS
# ==========================================

df = df[
    required_columns
].copy()


# ==========================================
# HANDLE CATEGORICAL VALUES
# ==========================================

df["programming_level"] = (

    df["programming_level"]

    .fillna("Beginner")

    .astype(str)

    .str.strip()

)


df["preferred_field"] = (

    df["preferred_field"]

    .fillna("")

    .astype(str)

    .str.strip()

)


# ==========================================
# NUMERIC COLUMNS
# ==========================================

numeric_columns = [

    "tenth_marks",

    "twelfth_marks",

    "graduation_marks",

    "semester",

    "backlogs",

    "skill_score",

    "assessment_score",

    "technology_score",

    "data_score",

    "web_score",

    "cyber_security_score"

]


for column in numeric_columns:

    df[column] = pd.to_numeric(

        df[column],

        errors="coerce"

    )

    df[column] = (

        df[column]

        .fillna(0)

    )


# ==========================================
# VALIDATE CAREER
# ==========================================

df["career"] = (

    df["career"]

    .fillna("")

    .astype(str)

    .str.strip()

)


df = df[
    df["career"] != ""
].copy()


# ==========================================
# SHOW DATASET
# ==========================================

print("\n==========================================")
print("DATASET PREVIEW")
print("==========================================")

print(df.to_string(index=False))


# ==========================================
# SHOW CAREER CLASSES
# ==========================================

print("\n==========================================")
print("CAREER CLASSES")
print("==========================================")

print(
    df["career"].value_counts()
)


# ==========================================
# DATASET WARNING
# ==========================================

if len(df) < 20:

    print("\nWARNING:")
    print(
        "Dataset me bahut kam records hain."
    )

    print(
        "Model sirf testing ke liye train hoga."
    )

    print(
        "Reliable ML prediction ke liye "
        "zyada records add karo."
    )


# ==========================================
# FEATURES
# ==========================================

X = df[
    FEATURES
]


y = df[
    "career"
]


# ==========================================
# CREATE MODEL
# ==========================================

print("\n==========================================")
print("CREATING ML MODEL")
print("==========================================")


model = create_model()


# ==========================================
# TRAIN MODEL
# ==========================================

print("\n==========================================")
print("TRAINING MODEL")
print("==========================================")


model.fit(

    X,

    y

)


print(
    "\nModel training completed successfully."
)


# ==========================================
# OPTIONAL TEST
# ==========================================

print("\n==========================================")
print("MODEL TEST")
print("==========================================")


predictions = model.predict(X)


accuracy = accuracy_score(

    y,

    predictions

)


print(
    "Training Accuracy:",
    round(
        accuracy * 100,
        2
    ),
    "%"
)


# ==========================================
# CREATE MODEL DIRECTORY
# ==========================================

os.makedirs(

    "model",

    exist_ok=True

)


# ==========================================
# SAVE MODEL
# ==========================================

model_path = (
    "model/career_model.pkl"
)


joblib.dump(

    model,

    model_path

)


print("\n==========================================")
print("MODEL SAVED SUCCESSFULLY")
print("==========================================")

print(
    "Location:",
    model_path
)


# ==========================================
# FINAL FEATURES
# ==========================================

print("\nFinal ML features:")


for index, feature in enumerate(

    FEATURES,

    start=1

):

    print(
        f"{index}. {feature}"
    )


print("\n==========================================")
print("TRAINING COMPLETED")
print("==========================================")