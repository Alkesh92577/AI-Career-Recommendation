import { useEffect, useState } from "react";

import studentService from "../services/studentService";
import interestAssessmentService from "../services/interestAssessmentService";

// =====================================================
// INTEREST QUESTIONS
// =====================================================

const QUESTIONS = [

    {
        id: 1,
        question: "Which activity do you enjoy the most?",
        options: [
            {
                text: "Writing code and building software",
                category: "Technology"
            },
            {
                text: "Analyzing data and finding patterns",
                category: "Data"
            },
            {
                text: "Designing websites and user interfaces",
                category: "Web"
            },
            {
                text: "Protecting systems from cyber attacks",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 2,
        question: "What type of problem do you like solving?",
        options: [
            {
                text: "Programming and logical problems",
                category: "Technology"
            },
            {
                text: "Data and mathematical problems",
                category: "Data"
            },
            {
                text: "Website and UI problems",
                category: "Web"
            },
            {
                text: "Security and networking problems",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 3,
        question: "Which subject interests you the most?",
        options: [
            {
                text: "Programming",
                category: "Technology"
            },
            {
                text: "Statistics and Data Analysis",
                category: "Data"
            },
            {
                text: "Web Development",
                category: "Web"
            },
            {
                text: "Networking and Security",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 4,
        question: "What would you prefer to build?",
        options: [
            {
                text: "A Java or Python application",
                category: "Technology"
            },
            {
                text: "A data analytics dashboard",
                category: "Data"
            },
            {
                text: "A modern website",
                category: "Web"
            },
            {
                text: "A secure network system",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 5,
        question: "Which work environment sounds most interesting?",
        options: [
            {
                text: "Software development team",
                category: "Technology"
            },
            {
                text: "Data and business analytics team",
                category: "Data"
            },
            {
                text: "Web and UI development team",
                category: "Web"
            },
            {
                text: "Cyber security team",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 6,
        question: "Which activity would you enjoy doing for hours?",
        options: [
            {
                text: "Coding and debugging",
                category: "Technology"
            },
            {
                text: "Working with Excel, SQL and data",
                category: "Data"
            },
            {
                text: "Creating websites and interfaces",
                category: "Web"
            },
            {
                text: "Testing security and finding vulnerabilities",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 7,
        question: "Which skill would you most like to improve?",
        options: [
            {
                text: "Java, Python or programming",
                category: "Technology"
            },
            {
                text: "SQL, Power BI and analytics",
                category: "Data"
            },
            {
                text: "HTML, CSS, JavaScript and React",
                category: "Web"
            },
            {
                text: "Networking and ethical hacking",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 8,
        question: "What kind of project would excite you?",
        options: [
            {
                text: "Building a complete software application",
                category: "Technology"
            },
            {
                text: "Predicting results using data",
                category: "Data"
            },
            {
                text: "Building an attractive web application",
                category: "Web"
            },
            {
                text: "Building a secure system",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 9,
        question: "Which task sounds most enjoyable?",
        options: [
            {
                text: "Creating algorithms",
                category: "Technology"
            },
            {
                text: "Finding insights from datasets",
                category: "Data"
            },
            {
                text: "Improving website design",
                category: "Web"
            },
            {
                text: "Finding and fixing security issues",
                category: "Cyber Security"
            }
        ]
    },

    {
        id: 10,
        question: "Which career area attracts you the most?",
        options: [
            {
                text: "Software Development",
                category: "Technology"
            },
            {
                text: "Data Analytics",
                category: "Data"
            },
            {
                text: "Web Development",
                category: "Web"
            },
            {
                text: "Cyber Security",
                category: "Cyber Security"
            }
        ]
    }

];


// =====================================================
// CAREER INFORMATION
// =====================================================

const CAREER_INFO = {

    Technology: {
        career: "Software Developer",
        course: "Java / Python / Software Development",
        icon: "💻"
    },

    Data: {
        career: "Data Analyst",
        course: "SQL / Power BI / Data Analytics",
        icon: "📊"
    },

    Web: {
        career: "Web Developer",
        course: "HTML / CSS / JavaScript / React",
        icon: "🌐"
    },

    "Cyber Security": {
        career: "Cyber Security Specialist",
        course: "Networking / Cyber Security / Ethical Hacking",
        icon: "🔐"
    }

};


// =====================================================
// COMPONENT
// =====================================================

function InterestAssessment() {

    // =================================================
    // STATES
    // =================================================

    const [studentId, setStudentId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState({});

    const [result, setResult] = useState(null);

    const [message, setMessage] = useState("");


    // =================================================
    // LOAD STUDENT
    // =================================================

    useEffect(() => {

        const loadStudent = async () => {

            try {

                const userId =
                    localStorage.getItem("userId");


                if (!userId) {

                    setMessage(
                        "Please login again."
                    );

                    return;

                }


                const student =
                    await studentService.getByUserId(
                        userId
                    );


                if (
                    !student ||
                    !student.id
                ) {

                    setMessage(
                        "Please complete your profile first."
                    );

                    return;

                }


                setStudentId(
                    student.id
                );


                localStorage.setItem(
                    "studentId",
                    student.id
                );


            } catch (error) {

                console.error(
                    "Student Load Error:",
                    error
                );


                setMessage(
                    "The student profile is not loading.."
                );

            } finally {

                setLoading(false);

            }

        };


        loadStudent();

    }, []);


    // =================================================
    // SELECT ANSWER
    // =================================================

    const handleAnswer = (
        questionId,
        option
    ) => {

        setAnswers(
            previous => ({

                ...previous,

                [questionId]: option

            })
        );


        setMessage("");

    };


    // =================================================
    // NEXT QUESTION
    // =================================================

    const handleNext = () => {

        const questionId =
            QUESTIONS[currentQuestion].id;


        if (
            !answers[questionId]
        ) {

            setMessage(
                "Please select an answer first."
            );

            return;

        }


        setMessage("");


        if (
            currentQuestion <
            QUESTIONS.length - 1
        ) {

            setCurrentQuestion(
                previous =>
                    previous + 1
            );

        }

    };


    // =================================================
    // PREVIOUS QUESTION
    // =================================================

    const handlePrevious = () => {

        setMessage("");


        if (
            currentQuestion > 0
        ) {

            setCurrentQuestion(
                previous =>
                    previous - 1
            );

        }

    };


    // =================================================
    // CALCULATE RESULT
    // =================================================

    const calculateResult = () => {

        // =============================================
        // CATEGORY SCORES
        // =============================================

        const categoryScores = {

            Technology: 0,

            Data: 0,

            Web: 0,

            "Cyber Security": 0

        };


        // =============================================
        // COUNT SELECTED ANSWERS
        // =============================================

        Object.values(answers).forEach(
            (answer) => {

                if (
                    answer &&
                    answer.category &&
                    categoryScores[
                        answer.category
                    ] !== undefined
                ) {

                    categoryScores[
                        answer.category
                    ]++;

                }

            }
        );


        // =============================================
        // FIND STRONGEST CATEGORY
        // =============================================

        let strongestCategory =
            "Technology";

        let highestScore =
            -1;


        Object.entries(
            categoryScores
        ).forEach(

            ([category, score]) => {

                if (
                    score > highestScore
                ) {

                    highestScore =
                        score;

                    strongestCategory =
                        category;

                }

            }

        );


        // =============================================
        // GET CAREER INFORMATION
        // =============================================

        const careerInfo =
            CAREER_INFO[
                strongestCategory
            ];


        // =============================================
        // TOTAL ANSWERS
        // =============================================

        const totalAnswers =
            Object.values(
                categoryScores
            ).reduce(

                (total, score) =>
                    total + score,

                0

            );


        // =============================================
        // CONFIDENCE
        // =============================================

        const confidence =
            totalAnswers > 0
                ? Number(
                    (
                        (
                            highestScore /
                            totalAnswers
                        ) * 100
                    ).toFixed(1)
                )
                : 0;


        // =============================================
        // RETURN RESULT
        // =============================================

        return {

            category:
                strongestCategory,

            career:
                careerInfo.career,

            course:
                careerInfo.course,

            icon:
                careerInfo.icon,

            score:
                highestScore,

            totalAnswers:
                totalAnswers,

            confidence:
                confidence,

            categoryScores:
                categoryScores

        };

    };


    // =================================================
    // SAVE LATEST INTEREST RESULT
    // =================================================

    const saveLatestInterestResult = (
        calculatedResult,
        attemptId
    ) => {

        localStorage.setItem(
            "interestCategory",
            calculatedResult.category
        );


        localStorage.setItem(
            "preferredField",
            calculatedResult.career
        );


        localStorage.setItem(
            "preferredCareer",
            calculatedResult.career
        );


        localStorage.setItem(
            "interestRecommendedCourse",
            calculatedResult.course
        );


        localStorage.setItem(
            "interestConfidence",
            calculatedResult.confidence
        );


        if (attemptId) {

            localStorage.setItem(
                "interestAttemptId",
                attemptId
            );

        }


        localStorage.setItem(
            "interestSubmittedAt",
            new Date().toISOString()
        );

    };


    // =================================================
    // SUBMIT TEST
    // =================================================

    const handleSubmit = async () => {

        // =============================================
        // CHECK ALL QUESTIONS
        // =============================================

        if (
            Object.keys(answers).length !==
            QUESTIONS.length
        ) {

            setMessage(
                "Please answer all questions before submitting."
            );

            return;

        }


        // =============================================
        // CHECK STUDENT
        // =============================================

        if (!studentId) {

            setMessage(
                "Student ID not found. Please complete your profile first."
            );

            return;

        }


        setSubmitting(true);

        setMessage("");


        try {

            // =========================================
            // CALCULATE RESULT
            // =========================================

            const calculatedResult =
                calculateResult();


            // =========================================
            // SAFETY CHECK
            // =========================================

            if (
                !calculatedResult ||
                !calculatedResult.category
            ) {

                throw new Error(
                    "The interest result could not be calculated."
                );

            }


            console.log(
                "INTEREST TEST RESULT:",
                calculatedResult
            );


            // =========================================
            // CREATE ASSESSMENT DATA
            // =========================================

            const assessments =
                QUESTIONS.map(
                    (question) => {

                        const selectedOption =
                            answers[
                                question.id
                            ];


                        return {

                            studentId:
                                studentId,

                            question:
                                question.question,

                            selectedAnswer:
                                selectedOption.text,

                            careerCategory:
                                selectedOption.category

                        };

                    }
                );


            console.log(
                "ASSESSMENTS:",
                assessments
            );


            // =========================================
            // SAVE TO DATABASE
            // =========================================

            const saved =
                await interestAssessmentService
                    .saveAll(
                        studentId,
                        assessments
                    );


            console.log(
                "Saved Interest Assessment:",
                saved
            );


            // =========================================
            // GET ATTEMPT ID
            // =========================================

            const attemptId =

                saved &&
                Array.isArray(saved) &&
                saved.length > 0

                    ? saved[0].attemptId

                    : null;


            // =========================================
            // SAVE LOCAL RESULT
            // =========================================

            saveLatestInterestResult(
                calculatedResult,
                attemptId
            );


            // =========================================
            // FINAL RESULT
            // =========================================

            const finalResult = {

                ...calculatedResult,

                attemptId:

                    attemptId,

                submittedAt:

                    new Date()
                        .toLocaleString()

            };


            // =========================================
            // SHOW RESULT
            // =========================================

            setResult(
                finalResult
            );


        } catch (error) {

            console.error(
                "INTEREST TEST SUBMIT ERROR:",
                error
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            setMessage(

                error.response?.data?.message ||

                error.response?.data ||

                error.message ||

                "The interest test is not submitting.."

            );


        } finally {

            setSubmitting(false);

        }

    };


    // =================================================
    // START NEW TEST
    // =================================================

    const startNewTest = () => {

        localStorage.removeItem(
            "interestCategory"
        );

        localStorage.removeItem(
            "preferredField"
        );

        localStorage.removeItem(
            "preferredCareer"
        );

        localStorage.removeItem(
            "interestRecommendedCourse"
        );

        localStorage.removeItem(
            "interestConfidence"
        );

        localStorage.removeItem(
            "interestAttemptId"
        );

        localStorage.removeItem(
            "interestSubmittedAt"
        );


        setAnswers({});

        setCurrentQuestion(0);

        setResult(null);

        setMessage("");

    };


    // =================================================
    // LOADING SCREEN
    // =================================================

    if (loading) {

        return (

            <div className="page-container">

                <div className="form-card">

                    <h2>
                        Loading Interest Assessment...
                    </h2>

                </div>

            </div>

        );

    }


    // =================================================
    // RESULT SCREEN
    // =================================================

    if (result) {

        return (

            <div className="page-container">

                <div className="page-header">

                    <h1>
                        🎯 Interest Test Result
                    </h1>

                    <p>
                        Your latest interest assessment result
                    </p>

                </div>


                <div
                    className="form-card"
                    style={{
                        textAlign: "center",
                        padding: "40px"
                    }}
                >

                    <div
                        style={{
                            fontSize: "60px",
                            marginBottom: "15px"
                        }}
                    >

                        {result.icon}

                    </div>


                    <h2>
                        Preferred Career
                    </h2>


                    <h1
                        style={{
                            marginTop: "10px"
                        }}
                    >

                        {result.career}

                    </h1>


                    <p
                        style={{
                            fontSize: "18px",
                            marginTop: "25px"
                        }}
                    >

                        Strongest Interest:

                        <strong>
                            {" "}
                            {result.category}
                        </strong>

                    </p>


                    <p
                        style={{
                            fontSize: "18px",
                            marginTop: "10px"
                        }}
                    >

                        Recommended Course:

                        <strong>
                            {" "}
                            {result.course}
                        </strong>

                    </p>


                    <p
                        style={{
                            fontSize: "18px",
                            marginTop: "10px"
                        }}
                    >

                        Interest Confidence:

                        <strong>
                            {" "}
                            {result.confidence}%
                        </strong>

                    </p>


                    <p
                        style={{
                            fontSize: "15px",
                            marginTop: "10px"
                        }}
                    >

                        Matching Answers:

                        <strong>
                            {" "}
                            {result.score}
                            {" / "}
                            {result.totalAnswers}
                        </strong>

                    </p>


                    {result.attemptId && (

                        <p
                            style={{
                                fontSize: "13px",
                                opacity: 0.7,
                                marginTop: "15px"
                            }}
                        >

                            Attempt ID:
                            {" "}
                            {result.attemptId}

                        </p>

                    )}


                    {result.submittedAt && (

                        <p
                            style={{
                                fontSize: "13px",
                                opacity: 0.7
                            }}
                        >

                            Submitted:
                            {" "}
                            {result.submittedAt}

                        </p>

                    )}


                    <div
                        style={{
                            marginTop: "30px"
                        }}
                    >

                        <button
                            type="button"
                            className="main-button"
                            onClick={
                                startNewTest
                            }
                        >

                            🔄 Take Test Again

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =================================================
    // CURRENT QUESTION
    // =================================================

    const question =
        QUESTIONS[currentQuestion];


    const selectedAnswer =
        answers[
            question.id
        ];


    // =================================================
    // MAIN TEST UI
    // =================================================

    return (

        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <h1>
                    🧠 Interest Assessment
                </h1>

                <p>
                    Answer the questions to discover
                    your strongest career interest.
                </p>

            </div>


            {/* PROGRESS */}

            <div
                className="form-card"
                style={{
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >

                    <strong>

                        Question{" "}
                        {currentQuestion + 1}
                        {" "}
                        of{" "}
                        {QUESTIONS.length}

                    </strong>


                    <span>

                        {Math.round(

                            (
                                (
                                    currentQuestion + 1
                                ) /
                                QUESTIONS.length
                            ) * 100

                        )}

                        %

                    </span>

                </div>


                {/* PROGRESS BAR */}

                <div
                    style={{
                        width: "100%",
                        height: "8px",
                        background: "#e5e7eb",
                        borderRadius: "10px",
                        marginTop: "10px"
                    }}
                >

                    <div
                        style={{
                            width:
                                `${
                                    (
                                        (
                                            currentQuestion + 1
                                        ) /
                                        QUESTIONS.length
                                    ) * 100
                                }%`,

                            height: "100%",

                            background:
                                "#6366f1",

                            borderRadius:
                                "10px"

                        }}
                    />

                </div>

            </div>


            {/* QUESTION */}

            <div className="form-card">

                <h2>
                    {question.question}
                </h2>


                {/* OPTIONS */}

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    {question.options.map(

                        (option, index) => {

                            const isSelected =

                                selectedAnswer &&

                                selectedAnswer.text ===
                                option.text;


                            return (

                                <button

                                    key={index}

                                    type="button"

                                    onClick={() =>
                                        handleAnswer(
                                            question.id,
                                            option
                                        )
                                    }

                                    style={{

                                        width: "100%",

                                        textAlign:
                                            "left",

                                        padding:
                                            "18px",

                                        marginBottom:
                                            "12px",

                                        borderRadius:
                                            "10px",

                                        border:

                                            isSelected

                                                ? "2px solid #6366f1"

                                                : "1px solid #ddd",

                                        background:

                                            isSelected

                                                ? "#eef2ff"

                                                : "#fff",

                                        cursor:
                                            "pointer",

                                        fontSize:
                                            "16px"

                                    }}

                                >

                                    <strong>

                                        {String.fromCharCode(
                                            65 + index
                                        )}

                                        .

                                    </strong>

                                    {" "}

                                    {option.text}

                                </button>

                            );

                        }

                    )}

                </div>


                {/* ERROR MESSAGE */}

                {message && (

                    <p
                        className="error-message"
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        {message}

                    </p>

                )}


                {/* BUTTONS */}

                <div
                    style={{

                        display:
                            "flex",

                        justifyContent:
                            "space-between",

                        gap:
                            "10px",

                        marginTop:
                            "20px"

                    }}
                >

                    {/* PREVIOUS */}

                    <button

                        type="button"

                        className="main-button"

                        onClick={
                            handlePrevious
                        }

                        disabled={
                            currentQuestion === 0
                        }

                    >

                        ← Previous

                    </button>


                    {/* NEXT OR SUBMIT */}

                    {currentQuestion <
                    QUESTIONS.length - 1 ? (

                        <button

                            type="button"

                            className="main-button"

                            onClick={
                                handleNext
                            }

                        >

                            Next →

                        </button>

                    ) : (

                        <button

                            type="button"

                            className="main-button"

                            onClick={
                                handleSubmit
                            }

                            disabled={
                                submitting
                            }

                        >

                            {submitting

                                ? "Submitting..."

                                : "Submit Assessment ✓"

                            }

                        </button>

                    )}

                </div>

            </div>

        </div>

    );

}


export default InterestAssessment;