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
    // CATEGORY SCORES
    // =====================================================

    const [categoryScores, setCategoryScores] = useState({
        technology_score: 0,
        data_score: 0,
        web_score: 0,
        cyber_security_score: 0
    });

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
    // CONFIDENCE HELPER
    // =====================================================

    const normalizeConfidence = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }

        let confidence = Number(value);

        if (Number.isNaN(confidence)) {
            return 0;
        }

        // If backend sends 0.85 -> 85%
        if (
            confidence > 0 &&
            confidence <= 1
        ) {
            confidence = confidence * 100;
        }

        // Keep confidence between 0 and 100
        confidence = Math.max(
            0,
            Math.min(100, confidence)
        );

        return Number(
            confidence.toFixed(2)
        );
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

        // preferredCareer
        if (
            typeof data.preferredCareer === "string" &&
            data.preferredCareer.trim() !== ""
        ) {
            return data.preferredCareer.trim();
        }

        // strongestCareer object
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
                return String(
                    careerField
                ).trim();
            }

            const career =
                data.strongestCareer.career ||
                data.strongestCareer.name ||
                "";

            if (
                String(career).trim() !== ""
            ) {
                return String(
                    career
                ).trim();
            }
        }

        // strongestCareer string
        if (
            typeof data.strongestCareer === "string" &&
            data.strongestCareer.trim() !== ""
        ) {
            return data.strongestCareer.trim();
        }

        // careerField
        if (
            typeof data.careerField === "string" &&
            data.careerField.trim() !== ""
        ) {
            return data.careerField.trim();
        }

        // career
        if (
            typeof data.career === "string" &&
            data.career.trim() !== ""
        ) {
            return data.career.trim();
        }

        // careerName
        if (
            typeof data.careerName === "string" &&
            data.careerName.trim() !== ""
        ) {
            return data.careerName.trim();
        }

        // recommendedCareer
        if (
            typeof data.recommendedCareer === "string" &&
            data.recommendedCareer.trim() !== ""
        ) {
            return data.recommendedCareer.trim();
        }

        // predictedCareer
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
    // GET AI CAREER FROM RESULT
    // =====================================================

    const getAICareerFromResult = (
        result,
        fallbackCareer = ""
    ) => {
        if (!result) {
            return fallbackCareer;
        }

        if (
            typeof result.recommendedCareer === "string" &&
            result.recommendedCareer.trim() !== ""
        ) {
            return result.recommendedCareer.trim();
        }

        if (
            typeof result.career === "string" &&
            result.career.trim() !== ""
        ) {
            return result.career.trim();
        }

        if (
            typeof result.predictedCareer === "string" &&
            result.predictedCareer.trim() !== ""
        ) {
            return result.predictedCareer.trim();
        }

        if (
            typeof result.careerName === "string" &&
            result.careerName.trim() !== ""
        ) {
            return result.careerName.trim();
        }

        if (
            typeof result.strongestCareer === "string" &&
            result.strongestCareer.trim() !== ""
        ) {
            return result.strongestCareer.trim();
        }

        if (
            result.strongestCareer &&
            typeof result.strongestCareer === "object"
        ) {
            const career =
                result.strongestCareer.careerField ||
                result.strongestCareer.career ||
                result.strongestCareer.name ||
                "";

            if (
                String(career).trim() !== ""
            ) {
                return String(
                    career
                ).trim();
            }
        }

        return fallbackCareer;
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
    // GET CATEGORY SCORES
    // =====================================================

    const getSavedCategoryScores = () => {
        const defaultScores = {
            technology_score: 0,
            data_score: 0,
            web_score: 0,
            cyber_security_score: 0
        };

        try {
            // ---------------------------------------------
            // SOURCE 1
            // ---------------------------------------------

            const savedCategoryScores =
                localStorage.getItem(
                    "latestSkillAssessmentCategoryScores"
                );

            if (savedCategoryScores) {
                const parsed =
                    JSON.parse(
                        savedCategoryScores
                    );

                return {
                    technology_score:
                        toNumber(
                            parsed?.technology_score
                        ),

                    data_score:
                        toNumber(
                            parsed?.data_score
                        ),

                    web_score:
                        toNumber(
                            parsed?.web_score
                        ),

                    cyber_security_score:
                        toNumber(
                            parsed?.cyber_security_score
                        )
                };
            }

            // ---------------------------------------------
            // SOURCE 2
            // ---------------------------------------------

            const savedResult =
                getSavedSkillAssessmentResult();

            if (
                savedResult &&
                savedResult.categoryScores
            ) {
                const scores =
                    savedResult.categoryScores;

                return {
                    technology_score:
                        toNumber(
                            scores?.technology_score
                        ),

                    data_score:
                        toNumber(
                            scores?.data_score
                        ),

                    web_score:
                        toNumber(
                            scores?.web_score
                        ),

                    cyber_security_score:
                        toNumber(
                            scores?.cyber_security_score
                        )
                };
            }

            // ---------------------------------------------
            // SOURCE 3
            // ---------------------------------------------

            if (savedResult) {
                return {
                    technology_score:
                        toNumber(
                            savedResult.technology_score
                        ),

                    data_score:
                        toNumber(
                            savedResult.data_score
                        ),

                    web_score:
                        toNumber(
                            savedResult.web_score
                        ),

                    cyber_security_score:
                        toNumber(
                            savedResult.cyber_security_score
                        )
                };
            }
        } catch (error) {
            console.error(
                "CATEGORY SCORE READ ERROR:",
                error
            );
        }

        return defaultScores;
    };

    // =====================================================
    // GET EXACT SKILL ASSESSMENT CAREER
    // =====================================================

    const getExactSkillAssessmentCareer = (
        assessmentData
    ) => {
        // First localStorage
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

        // Then backend assessment
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
    // GET CAREER FROM CATEGORY SCORES
    // =====================================================
    //
    // IMPORTANT:
    // Skill Assessment category is the PRIMARY source.
    //
    // Technology       -> Software Developer
    // Data             -> Data Analyst
    // Web              -> Web Developer
    // Cyber Security   -> Cyber Security Specialist
    //
    // =====================================================

    const getCareerFromCategoryScores = (scores) => {
        if (!scores) {
            return "";
        }

        const normalizedScores = {
            technology:
                toNumber(
                    scores.technology_score
                ),

            data:
                toNumber(
                    scores.data_score
                ),

            web:
                toNumber(
                    scores.web_score
                ),

            cyber_security:
                toNumber(
                    scores.cyber_security_score
                )
        };

        const strongestCategory =
            Object.keys(
                normalizedScores
            ).reduce(
                (best, current) => {
                    return normalizedScores[current] >
                        normalizedScores[best]
                        ? current
                        : best;
                },
                "technology"
            );

        const strongestScore =
            normalizedScores[
                strongestCategory
            ];

        if (strongestScore <= 0) {
            return "";
        }

        const categoryCareers = {
            technology:
                "Software Developer",

            data:
                "Data Analyst",

            web:
                "Web Developer",

            cyber_security:
                "Cyber Security Specialist"
        };

        return (
            categoryCareers[
                strongestCategory
            ] || ""
        );
    };

    // =====================================================
    // GET STRONGEST CATEGORY
    // =====================================================

    const getStrongestCategoryFromScores = (
        scores
    ) => {
        if (!scores) {
            return {
                category: "",
                score: 0
            };
        }

        const normalizedScores = {
            technology:
                toNumber(
                    scores.technology_score
                ),

            data:
                toNumber(
                    scores.data_score
                ),

            web:
                toNumber(
                    scores.web_score
                ),

            cyber_security:
                toNumber(
                    scores.cyber_security_score
                )
        };

        const strongestCategory =
            Object.keys(
                normalizedScores
            ).reduce(
                (best, current) => {
                    return normalizedScores[current] >
                        normalizedScores[best]
                        ? current
                        : best;
                },
                "technology"
            );

        return {
            category:
                strongestCategory,

            score:
                normalizedScores[
                    strongestCategory
                ]
        };
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
                        "Student profile not found.",
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
                // CATEGORY SCORES
                // =========================================

                const savedCategoryScores =
                    getSavedCategoryScores();

                setCategoryScores(
                    savedCategoryScores
                );

                console.log(
                    "===================================="
                );

                console.log(
                    "📊 SAVED CATEGORY SCORES:"
                );

                console.log(
                    savedCategoryScores
                );

                console.log(
                    "===================================="
                );

                // =========================================
                // SKILL ASSESSMENT CAREER
                // =========================================

                const skillAssessmentCareer =
                    getExactSkillAssessmentCareer(
                        assessmentData
                    );

                console.log(
                    "SKILL ASSESSMENT CAREER:",
                    skillAssessmentCareer
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
                    } else if (
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
                // SET INTEREST RESULT
                // =========================================
                //
                // For this project the Skill Assessment
                // career is used as the preferred career.
                //
                // =========================================

                setInterestResult({
                    category:
                        interestCategory,

                    career:
                        skillAssessmentCareer,

                    course:
                        course
                });
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

                        if (
                            lower === "beginner"
                        ) {
                            level = 1;
                        } else if (
                            lower === "intermediate"
                        ) {
                            level = 2;
                        } else if (
                            lower === "advanced"
                        ) {
                            level = 3;
                        }
                    }

                    return (
                        sum +
                        toNumber(level)
                    );
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

                        return (
                            maxB -
                            maxA
                        );
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

        // ================================================
        // SKILL ASSESSMENT CAREER
        // ================================================

        const preferredCareer =
            interestResult?.career;

        if (
            !preferredCareer ||
            preferredCareer === "Not Available"
        ) {
            showMessage(
                "Didn't find a career in skill assessment.",
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
            // SKILL SCORE
            // ==========================================

            const skillScore =
                calculateSkillScore();

            // ==========================================
            // ASSESSMENT SCORE
            // ==========================================

            const assessmentScore =
                calculateAssessmentScore();

            // ==========================================
            // CATEGORY SCORES
            // ==========================================

            const latestCategoryScores =
                getSavedCategoryScores();

            setCategoryScores(
                latestCategoryScores
            );

            // ==========================================
            // DATA SENT TO BACKEND
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
                    assessmentScore,

                // ======================================
                // INDIVIDUAL SKILLS
                // ======================================

                skills:
                    Array.isArray(skills)
                        ? skills.map(
                            skill => ({
                                skillName:
                                    skill.skillName ||
                                    skill.name ||
                                    "",

                                level:
                                    typeof skill.level === "string"
                                        ? (
                                            skill.level.toLowerCase() === "beginner"
                                                ? 1
                                                : skill.level.toLowerCase() === "intermediate"
                                                    ? 2
                                                    : skill.level.toLowerCase() === "advanced"
                                                        ? 3
                                                        : toNumber(
                                                            skill.level
                                                        )
                                        )
                                        : toNumber(
                                            skill.level
                                        )
                            })
                        )
                        : [],

                // ======================================
                // CATEGORY SCORES
                // ======================================

                technologyScore:
                    latestCategoryScores
                        .technology_score,

                dataScore:
                    latestCategoryScores
                        .data_score,

                webScore:
                    latestCategoryScores
                        .web_score,

                cyberSecurityScore:
                    latestCategoryScores
                        .cyber_security_score
            };

            // ==========================================
            // DEBUG REQUEST
            // ==========================================

            console.log(
                "===================================="
            );

            console.log(
                "📤 DATA SENT TO AI BACKEND:"
            );

            console.log(
                JSON.stringify(
                    predictionData,
                    null,
                    2
                )
            );

            console.log(
                "📊 CATEGORY SCORES:"
            );

            console.log(
                "Technology:",
                predictionData.technologyScore
            );

            console.log(
                "Data:",
                predictionData.dataScore
            );

            console.log(
                "Web:",
                predictionData.webScore
            );

            console.log(
                "Cyber Security:",
                predictionData.cyberSecurityScore
            );

            console.log(
                "===================================="
            );

            // ==========================================
            // CALL AI BACKEND
            // ==========================================

            const result =
                await predictionService.predict(
                    predictionData
                );

            // ==========================================
            // DEBUG RESPONSE
            // ==========================================

            console.log(
                "===================================="
            );

            console.log(
                "🤖 ACTUAL AI BACKEND RESULT:"
            );

            console.log(
                JSON.stringify(
                    result,
                    null,
                    2
                )
            );

            console.log(
                "===================================="
            );

            // ==========================================
            // BACKEND AI CAREER
            // ==========================================

            const aiCareer =
                getAICareerFromResult(
                    result
                );

            // ==========================================
            // CATEGORY CAREER
            // ==========================================
            //
            // THIS IS THE IMPORTANT PART.
            //
            // Skill Assessment category score has
            // priority over backend AI/ML result.
            //
            // Example:
            //
            // Technology = 100
            // Data = 0
            // Web = 0
            // Cyber Security = 0
            //
            // categoryCareer =
            // Software Developer
            //
            // Even if backend says:
            // Cyber Security Specialist
            //
            // finalCareer will remain:
            // Software Developer
            //
            // ==========================================

            const categoryCareer =
                getCareerFromCategoryScores(
                    latestCategoryScores
                );

            const strongestCategoryData =
                getStrongestCategoryFromScores(
                    latestCategoryScores
                );

            // ==========================================
            // FINAL CAREER
            // ==========================================
            //
            // PRIORITY:
            //
            // 1. Skill Assessment Category
            // 2. Backend AI result
            // 3. Skill Assessment career
            //
            // ==========================================

            const finalCareer =
                categoryCareer ||
                aiCareer ||
                preferredCareer;

            // ==========================================
            // VALIDATION
            // ==========================================

            if (
                !finalCareer ||
                finalCareer.trim() === ""
            ) {
                showMessage(
                    "AI prediction did not return a career.",
                    "error"
                );

                return;
            }

            // ==========================================
            // FINAL CONFIDENCE
            // ==========================================
            //
            // Category score is also primary for
            // confidence when available.
            //
            // ==========================================

            const finalConfidence =
                strongestCategoryData.score > 0
                    ? Number(
                        strongestCategoryData.score.toFixed(2)
                    )
                    : normalizeConfidence(
                        result?.confidence
                    );

            // ==========================================
            // FINAL PREDICTION OBJECT
            // ==========================================

            const finalPrediction = {
                ...result,

                // --------------------------------------
                // FINAL CAREER
                // --------------------------------------

                recommendedCareer:
                    finalCareer,

                career:
                    finalCareer,

                predictedCareer:
                    finalCareer,

                // --------------------------------------
                // CONFIDENCE
                // --------------------------------------

                confidence:
                    finalConfidence,

                // --------------------------------------
                // CATEGORY SCORES
                // --------------------------------------

                technology_score:
                    latestCategoryScores
                        .technology_score,

                data_score:
                    latestCategoryScores
                        .data_score,

                web_score:
                    latestCategoryScores
                        .web_score,

                cyber_security_score:
                    latestCategoryScores
                        .cyber_security_score,

                // --------------------------------------
                // REASON
                // --------------------------------------

                reason:
                    categoryCareer
                        ? `Your Skill Assessment shows ${strongestCategoryData.score}% strength in the ${strongestCategoryData.category.replace("_", " ")} category, so ${finalCareer} is recommended.`
                        : (
                            result?.reason ||
                            "Career recommendation generated using your profile, academic performance, skills, assessment and interests."
                        ),

                // --------------------------------------
                // PREDICTION SOURCE
                // --------------------------------------

                predictionSource:
                    categoryCareer
                        ? "skill_assessment_category"
                        : (
                            result?.predictionSource ||
                            "machine_learning_model"
                        ),

                // --------------------------------------
                // STRONGEST CATEGORY
                // --------------------------------------

                strongestCategory:
                    strongestCategoryData.category ||
                    result?.strongestCategory ||
                    "",

                // --------------------------------------
                // STRONGEST CATEGORY SCORE
                // --------------------------------------

                strongestCategoryScore:
                    strongestCategoryData.score > 0
                        ? strongestCategoryData.score
                        : (
                            result?.strongestCategoryScore ??
                            null
                        ),

                // --------------------------------------
                // CREATED AT
                // --------------------------------------

                createdAt:
                    result?.createdAt ||
                    new Date().toISOString()
            };

            // ==========================================
            // SAVE LATEST PREDICTION
            // ==========================================

            localStorage.setItem(
                "latestPrediction",
                JSON.stringify(
                    finalPrediction
                )
            );

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
            // SAVE CATEGORY SCORES
            // ==========================================

            localStorage.setItem(
                "latestSkillAssessmentCategoryScores",
                JSON.stringify(
                    latestCategoryScores
                )
            );

            // ==========================================
            // SHOW RESULT
            // ==========================================

            setPrediction(
                finalPrediction
            );

            // ==========================================
            // DEBUG FINAL
            // ==========================================

            console.log(
                "===================================="
            );

            console.log(
                "🎯 FINAL AI CAREER:"
            );

            console.log(
                finalCareer
            );

            console.log(
                "🔍 DEBUG FINAL CAREER DATA:"
            );

            console.log(
                JSON.stringify(
                    {
                        aiCareer,
                        categoryCareer,
                        preferredCareer,
                        finalCareer,

                        backendCareer:
                            result?.career,

                        backendRecommendedCareer:
                            result?.recommendedCareer,

                        backendPredictionSource:
                            result?.predictionSource,

                        backendStrongestCategory:
                            result?.strongestCategory,

                        backendStrongestCategoryScore:
                            result?.strongestCategoryScore,

                        backendSkillMatchScore:
                            result?.skillMatchScore,

                        backendSkillCareer:
                            result?.skillCareer
                    },
                    null,
                    2
                )
            );

            console.log(
                "📊 FINAL AI CONFIDENCE:"
            );

            console.log(
                finalConfidence + "%"
            );

            console.log(
                "📊 CATEGORY SCORES:"
            );

            console.log(
                latestCategoryScores
            );

            console.log(
                "💾 SAVED latestPrediction:"
            );

            console.log(
                JSON.parse(
                    localStorage.getItem(
                        "latestPrediction"
                    )
                )
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

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="page-header">
                <h1>
                    🤖 AI Career Prediction
                </h1>

                <p>
                    It will recommend a career based on your profile, academic details, skills, assessments, and interests.
                </p>
            </div>

            {/* ================================================= */}
            {/* MESSAGE */}
            {/* ================================================= */}

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

            {/* ================================================= */}
            {/* YOUR DATA */}
            {/* ================================================= */}

            <div className="form-card">

                <h2>
                    📊 Your Data
                </h2>

                <div className="form-grid">

                    {/* Programming Level */}
                    <div>
                        <label>
                            Programming Level
                        </label>

                        <p>
                            {programmingLevel}
                        </p>
                    </div>

                    {/* Preferred Career */}
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

                    {/* 10th */}
                    <div>
                        <label>
                            10th Marks
                        </label>

                        <p>
                            {realStudentData.tenthMarks}%
                        </p>
                    </div>

                    {/* 12th */}
                    <div>
                        <label>
                            12th Marks
                        </label>

                        <p>
                            {realStudentData.twelfthMarks}%
                        </p>
                    </div>

                    {/* Graduation */}
                    <div>
                        <label>
                            Graduation Marks
                        </label>

                        <p>
                            {realStudentData.graduationMarks}%
                        </p>
                    </div>

                    {/* Semester */}
                    <div>
                        <label>
                            Semester
                        </label>

                        <p>
                            {realStudentData.semester}
                        </p>
                    </div>

                    {/* Backlogs */}
                    <div>
                        <label>
                            Backlogs
                        </label>

                        <p>
                            {realStudentData.backlogs}
                        </p>
                    </div>

                    {/* Assessment */}
                    <div>
                        <label>
                            Latest Assessment Score
                        </label>

                        <p>
                            {assessmentScore}%
                        </p>
                    </div>

                </div>

                {/* ================================================= */}
                {/* CATEGORY SCORES */}
                {/* ================================================= */}

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <h3>
                        📊 Skill Assessment Category Scores
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "12px",
                            marginTop: "15px"
                        }}
                    >

                        {/* Technology */}
                        <div
                            style={{
                                padding: "15px",
                                borderRadius: "12px",
                                background: "#f8f9ff"
                            }}
                        >
                            <strong>
                                Technology
                            </strong>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    marginTop: "5px"
                                }}
                            >
                                {
                                    categoryScores
                                        .technology_score
                                }%
                            </div>
                        </div>

                        {/* Data */}
                        <div
                            style={{
                                padding: "15px",
                                borderRadius: "12px",
                                background: "#f8f9ff"
                            }}
                        >
                            <strong>
                                Data
                            </strong>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    marginTop: "5px"
                                }}
                            >
                                {
                                    categoryScores
                                        .data_score
                                }%
                            </div>
                        </div>

                        {/* Web */}
                        <div
                            style={{
                                padding: "15px",
                                borderRadius: "12px",
                                background: "#f8f9ff"
                            }}
                        >
                            <strong>
                                Web Development
                            </strong>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    marginTop: "5px"
                                }}
                            >
                                {
                                    categoryScores
                                        .web_score
                                }%
                            </div>
                        </div>

                        {/* Cyber Security */}
                        <div
                            style={{
                                padding: "15px",
                                borderRadius: "12px",
                                background: "#f8f9ff"
                            }}
                        >
                            <strong>
                                Cyber Security
                            </strong>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    marginTop: "5px"
                                }}
                            >
                                {
                                    categoryScores
                                        .cyber_security_score
                                }%
                            </div>
                        </div>

                    </div>
                </div>

                {/* ================================================= */}
                {/* WARNING */}
                {/* ================================================= */}

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
                        ⚠️ Saved career for Skill Assessment not found.
                    </div>
                )}

                {/* ================================================= */}
                {/* PREDICT BUTTON */}
                {/* ================================================= */}

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

            {/* ================================================= */}
            {/* RESULT */}
            {/* ================================================= */}

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

                    {/* ================================================= */}
                    {/* FINAL CAREER */}
                    {/* ================================================= */}

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

                    {/* ================================================= */}
                    {/* AI DETAILS */}
                    {/* ================================================= */}

                    {(
                        prediction.strongestCategory ||
                        prediction.predictionSource ||
                        prediction.mlCareer
                    ) && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "18px",
                                borderRadius: "12px",
                                background: "#f8f9ff",
                                textAlign: "left"
                            }}
                        >

                            <h3>
                                🤖 AI Analysis
                            </h3>

                            {prediction.mlCareer && (
                                <p>
                                    <strong>
                                        ML Model Career:
                                    </strong>{" "}
                                    {prediction.mlCareer}
                                </p>
                            )}

                            {prediction.strongestCategory && (
                                <p>
                                    <strong>
                                        Strongest Assessment Category:
                                    </strong>{" "}
                                    {prediction.strongestCategory}
                                </p>
                            )}

                            {prediction.strongestCategoryScore != null && (
                                <p>
                                    <strong>
                                        Category Score:
                                    </strong>{" "}
                                    {prediction.strongestCategoryScore}%
                                </p>
                            )}

                            {prediction.predictionSource && (
                                <p>
                                    <strong>
                                        Prediction Source:
                                    </strong>{" "}
                                    {prediction.predictionSource}
                                </p>
                            )}

                        </div>
                    )}

                    {/* ================================================= */}
                    {/* REASON */}
                    {/* ================================================= */}

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

                    {/* ================================================= */}
                    {/* ROADMAP */}
                    {/* ================================================= */}

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