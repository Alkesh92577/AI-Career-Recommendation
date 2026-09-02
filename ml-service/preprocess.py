import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier


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

    # ======================================
    # CATEGORICAL FEATURES
    # ======================================

    categorical_features = [

        "programming_level",

        "preferred_field",

    ]


    # ======================================
    # NUMERIC FEATURES
    # ======================================

    numeric_features = [

        "tenth_marks",

        "twelfth_marks",

        "graduation_marks",

        "semester",

        "backlogs",

        "skill_score",

        "assessment_score"

    ]


    # ======================================
    # PREPROCESSOR
    # ======================================

    preprocessor = ColumnTransformer(

        transformers=[

            # --------------------------------
            # CATEGORICAL
            # --------------------------------

            (

                "categorical",

                OneHotEncoder(

                    handle_unknown="ignore"

                ),

                categorical_features

            ),


            # --------------------------------
            # NUMERIC
            # --------------------------------

            (

                "numeric",

                "passthrough",

                numeric_features

            )

        ]

    )


    return preprocessor


# ==========================================
# CREATE MODEL
# ==========================================

def create_model():

    # ======================================
    # PREPROCESSOR
    # ======================================

    preprocessor = create_preprocessor()


    # ======================================
    # RANDOM FOREST
    # ======================================

    model = RandomForestClassifier(

        n_estimators=200,

        random_state=42,

        max_depth=10,

        class_weight="balanced"

    )


    # ======================================
    # PIPELINE
    # ======================================

    pipeline = Pipeline(

        steps=[

            (

                "preprocessor",

                preprocessor

            ),

            (

                "classifier",

                model

            )

        ]

    )


    return pipeline