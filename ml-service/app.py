from flask import Flask, request, jsonify

import joblib
import pandas as pd
import os
import traceback


# ==========================================================
# CREATE FLASK APP
# ==========================================================

app = Flask(__name__)


# ==========================================================
# BASE DIRECTORY
# ==========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ==========================================================
# MODEL PATH
# ==========================================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "career_model.pkl"
)


# ==========================================================
# LOAD MODEL
# ==========================================================

print("\n==========================================")
print("LOADING ML MODEL")
print("==========================================")
print("Model path:", MODEL_PATH)


if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(
        f"ML model not found: {MODEL_PATH}"
    )


try:

    model = joblib.load(MODEL_PATH)

    print("ML model loaded successfully!")

except Exception as e:

    print("ERROR: Failed to load ML model")
    print(str(e))

    raise e


# ==========================================================
# MODEL FEATURES
# ==========================================================

FEATURES = [

    "programming_level",

    "preferred_field",

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


# ==========================================================
# CATEGORY → CAREER
# ==========================================================

CATEGORY_CAREERS = {

    "technology":
        "Software Developer",

    "data":
        "Data Analyst",

    "web":
        "Web Developer",

    "cyber_security":
        "Cyber Security Specialist"

}


# ==========================================================
# DETAILED CAREER SKILLS
# ==========================================================

CAREER_SKILLS = {

    "Software Developer": {

        "core": [
            "C",
            "C++",
            "Java",
            "Python"
        ],

        "supporting": [
            "JavaScript",
            "SQL",
            "MySQL",
            "Spring Boot",
            "Node.js"
        ]

    },

    "Java Backend Developer": {

        "core": [
            "Java",
            "Spring Boot"
        ],

        "supporting": [
            "SQL",
            "MySQL",
            "MongoDB"
        ]

    },

    "Web Developer": {

        "core": [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        "supporting": [
            "React",
            "Node.js",
            "MongoDB"
        ]

    },

    "Full Stack Developer": {

        "core": [
            "JavaScript",
            "React"
        ],

        "supporting": [
            "HTML",
            "CSS",
            "Node.js",
            "MongoDB",
            "SQL"
        ]

    },

    "Data Analyst": {

        "core": [
            "Python",
            "SQL",
            "Data Analysis"
        ],

        "supporting": [
            "MySQL",
            "Machine Learning"
        ]

    },

    "Machine Learning Engineer": {

        "core": [
            "Python",
            "Machine Learning"
        ],

        "supporting": [
            "Data Analysis",
            "SQL"
        ]

    },

    "Database Developer": {

        "core": [
            "SQL",
            "MySQL"
        ],

        "supporting": [
            "MongoDB",
            "Python",
            "Data Analysis"
        ]

    },

    "Data Engineer": {

        "core": [
            "Python",
            "SQL"
        ],

        "supporting": [
            "MySQL",
            "MongoDB",
            "Data Analysis"
        ]

    }

}


# ==========================================================
# NORMALIZE SKILL
# ==========================================================

def normalize_skill(skill):

    if skill is None:
        return ""

    return str(skill).strip().lower()


# ==========================================================
# CALCULATE SKILL CAREER SCORE
# ==========================================================

def calculate_skill_career_score(
    career,
    user_skills
):

    career_data = CAREER_SKILLS.get(
        career
    )

    if not career_data:

        return {
            "score": 0,
            "matched_core": [],
            "matched_supporting": [],
            "missing_core": []
        }


    user_skill_map = {}


    # ======================================================
    # USER SKILLS
    # ======================================================

    for item in user_skills:

        if not isinstance(
            item,
            dict
        ):
            continue


        skill_name = (

            item.get("skillName")

            or item.get("name")

            or item.get("skill")

            or ""

        )


        level = item.get(
            "level",
            1
        )


        normalized = normalize_skill(
            skill_name
        )


        if not normalized:
            continue


        try:

            level_score = float(
                level
            )

        except Exception:

            level_text = str(
                level
            ).lower()


            if level_text == "advanced":

                level_score = 3

            elif level_text == "intermediate":

                level_score = 2

            else:

                level_score = 1


        if (

            normalized not in user_skill_map

            or

            level_score >
            user_skill_map[normalized]

        ):

            user_skill_map[
                normalized
            ] = level_score


    # ======================================================
    # CAREER SKILLS
    # ======================================================

    core_skills = career_data.get(
        "core",
        []
    )

    supporting_skills = career_data.get(
        "supporting",
        []
    )


    matched_core = []

    matched_supporting = []


    core_score = 0

    supporting_score = 0


    # ======================================================
    # CORE MATCH
    # ======================================================

    for skill in core_skills:

        normalized = normalize_skill(
            skill
        )


        if normalized in user_skill_map:

            level_score = user_skill_map[
                normalized
            ]


            matched_core.append(
                skill
            )


            core_score += (
                level_score
            )


    # ======================================================
    # SUPPORTING MATCH
    # ======================================================

    for skill in supporting_skills:

        normalized = normalize_skill(
            skill
        )


        if normalized in user_skill_map:

            level_score = user_skill_map[
                normalized
            ]


            matched_supporting.append(
                skill
            )


            supporting_score += (
                level_score
            )


    # ======================================================
    # CORE COMPLETION
    # ======================================================

    if len(core_skills) > 0:

        core_completion = (

            len(matched_core)
            /
            len(core_skills)

        )

    else:

        core_completion = 0


    # ======================================================
    # CORE PERCENTAGE
    # ======================================================

    if len(core_skills) > 0:

        max_core_score = (
            len(core_skills) * 3
        )


        core_percentage = (

            core_score
            /
            max_core_score

        ) * 100

    else:

        core_percentage = 0


    # ======================================================
    # SUPPORTING PERCENTAGE
    # ======================================================

    if len(supporting_skills) > 0:

        max_supporting_score = (
            len(supporting_skills) * 3
        )


        supporting_percentage = (

            supporting_score
            /
            max_supporting_score

        ) * 100

    else:

        supporting_percentage = 0


    # ======================================================
    # FINAL SKILL SCORE
    # ======================================================

    skill_score = (

        core_percentage * 0.75

        +

        supporting_percentage * 0.25

    )


    # ======================================================
    # CORE COMPLETION PENALTY
    # ======================================================

    skill_score *= core_completion


    # ======================================================
    # NO CORE = NO CAREER MATCH
    # ======================================================

    if len(matched_core) == 0:

        skill_score = 0


    # ======================================================
    # MISSING CORE
    # ======================================================

    missing_core = [

        skill

        for skill in core_skills

        if normalize_skill(skill)
        not in user_skill_map

    ]


    return {

        "score":
            round(
                skill_score,
                2
            ),

        "matched_core":
            matched_core,

        "matched_supporting":
            matched_supporting,

        "missing_core":
            missing_core

    }


# ==========================================================
# CALCULATE ALL SKILL CAREER SCORES
# ==========================================================

def calculate_all_skill_career_scores(
    user_skills
):

    results = []


    for career in CAREER_SKILLS:

        result = calculate_skill_career_score(

            career,

            user_skills

        )


        results.append({

            "career":
                career,

            "score":
                result["score"],

            "matchedCore":
                result["matched_core"],

            "matchedSupporting":
                result["matched_supporting"],

            "missingCore":
                result["missing_core"]

        })


    results.sort(

        key=lambda x:
        x["score"],

        reverse=True

    )


    return results


# ==========================================================
# HOME
# ==========================================================

@app.route(
    "/",
    methods=["GET"]
)

def home():

    return jsonify({

        "success":
            True,

        "message":
            "AI Career Recommendation ML API is running",

        "status":
            "success",

        "prediction_endpoint":
            "/predict",

        "health_endpoint":
            "/health"

    }), 200


# ==========================================================
# HEALTH
# ==========================================================

@app.route(
    "/health",
    methods=["GET"]
)

def health():

    return jsonify({

        "success":
            True,

        "status":
            "UP",

        "message":
            "ML service is healthy",

        "model_loaded":
            True

    }), 200


# ==========================================================
# PREDICTION
# ==========================================================

@app.route(
    "/predict",
    methods=["POST"]
)

def predict():

    try:

        # ==================================================
        # GET DATA
        # ==================================================

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
            "📥 NEW PREDICTION REQUEST"
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


        # ==================================================
        # REQUIRED FIELDS
        # ==================================================

        missing_fields = [

            field

            for field in FEATURES

            if field not in data

        ]


        if missing_fields:

            return jsonify({

                "success":
                    False,

                "error":
                    "Missing required fields",

                "missing_fields":
                    missing_fields

            }), 400


        # ==================================================
        # READ INPUT
        # ==================================================

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


        technology_score = float(
            data.get(
                "technology_score"
            )
        )


        data_score = float(
            data.get(
                "data_score"
            )
        )


        web_score = float(
            data.get(
                "web_score"
            )
        )


        cyber_security_score = float(
            data.get(
                "cyber_security_score"
            )
        )


        # ==================================================
        # USER SKILLS
        # ==================================================

        user_skills = data.get(
            "skills",
            []
        )


        if not isinstance(
            user_skills,
            list
        ):

            user_skills = []


        # ==================================================
        # CATEGORY SCORES
        # ==================================================

        category_scores = {

            "technology":
                technology_score,

            "data":
                data_score,

            "web":
                web_score,

            "cyber_security":
                cyber_security_score

        }


        # ==================================================
        # STRONGEST CATEGORY
        # ==================================================

        strongest_category = max(

            category_scores,

            key=category_scores.get

        )


        strongest_category_score = (

            category_scores[
                strongest_category
            ]

        )


        # ==================================================
        # PRINT CATEGORY INFORMATION
        # ==================================================

        print(
            "\n📊 CATEGORY SCORES RECEIVED:"
        )

        print(
            "Technology:",
            technology_score
        )

        print(
            "Data:",
            data_score
        )

        print(
            "Web:",
            web_score
        )

        print(
            "Cyber Security:",
            cyber_security_score
        )

        print(
            "Strongest Category:",
            strongest_category
        )

        print(
            "Strongest Category Score:",
            strongest_category_score
        )


        # ==================================================
        # MODEL INPUT
        # ==================================================

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
                assessment_score,

            "technology_score":
                technology_score,

            "data_score":
                data_score,

            "web_score":
                web_score,

            "cyber_security_score":
                cyber_security_score

        }])


        input_data = input_data[
            FEATURES
        ]


        # ==================================================
        # ML MODEL PREDICTION
        # ==================================================

        ml_prediction = model.predict(
            input_data
        )


        ml_career = str(
            ml_prediction[0]
        )


        # ==================================================
        # ML CONFIDENCE
        # ==================================================

        ml_confidence = None


        if hasattr(
            model,
            "predict_proba"
        ):

            probabilities = (
                model.predict_proba(
                    input_data
                )
            )


            ml_confidence = (

                float(
                    max(
                        probabilities[0]
                    )
                )
                * 100

            )


        # ==================================================
        # SKILL CAREER SCORES
        # ==================================================

        skill_career_scores = (
            calculate_all_skill_career_scores(
                user_skills
            )
        )


        best_skill_career = None


        if skill_career_scores:

            best_skill_career = (
                skill_career_scores[0]
            )


        skill_match_score = 0


        if best_skill_career:

            skill_match_score = float(
                best_skill_career["score"]
            )


        # ==================================================
        # IMPORTANT FINAL CAREER LOGIC
        # ==================================================
        #
        # Skill Assessment category is authoritative.
        #
        # Example:
        #
        # Technology = 100
        # Data = 0
        # Web = 0
        # Cyber = 0
        #
        # FINAL = Software Developer
        #
        # ML model is NOT allowed to replace
        # a valid assessment category.
        #
        # ==================================================

        if strongest_category_score > 0:

            final_career = (
                CATEGORY_CAREERS[
                    strongest_category
                ]
            )

            prediction_source = (
                "skill_assessment_category"
            )

            final_confidence = (
                strongest_category_score
            )


        # ==================================================
        # NO CATEGORY SCORE
        # ==================================================

        else:

            if (
                best_skill_career
                and
                best_skill_career["score"] >= 50
            ):

                final_career = (
                    best_skill_career["career"]
                )

                prediction_source = (
                    "skills"
                )

                final_confidence = (
                    skill_match_score
                )

            else:

                final_career = ml_career

                prediction_source = (
                    "machine_learning_model"
                )

                final_confidence = (

                    ml_confidence
                    if ml_confidence is not None
                    else 0

                )


        # ==================================================
        # LIMIT CONFIDENCE
        # ==================================================

        final_confidence = min(
            100,
            max(
                0,
                float(final_confidence)
            )
        )


        # ==================================================
        # REASON
        # ==================================================

        if strongest_category_score > 0:

            reason = (

                f"Your Skill Assessment shows "
                f"{strongest_category_score:.2f}% strength "
                f"in the {strongest_category.replace('_', ' ')} "
                f"category. Therefore, {final_career} "
                f"is recommended as your primary career."

            )

        elif (
            best_skill_career
            and
            best_skill_career["score"] >= 50
        ):

            reason = (

                f"Your current skills show a "
                f"{skill_match_score:.2f}% match for "
                f"{final_career}."

            )

        else:

            reason = (

                f"The ML model predicted "
                f"{final_career} using your profile, "
                f"academic performance and assessment data."

            )


        # ==================================================
        # RESPONSE
        # ==================================================

        response = {

            "success":
                True,

            "career":
                final_career,

            "recommendedCareer":
                final_career,

            "mlCareer":
                ml_career,

            "confidence":
                round(
                    final_confidence,
                    2
                ),

            "mlConfidence":
                (
                    round(
                        ml_confidence,
                        2
                    )
                    if ml_confidence is not None
                    else None
                ),

            "predictionSource":
                prediction_source,

            "strongestCategory":
                strongest_category,

            "strongestCategoryScore":
                round(
                    strongest_category_score,
                    2
                ),

            "skillMatchScore":
                round(
                    skill_match_score,
                    2
                ),

            "skillCareer":
                (
                    best_skill_career["career"]
                    if best_skill_career
                    else None
                ),

            "skillCareerScores":
                skill_career_scores,

            "categoryScores":
                category_scores,

            "reason":
                reason,

            "message":
                "Career prediction generated successfully."

        }


        # ==================================================
        # FINAL DEBUG
        # ==================================================

        print(
            "\n=========================================="
        )

        print(
            "🎯 FINAL PREDICTION"
        )

        print(
            "=========================================="
        )

        print(
            "ML Career:",
            ml_career
        )

        print(
            "Best Skill Career:",
            (
                best_skill_career["career"]
                if best_skill_career
                else "None"
            )
        )

        print(
            "Skill Match:",
            skill_match_score
        )

        print(
            "Strongest Category:",
            strongest_category
        )

        print(
            "Strongest Category Score:",
            strongest_category_score
        )

        print(
            "FINAL CAREER:",
            final_career
        )

        print(
            "FINAL CONFIDENCE:",
            final_confidence
        )

        print(
            "PREDICTION SOURCE:",
            prediction_source
        )

        print(
            "==========================================\n"
        )


        return jsonify(
            response
        ), 200


    # ======================================================
    # INVALID INPUT
    # ======================================================

    except ValueError as e:

        return jsonify({

            "success":
                False,

            "error":
                "Invalid input data",

            "message":
                str(e)

        }), 400


    # ======================================================
    # GENERAL ERROR
    # ======================================================

    except Exception as e:

        print(
            "\n=========================================="
        )

        print(
            "❌ PREDICTION ERROR"
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


# ==========================================================
# RUN SERVER
# ==========================================================

if __name__ == "__main__":

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
        "🚀 AI CAREER ML SERVER"
    )

    print(
        "=========================================="
    )

    print(
        f"http://localhost:{port}"
    )


    print(
        "\nSupported Careers:"
    )


    for career in CAREER_SKILLS:

        print(
            f"- {career}"
        )


    print(
        "\n==========================================\n"
    )


    app.run(

        host="0.0.0.0",

        port=port,

        debug=True

    )