import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier


# ==========================================
# FEATURES
# ==========================================

CATEGORICAL_FEATURES = [
    "programming_level",
    "preferred_field"
]


NUMERIC_FEATURES = [
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


FEATURES = (
    CATEGORICAL_FEATURES
    + NUMERIC_FEATURES
)


# ==========================================
# LOAD DATASET
# ==========================================

def load_dataset():

    file_path = "dataset/career_dataset.csv"

    df = pd.read_csv(file_path)

    return df


# ==========================================
# CREATE PREPROCESSOR
# ==========================================

def create_preprocessor():

    preprocessor = ColumnTransformer(

        transformers=[

            (
                "categorical",

                OneHotEncoder(
                    handle_unknown="ignore"
                ),

                CATEGORICAL_FEATURES
            ),

            (
                "numeric",

                "passthrough",

                NUMERIC_FEATURES
            )

        ]

    )

    return preprocessor


# ==========================================
# CREATE MODEL
# ==========================================

def create_model():

    preprocessor = create_preprocessor()

    classifier = RandomForestClassifier(

        n_estimators=300,

        random_state=42,

        max_depth=12,

        min_samples_leaf=1,

        class_weight="balanced",

        n_jobs=-1

    )

    model = Pipeline(

        steps=[

            (
                "preprocessor",
                preprocessor
            ),

            (
                "classifier",
                classifier
            )

        ]

    )

    return model