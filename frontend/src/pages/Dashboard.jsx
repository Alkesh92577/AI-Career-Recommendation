import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import studentService from "../services/studentService";
import interestAssessmentService from "../services/interestAssessmentService";

// =====================================================
// API
// =====================================================

const PREDICTION_API =
  "http://ai-career-recommendation-production.up.railway.app/api/predictions";

// =====================================================
// COMPONENT
// =====================================================

function Dashboard() {

  const navigate = useNavigate();

  // =====================================================
  // USER DATA
  // =====================================================

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  // =====================================================
  // INTEREST TEST RESULT
  // =====================================================

  const [interestResult, setInterestResult] =
    useState(null);

  // =====================================================
  // AI PREDICTION RESULT
  // =====================================================

  const [predictionResult, setPredictionResult] =
    useState(null);

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const [dashboardData, setDashboardData] =
    useState({

      studentId: null,

      studentName: "Student",

      profileCompletion: 0,

      skillsCount: 0,

      recommendedCareer: "Not Generated",

      confidence: 0,

      totalRoadmapSteps: 0,

      completedRoadmapSteps: 0,

      roadmapProgress: 0

    });

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = () => {

    return localStorage.getItem(
      "userId"
    );

  };

  // =====================================================
  // GET LATEST AI PREDICTION
  // =====================================================

  const loadLatestPrediction = async (
    studentId
  ) => {

    try {

      console.log(
        "===================================="
      );

      console.log(
        "LOADING AI PREDICTION"
      );

      console.log(
        "STUDENT ID:",
        studentId
      );

      console.log(
        "===================================="
      );

      // =================================================
      // STEP 1
      // CHECK LOCALSTORAGE FIRST
      // =================================================
      //
      // Prediction.jsx me:
      //
      // localStorage.setItem(
      //     "latestPrediction",
      //     JSON.stringify(finalPrediction)
      // );
      //
      // Isliye Dashboard pehle wahi exact result
      // read karega.
      //
      // =================================================

      const savedPrediction =
        localStorage.getItem(
          "latestPrediction"
        );

      if (savedPrediction) {

        try {

          const parsedPrediction =
            JSON.parse(
              savedPrediction
            );

          console.log(
            "LOCALSTORAGE AI PREDICTION:",
            parsedPrediction
          );

          // =================================================
          // CAREER
          // =================================================

          const localCareer =
            parsedPrediction.recommendedCareer ||
            parsedPrediction.career ||
            parsedPrediction.predictedCareer ||
            parsedPrediction.careerName ||
            "";

          // =================================================
          // CONFIDENCE
          // =================================================

          let localConfidence =
            parsedPrediction.confidence;

          if (
            localConfidence !== null &&
            localConfidence !== undefined &&
            localConfidence !== ""
          ) {

            localConfidence =
              Number(
                localConfidence
              );

            // Backend / AI agar 0.465 format me de

            if (
              localConfidence > 0 &&
              localConfidence <= 1
            ) {

              localConfidence =
                localConfidence * 100;

            }

            localConfidence =
              Math.round(
                localConfidence * 100
              ) / 100;

          } else {

            localConfidence = 0;

          }

          // =================================================
          // VALID LOCAL RESULT
          // =================================================

          if (
            localCareer &&
            String(
              localCareer
            ).trim() !== ""
          ) {

            const finalLocalPrediction = {

              id:
                parsedPrediction.id ||
                null,

              recommendedCareer:
                String(
                  localCareer
                ).trim(),

              confidence:
                localConfidence,

              reason:
                parsedPrediction.reason ||
                "",

              createdAt:
                parsedPrediction.createdAt ||
                null

            };

            console.log(
              "===================================="
            );

            console.log(
              "USING EXACT AI RESULT FROM LOCALSTORAGE"
            );

            console.log(
              "CAREER:",
              finalLocalPrediction.recommendedCareer
            );

            console.log(
              "CONFIDENCE:",
              finalLocalPrediction.confidence
            );

            console.log(
              "===================================="
            );

            setPredictionResult(
              finalLocalPrediction
            );

            // =================================================
            // IMPORTANT
            // =================================================
            //
            // LocalStorage ka latest result mil gaya.
            // Backend ke purane result ko use nahi karna.
            //
            // =================================================

            return;

          }

        } catch (localError) {

          console.error(
            "LOCALSTORAGE PREDICTION PARSE ERROR:",
            localError
          );

        }

      }

      // =================================================
      // STEP 2
      // LOCALSTORAGE RESULT NAHI MILA
      // BACKEND SE LOAD KARO
      // =================================================

      console.log(
        "LocalStorage prediction not found."
      );

      console.log(
        "Backend prediction is loading..."
      );

      const response =
        await axios.get(
          `${PREDICTION_API}/student/${studentId}`
        );

      let predictions =
        response.data;

      console.log(
        "ALL AI PREDICTIONS FROM BACKEND:",
        predictions
      );

      // =================================================
      // ARRAY / OBJECT CHECK
      // =================================================

      if (
        Array.isArray(
          predictions
        )
      ) {

        // Already array

      } else if (
        predictions &&
        typeof predictions === "object"
      ) {

        // Single prediction object

        predictions = [
          predictions
        ];

      } else {

        predictions = [];

      }

      // =================================================
      // NO PREDICTION
      // =================================================

      if (
        predictions.length === 0
      ) {

        console.log(
          "AI Prediction is not available.."
        );

        setPredictionResult(
          null
        );

        return;

      }

      // =================================================
      // SORT BY ID
      // =================================================
      //
      // Higher ID = latest database record
      //
      // =================================================

      const sortedPredictions =
        [...predictions].sort(
          (a, b) =>
            Number(
              b.id || 0
            ) -
            Number(
              a.id || 0
            )
        );

      // =================================================
      // LATEST BACKEND PREDICTION
      // =================================================

      const latestPrediction =
        sortedPredictions[0];

      console.log(
        "LATEST BACKEND AI PREDICTION:",
        latestPrediction
      );

      // =================================================
      // CAREER
      // =================================================

      const career =
        latestPrediction.recommendedCareer ||
        latestPrediction.career ||
        latestPrediction.predictedCareer ||
        latestPrediction.careerName ||
        "";

      // =================================================
      // NO CAREER
      // =================================================

      if (
        !career ||
        String(
          career
        ).trim() === ""
      ) {

        console.log(
          "Didn't find a career in backend prediction.."
        );

        setPredictionResult(
          null
        );

        return;

      }

      // =================================================
      // CONFIDENCE
      // =================================================

      let confidence =
        latestPrediction.confidence;

      if (
        confidence !== null &&
        confidence !== undefined &&
        confidence !== ""
      ) {

        confidence =
          Number(
            confidence
          );

        // Example:
        // 0.465 -> 46.5

        if (
          confidence > 0 &&
          confidence <= 1
        ) {

          confidence =
            confidence * 100;

        }

        confidence =
          Math.round(
            confidence * 100
          ) / 100;

      } else {

        confidence = 0;

      }

      // =================================================
      // FINAL BACKEND RESULT
      // =================================================

      const finalPrediction = {

        id:
          latestPrediction.id,

        recommendedCareer:
          String(
            career
          ).trim(),

        confidence,

        reason:
          latestPrediction.reason ||
          "",

        createdAt:
          latestPrediction.createdAt ||
          null

      };

      // =================================================
      // SAVE IN STATE
      // =================================================

      setPredictionResult(
        finalPrediction
      );

      // =================================================
      // ALSO SAVE IN LOCALSTORAGE
      // =================================================

      localStorage.setItem(
        "latestPrediction",
        JSON.stringify(
          finalPrediction
        )
      );

      localStorage.setItem(
        "latestPredictedCareer",
        finalPrediction.recommendedCareer
      );

      localStorage.setItem(
        "recommendedCareer",
        finalPrediction.recommendedCareer
      );

      console.log(
        "===================================="
      );

      console.log(
        "FINAL DASHBOARD AI CAREER:"
      );

      console.log(
        finalPrediction.recommendedCareer
      );

      console.log(
        "FINAL DASHBOARD AI CONFIDENCE:"
      );

      console.log(
        finalPrediction.confidence
      );

      console.log(
        "===================================="
      );

    } catch (error) {

      console.error(
        "AI PREDICTION LOAD ERROR:",
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

      // =================================================
      // STEP 3
      // BACKEND ERROR HO JAYE TO LOCALSTORAGE
      // DOBARA FALLBACK
      // =================================================

      try {

        const savedPrediction =
          localStorage.getItem(
            "latestPrediction"
          );

        if (savedPrediction) {

          const parsed =
            JSON.parse(
              savedPrediction
            );

          const career =
            parsed.recommendedCareer ||
            parsed.career ||
            parsed.predictedCareer ||
            "";

          if (career) {

            let confidence =
              Number(
                parsed.confidence || 0
              );

            if (
              confidence > 0 &&
              confidence <= 1
            ) {

              confidence =
                confidence * 100;

            }

            const fallbackPrediction = {

              id:
                parsed.id ||
                null,

              recommendedCareer:
                String(
                  career
                ).trim(),

              confidence:
                Math.round(
                  confidence * 100
                ) / 100,

              reason:
                parsed.reason ||
                "",

              createdAt:
                parsed.createdAt ||
                null

            };

            setPredictionResult(
              fallbackPrediction
            );

            console.log(
              "LOCALSTORAGE FALLBACK RESULT:",
              fallbackPrediction
            );

            return;

          }

        }

      } catch (
        fallbackError
      ) {

        console.error(
          "PREDICTION FALLBACK ERROR:",
          fallbackError
        );

      }

      setPredictionResult(
        null
      );

    }

  };

  // =====================================================
  // GET INTEREST TEST
  // =====================================================

  const loadInterestResult = async (
    studentId
  ) => {

    try {

      const assessmentData =
        await interestAssessmentService
          .getByStudentId(
            studentId
          );

      console.log(
        "INTEREST TEST DATA:",
        assessmentData
      );

      if (
        !Array.isArray(
          assessmentData
        ) ||
        assessmentData.length === 0
      ) {

        setInterestResult(
          null
        );

        return;

      }

      // =================================================
      // GROUP ATTEMPTS
      // =================================================

      const groupedAttempts = {};

      assessmentData.forEach(
        (item) => {

          const attemptId =
            item.attemptId ||
            "OLD-ATTEMPT";

          if (
            !groupedAttempts[
              attemptId
            ]
          ) {

            groupedAttempts[
              attemptId
            ] = [];

          }

          groupedAttempts[
            attemptId
          ].push(item);

        }
      );

      // =================================================
      // SORT ATTEMPTS
      // =================================================

      const attemptEntries =
        Object.entries(
          groupedAttempts
        );

      attemptEntries.sort(
        (
          [, a],
          [, b]
        ) => {

          const maxA =
            Math.max(
              ...a.map(
                (item) =>
                  Number(
                    item.id || 0
                  )
              )
            );

          const maxB =
            Math.max(
              ...b.map(
                (item) =>
                  Number(
                    item.id || 0
                  )
              )
            );

          return (
            maxB - maxA
          );

        }
      );

      const latestAttempt =
        attemptEntries[0];

      if (
        !latestAttempt
      ) {

        setInterestResult(
          null
        );

        return;

      }

      const [
        attemptId,
        attemptData
      ] = latestAttempt;

      // =================================================
      // CATEGORY COUNT
      // =================================================

      const categoryCounts = {};

      attemptData.forEach(
        (item) => {

          const category =
            item.careerCategory;

          if (!category) {

            return;

          }

          categoryCounts[
            category
          ] =
            (
              categoryCounts[
                category
              ] || 0
            ) + 1;

        }
      );

      // =================================================
      // STRONGEST CATEGORY
      // =================================================

      let strongestCategory =
        "";

      let highestScore = 0;

      Object.entries(
        categoryCounts
      ).forEach(
        (
          [
            category,
            score
          ]
        ) => {

          if (
            score >
            highestScore
          ) {

            highestScore =
              score;

            strongestCategory =
              category;

          }

        }
      );

      // =================================================
      // INTEREST CAREER MAP
      // =================================================

      const careerMap = {

        Technology: {

          career:
            "Software Developer",

          icon:
            "💻"

        },

        Data: {

          career:
            "Data Analyst",

          icon:
            "📊"

        },

        Web: {

          career:
            "Web Developer",

          icon:
            "🌐"

        },

        "Cyber Security": {

          career:
            "Cyber Security Specialist",

          icon:
            "🔐"

        }

      };

      const careerInfo =
        careerMap[
          strongestCategory
        ];

      if (
        !careerInfo
      ) {

        setInterestResult({

          attemptId,

          category:
            strongestCategory ||
            "Not Available",

          career:
            strongestCategory ||
            "Not Available",

          icon:
            "🧠",

          score:
            highestScore

        });

        return;

      }

      // =================================================
      // SAVE INTEREST RESULT
      // =================================================

      setInterestResult({

        attemptId,

        category:
          strongestCategory,

        career:
          careerInfo.career,

        icon:
          careerInfo.icon,

        score:
          highestScore

      });

    } catch (error) {

      console.error(
        "INTEREST TEST LOAD ERROR:",
        error
      );

      setInterestResult(
        null
      );

    }

  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard =
      async () => {

        const storedUserId =
          getUserId();

        const storedUserName =
          localStorage.getItem(
            "userName"
          );

        const storedUserEmail =
          localStorage.getItem(
            "userEmail"
          );

        const storedUserRole =
          localStorage.getItem(
            "userRole"
          );

        setUserName(
          storedUserName ||
          "Student"
        );

        setUserEmail(
          storedUserEmail ||
          ""
        );

        setUserRole(
          storedUserRole ||
          "STUDENT"
        );

        // =================================================
        // USER ID CHECK
        // =================================================

        if (!storedUserId) {

          console.error(
            "User ID not found.."
          );

          setLoading(
            false
          );

          return;

        }

        try {

          // =================================================
          // STEP 1
          // GET STUDENT
          // =================================================

          const student =
            await studentService
              .getByUserId(
                storedUserId
              );

          console.log(
            "STUDENT PROFILE:",
            student
          );

          if (
            !student ||
            !student.id
          ) {

            console.error(
              "The student didn't get ID"
            );

            setLoading(
              false
            );

            return;

          }

          const studentId =
            student.id;

          console.log(
            "ACTUAL STUDENT ID:",
            studentId
          );

          // =================================================
          // STEP 2
          // DASHBOARD API
          // =================================================

          try {

            const response =
              await axios.get(
                `http://ai-career-recommendation-production.up.railway.app/api/dashboard/${studentId}`
              );

            console.log(
              "DASHBOARD API RESPONSE:",
              response.data
            );

            setDashboardData({

              studentId:
                response.data.studentId ??
                studentId,

              studentName:
                response.data.studentName ||
                student.fullName ||
                "Student",

              profileCompletion:
                response.data.profileCompletion ??
                0,

              skillsCount:
                response.data.skillsCount ??
                0,

              recommendedCareer:
                response.data.recommendedCareer ||
                "Not Generated",

              confidence:
                response.data.confidence ??
                0,

              totalRoadmapSteps:
                response.data.totalRoadmapSteps ??
                0,

              completedRoadmapSteps:
                response.data.completedRoadmapSteps ??
                0,

              roadmapProgress:
                response.data.roadmapProgress ??
                0

            });

            setUserName(
              response.data.studentName ||
              student.fullName ||
              storedUserName ||
              "Student"
            );

          } catch (
            dashboardError
          ) {

            console.error(
              "DASHBOARD API ERROR:",
              dashboardError
            );

          }

          // =================================================
          // STEP 3
          // LOAD REAL AI PREDICTION
          // =================================================

          await loadLatestPrediction(
            studentId
          );

          // =================================================
          // STEP 4
          // LOAD INTEREST TEST
          // =================================================

          await loadInterestResult(
            studentId
          );

        } catch (error) {

          console.error(
            "DASHBOARD ERROR:",
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

        } finally {

          setLoading(
            false
          );

        }

      };

    loadDashboard();

  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "studentId"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userEmail"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login"
    );

  };

  // =====================================================
  // USER INITIAL
  // =====================================================

  const userInitial =
    userName &&
    userName.length > 0
      ? userName
          .charAt(0)
          .toUpperCase()
      : "S";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading Dashboard...
          </h2>

        </div>

      </div>

    );

  }

  // =====================================================
  // AI CAREER
  // =====================================================

  const aiCareer =
    predictionResult
      ?.recommendedCareer ||
    "";

  const aiConfidence =
    predictionResult
      ?.confidence ??
    0;

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="dashboard-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="dashboard-sidebar">

        {/* LOGO */}

        <div className="dashboard-logo">

          <div className="logo-icon">
            ✦
          </div>

          <div>

            <h2>
              CareerAI
            </h2>

            <span>
              Career Assistant
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          <div className="nav-section-title">
            MAIN
          </div>

          <button
            className="dashboard-nav-item active"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >

            <span>
              ⌂
            </span>

            Dashboard

          </button>

          <div className="nav-section-title">
            MY PROFILE
          </div>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >

            <span>
              ◉
            </span>

            My Profile

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/academic-details"
              )
            }
          >

            <span>
              ◉
            </span>

            Academic Details

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/skills"
              )
            }
          >

            <span>
              ◉
            </span>

            Skills

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/interest-assessment"
              )
            }
          >

            <span>
              🧠
            </span>

            Interest Test

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/skill-assessment"
              )
            }
          >

            <span>
              📊
            </span>

            Skill Assessment

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/ai-prediction"
              )
            }
          >

            <span>
              ✦
            </span>

            AI Prediction

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/career-roadmap"
              )
            }
          >

            <span>
              🛣️
            </span>

            Career Roadmap

          </button>

          <div className="nav-section-title">
            RESOURCES
          </div>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/courses"
              )
            }
          >

            <span>
              ▤
            </span>

            Recommended Courses

          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/career-report"
              )
            }
          >

            <span>
              📄
            </span>

            Report

          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={
              handleLogout
            }
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        {/* NAVBAR */}

        <header className="dashboard-navbar">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, {userName}! Let's build your career future.
            </p>

          </div>

          <div className="navbar-right">

            <div className="navbar-user">

              <div className="avatar">
                👤
              </div>

              <div>

                <h3>
                  {userName}
                </h3>

                <p>
                  Career Explorer
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="dashboard-content-new">

          {/* =================================================
              WELCOME CARD
          ================================================= */}

          <div className="welcome-card">

            <div className="welcome-content">

              <span className="welcome-badge">
                ✦ AI Career Assistant
              </span>

              <h2>

                Discover the career

                <br />

                that's right for you.

              </h2>

              <p>

                Complete your profile and take our interest
                assessment to get personalized career
                recommendations powered by AI.

              </p>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  navigate(
                    "/ai-prediction"
                  )
                }
              >

                {predictionResult
                  ? "View AI Prediction"
                  : "Generate AI Prediction"}

                <span>
                  →
                </span>

              </button>

            </div>

            <div className="welcome-visual">

              <div className="ai-circle">

                <div className="ai-inner">
                  ✦
                </div>

              </div>

              <div className="floating-card card-one">
                💻 Software
              </div>

              <div className="floating-card card-two">
                📊 Data
              </div>

              <div className="floating-card card-three">
                🎨 Design
              </div>

            </div>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="dashboard-stats">

            {/* PROFILE */}

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-card-icon purple">
                  ◉
                </div>

                <span className="stat-status">
                  Profile
                </span>

              </div>

              <h3>
                Profile Completion
              </h3>

              <div className="progress-wrapper">

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${dashboardData.profileCompletion}%`
                    }}
                  >
                  </div>

                </div>

                <strong>
                  {dashboardData.profileCompletion}%
                </strong>

              </div>

              <p>
                Complete your profile to improve recommendations.
              </p>

            </div>

            {/* SKILLS */}

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-card-icon blue">
                  ◆
                </div>

                <span className="stat-status">
                  SKILLS
                </span>

              </div>

              <h3>
                Skills Added
              </h3>

              <div className="big-stat">

                {dashboardData.skillsCount}

              </div>

              <p>
                Add your technical and soft skills.
              </p>

            </div>

            {/* =================================================
                INTEREST TEST
            ================================================= */}

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-card-icon orange">
                  ☑
                </div>

                <span className="stat-status">
                  ASSESSMENT
                </span>

              </div>

              <h3>
                Interest Test
              </h3>

              {interestResult ? (

                <>

                  <div
                    className="big-stat"
                    style={{
                      fontSize:
                        "22px"
                    }}
                  >

                    <span>
                      ✓ Completed
                    </span>

                  </div>

                  <p>

                    <strong
                      style={{
                        color:
                          "#172554",
                        fontWeight:
                          "700"
                      }}
                    >

                      {interestResult.icon}{" "}
                      {interestResult.career}

                    </strong>

                    <br />

                    <span
                      style={{
                        color:
                          "#64748b"
                      }}
                    >

                      Interest:
                      {" "}
                      {interestResult.category}

                    </span>

                  </p>

                </>

              ) : (

                <>

                  <div className="big-stat">

                    <span className="not-started">
                      Not Started
                    </span>

                  </div>

                  <p>
                    Take the test to discover your interests.
                  </p>

                </>

              )}

            </div>

            {/* =================================================
                AI CAREER PREDICTION
            ================================================= */}

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-card-icon green">
                  ✦
                </div>

                <span className="stat-status">
                  AI
                </span>

              </div>

              <h3>
                Career Prediction
              </h3>

              {predictionResult ? (

                <>

                  <div
                    className="big-stat"
                    style={{
                      fontSize:
                        "22px",
                      color:
                        "#172554",
                      fontWeight:
                        "700"
                    }}
                  >

                    {aiCareer}

                  </div>

                  <p>

                    AI Confidence:
                    {" "}

                    <strong>
                      {aiConfidence}%
                    </strong>

                  </p>

                </>

              ) : (

                <>

                  <div className="big-stat">

                    —

                  </div>

                  <p>
                    Generate AI prediction to see your career.
                  </p>

                </>

              )}

            </div>

          </div>

          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="dashboard-grid-bottom">

            {/* PROFILE TASKS */}

            <div className="dashboard-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Complete Your Profile
                  </h2>

                  <p>
                    A complete profile gives better AI recommendations.
                  </p>

                </div>

                <span className="panel-icon">
                  ✦
                </span>

              </div>

              <div className="profile-tasks">

                {/* PERSONAL */}

                <div className="profile-task">

                  <div className="task-icon">
                    01
                  </div>

                  <div className="task-content">

                    <h3>
                      Personal Information
                    </h3>

                    <p>
                      Add your basic profile information.
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        "/profile"
                      )
                    }
                  >

                    Complete →

                  </button>

                </div>

                {/* ACADEMIC */}

                <div className="profile-task">

                  <div className="task-icon">
                    02
                  </div>

                  <div className="task-content">

                    <h3>
                      Academic Details
                    </h3>

                    <p>
                      Add marks, education and academic information.
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        "/academic-details"
                      )
                    }
                  >

                    Add →

                  </button>

                </div>

                {/* SKILLS */}

                <div className="profile-task">

                  <div className="task-icon">
                    03
                  </div>

                  <div className="task-content">

                    <h3>
                      Your Skills
                    </h3>

                    <p>
                      Add programming and technical skills.
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        "/skills"
                      )
                    }
                  >

                    Add →

                  </button>

                </div>

              </div>

            </div>

            {/* =================================================
                AI RECOMMENDATION
            ================================================= */}

            <div className="dashboard-panel ai-panel">

              <div className="ai-panel-icon">
                ✦
              </div>

              <span className="ai-label">
                AI CAREER ENGINE
              </span>

              <h2>

                Your Career

                <br />

                Recommendation

              </h2>

              {predictionResult ? (

                <>

                  <p>

                    Based on your profile, academic details,
                    skills and assessment, our AI recommends:

                  </p>

                  {/* =================================================
                      AI PREDICTION CARD
                  ================================================= */}

                  <div
                    className="locked-prediction"
                    style={{
                      background:
                        "#ffffff",

                      color:
                        "#172554",

                      border:
                        "1px solid #ddd6fe",

                      borderRadius:
                        "16px",

                      padding:
                        "18px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "15px",

                      boxShadow:
                        "0 8px 25px rgba(15, 23, 42, 0.12)"
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          "30px",

                        flexShrink:
                          0
                      }}
                    >
                      🤖
                    </span>

                    <div>

                      <strong
                        style={{
                          color:
                            "#172554",

                          display:
                            "block",

                          fontSize:
                            "18px",

                          fontWeight:
                            "700",

                          lineHeight:
                            "1.4"
                        }}
                      >

                        {aiCareer}

                      </strong>

                    </div>

                  </div>

                  {/* =================================================
                      AI REASON
                  ================================================= */}



                </>

              ) : (

                <>

                  <p>

                    Your personalized AI career prediction
                    will appear here after generating your
                    AI prediction.

                  </p>

                  <div className="locked-prediction">

                    <span>
                      🔒
                    </span>

                    <div>

                      <strong>
                        Prediction Not Generated
                      </strong>

                      <small>
                        Generate your AI prediction first.
                      </small>

                    </div>

                  </div>

                  <button
                    className="secondary-dashboard-button"
                    onClick={() =>
                      navigate(
                        "/ai-prediction"
                      )
                    }
                  >

                    Generate AI Prediction →

                  </button>

                </>

              )}

            </div>

          </div>

          {/* =================================================
              CAREER JOURNEY
          ================================================= */}

          <div className="next-section">

            <div className="next-heading">

              <div>

                <h2>
                  Your Career Journey
                </h2>

                <p>
                  Follow these steps to get your AI-powered career recommendation.
                </p>

              </div>

            </div>

            <div className="journey-grid">

              {/* STEP 1 */}

              <div className="journey-card active-step">

                <div className="journey-number">
                  1
                </div>

                <h3>
                  Complete Profile
                </h3>

                <p>
                  Tell us about yourself.
                </p>

                <span>
                  Current Step
                </span>

              </div>

              <div className="journey-line">
              </div>

              {/* STEP 2 */}

              <div className="journey-card">

                <div className="journey-number">
                  2
                </div>

                <h3>
                  Add Skills
                </h3>

                <p>
                  Add your technical skills.
                </p>

              </div>

              <div className="journey-line">
              </div>

              {/* STEP 3 */}

              <div className="journey-card">

                <div className="journey-number">
                  3
                </div>

                <h3>
                  Interest Test
                </h3>

                <p>

                  {interestResult
                    ? `✓ ${interestResult.career}`
                    : "Discover your interests."
                  }

                </p>

              </div>

              <div className="journey-line">
              </div>

              {/* STEP 4 */}

              <div className="journey-card">

                <div className="journey-number">
                  4
                </div>

                <h3>
                  AI Prediction
                </h3>

                <p>

                  {predictionResult
                    ? predictionResult.recommendedCareer
                    : "Get your ideal career."
                  }

                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>

  );

}

export default Dashboard;