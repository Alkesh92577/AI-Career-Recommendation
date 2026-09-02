import { useEffect, useState } from "react";

import studentService
    from "../services/studentService";

import careerRoadmapService
    from "../services/careerRoadmapService";

import roadmapProgressService
    from "../services/roadmapProgressService";


function CareerRoadmap() {


    // ==========================================
    // CAREER ROADMAP
    // ==========================================

    const [roadmap, setRoadmap] =
        useState([]);


    // ==========================================
    // LEARNING ROADMAP
    // ==========================================

    const [learningRoadmap, setLearningRoadmap] =
        useState([]);


    // ==========================================
    // CAREER ROADMAP PROGRESS
    // ==========================================

    const [progress, setProgress] =
        useState([]);


    // ==========================================
    // LEARNING ROADMAP PROGRESS
    // ==========================================

    const [learningCompleted, setLearningCompleted] =
        useState([]);


    // ==========================================
    // STUDENT ID
    // ==========================================

    const [studentId, setStudentId] =
        useState(null);


    // ==========================================
    // FINAL CAREER
    // ==========================================

    const [finalCareer, setFinalCareer] =
        useState("");


    // ==========================================
    // LOADING
    // ==========================================

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // GENERATING
    // ==========================================

    const [generating, setGenerating] =
        useState(false);


    // ==========================================
    // MESSAGE
    // ==========================================

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("");


    // ==========================================
    // SHOW MESSAGE
    // ==========================================

    const showMessage = (
        text,
        type
    ) => {

        setMessage(text);

        setMessageType(type);

        setTimeout(() => {

            setMessage("");

            setMessageType("");

        }, 3000);

    };


    // ==========================================
    // GET FINAL CAREER
    // ==========================================

    const getFinalCareer = () => {

        const savedCareer =
            localStorage.getItem(
                "latestPredictedCareer"
            );


        if (
            savedCareer &&
            savedCareer.trim() !== ""
        ) {

            return savedCareer.trim();

        }


        return "";

    };


    // ==========================================
    // CREATE LEARNING ROADMAP
    // ==========================================

    const createLearningRoadmap = (
        career
    ) => {

        if (
            !career ||
            career.trim() === ""
        ) {

            return [];

        }


        const normalizedCareer =
            career
                .trim()
                .toLowerCase();


        // ======================================
        // SOFTWARE DEVELOPER
        // ======================================

        if (
            normalizedCareer ===
            "software developer"
        ) {

            return [

                {
                    id: "software-1",
                    stepNumber: 1,
                    topic: "Programming Fundamentals",
                    description:
                        "Learn programming fundamentals and problem solving.",
                    whatToLearn:
                        "Java / Python, variables, loops, conditions, functions and OOP.",
                    duration: "2 Weeks",
                    difficulty: "Beginner",
                    resources:
                        "Java / Python documentation.",
                    miniProject:
                        "Build a Console Based Student Management System"
                },

                {
                    id: "software-2",
                    stepNumber: 2,
                    topic: "Data Structures & Algorithms",
                    description:
                        "Learn important data structures and algorithms.",
                    whatToLearn:
                        "Arrays, strings, linked list, stack, queue, sorting and searching.",
                    duration: "4 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "LeetCode and GeeksForGeeks.",
                    miniProject:
                        "Build a DSA Practice Application"
                },

                {
                    id: "software-3",
                    stepNumber: 3,
                    topic: "Database & SQL",
                    description:
                        "Learn relational databases and SQL.",
                    whatToLearn:
                        "MySQL, SELECT, INSERT, UPDATE, DELETE, JOIN and relationships.",
                    duration: "2 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "MySQL documentation.",
                    miniProject:
                        "Build a Student Database System"
                },

                {
                    id: "software-4",
                    stepNumber: 4,
                    topic: "Backend Development",
                    description:
                        "Learn backend development using Spring Boot.",
                    whatToLearn:
                        "Spring Boot, REST API, JPA, Hibernate and authentication.",
                    duration: "4 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "Spring Boot documentation.",
                    miniProject:
                        "Build a Complete Student Management REST API"
                },

                {
                    id: "software-5",
                    stepNumber: 5,
                    topic: "Full Stack Project",
                    description:
                        "Combine frontend, backend and database technologies.",
                    whatToLearn:
                        "React, Spring Boot, MySQL, REST API and authentication.",
                    duration: "5 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "React and Spring Boot documentation.",
                    miniProject:
                        "Build a Complete Student Management Portal"
                }

            ];

        }


        // ======================================
        // DATA ANALYST
        // ======================================

        if (
            normalizedCareer ===
            "data analyst"
        ) {

            return [

                {
                    id: "data-1",
                    stepNumber: 1,
                    topic: "Excel Fundamentals",
                    description:
                        "Learn Excel for data analysis.",
                    whatToLearn:
                        "Formulas, functions, sorting, filtering and charts.",
                    duration: "2 Weeks",
                    difficulty: "Beginner",
                    resources:
                        "Microsoft Excel documentation.",
                    miniProject:
                        "Create a Student Performance Dashboard"
                },

                {
                    id: "data-2",
                    stepNumber: 2,
                    topic: "SQL",
                    description:
                        "Learn SQL for extracting data.",
                    whatToLearn:
                        "SELECT, WHERE, GROUP BY, JOIN, subqueries and aggregate functions.",
                    duration: "3 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "MySQL documentation.",
                    miniProject:
                        "Build a Sales Database Analysis"
                },

                {
                    id: "data-3",
                    stepNumber: 3,
                    topic: "Python for Data Analysis",
                    description:
                        "Learn Python data analysis libraries.",
                    whatToLearn:
                        "Python, Pandas, NumPy and Matplotlib.",
                    duration: "4 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "Python and Pandas documentation.",
                    miniProject:
                        "Analyze a Student Dataset"
                },

                {
                    id: "data-4",
                    stepNumber: 4,
                    topic: "Power BI",
                    description:
                        "Learn business intelligence and visualization.",
                    whatToLearn:
                        "Power BI, dashboards, reports and data visualization.",
                    duration: "3 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "Microsoft Power BI documentation.",
                    miniProject:
                        "Build a Business Intelligence Dashboard"
                },

                {
                    id: "data-5",
                    stepNumber: 5,
                    topic: "Data Analytics Project",
                    description:
                        "Build an end-to-end analytics project.",
                    whatToLearn:
                        "Data cleaning, analysis, visualization and reporting.",
                    duration: "4 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "Kaggle datasets.",
                    miniProject:
                        "Build an End-to-End Data Analytics Project"
                }

            ];

        }


        // ======================================
        // WEB DEVELOPER
        // ======================================

        if (
            normalizedCareer ===
            "web developer"
        ) {

            return [

                {
                    id: "web-1",
                    stepNumber: 1,
                    topic: "HTML Fundamentals",
                    description:
                        "Learn how web pages are structured.",
                    whatToLearn:
                        "HTML elements, forms, tables, links and semantic HTML.",
                    duration: "1 Week",
                    difficulty: "Beginner",
                    resources:
                        "MDN Web Docs.",
                    miniProject:
                        "Build a Personal Portfolio Website"
                },

                {
                    id: "web-2",
                    stepNumber: 2,
                    topic: "CSS & Responsive Design",
                    description:
                        "Learn modern website styling.",
                    whatToLearn:
                        "CSS, Flexbox, Grid, animations and responsive design.",
                    duration: "2 Weeks",
                    difficulty: "Beginner",
                    resources:
                        "MDN Web Docs.",
                    miniProject:
                        "Build a Responsive Landing Page"
                },

                {
                    id: "web-3",
                    stepNumber: 3,
                    topic: "JavaScript",
                    description:
                        "Learn programming for interactive websites.",
                    whatToLearn:
                        "Variables, functions, arrays, objects, DOM and APIs.",
                    duration: "3 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "MDN JavaScript documentation.",
                    miniProject:
                        "Build a Weather Application"
                },

                {
                    id: "web-4",
                    stepNumber: 4,
                    topic: "React",
                    description:
                        "Learn modern frontend development.",
                    whatToLearn:
                        "Components, props, state, hooks, routing and API integration.",
                    duration: "4 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "React documentation.",
                    miniProject:
                        "Build a React Student Portal"
                },

                {
                    id: "web-5",
                    stepNumber: 5,
                    topic: "Full Stack Web Project",
                    description:
                        "Build a complete web application.",
                    whatToLearn:
                        "React, REST API, Spring Boot and MySQL.",
                    duration: "5 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "React and Spring Boot documentation.",
                    miniProject:
                        "Build a Complete Full Stack Web Application"
                }

            ];

        }


        // ======================================
        // CYBER SECURITY
        // ======================================

        if (
            normalizedCareer ===
            "cyber security specialist"
        ) {

            return [

                {
                    id: "cyber-1",
                    stepNumber: 1,
                    topic:
                        "Computer & Networking Fundamentals",
                    description:
                        "Understand how computers and networks work.",
                    whatToLearn:
                        "TCP/IP, OSI model, IP address, DNS, HTTP and ports.",
                    duration: "3 Weeks",
                    difficulty: "Beginner",
                    resources:
                        "Cisco Networking documentation.",
                    miniProject:
                        "Build a Small Network Lab"
                },

                {
                    id: "cyber-2",
                    stepNumber: 2,
                    topic:
                        "Linux Fundamentals",
                    description:
                        "Learn Linux commands and administration.",
                    whatToLearn:
                        "Linux commands, permissions, processes and shell scripting.",
                    duration: "2 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "Linux documentation.",
                    miniProject:
                        "Build a Linux Administration Lab"
                },

                {
                    id: "cyber-3",
                    stepNumber: 3,
                    topic:
                        "Cyber Security Fundamentals",
                    description:
                        "Learn core cyber security concepts.",
                    whatToLearn:
                        "CIA triad, authentication, encryption and common attacks.",
                    duration: "3 Weeks",
                    difficulty: "Intermediate",
                    resources:
                        "OWASP documentation.",
                    miniProject:
                        "Build a Security Awareness Application"
                },

                {
                    id: "cyber-4",
                    stepNumber: 4,
                    topic:
                        "Web Security",
                    description:
                        "Understand common web application vulnerabilities.",
                    whatToLearn:
                        "OWASP Top 10, authentication, authorization and secure coding.",
                    duration: "4 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "OWASP documentation.",
                    miniProject:
                        "Build a Secure Web Application"
                },

                {
                    id: "cyber-5",
                    stepNumber: 5,
                    topic:
                        "Cyber Security Project",
                    description:
                        "Create a practical security project.",
                    whatToLearn:
                        "Network monitoring, logging and security analysis.",
                    duration: "5 Weeks",
                    difficulty: "Advanced",
                    resources:
                        "OWASP and cybersecurity documentation.",
                    miniProject:
                        "Build a Basic Security Monitoring System"
                }

            ];

        }


        // ======================================
        // FALLBACK
        // ======================================

        return [

            {
                id: "fallback-1",
                stepNumber: 1,
                topic: "Career Fundamentals",
                description:
                    "Build fundamentals required for your recommended career.",
                whatToLearn:
                    "Learn programming, problem solving and basic computer concepts.",
                duration: "2 Weeks",
                difficulty: "Beginner",
                resources:
                    "Online documentation and learning resources.",
                miniProject:
                    "Build a Basic Career Related Project"
            },

            {
                id: "fallback-2",
                stepNumber: 2,
                topic: "Core Skills",
                description:
                    "Develop the core skills required for this career.",
                whatToLearn:
                    "Learn tools and technologies related to your career.",
                duration: "3 Weeks",
                difficulty: "Intermediate",
                resources:
                    "Official technology documentation.",
                miniProject:
                    "Build a Core Skills Project"
            },

            {
                id: "fallback-3",
                stepNumber: 3,
                topic: "Practical Project",
                description:
                    "Apply your knowledge through a practical project.",
                whatToLearn:
                    "Build, test and document a real-world project.",
                duration: "4 Weeks",
                difficulty: "Advanced",
                resources:
                    "Official documentation.",
                miniProject:
                    "Build a Real World Career Project"
            }

        ];

    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                // ====================================
                // USER ID
                // ====================================

                const userId =
                    localStorage.getItem(
                        "userId"
                    );


                if (!userId) {

                    showMessage(
                        "User not found. Please login again.",
                        "error"
                    );

                    setLoading(false);

                    return;

                }


                // ====================================
                // FINAL CAREER
                // ====================================

                const savedCareer =
                    getFinalCareer();


                console.log(
                    "===================================="
                );

                console.log(
                    "FINAL CAREER FROM PREDICTION:"
                );

                console.log(
                    savedCareer
                );

                console.log(
                    "===================================="
                );


                // ====================================
                // STUDENT
                // ====================================

                const student =
                    await studentService
                        .getByUserId(
                            userId
                        );


                if (
                    !student ||
                    !student.id
                ) {

                    showMessage(
                        "Complete your profile first..",
                        "error"
                    );

                    setLoading(false);

                    return;

                }


                setStudentId(
                    student.id
                );


                // ====================================
                // EXISTING CAREER ROADMAP
                // ====================================

                let roadmapData =
                    await careerRoadmapService
                        .getByStudentId(
                            student.id
                        );


                console.log(
                    "Existing Career Roadmap:",
                    roadmapData
                );


                // ====================================
                // GENERATE IF EMPTY
                // ====================================

                if (
                    !roadmapData ||
                    roadmapData.length === 0
                ) {

                    roadmapData =
                        await careerRoadmapService
                            .generate(
                                student.id
                            );


                    console.log(
                        "Generated Career Roadmap:",
                        roadmapData
                    );

                }


                // ====================================
                // VALID CAREER ROADMAP
                // ====================================

                const validRoadmap =
                    Array.isArray(
                        roadmapData
                    )
                        ? roadmapData
                        : [];


                setRoadmap(
                    validRoadmap
                );


                // ====================================
                // FINAL CAREER
                // ====================================

                let career =
                    savedCareer;


                if (
                    !career &&
                    validRoadmap.length > 0
                ) {

                    career =
                        validRoadmap[0].career ||
                        "";

                }


                if (career) {

                    setFinalCareer(
                        career
                    );

                }


                // ====================================
                // LEARNING ROADMAP
                // ====================================

                const learningData =
                    createLearningRoadmap(
                        career
                    );


                console.log(
                    "===================================="
                );

                console.log(
                    "LEARNING ROADMAP CAREER:"
                );

                console.log(
                    career
                );

                console.log(
                    "LEARNING ROADMAP:"
                );

                console.log(
                    learningData
                );

                console.log(
                    "===================================="
                );


                setLearningRoadmap(
                    learningData
                );


                // ====================================
                // CAREER ROADMAP PROGRESS
                // ====================================

                const progressData =
                    await roadmapProgressService
                        .getByStudentId(
                            student.id
                        );


                setProgress(
                    Array.isArray(
                        progressData
                    )
                        ? progressData
                        : []
                );


            } catch (error) {

                console.error(
                    "ROADMAP LOAD ERROR:",
                    error
                );


                console.error(
                    "STATUS:",
                    error.response?.status
                );


                console.error(
                    "BACKEND RESPONSE:",
                    error.response?.data
                );


                showMessage(

                    error.response?.data?.message ||

                    error.response?.data?.error ||

                    "Career roadmap is not loading.",

                    "error"

                );

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    // ==========================================
    // GENERATE ROADMAP AGAIN
    // ==========================================

    const handleGenerate = async () => {

        if (!studentId) {

            showMessage(
                "Student profile not found..",
                "error"
            );

            return;

        }


        if (generating) {

            return;

        }


        // ========================================
        // GET FINAL CAREER
        // ========================================

        const savedCareer =
            localStorage.getItem(
                "latestPredictedCareer"
            );


        if (
            !savedCareer ||
            savedCareer.trim() === ""
        ) {

            showMessage(
                "Generate a career prediction in advance.",
                "error"
            );

            return;

        }


        setGenerating(true);

        setRoadmap([]);

        setProgress([]);

        setLearningCompleted([]);


        try {

            console.log(
                "===================================="
            );

            console.log(
                "GENERATE ROADMAP AGAIN"
            );

            console.log(
                "Student ID:",
                studentId
            );

            console.log(
                "FINAL CAREER:",
                savedCareer
            );

            console.log(
                "===================================="
            );


            // ====================================
            // GENERATE CAREER ROADMAP
            // ====================================

            const newRoadmap =
                await careerRoadmapService
                    .generate(
                        studentId
                    );


            console.log(
                "NEW CAREER ROADMAP:",
                newRoadmap
            );


            if (
                !Array.isArray(
                    newRoadmap
                ) ||
                newRoadmap.length === 0
            ) {

                throw new Error(
                    "The backend returned an empty roadmap.."
                );

            }


            // ====================================
            // SET CAREER ROADMAP
            // ====================================

            setRoadmap(
                newRoadmap
            );


            // ====================================
            // KEEP AI CAREER
            // ====================================

            setFinalCareer(
                savedCareer
            );


            // ====================================
            // CREATE LEARNING ROADMAP
            // SAME CAREER
            // ====================================

            const newLearningRoadmap =
                createLearningRoadmap(
                    savedCareer
                );


            setLearningRoadmap(
                newLearningRoadmap
            );


            // ====================================
            // RESET PROGRESS
            // ====================================

            setProgress([]);

            setLearningCompleted([]);


            showMessage(
                "🎉 New Career Roadmap successfully generated!",
                "success"
            );


        } catch (error) {

            console.error(
                "ROADMAP GENERATE ERROR:",
                error
            );


            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );


            showMessage(

                error.response?.data?.message ||

                error.response?.data?.error ||

                error.message ||

                "The roadmap is not being generated..",

                "error"

            );


        } finally {

            setGenerating(false);

        }

    };


    // ==========================================
    // CAREER ROADMAP CHECK
    // ==========================================

    const isCompleted = (
        roadmapId
    ) => {

        const item =
            progress.find(
                (p) =>
                    Number(
                        p.roadmapId
                    ) ===
                    Number(
                        roadmapId
                    )
            );


        return item?.completed === true;

    };


    // ==========================================
    // LEARNING ROADMAP CHECK
    // ==========================================

    const isLearningCompleted = (
        learningId
    ) => {

        return learningCompleted.includes(
            String(
                learningId
            )
        );

    };


    // ==========================================
    // MARK CAREER ROADMAP COMPLETE
    // ==========================================

    const handleComplete = async (
        roadmapId
    ) => {

        if (!studentId) {

            showMessage(
                "The student didn't get ID",
                "error"
            );

            return;

        }


        const currentStatus =
            isCompleted(
                roadmapId
            );


        const newStatus =
            !currentStatus;


        try {

            const savedProgress =
                await roadmapProgressService
                    .updateProgress(

                        studentId,

                        roadmapId,

                        newStatus

                    );


            setProgress(
                (previousProgress) => {

                    const exists =
                        previousProgress.some(
                            (item) =>
                                Number(
                                    item.roadmapId
                                ) ===
                                Number(
                                    roadmapId
                                )
                        );


                    if (exists) {

                        return previousProgress.map(
                            (item) =>

                                Number(
                                    item.roadmapId
                                ) ===
                                Number(
                                    roadmapId
                                )

                                    ? savedProgress

                                    : item
                        );

                    }


                    return [

                        ...previousProgress,

                        savedProgress

                    ];

                }
            );


            showMessage(

                newStatus

                    ? "Step completed and saved! ✓"

                    : "Step marked incomplete.",

                "success"

            );


        } catch (error) {

            console.error(
                "PROGRESS SAVE ERROR:",
                error
            );


            showMessage(

                error.response?.data?.message ||

                error.response?.data?.error ||

                "Progress isn't saving..",

                "error"

            );

        }

    };


    // ==========================================
    // MARK LEARNING ROADMAP COMPLETE
    // ==========================================

    const handleLearningComplete = (
        learningId
    ) => {

        const id =
            String(
                learningId
            );


        const alreadyCompleted =
            learningCompleted.includes(
                id
            );


        setLearningCompleted(
            (previous) => {

                if (
                    previous.includes(
                        id
                    )
                ) {

                    return previous.filter(
                        (item) =>
                            item !== id
                    );

                }


                return [

                    ...previous,

                    id

                ];

            }
        );


        showMessage(

            alreadyCompleted

                ? "Learning step marked incomplete."

                : "Learning step completed! ✓",

            "success"

        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="page-container">

                <div className="form-card">

                    <h2>
                        Loading Career Roadmap...
                    </h2>

                </div>

            </div>

        );

    }


    // ==========================================
    // CAREER ROADMAP COMPLETED STEPS
    // ==========================================

    const completedSteps =
        roadmap.filter(
            (item) =>
                isCompleted(
                    item.id
                )
        ).length;


    // ==========================================
    // CAREER ROADMAP PROGRESS
    // ==========================================

    const progressPercentage =

        roadmap.length === 0

            ? 0

            : Math.round(

                (
                    completedSteps /
                    roadmap.length
                ) * 100

            );


    // ==========================================
    // LEARNING COMPLETED STEPS
    // ==========================================

    const learningCompletedSteps =
        learningRoadmap.filter(
            (item) =>
                isLearningCompleted(
                    item.id
                )
        ).length;


    // ==========================================
    // LEARNING PROGRESS
    // ==========================================

    const learningProgressPercentage =

        learningRoadmap.length === 0

            ? 0

            : Math.round(

                (
                    learningCompletedSteps /
                    learningRoadmap.length
                ) * 100

            );


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="page-container">


            {/* ==================================== */}
            {/* HEADER */}
            {/* ==================================== */}

            <div className="page-header">

                <h1>
                    🗺️ Career Roadmap
                </h1>

                <p>
                   A personalized roadmap based on your recommended career.
                </p>

            </div>


            {/* ==================================== */}
            {/* MESSAGE */}
            {/* ==================================== */}

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


            {/* ==================================== */}
            {/* CAREER HEADER */}
            {/* ==================================== */}

            <div
                className="profile-completion-card"
                style={{
                    marginBottom: "25px"
                }}
            >

                <div>

                    <h2>

                        🎯{" "}

                        {
                            finalCareer ||
                            "Career Roadmap"
                        }

                    </h2>


                    <p>

                        Your personalized learning path based on career predictions.

                    </p>

                </div>


                <div className="completion-circle">

                    <span>
                        {progressPercentage}%
                    </span>

                </div>

            </div>


            {/* ==================================== */}
            {/* LEARNING ROADMAP PROGRESS */}
            {/* ==================================== */}

            <div
                className="form-card"
                style={{
                    marginTop: "25px",
                    marginBottom: "25px"
                }}
            >

                <h2>
                    📚 Learning Progress
                </h2>


                <p>

                    {learningCompletedSteps} of{" "}
                    {learningRoadmap.length} learning steps completed

                </p>


                <div
                    style={{
                        width: "100%",
                        height: "12px",
                        background: "#e5e7eb",
                        borderRadius: "20px",
                        overflow: "hidden",
                        marginTop: "15px"
                    }}
                >

                    <div
                        style={{
                            width:
                                `${learningProgressPercentage}%`,
                            height: "100%",
                            background:
                                "linear-gradient(90deg,#22c55e,#16a34a)",
                            transition:
                                "width 0.3s ease"
                        }}
                    />

                </div>


                <h3
                    style={{
                        marginTop: "15px"
                    }}
                >

                    {learningProgressPercentage}%
                    {" "}Complete

                </h3>

            </div>


            {/* ==================================== */}
            {/* LEARNING ROADMAP */}
            {/* ==================================== */}

            <div className="form-card">

                <h2>
                    🚀 Learning Roadmap
                </h2>


                <p
                    style={{
                        color: "#64748b",
                        marginTop: "10px"
                    }}
                >

                    Learning path for{" "}

                    <strong>
                        {finalCareer}
                    </strong>

                </p>


                {learningRoadmap.length === 0 ? (

                    <p>
                        A learning roadmap is not available.
                    </p>

                ) : (

                    <div
                        style={{
                            marginTop: "25px"
                        }}
                    >

                        {learningRoadmap.map(
                            (step) => {

                                const completed =
                                    isLearningCompleted(
                                        step.id
                                    );


                                return (

                                    <div
                                        key={step.id}
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            marginBottom: "20px"
                                        }}
                                    >

                                        {/* ================================= */}
                                        {/* LEARNING STEP NUMBER */}
                                        {/* ================================= */}

                                        <div
                                            style={{
                                                minWidth: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",

                                                background:
                                                    completed
                                                        ? "#22c55e"
                                                        : "#6366f1",

                                                color: "white",
                                                fontWeight: "bold",
                                                fontSize: "18px",

                                                transition:
                                                    "all 0.3s ease"
                                            }}
                                        >

                                            {completed

                                                ? "✓"

                                                : step.stepNumber

                                            }

                                        </div>


                                        {/* ================================= */}
                                        {/* LEARNING CONTENT */}
                                        {/* ================================= */}

                                        <div
                                            style={{
                                                flex: 1,
                                                padding: "20px",
                                                borderRadius: "14px",

                                                border:
                                                    completed
                                                        ? "2px solid #22c55e"
                                                        : "1px solid #e5e7eb",

                                                background:
                                                    completed
                                                        ? "#f0fdf4"
                                                        : "#f8f9ff",

                                                transition:
                                                    "all 0.3s ease"
                                            }}
                                        >

                                            {/* TOPIC */}

                                            <h3
                                                style={{
                                                    marginTop: 0,

                                                    textDecoration:
                                                        completed
                                                            ? "line-through"
                                                            : "none",

                                                    color:
                                                        completed
                                                            ? "#15803d"
                                                            : "#0f172a"
                                                }}
                                            >

                                                {step.topic}

                                            </h3>


                                            {/* DESCRIPTION */}

                                            <p>
                                                {step.description}
                                            </p>


                                            {/* WHAT TO LEARN */}

                                            {step.whatToLearn && (

                                                <div>

                                                    <strong>
                                                        📚 What to learn:
                                                    </strong>

                                                    <p>
                                                        {step.whatToLearn}
                                                    </p>

                                                </div>

                                            )}


                                            {/* DURATION */}

                                            {step.duration && (

                                                <p>

                                                    ⏱️{" "}

                                                    <strong>
                                                        Duration:
                                                    </strong>{" "}

                                                    {step.duration}

                                                </p>

                                            )}


                                            {/* DIFFICULTY */}

                                            {step.difficulty && (

                                                <p>

                                                    🎯{" "}

                                                    <strong>
                                                        Difficulty:
                                                    </strong>{" "}

                                                    {step.difficulty}

                                                </p>

                                            )}


                                            {/* RESOURCES */}

                                            {step.resources && (

                                                <div>

                                                    <strong>
                                                        🔗 Resources:
                                                    </strong>

                                                    <p>
                                                        {step.resources}
                                                    </p>

                                                </div>

                                            )}


                                            {/* MINI PROJECT */}

                                            {step.miniProject && (

                                                <div>

                                                    <strong>
                                                        💻 Mini Project:
                                                    </strong>

                                                    <p>
                                                        {step.miniProject}
                                                    </p>

                                                </div>

                                            )}


                                            {/* ================================= */}
                                            {/* COMPLETE BUTTON */}
                                            {/* ================================= */}

                                            <button
                                                type="button"
                                                className="main-button"
                                                onClick={() =>
                                                    handleLearningComplete(
                                                        step.id
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    minHeight: "55px",
                                                    fontSize: "17px",
                                                    marginTop: "15px",

                                                    background:
                                                        completed
                                                            ? "#22c55e"
                                                            : "linear-gradient(90deg,#6366f1,#8b5cf6)"
                                                }}
                                            >

                                                {completed

                                                    ? "✓ Completed - Mark Incomplete"

                                                    : "Mark Complete ✓"

                                                }

                                            </button>

                                        </div>

                                    </div>

                                );

                            }

                        )}

                    </div>

                )}

            </div>


            {/* ==================================== */}
            {/* GENERATE AGAIN */}
            {/* ==================================== */}

            <div
                style={{
                    marginTop: "25px",
                    marginBottom: "30px"
                }}
            >

                <button
                    type="button"
                    className="main-button"
                    onClick={handleGenerate}
                    disabled={generating}
                    style={{
                        width: "100%",
                        minHeight: "60px",
                        fontSize: "18px"
                    }}
                >

                    {generating

                        ? "🤖 Generating New Roadmap..."

                        : "🔄 Generate Roadmap Again"

                    }

                </button>

            </div>


        </div>

    );

}


export default CareerRoadmap;