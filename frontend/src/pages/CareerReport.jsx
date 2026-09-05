import { useEffect, useState } from "react";
import axios from "axios";

import studentService from "../services/studentService";

// =====================================================
// API URLS
// =====================================================

const PREDICTION_API =
    "http://ai-career-recommendation-production.up.railway.app/api/predictions";

const COURSE_API =
    "http://ai-career-recommendation-production.up.railway.app/api/courses";

// =====================================================
// CAREER REPORT
// =====================================================

function CareerReport() {

    // =================================================
    // STUDENT
    // =================================================

    const [student, setStudent] =
        useState(null);

    // =================================================
    // LATEST PREDICTION
    // =================================================

    const [prediction, setPrediction] =
        useState(null);

    // =================================================
    // COURSES
    // =================================================

    const [courses, setCourses] =
        useState([]);

    // =================================================
    // LOADING
    // =================================================

    const [loading, setLoading] =
        useState(true);

    // =================================================
    // ERROR
    // =================================================

    const [error, setError] =
        useState("");

    // =================================================
    // NORMALIZE CONFIDENCE
    // =================================================

    const getConfidence = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return 0;

        }

        let number =
            Number(value);

        if (Number.isNaN(number)) {

            return 0;

        }

        // Backend agar 0.35 bhej raha hai

        if (
            number > 0 &&
            number <= 1
        ) {

            number =
                number * 100;

        }

        return Math.round(
            number * 100
        ) / 100;

    };

    // =================================================
    // GET FIELD
    // =================================================

    const getField = (
        object,
        ...fields
    ) => {

        if (!object) {

            return "-";

        }

        for (const field of fields) {

            if (
                object[field] !== undefined &&
                object[field] !== null &&
                object[field] !== ""
            ) {

                return object[field];

            }

        }

        return "-";

    };

    // =================================================
    // LOAD REPORT
    // =================================================

    useEffect(() => {

        const loadReport = async () => {

            try {

                setLoading(true);

                setError("");

                // =====================================
                // USER ID
                // =====================================

                const userId =
                    localStorage.getItem(
                        "userId"
                    );

                if (!userId) {

                    throw new Error(
                        "User ID not found. Please login again.."
                    );

                }

                console.log(
                    "===================================="
                );

                console.log(
                    "CAREER REPORT LOADING"
                );

                console.log(
                    "USER ID:",
                    userId
                );

                console.log(
                    "===================================="
                );

                // =====================================
                // STUDENT
                // =====================================

                const studentData =
                    await studentService
                        .getByUserId(
                            userId
                        );

                if (
                    !studentData ||
                    !studentData.id
                ) {

                    throw new Error(
                        "Student profile not found."
                    );

                }

                setStudent(
                    studentData
                );

                console.log(
                    "STUDENT:",
                    studentData
                );

                // =====================================
                // SAVED FINAL PREDICTION
                // =====================================

                let savedPrediction = null;

                try {

                    const saved =
                        localStorage.getItem(
                            "latestPrediction"
                        );

                    if (saved) {

                        savedPrediction =
                            JSON.parse(saved);

                    }

                } catch (error) {

                    console.log(
                        "Saved prediction unavailable."
                    );

                }

                // =====================================
                // LATEST AI PREDICTION
                // =====================================

                const predictionResponse =
                    await axios.get(
                        `${PREDICTION_API}/student/${studentData.id}`
                    );

                let predictionData =
                    predictionResponse.data;

                console.log(
                    "ALL PREDICTIONS:",
                    predictionData
                );

                // =====================================
                // ARRAY CHECK
                // =====================================

                if (
                    !Array.isArray(
                        predictionData
                    )
                ) {

                    predictionData = [];

                }

                // =====================================
                // LATEST BACKEND PREDICTION
                // =====================================

                let latestPrediction = null;

                if (
                    predictionData.length > 0
                ) {

                    const sortedPredictions =
                        [...predictionData]
                            .sort(
                                (a, b) => {

                                    const dateA =
                                        a.createdAt
                                            ? new Date(
                                                a.createdAt
                                            ).getTime()
                                            : 0;

                                    const dateB =
                                        b.createdAt
                                            ? new Date(
                                                b.createdAt
                                            ).getTime()
                                            : 0;

                                    return (
                                        dateB -
                                        dateA
                                    );

                                }
                            );

                    latestPrediction =
                        sortedPredictions[0];

                }

                // =====================================
                // FINAL PREDICTION
                // =====================================
                //
                // Prediction page par jo final
                // career save hua hai, wahi use hoga.
                //
                // Agar saved prediction nahi hai,
                // to backend prediction use hogi.
                //
                // =====================================

                let finalPrediction =
                    savedPrediction ||
                    latestPrediction;

                if (!finalPrediction) {

                    throw new Error(
                        "I haven't received the career prediction yet. Please generate the prediction first.."
                    );

                }

                // =====================================
                // FINAL CAREER
                // =====================================

                const career =
                    getField(
                        finalPrediction,
                        "recommendedCareer",
                        "career",
                        "predictedCareer"
                    );

                if (
                    career === "-" ||
                    !String(career).trim()
                ) {

                    throw new Error(
                        "Didn't get any career-related insights in the latest prediction.."
                    );

                }

                console.log(
                    "===================================="
                );

                console.log(
                    "FINAL CAREER REPORT PREDICTION:"
                );

                console.log(
                    finalPrediction
                );

                console.log(
                    "FINAL CAREER:",
                    career
                );

                console.log(
                    "===================================="
                );

                setPrediction(
                    finalPrediction
                );

                // =====================================
                // SAVE FINAL CAREER
                // =====================================

                localStorage.setItem(
                    "latestPredictedCareer",
                    String(career).trim()
                );

                localStorage.setItem(
                    "recommendedCareer",
                    String(career).trim()
                );

                // =====================================
                // COURSES
                // =====================================

                const courseResponse =
                    await axios.get(
                        `${COURSE_API}/career/${encodeURIComponent(
                            String(career).trim()
                        )}`
                    );

                let courseData =
                    courseResponse.data;

                console.log(
                    "COURSES FOR CAREER:",
                    career
                );

                console.log(
                    courseData
                );

                if (
                    !Array.isArray(
                        courseData
                    )
                ) {

                    courseData = [];

                }

                setCourses(
                    courseData
                );

            } catch (err) {

                console.error(
                    "===================================="
                );

                console.error(
                    "CAREER REPORT ERROR:"
                );

                console.error(
                    err
                );

                console.error(
                    "BACKEND RESPONSE:",
                    err.response?.data
                );

                console.error(
                    "===================================="
                );

                setError(

                    err.response?.data?.message ||

                    err.response?.data?.error ||

                    err.message ||

                    "The career report is not loading."

                );

            } finally {

                setLoading(false);

            }

        };

        loadReport();

    }, []);

    // =================================================
    // LOADING UI
    // =================================================

    if (loading) {

        return (

            <div className="page-container">

                <div className="form-card">

                    <h2>
                        📊 Career Report Loading...
                    </h2>

                    <p>
                        Latest predictions and courses
                        are loading...
                    </p>

                </div>

            </div>

        );

    }

    // =================================================
    // ERROR UI
    // =================================================

    if (error) {

        return (

            <div className="page-container">

                <div className="error-message">

                    {error}

                </div>

            </div>

        );

    }

    // =================================================
    // DATA
    // =================================================

    const career =
        prediction
            ? getField(
                prediction,
                "recommendedCareer",
                "career",
                "predictedCareer"
            )
            : "-";

    const confidence =
        prediction
            ? getConfidence(
                getField(
                    prediction,
                    "confidence"
                )
            )
            : 0;

    // =================================================
    // STUDENT DATA
    // =================================================

    const studentName =
        getField(
            student,
            "name",
            "studentName",
            "fullName"
        );

    const email =
        getField(
            student,
            "email"
        );

    const studentId =
        getField(
            student,
            "id",
            "studentId"
        );

    const tenthMarks =
        getField(
            student,
            "tenthMarks",
            "marks10",
            "tenth"
        );

    const twelfthMarks =
        getField(
            student,
            "twelfthMarks",
            "marks12",
            "twelfth"
        );

    const graduationMarks =
        getField(
            student,
            "graduationMarks",
            "graduationPercentage",
            "graduation"
        );

    const semester =
        getField(
            student,
            "semester",
            "currentSemester"
        );

    const backlogs =
        getField(
            student,
            "backlogs",
            "backlog"
        );

    // =================================================
    // UI
    // =================================================

    return (

        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h1>
                            📊 Career Report
                        </h1>

                        <p>
                            A comprehensive report based on your profile, skills, academics, and predictions.
                        </p>

                    </div>

                    {/* PRINT BUTTON */}

                    <button
                        type="button"
                        className="main-button no-print"
                        onClick={() => window.print()}
                        style={{
                            padding: "14px 25px",
                            fontSize: "16px",
                            whiteSpace: "nowrap"
                        }}
                    >

                        🖨️ Print / Download PDF

                    </button>

                </div>

            </div>

            {/* STUDENT DETAILS */}

            <div className="form-card">

                <h2>
                    👤 Student Details
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "25px",
                        marginTop: "20px"
                    }}
                >

                    <div>

                        <strong>
                            Name
                        </strong>

                        <p>
                            {studentName}
                        </p>

                    </div>

                    <div>

                        <strong>
                            Email
                        </strong>

                        <p>
                            {email}
                        </p>

                    </div>

                    <div>

                        <strong>
                            Student ID
                        </strong>

                        <p>
                            {studentId}
                        </p>

                    </div>

                </div>

            </div>

            {/* ACADEMIC DETAILS */}

            <div className="form-card">

                <h2>
                    🎓 Academic Details
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(180px,1fr))",
                        gap: "16px",
                        marginTop: "20px"
                    }}
                >

                    <div className="profile-completion-card">

                        <strong>
                            10th Marks
                        </strong>

                        <h3>
                            {tenthMarks}
                        </h3>

                    </div>

                    <div className="profile-completion-card">

                        <strong>
                            12th Marks
                        </strong>

                        <h3>
                            {twelfthMarks}
                        </h3>

                    </div>

                    <div className="profile-completion-card">

                        <strong>
                            Graduation Marks
                        </strong>

                        <h3>
                            {graduationMarks}
                        </h3>

                    </div>

                    <div className="profile-completion-card">

                        <strong>
                            Semester
                        </strong>

                        <h3>
                            {semester}
                        </h3>

                    </div>

                    <div className="profile-completion-card">

                        <strong>
                            Backlogs
                        </strong>

                        <h3>
                            {backlogs}
                        </h3>

                    </div>

                </div>

            </div>

            {/* AI RECOMMENDED CAREER */}

            <div
                className="profile-completion-card"
                style={{
                    marginBottom: "25px",
                    padding: "30px"
                }}
            >

                <div>

                    <p
                        style={{
                            margin: 0,
                            fontSize: "16px"
                        }}
                    >
                        🤖 AI Recommended Career
                    </p>

                    <h1
                        style={{
                            marginTop: "10px",
                            marginBottom: "10px"
                        }}
                    >

                        🎯 {career}

                    </h1>

                    <p
                        style={{
                            margin: 0
                        }}
                    >

                        Career recommendation generated using
                        AI/ML model based on profile, academic
                        performance, skills and assessment score.

                    </p>

                </div>

                <div className="completion-circle">

                    <span>
                        {confidence}%
                    </span>

                </div>

            </div>

            {/* PREDICTION REASON */}

            {prediction?.reason && (

                <div
                    className="form-card"
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <h2>
                        💡 Why this career?
                    </h2>

                    <p>
                        {prediction.reason}
                    </p>

                </div>

            )}

            {/* RECOMMENDED COURSES */}

            <div className="form-card">

                <h2>
                    📚 Recommended Courses
                </h2>

                <p>

                   These courses are aligned with your AI-recommended career,{" "}
                    <strong>
                        {career}
                    </strong>{" "}

                </p>

                {courses.length === 0 ? (

                    <div
                        style={{
                            padding: "20px",
                            marginTop: "20px",
                            borderRadius: "12px",
                            background: "#f8f9ff"
                        }}
                    >

                        <p>
                            No recommended courses are available for this career.
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gap: "20px",
                            marginTop: "25px"
                        }}
                    >

                        {courses.map(
                            (
                                course,
                                index
                            ) => (

                                <div
                                    key={
                                        course.id ||
                                        index
                                    }
                                    style={{
                                        padding: "25px",
                                        borderRadius: "16px",
                                        border:
                                            "1px solid #e5e7eb",
                                        background:
                                            "#f8f9ff"
                                    }}
                                >

                                    <h3
                                        style={{
                                            marginTop: 0
                                        }}
                                    >

                                        📖{" "}

                                        {
                                            getField(
                                                course,
                                                "name",
                                                "courseName",
                                                "title"
                                            )
                                        }

                                    </h3>

                                    <p>

                                        <strong>
                                            Platform:
                                        </strong>{" "}

                                        {
                                            getField(
                                                course,
                                                "platform"
                                            )
                                        }

                                    </p>

                                    <p>

                                        <strong>
                                            Duration:
                                        </strong>{" "}

                                        {
                                            getField(
                                                course,
                                                "duration"
                                            )
                                        }

                                    </p>

                                    {course.url && (

                                        <button
                                            type="button"
                                            className="main-button"
                                            style={{
                                                width: "100%",
                                                marginTop: "15px"
                                            }}
                                            onClick={() =>
                                                window.open(
                                                    course.url,
                                                    "_blank"
                                                )
                                            }
                                        >

                                            View Course ↗

                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default CareerReport;