from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)


# ==========================================
# MODEL PATH
# ==========================================

MODEL_PATH = os.path.join(
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
        "Please run train.py first."
    )


model = joblib.load(
    MODEL_PATH
)


print(
    "ML model loaded successfully!"
)


# ==========================================
# HOME API
# ==========================================

@app.route(
    "/",
    methods=["GET"]
)

def home():

    return jsonify({

        "message":
            "AI Career Recommendation ML API is running",

        "status":
            "success"

    })


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
        # GET INPUT VALUES
        # ==================================

        programming_level = data.get(
            "programming_level",
            "Beginner"
        )


        preferred_field = data.get(
            "preferred_field",
            ""
        )


        tenth_marks = float(
            data.get(
                "tenth_marks",
                0
            )
        )


        twelfth_marks = float(
            data.get(
                "twelfth_marks",
                0
            )
        )


        graduation_marks = float(
            data.get(
                "graduation_marks",
                0
            )
        )


        semester = int(
            data.get(
                "semester",
                0
            )
        )


        backlogs = int(
            data.get(
                "backlogs",
                0
            )
        )


        skill_score = float(
            data.get(
                "skill_score",
                0
            )
        )


        assessment_score = float(
            data.get(
                "assessment_score",
                0
            )
        )


        # ==================================
        # CREATE INPUT DATAFRAME
        # ==================================
        # IMPORTANT:
        # best_skill and best_skill_score
        # completely removed.
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


        input_data = input_data[
            features
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
            features
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


            if model_features != features:

                return jsonify({

                    "error":
                        "ML model feature mismatch",

                    "message":
                        "Old ML model detected. Please retrain the model using train.py.",

                    "model_features":
                        model_features,

                    "required_features":
                        features

                }), 500


        # ==================================
        # PREDICT CAREER
        # ==================================

        prediction = model.predict(
            input_data
        )


        career = prediction[0]


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
            "=========================================="
        )


        return jsonify(
            response
        )


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

        print(
            str(e)
        )


        return jsonify({

            "error":
                "Prediction failed",

            "message":
                str(e)

        }), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

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
        "http://localhost:5000"
    )

    print(
        "\nPrediction API:"
    )

    print(
        "http://localhost:5000/predict"
    )


    print(
        "\nFeatures:"
    )

    print(
        "1. programming_level"
    )

    print(
        "2. preferred_field"
    )

    print(
        "3. tenth_marks"
    )

    print(
        "4. twelfth_marks"
    )

    print(
        "5. graduation_marks"
    )

    print(
        "6. semester"
    )

    print(
        "7. backlogs"
    )

    print(
        "8. skill_score"
    )

    print(
        "9. assessment_score"
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

        port=5000,

        debug=True

    )