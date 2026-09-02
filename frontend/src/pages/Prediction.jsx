import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import studentService from "../services/studentService";
import skillService from "../services/skillService";
import skillAssessmentService from "../services/skillAssessmentService";
import interestAssessmentService from "../services/interestAssessmentService";
import predictionService from "../services/predictionService";

function Prediction() {

    const navigate = useNavigate();

    // =====================================================
    // DATA
    // =====================================================

    const [student, setStudent] = useState(null);

    const [skills, setSkills] = useState([]);

    const [assessment, setAssessment] = useState([]);

    const [interestResult, setInterestResult] = useState(null);

    const [prediction, setPrediction] = useState(null);

    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [predicting, setPredicting] = useState(false);

    // =====================================================
    // MESSAGE
    // =====================================================

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("");

    // =====================================================
    // USER ID
    // =====================================================

    const getUserId = () => {

        return localStorage.getItem("userId");

    };

    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    const showMessage = (text, type) => {

        setMessage(text);

        setMessageType(type);

        setTimeout(() => {

            setMessage("");

            setMessageType("");

        }, 4000);

    };

    // =====================================================
    // NUMBER HELPER
    // =====================================================

    const toNumber = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return 0;

        }

        const number = Number(value);

        return Number.isNaN(number)
            ? 0
            : number;

    };

    // =====================================================
    // GET VALUE
    // =====================================================

    const getValue = (object, keys) => {

        if (!object) {

            return null;

        }

        for (const key of keys) {

            if (
                object[key] !== undefined &&
                object[key] !== null &&
                object[key] !== ""
            ) {

                return object[key];

            }

        }

        return null;

    };

    // =====================================================
    // GET CAREER FROM OBJECT
    // =====================================================

    const getCareerFromObject = (data) => {

        if (!data) {

            return "";

        }

        if (
            typeof data.preferredCareer === "string" &&
            data.preferredCareer.trim() !== ""
        ) {

            return data.preferredCareer.trim();

        }

        if (
            data.strongestCareer &&
            typeof data.strongestCareer === "object"
        ) {

            const careerField =
                data.strongestCareer.careerField;

            if (
                careerField !== undefined &&
                careerField !== null &&
                String(careerField).trim() !== ""
            ) {

                return String(careerField).trim();

            }

        }

        if (
            typeof data.strongestCareer === "string" &&
            data.strongestCareer.trim() !== ""
        ) {

            return data.strongestCareer.trim();

        }

        if (
            typeof data.careerField === "string" &&
            data.careerField.trim() !== ""
        ) {

            return data.careerField.trim();

        }

        if (
            typeof data.career === "string" &&
            data.career.trim() !== ""
        ) {

            return data.career.trim();

        }

        if (
            typeof data.careerName === "string" &&
            data.careerName.trim() !== ""
        ) {

            return data.careerName.trim();

        }

        if (
            typeof data.recommendedCareer === "string" &&
            data.recommendedCareer.trim() !== ""
        ) {

            return data.recommendedCareer.trim();

        }

        if (
            typeof data.predictedCareer === "string" &&
            data.predictedCareer.trim() !== ""
        ) {

            return data.predictedCareer.trim();

        }

        return "";

    };

    // =====================================================
    // GET CAREER FROM DATA
    // =====================================================

    const getCareerFromData = (data) => {

        if (
            data &&
            !Array.isArray(data)
        ) {

            return getCareerFromObject(data);

        }

        if (
            Array.isArray(data) &&
            data.length > 0
        ) {

            for (
                let i = data.length - 1;
                i >= 0;
                i--
            ) {

                const career =
                    getCareerFromObject(
                        data[i]
                    );

                if (career) {

                    return career;

                }

            }

        }

        return "";

    };

    // =====================================================
    // GET SAVED SKILL ASSESSMENT RESULT
    // =====================================================

    const getSavedSkillAssessmentResult = () => {

        try {

            const saved =
                localStorage.getItem(
                    "latestSkillAssessmentResult"
                );

            if (!saved) {

                return null;

            }

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Error reading Skill Assessment result:",
                error
            );

            return null;

        }

    };

    // =====================================================
    // GET EXACT SKILL ASSESSMENT CAREER
    // =====================================================

    const getExactSkillAssessmentCareer = (
        assessmentData
    ) => {

        const savedResult =
            getSavedSkillAssessmentResult();

        if (savedResult) {

            const localCareer =
                getCareerFromData(
                    savedResult
                );

            if (localCareer) {

                return localCareer;

            }

        }

        const backendCareer =
            getCareerFromData(
                assessmentData
            );

        if (backendCareer) {

            return backendCareer;

        }

        return "";

    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            const userId =
                getUserId();

            if (!userId) {

                showMessage(
                    "User not found. Please login again.",
                    "error"
                );

                setLoading(false);

                return;

            }

            try {

                setPrediction(null);

                // =========================================
                // STUDENT
                // =========================================

                const studentData =
                    await studentService
                        .getByUserId(
                            userId
                        );

                if (
                    !studentData ||
                    !studentData.id
                ) {

                    showMessage(
                        "Student profile not found..",
                        "error"
                    );

                    setLoading(false);

                    return;

                }

                setStudent(
                    studentData
                );

                // =========================================
                // SKILLS
                // =========================================

                const skillsData =
                    await skillService
                        .getByStudentId(
                            studentData.id
                        );

                setSkills(
                    Array.isArray(
                        skillsData
                    )
                        ? skillsData
                        : []
                );

                // =========================================
                // SKILL ASSESSMENT
                // =========================================

                const assessmentData =
                    await skillAssessmentService
                        .getByStudentId(
                            studentData.id
                        );

                setAssessment(
                    Array.isArray(
                        assessmentData
                    )
                        ? assessmentData
                        : []
                );

                // =========================================
                // EXACT CAREER
                // =========================================

                const skillAssessmentCareer =
                    getExactSkillAssessmentCareer(
                        assessmentData
                    );

                console.log(
                    "===================================="
                );

                console.log(
                    "FINAL SKILL ASSESSMENT CAREER:"
                );

                console.log(
                    skillAssessmentCareer
                );

                console.log(
                    "===================================="
                );

                // =========================================
                // INTEREST TEST
                // =========================================

                let interestCategory = "";

                let course = "";

                try {

                    const latestInterest =
                        await interestAssessmentService
                            .getLatest(
                                studentData.id
                            );

                    if (
                        Array.isArray(
                            latestInterest
                        ) &&
                        latestInterest.length > 0
                    ) {

                        const latest =
                            latestInterest[
                                latestInterest.length - 1
                            ];

                        interestCategory =
                            latest?.careerCategory ||
                            "";

                        course =
                            latest?.course ||
                            "";

                    }

                    else if (
                        latestInterest &&
                        typeof latestInterest === "object"
                    ) {

                        interestCategory =
                            latestInterest?.careerCategory ||
                            "";

                        course =
                            latestInterest?.course ||
                            "";

                    }

                } catch (error) {

                    console.log(
                        "Interest test unavailable."
                    );

                }

                // =========================================
                // FINAL CAREER
                // =========================================

                setInterestResult({

                    category:
                        interestCategory,

                    career:
                        skillAssessmentCareer,

                    course:
                        course

                });

                // =========================================
                // SAVE CAREER
                // =========================================

                if (skillAssessmentCareer) {

                    localStorage.setItem(
                        "latestPredictedCareer",
                        skillAssessmentCareer
                    );

                }

            } catch (error) {

                console.error(
                    "PREDICTION DATA ERROR:",
                    error
                );

                showMessage(
                    "Prediction data is not loading.",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);

    // =====================================================
    // SKILL SCORE
    // =====================================================

    const calculateSkillScore = () => {

        if (
            !Array.isArray(skills) ||
            skills.length === 0
        ) {

            return 0;

        }

        const total =
            skills.reduce(
                (sum, item) => {

                    let level =
                        item.level;

                    if (
                        typeof level === "string"
                    ) {

                        const lower =
                            level.toLowerCase();

                        if (lower === "beginner") {

                            level = 1;

                        }

                        else if (
                            lower === "intermediate"
                        ) {

                            level = 2;

                        }

                        else if (
                            lower === "advanced"
                        ) {

                            level = 3;

                        }

                    }

                    return sum + toNumber(level);

                },
                0
            );

        return Number(
            (
                total /
                skills.length
            ).toFixed(2)
        );

    };

    // =====================================================
    // LATEST ASSESSMENT
    // =====================================================

    const getLatestAssessmentAttempt = () => {

        if (
            !Array.isArray(assessment) ||
            assessment.length === 0
        ) {

            return [];

        }

        const hasAttemptIds =
            assessment.some(
                item =>
                    item &&
                    item.attemptId
            );

        if (hasAttemptIds) {

            const groups = {};

            assessment.forEach(
                item => {

                    const attemptId =
                        item.attemptId;

                    if (!attemptId) {

                        return;

                    }

                    if (
                        !groups[attemptId]
                    ) {

                        groups[attemptId] = [];

                    }

                    groups[attemptId].push(
                        item
                    );

                }
            );

            const attempts =
                Object.entries(
                    groups
                );

            if (
                attempts.length > 0
            ) {

                attempts.sort(
                    (
                        [, a],
                        [, b]
                    ) => {

                        const maxA =
                            Math.max(
                                ...a.map(
                                    item =>
                                        toNumber(
                                            item.id
                                        )
                                )
                            );

                        const maxB =
                            Math.max(
                                ...b.map(
                                    item =>
                                        toNumber(
                                            item.id
                                        )
                                )
                            );

                        return maxB - maxA;

                    }
                );

                return attempts[0][1];

            }

        }

        return assessment;

    };

    // =====================================================
    // ASSESSMENT SCORE
    // =====================================================

    const calculateAssessmentScore = () => {

        const latestAttempt =
            getLatestAssessmentAttempt();

        if (
            latestAttempt.length === 0
        ) {

            return 0;

        }

        const totalQuestions =
            latestAttempt.length;

        const totalCorrect =
            latestAttempt.reduce(
                (total, item) => {

                    return (
                        total +
                        (
                            toNumber(
                                item.score
                            ) > 0
                                ? 1
                                : 0
                        )
                    );

                },
                0
            );

        return Number(
            (
                (
                    totalCorrect /
                    totalQuestions
                ) * 100
            ).toFixed(2)
        );

    };

    // =====================================================
    // PROGRAMMING LEVEL
    // =====================================================

    const getProgrammingLevelFromAssessment =
        (percentage) => {

            const value =
                toNumber(
                    percentage
                );

            if (value >= 80) {

                return "Advanced";

            }

            if (value >= 50) {

                return "Intermediate";

            }

            return "Beginner";

        };

    // =====================================================
    // STUDENT DATA
    // =====================================================

    const getStudentDataForPrediction = () => {

        const tenthMarks =
            getValue(
                student,
                [
                    "tenthMarks",
                    "tenthPercentage",
                    "marks10",
                    "marks10th",
                    "tenth"
                ]
            );

        const twelfthMarks =
            getValue(
                student,
                [
                    "twelfthMarks",
                    "twelfthPercentage",
                    "marks12",
                    "marks12th",
                    "twelfth"
                ]
            );

        const graduationMarks =
            getValue(
                student,
                [
                    "graduationMarks",
                    "graduationPercentage",
                    "graduationPercentageMarks",
                    "degreeMarks",
                    "graduation"
                ]
            );

        const semester =
            getValue(
                student,
                [
                    "semester",
                    "currentSemester",
                    "currentSem"
                ]
            );

        const backlogs =
            getValue(
                student,
                [
                    "backlogs",
                    "backlog",
                    "numberOfBacklogs"
                ]
            );

        const assessmentScore =
            calculateAssessmentScore();

        return {

            tenthMarks:
                toNumber(
                    tenthMarks
                ),

            twelfthMarks:
                toNumber(
                    twelfthMarks
                ),

            graduationMarks:
                toNumber(
                    graduationMarks
                ),

            semester:
                toNumber(
                    semester
                ),

            backlogs:
                toNumber(
                    backlogs
                ),

            programmingKnowledge:
                getProgrammingLevelFromAssessment(
                    assessmentScore
                )

        };

    };

    // =====================================================
    // AI PREDICTION
    // =====================================================

    const handlePrediction = async () => {

        if (!student) {

            showMessage(
                "Student profile not found.",
                "error"
            );

            return;

        }

        // =================================================
        // FINAL CAREER
        // =================================================

        const preferredCareer =
            interestResult?.career;

        if (
            !preferredCareer ||
            preferredCareer === "Not Available"
        ) {

            showMessage(
                "Didn't find a career in skill assessment..",
                "error"
            );

            return;

        }

        if (
            assessment.length === 0
        ) {

            showMessage(
                "Please complete the Skill Assessment first.",
                "error"
            );

            return;

        }

        setPredicting(true);

        setPrediction(null);

        try {

            // ==========================================
            // STUDENT DATA
            // ==========================================

            const studentData =
                getStudentDataForPrediction();

            // ==========================================
            // SKILL
            // ==========================================

            const skillScore =
                calculateSkillScore();

            const assessmentScore =
                calculateAssessmentScore();

            // ==========================================
            // DATA TO BACKEND
            // ==========================================

            const predictionData = {

                studentId:
                    student.id,

                programmingKnowledge:
                    studentData.programmingKnowledge,

                preferredField:
                    preferredCareer,

                tenthMarks:
                    studentData.tenthMarks,

                twelfthMarks:
                    studentData.twelfthMarks,

                graduationMarks:
                    studentData.graduationMarks,

                semester:
                    studentData.semester,

                backlogs:
                    studentData.backlogs,

                skillScore:
                    skillScore,

                assessmentScore:
                    assessmentScore

            };

            console.log(
                "FINAL DATA SENT TO BACKEND:",
                predictionData
            );

            // ==========================================
            // CALL BACKEND
            // ==========================================

            const result =
                await predictionService.predict(
                    predictionData
                );

            console.log(
                "BACKEND AI RESULT:",
                result
            );

            // =================================================
            // FINAL CAREER
            // =================================================
            //
            // IMPORTANT:
            // Skill Assessment ka career hi final career hoga.
            // Backend agar doosra career return karega,
            // usko use nahi kiya jayega.
            //
            // =================================================

            const finalCareer =
                preferredCareer;

            // ==========================================
            // FINAL PREDICTION
            // ==========================================

            const finalPrediction = {

                ...result,

                recommendedCareer:
                    finalCareer,

                career:
                    finalCareer,

                predictedCareer:
                    finalCareer

            };

            // ==========================================
            // SAVE FINAL CAREER
            // ==========================================

            localStorage.setItem(
                "latestPredictedCareer",
                finalCareer
            );

            localStorage.setItem(
                "recommendedCareer",
                finalCareer
            );

            // ==========================================
            // SAVE FULL RESULT
            // ==========================================

            localStorage.setItem(
                "latestPrediction",
                JSON.stringify(
                    finalPrediction
                )
            );

            setPrediction(
                finalPrediction
            );

            console.log(
                "===================================="
            );

            console.log(
                "FINAL CAREER USED EVERYWHERE:"
            );

            console.log(
                finalCareer
            );

            console.log(
                "===================================="
            );

            showMessage(
                "AI Career Prediction successfully generated!",
                "success"
            );

        } catch (error) {

            console.error(
                "PREDICTION ERROR:",
                error
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            showMessage(
                error.response?.data?.message ||
                "Predictions are not being generated.",
                "error"
            );

        } finally {

            setPredicting(false);

        }

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="page-container">

                <div className="form-card">

                    <h2>
                        Loading Prediction Data...
                    </h2>

                </div>

            </div>

        );

    }

    // =====================================================
    // DISPLAY VALUES
    // =====================================================

    const realStudentData =
        getStudentDataForPrediction();

    const skillScore =
        calculateSkillScore();

    const assessmentScore =
        calculateAssessmentScore();

    const programmingLevel =
        getProgrammingLevelFromAssessment(
            assessmentScore
        );

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <h1>
                    🤖 AI Career Prediction
                </h1>

                <p>
                    It will recommend a career based on your profile, academic details, skills, assessments, and interests.
                </p>

            </div>

            {/* MESSAGE */}

            {message && (

                <div
                    className={
                        messageType === "success"
                            ? "success-message"
                            : "error-message"
                    }
                >

                    {message}

                </div>

            )}

            {/* YOUR DATA */}

            <div className="form-card">

                <h2>
                    📊 Your Data
                </h2>

                <div className="form-grid">

                    <div>

                        <label>
                            Programming Level
                        </label>

                        <p>
                            {programmingLevel}
                        </p>

                    </div>

                    <div>

                        <label>
                            Preferred Career
                        </label>

                        <p>

                            {
                                interestResult?.career ||
                                "Please complete Skill Assessment"
                            }

                        </p>

                    </div>

                    <div>

                        <label>
                            10th Marks
                        </label>

                        <p>
                            {realStudentData.tenthMarks}%
                        </p>

                    </div>

                    <div>

                        <label>
                            12th Marks
                        </label>

                        <p>
                            {realStudentData.twelfthMarks}%
                        </p>

                    </div>

                    <div>

                        <label>
                            Graduation Marks
                        </label>

                        <p>
                            {realStudentData.graduationMarks}%
                        </p>

                    </div>

                    <div>

                        <label>
                            Semester
                        </label>

                        <p>
                            {realStudentData.semester}
                        </p>

                    </div>

                    <div>

                        <label>
                            Backlogs
                        </label>

                        <p>
                            {realStudentData.backlogs}
                        </p>

                    </div>

                    <div>

                        <label>
                            Latest Assessment Score
                        </label>

                        <p>
                            {assessmentScore}%
                        </p>

                    </div>

                </div>

                {assessment.length === 0 && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "#fff3cd",
                            borderRadius: "10px"
                        }}
                    >

                        ⚠️ Please complete the Skill Assessment
                        before generating your AI prediction.

                    </div>

                )}

                {!interestResult?.career && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "#fff3cd",
                            borderRadius: "10px"
                        }}
                    >

                        ⚠️ Saved career for skill assessment not found.

                    </div>

                )}

                <button
                    type="button"
                    className="main-button profile-save-button"
                    onClick={handlePrediction}
                    disabled={
                        predicting ||
                        !interestResult?.career ||
                        assessment.length === 0
                    }
                    style={{
                        marginTop: "25px"
                    }}
                >

                    {predicting
                        ? "🤖 AI is Analyzing..."
                        : "🚀 Get AI Career Prediction"
                    }

                </button>

            </div>

            {/* RESULT */}

            {prediction && (

                <div
                    className="form-card"
                    style={{
                        marginTop: "25px",
                        textAlign: "center"
                    }}
                >

                    <h2>
                        🎯 Your Recommended Career
                    </h2>

                    {/* FINAL CAREER */}

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "30px",
                            borderRadius: "20px",
                            background:
                                "linear-gradient(135deg, #667eea, #764ba2)",
                            color: "white"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "32px",
                                fontWeight: "700"
                            }}
                        >

                            {
                                prediction.recommendedCareer ||
                                interestResult?.career ||
                                "Not Available"
                            }

                        </div>

                        {prediction.confidence != null && (

                            <div
                                style={{
                                    marginTop: "15px",
                                    fontSize: "20px"
                                }}
                            >

                                Confidence:{" "}

                                {Number(
                                    prediction.confidence
                                ).toFixed(2)}%

                            </div>

                        )}

                    </div>

                    {/* REASON */}

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "20px",
                            borderRadius: "12px",
                            background: "#f8f9ff"
                        }}
                    >

                        <h3>
                            💡 Why this career?
                        </h3>

                        <p>

                            {
                                prediction.reason ||
                                "Career recommendation generated using your profile, academic performance, skills, assessment and interest test."
                            }

                        </p>

                    </div>

                    {/* ROADMAP */}

                    <button
                        type="button"
                        className="main-button"
                        onClick={() =>
                            navigate(
                                "/career-roadmap"
                            )
                        }
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        🗺️ View Career Roadmap →

                    </button>

                </div>

            )}

        </div>

    );

}

export default Prediction;