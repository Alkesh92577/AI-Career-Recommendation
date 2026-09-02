import os

import pandas as pd

import joblib

from sklearn.model_selection import train_test_split

from sklearn.metrics import accuracy_score

from preprocess import load_dataset, create_model


# ==========================================
# LOAD DATASET
# ==========================================

print(
    "\n=========================================="
)

print(
    "LOADING DATASET"
)

print(
    "=========================================="
)


df = load_dataset()


print(
    "\nDataset loaded successfully."
)


print(
    "Total records:",
    len(df)
)


# ==========================================
# REQUIRED COLUMNS
# ==========================================

required_columns = [

    "programming_level",

    "preferred_field",

    "tenth_marks",

    "twelfth_marks",

    "graduation_marks",

    "semester",

    "backlogs",

    "skill_score",

    "assessment_score",

    "career"

]


# ==========================================
# CHECK REQUIRED COLUMNS
# ==========================================

print(
    "\nChecking dataset columns..."
)


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

        print(
            "-",
            column
        )


    raise ValueError(
        "Dataset columns incomplete hain."
    )


print(
    "All required columns found."
)


# ==========================================
# HANDLE MISSING VALUES
# ==========================================

print(
    "\nChecking missing values..."
)


# ==========================================
# CATEGORICAL COLUMNS
# ==========================================

df["programming_level"] = (

    df["programming_level"]

    .fillna("Beginner")

)


df["preferred_field"] = (

    df["preferred_field"]

    .fillna("")

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

    "assessment_score"

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
# FEATURES
# ==========================================
# IMPORTANT:
# best_skill completely removed
# best_skill_score completely removed
# ==========================================

features = [

    "programming_level",

    "preferred_field",

    "tenth_marks",

    "twelfth_marks",

    "graduation_marks",

    "semester",

    "backlogs",

    "skill_score",

    "assessment_score"

]


print(
    "\n=========================================="
)

print(
    "ML FEATURES"
)

print(
    "=========================================="
)


for index, feature in enumerate(
    features,
    start=1
):

    print(
        f"{index}. {feature}"
    )


# ==========================================
# CREATE X
# ==========================================

X = df[
    features
]


# ==========================================
# TARGET
# ==========================================

y = df[
    "career"
]


# ==========================================
# SHOW CAREER CLASSES
# ==========================================

print(
    "\n=========================================="
)

print(
    "CAREER CLASSES"
)

print(
    "=========================================="
)


print(
    y.value_counts()
)


# ==========================================
# SHOW DATASET SAMPLE
# ==========================================

print(
    "\n=========================================="
)

print(
    "DATASET SAMPLE"
)

print(
    "=========================================="
)


print(
    df.head()
)


# ==========================================
# SHOW X SAMPLE
# ==========================================

print(
    "\n=========================================="
)

print(
    "ML INPUT SAMPLE"
)

print(
    "=========================================="
)


print(
    X.head()
)


# ==========================================
# TRAIN TEST SPLIT
# ==========================================

print(
    "\n=========================================="
)

print(
    "SPLITTING DATASET"
)

print(
    "=========================================="
)


X_train, X_test, y_train, y_test = (

    train_test_split(

        X,

        y,

        test_size=0.20,

        random_state=42

    )

)


print(
    "\nTraining records:",
    len(X_train)
)


print(
    "Testing records:",
    len(X_test)
)


# ==========================================
# CREATE MODEL
# ==========================================

print(
    "\n=========================================="
)

print(
    "CREATING ML MODEL"
)

print(
    "=========================================="
)


model = create_model()


# ==========================================
# TRAIN MODEL
# ==========================================

print(
    "\n=========================================="
)

print(
    "TRAINING MODEL"
)

print(
    "=========================================="
)


model.fit(

    X_train,

    y_train

)


print(
    "\nModel training completed successfully."
)


# ==========================================
# SHOW MODEL FEATURES
# ==========================================

if hasattr(
    model,
    "feature_names_in_"
):

    print(
        "\nModel trained with features:"
    )

    print(
        list(
            model.feature_names_in_
        )
    )


# ==========================================
# TEST MODEL
# ==========================================

print(
    "\n=========================================="
)

print(
    "TESTING MODEL"
)

print(
    "=========================================="
)


predictions = model.predict(

    X_test

)


# ==========================================
# ACCURACY
# ==========================================

accuracy = accuracy_score(

    y_test,

    predictions

)


print(
    "\nModel Accuracy:",
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
# MODEL PATH
# ==========================================

model_path = (

    "model/career_model.pkl"

)


# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(

    model,

    model_path

)


print(
    "\n=========================================="
)

print(
    "MODEL SAVED SUCCESSFULLY"
)

print(
    "=========================================="
)


print(
    "Location:",
    model_path
)


# ==========================================
# FINAL FEATURES
# ==========================================

print(
    "\nFinal ML features:"
)


for index, feature in enumerate(
    features,
    start=1
):

    print(
        f"{index}. {feature}"
    )


print(
    "\nRemoved:"
)


print(
    "- best_skill"
)


print(
    "- best_skill_score"
)


print(
    "\nTraining completed!"
)