import { useEffect, useState } from "react";
import interestService from "../services/interestAssessmentService";

function PreviousInterestTests() {

    // =====================================================
    // STATE
    // =====================================================

    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // GET STUDENT ID
    // =====================================================

    const getStudentId = () => {

        const studentId =
            localStorage.getItem("studentId");

        if (studentId) {
            return Number(studentId);
        }

        return null;
    };


    // =====================================================
    // LOAD PREVIOUS TESTS
    // =====================================================

    useEffect(() => {

        const loadPreviousTests = async () => {

            try {

                setLoading(true);
                setError("");

                const studentId =
                    getStudentId();


                // =========================================
                // STUDENT ID CHECK
                // =========================================

                if (!studentId) {

                    setError(
                        "Student ID not found. Please login again.."
                    );

                    setLoading(false);

                    return;
                }


                console.log(
                    "Loading previous interest tests for:",
                    studentId
                );


                // =========================================
                // GET ALL ASSESSMENTS
                // =========================================

                const data =
                    await interestService.getByStudentId(
                        studentId
                    );


                console.log(
                    "Interest Assessment History:",
                    data
                );


                if (
                    !data ||
                    !Array.isArray(data) ||
                    data.length === 0
                ) {

                    setTests([]);

                    setLoading(false);

                    return;
                }


                // =========================================
                // GROUP BY ATTEMPT ID
                // =========================================
                //
                // Example:
                //
                // ATTEMPT-ABC
                //   Q1
                //   Q2
                //   Q3
                //
                // ATTEMPT-XYZ
                //   Q1
                //   Q2
                //
                // Har test alag show hoga.
                // =========================================

                const grouped = {};


                data.forEach((item) => {

                    const attemptId =
                        item.attemptId ||
                        "OLD-ATTEMPT";


                    if (!grouped[attemptId]) {

                        grouped[attemptId] = [];

                    }


                    grouped[attemptId].push(item);

                });


                // =========================================
                // CONVERT GROUPS INTO TEST LIST
                // =========================================

                const previousTests =
                    Object.keys(grouped).map(
                        (attemptId, index) => {

                            const answers =
                                grouped[attemptId];


                            // =================================
                            // TOTAL SCORE
                            // =================================

                            let totalScore = 0;


                            answers.forEach((answer) => {

                                totalScore +=
                                    Number(
                                        answer.interestScore || 0
                                    );

                            });


                            // =================================
                            // SCORE PERCENTAGE
                            // =================================
                            //
                            // Agar 10 questions hain
                            // aur maximum score 5 hai:
                            //
                            // 10 × 5 = 50
                            //
                            // =================================

                            const maxScore =
                                answers.length * 5;


                            let percentage = 0;


                            if (maxScore > 0) {

                                percentage =
                                    Math.round(
                                        (
                                            totalScore /
                                            maxScore
                                        ) * 100
                                    );

                            }


                            // =================================
                            // CAREER
                            // =================================

                            let career =
                                "Not Generated";


                            const careerAnswer =
                                answers.find(
                                    (item) =>
                                        item.careerCategory &&
                                        item.careerCategory.trim() !== ""
                                );


                            if (careerAnswer) {

                                career =
                                    careerAnswer.careerCategory;

                            }


                            // =================================
                            // INTEREST CATEGORY
                            // =================================

                            let interest =
                                "Not Generated";


                            if (careerAnswer) {

                                interest =
                                    careerAnswer.careerCategory;

                            }


                            // =================================
                            // COURSE
                            // =================================

                            let course =
                                getCourseForCareer(
                                    career
                                );


                            // =================================
                            // RETURN TEST
                            // =================================

                            return {

                                testNumber:
                                    index + 1,

                                attemptId,

                                career,

                                interest,

                                score:
                                    percentage,

                                course,

                                date:
                                    null

                            };

                        }
                    );


                // =========================================
                // LATEST TEST FIRST
                // =========================================

                previousTests.reverse();


                // =========================================
                // SAVE STATE
                // =========================================

                setTests(
                    previousTests
                );


            } catch (err) {

                console.error(
                    "PREVIOUS TEST ERROR:",
                    err
                );

                console.error(
                    "BACKEND RESPONSE:",
                    err.response?.data
                );


                setError(
                    "Previous interest tests are not loading."
                );

            } finally {

                setLoading(false);

            }

        };


        loadPreviousTests();

    }, []);


    // =====================================================
    // COURSE MAPPING
    // =====================================================

    const getCourseForCareer = (career) => {

        if (!career) {

            return "Career course";

        }


        const normalized =
            career.toLowerCase();


        // =========================================
        // SOFTWARE DEVELOPER
        // =========================================

        if (
            normalized.includes("software")
        ) {

            return (
                "Java / Python / Software Development"
            );

        }


        // =========================================
        // WEB DEVELOPER
        // =========================================

        if (
            normalized.includes("web")
        ) {

            return (
                "HTML / CSS / JavaScript / React"
            );

        }


        // =========================================
        // DATA ANALYST
        // =========================================

        if (
            normalized.includes("data analyst")
        ) {

            return (
                "SQL / Excel / Python / Power BI"
            );

        }


        // =========================================
        // DATA SCIENTIST
        // =========================================

        if (
            normalized.includes("data scientist")
        ) {

            return (
                "Python / Statistics / Machine Learning"
            );

        }


        // =========================================
        // AI ENGINEER
        // =========================================

        if (
            normalized.includes("ai")
        ) {

            return (
                "Python / Machine Learning / AI"
            );

        }


        // =========================================
        // CYBER SECURITY
        // =========================================

        if (
            normalized.includes("cyber")
        ) {

            return (
                "Networking / Linux / Cyber Security"
            );

        }


        return "Career Development Course";

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="previous-tests-section">

                <h2>
                    📊 Previous Interest Tests
                </h2>

                <p>
                    Loading previous tests...
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="previous-tests-section">

                <h2>
                    📊 Previous Interest Tests
                </h2>

                <p className="error-message">
                    {error}
                </p>

            </div>

        );

    }


    // =====================================================
    // NO TEST
    // =====================================================

    if (tests.length === 0) {

        return (

            <div className="previous-tests-section">

                <h2>
                    📊 Previous Interest Tests
                </h2>

                <div className="no-tests-card">

                    <div className="no-tests-icon">
                        📝
                    </div>

                    <h3>
                        No Previous Tests
                    </h3>

                    <p>
                        No interest test has been completed so far.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="previous-tests-section">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="previous-tests-header">

                <div>

                    <h2>
                        📊 Previous Interest Tests
                    </h2>

                    <p>
                        Your previous assessment attempts will be saved here.
                    </p>

                </div>

            </div>


            {/* =================================================
                TEST LIST
            ================================================= */}

            <div className="previous-tests-list">

                {tests.map((test) => (

                    <div
                        className="previous-test-card"
                        key={test.attemptId}
                    >


                        {/* =====================================
                            TEST HEADER
                        ===================================== */}

                        <div className="previous-test-top">

                            <div>

                                <h3>
                                    Test #{test.testNumber}
                                </h3>

                                <span className="attempt-id">

                                    Attempt ID:{" "}

                                    {test.attemptId}

                                </span>

                            </div>


                            <div className="test-icon">
                                💻
                            </div>

                        </div>


                        {/* =====================================
                            DIVIDER
                        ===================================== */}

                        <div className="test-divider"></div>


                        {/* =====================================
                            CAREER
                        ===================================== */}

                        <div className="test-info-row">

                            <strong>
                                Career:
                            </strong>

                            <span>
                                {test.career}
                            </span>

                        </div>


                        {/* =====================================
                            INTEREST
                        ===================================== */}

                        <div className="test-info-row">

                            <strong>
                                Interest:
                            </strong>

                            <span>
                                {test.interest}
                            </span>

                        </div>


                        {/* =====================================
                            SCORE
                        ===================================== */}

                        <div className="test-info-row">

                            <strong>
                                Score:
                            </strong>

                            <span className="test-score">

                                {test.score}%

                            </span>

                        </div>


                        {/* =====================================
                            COURSE
                        ===================================== */}

                        <div className="test-info-row">

                            <strong>
                                Course:
                            </strong>

                            <span>
                                {test.course}
                            </span>

                        </div>


                        {/* =====================================
                            IMPORTANT
                            =====================================
                            
                            YAHAN "VIEW ANSWERS" BUTTON
                            JAAN-BUJH KAR NAHI HAI.
                            
                            Questions bhi nahi dikhaye jayenge.
                            
                        ===================================== */}

                    </div>

                ))}

            </div>

        </div>

    );

}


export default PreviousInterestTests;