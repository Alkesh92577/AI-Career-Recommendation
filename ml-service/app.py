from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
import traceback


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# BASE DIRECTORY
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ==========================================
# MODEL PATH
# ==========================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "career_model.pkl"
)


# ==========================================
# LOAD TRAINED MODEL
# ==========================================

print(
    "\n=========================================="
)

print(
    "LOADING ML MODEL"
)

print(
    "=========================================="
)

print(
    "Model path:",
    MODEL_PATH
)


if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(
        f"ML model not found: {MODEL_PATH}\n"
        "Please make sure career_model.pkl exists "
        "inside the model folder."
    )


try:

    model = joblib.load(
        MODEL_PATH
    )

    print(
        "ML model loaded successfully!"
    )


except Exception as e:

    print(
        "ERROR: Failed to load ML model"
    )

    print(
        str(e)
    )

    raise e


# ==========================================
# REQUIRED MODEL FEATURES
# ==========================================

FEATURES = [

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


# ==========================================
# HOME API
# ==========================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "success": True,

        "message":
            "AI Career Recommendation ML API is running",

        "status":
            "success",

        "prediction_endpoint":
            "/predict",

        "health_endpoint":
            "/health"

    }), 200


# ==========================================
# HEALTH CHECK API
# ==========================================

@app.route(
    "/health",
    methods=["GET"]
)
def health():

    return jsonify({

        "success": True,

        "status":
            "UP",

        "message":
            "ML service is healthy",

        "model_loaded":
            True

    }), 200


# ==========================================
# PREDICTION API
# ==========================================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:

        # ==================================
        # GET JSON DATA
        # ==================================

        data = request.get_json()


        if not data:

            return jsonify({

                "success":
                    False,

                "error":
                    "No data received",

                "message":
                    "Prediction data is empty."

            }), 400


        print(
            "\n=========================================="
        )

        print(
            "NEW PREDICTION REQUEST"
        )

        print(
            "=========================================="
        )

        print(
            "Received data:"
        )

        print(
            data
        )


        # ==================================
        # CHECK REQUIRED FIELDS
        # ==================================

        missing_fields = []


        for field in FEATURES:

            if field not in data:

                missing_fields.append(
                    field
                )


        if len(missing_fields) > 0:

            return jsonify({

                "success":
                    False,

                "error":
                    "Missing required fields",

                "missing_fields":
                    missing_fields

            }), 400


        # ==================================
        # GET INPUT VALUES
        # ==================================

        programming_level = str(
            data.get(
                "programming_level"
            )
        )


        preferred_field = str(
            data.get(
                "preferred_field"
            )
        )


        tenth_marks = float(
            data.get(
                "tenth_marks"
            )
        )


        twelfth_marks = float(
            data.get(
                "twelfth_marks"
            )
        )


        graduation_marks = float(
            data.get(
                "graduation_marks"
            )
        )


        semester = int(
            data.get(
                "semester"
            )
        )


        backlogs = int(
            data.get(
                "backlogs"
            )
        )


        skill_score = float(
            data.get(
                "skill_score"
            )
        )


        assessment_score = float(
            data.get(
                "assessment_score"
            )
        )


        # ==================================
        # CREATE INPUT DATAFRAME
        # ==================================

        input_data = pd.DataFrame([{

            "programming_level":
                programming_level,

            "preferred_field":
                preferred_field,

            "tenth_marks":
                tenth_marks,

            "twelfth_marks":
                twelfth_marks,

            "graduation_marks":
                graduation_marks,

            "semester":
                semester,

            "backlogs":
                backlogs,

            "skill_score":
                skill_score,

            "assessment_score":
                assessment_score

        }])


        # ==================================
        # FORCE CORRECT COLUMN ORDER
        # ==================================

        input_data = input_data[
            FEATURES
        ]


        # ==================================
        # SHOW INPUT
        # ==================================

        print(
            "\nInput Data:"
        )

        print(
            input_data
        )


        print(
            "\nFeatures sent to ML model:"
        )

        print(
            FEATURES
        )


        # ==================================
        # CHECK MODEL FEATURES
        # ==================================

        if hasattr(
            model,
            "feature_names_in_"
        ):

            model_features = list(
                model.feature_names_in_
            )


            print(
                "\nModel expects features:"
            )

            print(
                model_features
            )


            if model_features != FEATURES:

                return jsonify({

                    "success":
                        False,

                    "error":
                        "ML model feature mismatch",

                    "message":
                        "The loaded ML model expects different features.",

                    "model_features":
                        model_features,

                    "required_features":
                        FEATURES

                }), 500


        # ==================================
        # PREDICT CAREER
        # ==================================

        prediction = model.predict(
            input_data
        )


        career = str(
            prediction[0]
        )


        # ==================================
        # PREDICT PROBABILITY
        # ==================================

        confidence = None


        if hasattr(
            model,
            "predict_proba"
        ):

            probabilities = model.predict_proba(
                input_data
            )


            confidence = float(
                max(
                    probabilities[0]
                ) * 100
            )


        # ==================================
        # RESPONSE
        # ==================================

        response = {

            "success":
                True,

            "career":
                career,

            "confidence":
                round(
                    confidence,
                    2
                )
                if confidence is not None
                else None,

            "message":
                "Career prediction generated successfully."

        }


        # ==================================
        # PRINT RESULT
        # ==================================

        print(
            "\n=========================================="
        )

        print(
            "PREDICTION RESULT"
        )

        print(
            "=========================================="
        )

        print(
            "Career:",
            career
        )

        print(
            "Confidence:",
            confidence
        )

        print(
            "==========================================\n"
        )


        return jsonify(
            response
        ), 200


    except ValueError as e:

        return jsonify({

            "success":
                False,

            "error":
                "Invalid input data",

            "message":
                str(e)

        }), 400


    except Exception as e:

        # ==================================
        # ERROR
        # ==================================

        print(
            "\n=========================================="
        )

        print(
            "PREDICTION ERROR"
        )

        print(
            "=========================================="
        )

        traceback.print_exc()

        print(
            "==========================================\n"
        )


        return jsonify({

            "success":
                False,

            "error":
                "Prediction failed",

            "message":
                str(e)

        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    # Railway automatically provides PORT.
    # Local machine will use 5000.

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )


    print(
        "\n=========================================="
    )

    print(
        "AI CAREER ML SERVER"
    )

    print(
        "=========================================="
    )

    print(
        "Server:"
    )

    print(
        f"http://localhost:{port}"
    )


    print(
        "\nPrediction API:"
    )

    print(
        f"http://localhost:{port}/predict"
    )


    print(
        "\nHealth API:"
    )

    print(
        f"http://localhost:{port}/health"
    )


    print(
        "\nFeatures:"
    )


    for index, feature in enumerate(
        FEATURES,
        start=1
    ):

        print(
            f"{index}. {feature}"
        )


    print(
        "\nRemoved Features:"
    )

    print(
        "- best_skill"
    )

    print(
        "- best_skill_score"
    )


    print(
        "==========================================\n"
    )


    app.run(

        host="0.0.0.0",

        port=port,

        debug=True

    )