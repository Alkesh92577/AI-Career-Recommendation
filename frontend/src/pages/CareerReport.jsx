import { useEffect, useState } from "react";
import axios from "axios";
import studentService from "../services/studentService";

// =====================================================
// API URLS
// =====================================================

const API_BASE =
    "https://ai-career-backend-vj8d.onrender.com/api";

const PREDICTION_API =
    `${API_BASE}/predictions`;

const COURSE_API =
    `${API_BASE}/courses`;

// =====================================================
// CAREER REPORT
// =====================================================

function CareerReport() {

    // =================================================
    // STATE
    // =================================================

    const [student, setStudent] = useState(null);

    const [prediction, setPrediction] = useState(null);

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =================================================
    // HELPERS
    // =================================================

    const getConfidence = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }

        let number = Number(value);

        if (Number.isNaN(number)) {
            return 0;
        }

        if (number > 0 && number <= 1) {
            number = number * 100;
        }

        return Math.round(number * 100) / 100;
    };

    // =================================================
    // GET FIELD
    // =================================================

    const getField = (
        object,
        ...fields
    ) => {

        if (!object) {
            return "";
        }

        for (const field of fields) {

            const value = object[field];

            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {
                return value;
            }
        }

        return "";
    };

    // =================================================
    // CHECK VALUE
    // =================================================

    const hasValue = (value) => {

        if (
            value === null ||
            value === undefined
        ) {
            return false;
        }

        return String(value).trim() !== "";
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
                    localStorage.getItem("userId");

                if (!userId) {

                    throw new Error(
                        "User ID not found. Please login again."
                    );
                }

                // =====================================
                // STUDENT
                // =====================================

                const studentData =
                    await studentService.getByUserId(
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

                setStudent(studentData);

                // =====================================
                // SAVED PREDICTION
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

                } catch (predictionStorageError) {

                    console.log(
                        "Saved prediction unavailable."
                    );
                }

                // =====================================
                // BACKEND PREDICTION
                // =====================================

                let predictionData = [];

                try {

                    const predictionResponse =
                        await axios.get(
                            `${PREDICTION_API}/student/${studentData.id}`
                        );

                    predictionData =
                        predictionResponse.data;

                } catch (predictionError) {

                    console.log(
                        "Backend prediction unavailable."
                    );

                    predictionData = [];
                }

                // =====================================
                // ARRAY CHECK
                // =====================================

                if (
                    !Array.isArray(predictionData)
                ) {

                    predictionData = [];
                }

                // =====================================
                // LATEST PREDICTION
                // =====================================

                let latestPrediction = null;

                if (
                    predictionData.length > 0
                ) {

                    const sortedPredictions =
                        [...predictionData].sort(
                            (a, b) => {

                                const dateA =
                                    a.createdAt
                                        ? new Date(
                                            a.createdAt
                                        ).getTime()
                                        : Number(a.id) || 0;

                                const dateB =
                                    b.createdAt
                                        ? new Date(
                                            b.createdAt
                                        ).getTime()
                                        : Number(b.id) || 0;

                                return dateB - dateA;
                            }
                        );

                    latestPrediction =
                        sortedPredictions[0];
                }

                // =====================================
                // FINAL PREDICTION
                // =====================================

                const finalPrediction =
                    savedPrediction ||
                    latestPrediction;

                // =====================================
                // CAREER
                // =====================================

                let career = "";

                if (finalPrediction) {

                    career =
                        getField(
                            finalPrediction,
                            "recommendedCareer",
                            "career",
                            "predictedCareer",
                            "careerName"
                        );
                }

                // =====================================
                // SET PREDICTION
                // =====================================

                if (hasValue(career)) {

                    const cleanPrediction = {

                        ...finalPrediction,

                        recommendedCareer:
                            String(career).trim(),

                        confidence:
                            getConfidence(
                                getField(
                                    finalPrediction,
                                    "confidence"
                                )
                            )
                    };

                    setPrediction(
                        cleanPrediction
                    );

                    // Save final career
                    localStorage.setItem(
                        "latestPredictedCareer",
                        String(career).trim()
                    );

                    localStorage.setItem(
                        "recommendedCareer",
                        String(career).trim()
                    );

                } else {

                    setPrediction(null);
                }

                // =====================================
                // COURSES
                // =====================================

                if (hasValue(career)) {

                    try {

                        const courseResponse =
                            await axios.get(
                                `${COURSE_API}/career/${encodeURIComponent(
                                    String(career).trim()
                                )}`
                            );

                        let courseData =
                            courseResponse.data;

                        if (
                            !Array.isArray(courseData)
                        ) {

                            courseData = [];
                        }

                        setCourses(
                            courseData
                        );

                    } catch (courseError) {

                        console.log(
                            "Courses not available."
                        );

                        setCourses([]);
                    }

                } else {

                    setCourses([]);
                }

            } catch (err) {

                console.error(
                    "CAREER REPORT ERROR:",
                    err
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
    // LOADING
    // =================================================

    if (loading) {

        return (
            <div className="page-container">

                <div className="form-card">

                    <h2>
                        📊 Career Report Loading...
                    </h2>

                    <p>
                        Your completed career information
                        is loading...
                    </p>

                </div>

            </div>
        );
    }

    // =================================================
    // ERROR
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
    // FINAL DATA
    // =================================================

    const career =
        prediction
            ? getField(
                prediction,
                "recommendedCareer",
                "career",
                "predictedCareer",
                "careerName"
            )
            : "";

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
            "email",
            "emailAddress"
        );

    const studentId =
        getField(
            student,
            "id",
            "studentId"
        );

    // =================================================
    // ACADEMIC DATA
    // =================================================

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
    // ONLY COMPLETED ACADEMIC FIELDS
    // =================================================

    const academicFields = [

        {
            label: "10th Marks",
            value: tenthMarks
        },

        {
            label: "12th Marks",
            value: twelfthMarks
        },

        {
            label: "Graduation Marks",
            value: graduationMarks
        },

        {
            label: "Semester",
            value: semester
        },

        {
            label: "Backlogs",
            value: backlogs
        }

    ].filter(
        (item) =>
            hasValue(item.value)
    );

    // =================================================
    // ONLY COMPLETED STUDENT FIELDS
    // =================================================

    const studentFields = [

        {
            label: "Name",
            value: studentName
        },

        {
            label: "Email",
            value: email
        },

        {
            label: "Student ID",
            value: studentId
        }

    ].filter(
        (item) =>
            hasValue(item.value)
    );

    // =================================================
    // PREDICTION REASON
    // =================================================

    const predictionReason =
        prediction
            ? getField(
                prediction,
                "reason",
                "explanation",
                "description"
            )
            : "";

    // =================================================
    // PRINT
    // =================================================

    const handlePrint = () => {
        window.print();
    };

    // =================================================
    // UI
    // =================================================

    return (

        <div className="career-report-page">

            {/* =================================================
                PRINT STYLE
            ================================================= */}

            <style>
                {`
                    /* =========================================
                       NORMAL REPORT PAGE
                    ========================================= */

                    .career-report-page {
                        width: 100%;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 35px 45px;
                        box-sizing: border-box;
                        background: #ffffff;
                        color: #17213d;
                    }

                    .career-report-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 20px;
                        margin-bottom: 25px;
                        padding-bottom: 18px;
                        border-bottom: 2px solid #e8e9f5;
                    }

                    .career-report-brand {
                        font-size: 15px;
                        font-weight: 800;
                        color: #5b3fd3;
                        letter-spacing: 0.3px;
                        margin-bottom: 7px;
                    }

                    .career-report-title {
                        margin: 0;
                        font-size: 34px;
                        line-height: 1.15;
                        font-weight: 800;
                        color: #15213f;
                    }

                    .career-report-subtitle {
                        margin: 7px 0 0;
                        font-size: 14px;
                        line-height: 1.5;
                        color: #68738f;
                    }

                    .career-report-date {
                        font-size: 12px;
                        font-weight: 700;
                        color: #68738f;
                        white-space: nowrap;
                        padding-top: 5px;
                    }

                    .report-section {
                        margin-bottom: 18px;
                    }

                    .report-section-title {
                        display: flex;
                        align-items: center;
                        gap: 9px;
                        margin-bottom: 10px;
                        font-size: 17px;
                        line-height: 1.2;
                        font-weight: 800;
                        color: #17213d;
                    }

                    .report-section-number {
                        width: 25px;
                        height: 25px;
                        min-width: 25px;
                        border-radius: 8px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: #eeeaff;
                        color: #5b3fd3;
                        font-size: 11px;
                        font-weight: 800;
                    }

                    .report-student-grid {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 10px;
                    }

                    .report-info-box {
                        padding: 12px 14px;
                        border: 1px solid #dfe3f2;
                        border-radius: 10px;
                        background: #fbfbff;
                        min-height: 55px;
                        box-sizing: border-box;
                    }

                    .report-info-label {
                        display: block;
                        margin-bottom: 5px;
                        font-size: 10px;
                        color: #78829a;
                        font-weight: 700;
                    }

                    .report-info-value {
                        display: block;
                        font-size: 14px;
                        color: #18223d;
                        font-weight: 700;
                        word-break: break-word;
                    }

                    .report-academic-grid {
                        display: grid;
                        grid-template-columns: repeat(5, minmax(0, 1fr));
                        gap: 9px;
                    }

                    .report-academic-box {
                        padding: 11px 12px;
                        border: 1px solid #dfe3f2;
                        border-radius: 10px;
                        background: #fbfbff;
                        box-sizing: border-box;
                    }

                    .report-academic-label {
                        display: block;
                        font-size: 9px;
                        color: #78829a;
                        font-weight: 700;
                        margin-bottom: 5px;
                    }

                    .report-academic-value {
                        display: block;
                        font-size: 16px;
                        color: #17213d;
                        font-weight: 800;
                    }

                    .career-recommendation-box {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 25px;
                        padding: 17px 20px;
                        border: 1px solid #cfc4ff;
                        border-radius: 13px;
                        background: linear-gradient(
                            135deg,
                            #f8f6ff 0%,
                            #f1edff 100%
                        );
                        box-sizing: border-box;
                    }

                    .career-recommendation-content {
                        min-width: 0;
                        flex: 1;
                    }

                    .career-recommendation-label {
                        margin: 0 0 5px;
                        color: #5b3fd3;
                        font-size: 10px;
                        font-weight: 800;
                        letter-spacing: 0.6px;
                        text-transform: uppercase;
                    }

                    .career-recommendation-title {
                        margin: 0;
                        font-size: 25px;
                        line-height: 1.15;
                        font-weight: 800;
                        color: #17213d;
                    }

                    .career-recommendation-description {
                        margin: 6px 0 0;
                        font-size: 11px;
                        line-height: 1.45;
                        color: #68738f;
                    }

                    .confidence-circle {
                        width: 68px;
                        height: 68px;
                        min-width: 68px;
                        border-radius: 50%;
                        background: #633ee0;
                        color: #ffffff;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 7px 18px rgba(99, 62, 224, 0.18);
                    }

                    .confidence-number {
                        font-size: 20px;
                        line-height: 1;
                        font-weight: 800;
                    }

                    .confidence-label {
                        margin-top: 3px;
                        font-size: 7px;
                        font-weight: 600;
                    }

                    .why-career-box {
                        padding: 12px 15px;
                        border-left: 4px solid #633ee0;
                        background: #f8f8ff;
                        box-sizing: border-box;
                    }

                    .why-career-title {
                        margin: 0 0 4px;
                        font-size: 14px;
                        font-weight: 800;
                        color: #17213d;
                    }

                    .why-career-text {
                        margin: 0;
                        font-size: 10px;
                        line-height: 1.5;
                        color: #4f5b78;
                    }

                    .courses-grid {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 9px;
                    }

                    .course-report-card {
                        padding: 11px 13px;
                        border: 1px solid #dfe3f2;
                        border-radius: 10px;
                        background: #fbfbff;
                        box-sizing: border-box;
                        min-height: 62px;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .course-report-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .course-report-name {
                        margin: 0;
                        font-size: 12px;
                        line-height: 1.3;
                        font-weight: 800;
                        color: #17213d;
                    }

                    .course-report-meta {
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                        justify-content: flex-end;
                        text-align: right;
                    }

                    .course-report-meta span {
                        font-size: 9px;
                        line-height: 1.3;
                        color: #68738f;
                    }

                    .course-report-meta strong {
                        color: #4e5872;
                        font-weight: 700;
                    }

                    .no-print {
                        display: inline-flex;
                    }


                    /* =========================================
                       PRINT / PDF
                    ========================================= */

                    @media print {

                        @page {
                            size: A4 portrait;
                            margin: 8mm;
                        }

                        html,
                        body {
                            width: 210mm !important;
                            min-height: 297mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: #ffffff !important;
                        }

                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        /* Hide all normal application navigation */
                        nav,
                        aside,
                        header:not(.career-report-header),
                        footer,
                        .dashboard-navbar,
                        .dashboard-sidebar,
                        .mobile-menu-button,
                        .no-print {
                            display: none !important;
                        }

                        .career-report-page {
                            width: 100% !important;
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: #ffffff !important;
                        }

                        .career-report-header {
                            margin-bottom: 10px !important;
                            padding-bottom: 8px !important;
                            border-bottom: 1.5px solid #dfe3f2 !important;
                        }

                        .career-report-brand {
                            font-size: 11px !important;
                            margin-bottom: 3px !important;
                        }

                        .career-report-title {
                            font-size: 24px !important;
                        }

                        .career-report-subtitle {
                            font-size: 9px !important;
                            margin-top: 3px !important;
                        }

                        .career-report-date {
                            font-size: 8px !important;
                        }

                        .report-section {
                            margin-bottom: 9px !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }

                        .report-section-title {
                            font-size: 12px !important;
                            margin-bottom: 5px !important;
                            gap: 6px !important;
                        }

                        .report-section-number {
                            width: 18px !important;
                            height: 18px !important;
                            min-width: 18px !important;
                            border-radius: 5px !important;
                            font-size: 8px !important;
                        }

                        .report-student-grid {
                            gap: 6px !important;
                        }

                        .report-info-box {
                            min-height: 43px !important;
                            padding: 7px 9px !important;
                            border-radius: 7px !important;
                        }

                        .report-info-label {
                            font-size: 7px !important;
                            margin-bottom: 3px !important;
                        }

                        .report-info-value {
                            font-size: 10px !important;
                        }

                        .report-academic-grid {
                            gap: 6px !important;
                        }

                        .report-academic-box {
                            padding: 7px 8px !important;
                            border-radius: 7px !important;
                        }

                        .report-academic-label {
                            font-size: 7px !important;
                            margin-bottom: 3px !important;
                        }

                        .report-academic-value {
                            font-size: 12px !important;
                        }

                        .career-recommendation-box {
                            padding: 10px 13px !important;
                            gap: 15px !important;
                            border-radius: 9px !important;
                        }

                        .career-recommendation-label {
                            font-size: 7px !important;
                            margin-bottom: 3px !important;
                        }

                        .career-recommendation-title {
                            font-size: 19px !important;
                        }

                        .career-recommendation-description {
                            font-size: 8px !important;
                            margin-top: 3px !important;
                        }

                        .confidence-circle {
                            width: 54px !important;
                            height: 54px !important;
                            min-width: 54px !important;
                            box-shadow: none !important;
                        }

                        .confidence-number {
                            font-size: 16px !important;
                        }

                        .confidence-label {
                            font-size: 6px !important;
                        }

                        .why-career-box {
                            padding: 7px 10px !important;
                            border-left-width: 3px !important;
                        }

                        .why-career-title {
                            font-size: 10px !important;
                            margin-bottom: 2px !important;
                        }

                        .why-career-text {
                            font-size: 8px !important;
                            line-height: 1.35 !important;
                        }

                        .courses-grid {
                            gap: 6px !important;
                        }

                        .course-report-card {
                            min-height: 46px !important;
                            padding: 7px 9px !important;
                            border-radius: 7px !important;
                        }

                        .course-report-name {
                            font-size: 9px !important;
                        }

                        .course-report-meta {
                            gap: 7px !important;
                        }

                        .course-report-meta span {
                            font-size: 7px !important;
                        }

                        /* Prevent unwanted page breaks */
                        .career-recommendation-box,
                        .why-career-box,
                        .course-report-card {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                    }
                `}
            </style>

            {/* =================================================
                REPORT HEADER
            ================================================= */}

            <div className="career-report-header">

                <div>

                    <div className="career-report-brand">
                        ✦ CareerAI
                    </div>

                    <h1 className="career-report-title">
                        Career Recommendation Report
                    </h1>

                    <p className="career-report-subtitle">
                        Personalized career report based on
                        your completed information.
                    </p>

                </div>

                <div className="career-report-date">
                    {new Date().toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )}
                </div>

            </div>

            {/* =================================================
                STUDENT DETAILS
            ================================================= */}

            {studentFields.length > 0 && (

                <section className="report-section">

                    <h2 className="report-section-title">

                        <span className="report-section-number">
                            01
                        </span>

                        Student Details

                    </h2>

                    <div className="report-student-grid">

                        {studentFields.map(
                            (item) => (

                                <div
                                    className="report-info-box"
                                    key={item.label}
                                >

                                    <span className="report-info-label">
                                        {item.label}
                                    </span>

                                    <span className="report-info-value">
                                        {item.value}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}

            {/* =================================================
                ACADEMIC PERFORMANCE
            ================================================= */}

            {academicFields.length > 0 && (

                <section className="report-section">

                    <h2 className="report-section-title">

                        <span className="report-section-number">
                            02
                        </span>

                        Academic Performance

                    </h2>

                    <div className="report-academic-grid">

                        {academicFields.map(
                            (item) => (

                                <div
                                    className="report-academic-box"
                                    key={item.label}
                                >

                                    <span className="report-academic-label">
                                        {item.label}
                                    </span>

                                    <span className="report-academic-value">
                                        {item.value}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}

            {/* =================================================
                AI RECOMMENDED CAREER
            ================================================= */}

            {prediction &&
                hasValue(career) && (

                    <section className="report-section">

                        <div className="career-recommendation-box">

                            <div className="career-recommendation-content">

                                <p className="career-recommendation-label">
                                    🤖 AI Recommended Career
                                </p>

                                <h2 className="career-recommendation-title">
                                    {career}
                                </h2>

                                <p className="career-recommendation-description">
                                    Your completed profile,
                                    academic information,
                                    skills and assessment
                                    indicate this as your
                                    recommended career.
                                </p>

                            </div>

                            <div className="confidence-circle">

                                <span className="confidence-number">
                                    {confidence}%
                                </span>

                                <span className="confidence-label">
                                    Confidence
                                </span>

                            </div>

                        </div>

                    </section>

                )}

            {/* =================================================
                WHY THIS CAREER
            ================================================= */}

            {hasValue(predictionReason) && (

                <section className="report-section">

                    <div className="why-career-box">

                        <h3 className="why-career-title">
                            💡 Why This Career?
                        </h3>

                        <p className="why-career-text">
                            {predictionReason}
                        </p>

                    </div>

                </section>

            )}

            {/* =================================================
                RECOMMENDED COURSES
            ================================================= */}

            {courses.length > 0 && (

                <section className="report-section">

                    <h2 className="report-section-title">

                        <span className="report-section-number">
                            04
                        </span>

                        Recommended Courses

                    </h2>

                    <div className="courses-grid">

                        {courses.map(
                            (course, index) => {

                                const courseName =
                                    getField(
                                        course,
                                        "name",
                                        "courseName",
                                        "title"
                                    );

                                const platform =
                                    getField(
                                        course,
                                        "platform"
                                    );

                                const duration =
                                    getField(
                                        course,
                                        "duration"
                                    );

                                return (

                                    <div
                                        className="course-report-card"
                                        key={
                                            course.id ||
                                            index
                                        }
                                    >

                                        <div className="course-report-top">

                                            <h3 className="course-report-name">
                                                📖{" "}
                                                {courseName}
                                            </h3>

                                            <div className="course-report-meta">

                                                {hasValue(
                                                    platform
                                                ) && (

                                                    <span>
                                                        <strong>
                                                            Platform:
                                                        </strong>{" "}
                                                        {platform}
                                                    </span>

                                                )}

                                                {hasValue(
                                                    duration
                                                ) && (

                                                    <span>
                                                        <strong>
                                                            Duration:
                                                        </strong>{" "}
                                                        {duration}
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                </section>

            )}

            {/* =================================================
                PRINT BUTTON
            ================================================= */}

            <div
                className="no-print"
                style={{
                    marginTop: "30px",
                    display: "flex",
                    justifyContent: "center"
                }}
            >

                <button
                    type="button"
                    className="main-button"
                    onClick={handlePrint}
                    style={{
                        padding: "13px 25px",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer"
                    }}
                >
                    🖨️ Print / Download PDF
                </button>

            </div>

        </div>
    );
}

export default CareerReport;