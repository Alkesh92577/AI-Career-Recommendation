import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import studentService from "../services/studentService";
import skillService from "../services/skillService";
import interestAssessmentService from "../services/interestAssessmentService";

import { getBestCareer } from "../utils/careerRecommendation";

const API_BASE =
  "http://ai-career-recommendation-production.up.railway.app/api";

const PREDICTION_API = `${API_BASE}/predictions`;
const DASHBOARD_API = `${API_BASE}/dashboard`;

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Student");
  const [interestResult, setInterestResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  // ==========================================================
  // SKILL BASED CAREER RECOMMENDATION
  // ==========================================================

  const [skillCareerResult, setSkillCareerResult] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    studentId: null,
    studentName: "Student",
    profileCompletion: 0,
    skillsCount: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const goToPage = (path) => {
    navigate(path);
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
  };

  const isFilled = (value) =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  // ==========================================================
  // PROFILE COMPLETION
  // ==========================================================

  const calculateProfileCompletion = (student) => {
    if (!student) return 0;

    const fields = [
      student.fullName ?? student.name ?? student.studentName,
      student.email ?? student.emailAddress,
      student.programmingKnowledge,
      student.preferredField,
      student.education,
      student.experience,
    ];

    return Math.round(
      (fields.filter(isFilled).length / 6) * 100
    );
  };

  // ==========================================================
  // CONFIDENCE
  // ==========================================================

  const normalizeConfidence = (value) => {
    let confidence = toNumber(value);

    if (confidence > 0 && confidence <= 1) {
      confidence *= 100;
    }

    return Math.round(confidence * 100) / 100;
  };

  // ==========================================================
  // LOAD LATEST AI PREDICTION
  // ==========================================================

  const loadLatestPrediction = async (studentId) => {
  try {
    // =====================================================
    // FIRST: CHECK CURRENT SKILL ASSESSMENT CATEGORY SCORES
    // =====================================================

    let categoryScores = null;

    try {
      const savedCategoryScores = localStorage.getItem(
        "latestSkillAssessmentCategoryScores"
      );

      if (savedCategoryScores) {
        categoryScores = JSON.parse(savedCategoryScores);
      }
    } catch (error) {
      console.error(
        "CATEGORY SCORE READ ERROR:",
        error
      );
    }

    // =====================================================
    // GET STRONGEST CATEGORY
    // =====================================================

    if (categoryScores) {
      const technology = toNumber(
        categoryScores.technology_score
      );

      const data = toNumber(
        categoryScores.data_score
      );

      const web = toNumber(
        categoryScores.web_score
      );

      const cyberSecurity = toNumber(
        categoryScores.cyber_security_score
      );

      const scores = [
        {
          category: "technology",
          score: technology,
          career: "Software Developer",
        },
        {
          category: "data",
          score: data,
          career: "Data Analyst",
        },
        {
          category: "web",
          score: web,
          career: "Web Developer",
        },
        {
          category: "cyber_security",
          score: cyberSecurity,
          career: "Cyber Security Specialist",
        },
      ];

      const strongestCategory = scores.reduce(
        (best, current) =>
          current.score > best.score
            ? current
            : best,
        scores[0]
      );

      // ===================================================
      // CURRENT ASSESSMENT HAS A VALID SCORE
      // ===================================================

      if (strongestCategory.score > 0) {
        const currentPrediction = {
          recommendedCareer:
            strongestCategory.career,

          confidence:
            strongestCategory.score,

          strongestCategory:
            strongestCategory.category,

          strongestCategoryScore:
            strongestCategory.score,

          predictionSource:
            "skill_assessment_category",
        };

        setPredictionResult(
          currentPrediction
        );

        // Update localStorage so old prediction
        // cannot remain visible on dashboard.
        localStorage.setItem(
          "latestPrediction",
          JSON.stringify(currentPrediction)
        );

        return;
      }
    }

    // =====================================================
    // SECOND: CHECK SAVED LATEST PREDICTION
    // =====================================================

    const savedPrediction =
      localStorage.getItem("latestPrediction");

    if (savedPrediction) {
      try {
        const parsed =
          JSON.parse(savedPrediction);

        const career =
          parsed.recommendedCareer ||
          parsed.career ||
          parsed.predictedCareer ||
          parsed.careerName ||
          "";

        if (String(career).trim()) {
          setPredictionResult({
            recommendedCareer:
              String(career).trim(),

            confidence:
              normalizeConfidence(
                parsed.confidence
              ),
          });

          return;
        }
      } catch (error) {
        console.error(
          "LOCAL PREDICTION ERROR:",
          error
        );
      }
    }

    // =====================================================
    // THIRD: GET PREDICTION FROM BACKEND
    // =====================================================

    const response = await axios.get(
      `${PREDICTION_API}/student/${studentId}`
    );

    let predictions = response.data;

    if (!Array.isArray(predictions)) {
      predictions = predictions
        ? [predictions]
        : [];
    }

    if (predictions.length === 0) {
      setPredictionResult(null);
      return;
    }

    const latest = [...predictions].sort(
      (a, b) =>
        toNumber(b.id) -
        toNumber(a.id)
    )[0];

    const career =
      latest.recommendedCareer ||
      latest.career ||
      latest.predictedCareer ||
      latest.careerName ||
      "";

    if (!String(career).trim()) {
      setPredictionResult(null);
      return;
    }

    const finalPrediction = {
      recommendedCareer:
        String(career).trim(),

      confidence:
        normalizeConfidence(
          latest.confidence
        ),
    };

    setPredictionResult(
      finalPrediction
    );

    localStorage.setItem(
      "latestPrediction",
      JSON.stringify(
        finalPrediction
      )
    );
  } catch (error) {
    console.error(
      "AI PREDICTION ERROR:",
      error
    );

    setPredictionResult(null);
  }
};

  // ==========================================================
  // LOAD INTEREST TEST
  // ==========================================================

  const loadInterestResult = async (studentId) => {
    try {
      const assessmentData =
        await interestAssessmentService.getByStudentId(
          studentId
        );

      if (
        !Array.isArray(assessmentData) ||
        assessmentData.length === 0
      ) {
        setInterestResult(null);
        return;
      }

      const groupedAttempts = {};

      assessmentData.forEach((item) => {
        const attemptId =
          item.attemptId || "OLD-ATTEMPT";

        if (!groupedAttempts[attemptId]) {
          groupedAttempts[attemptId] = [];
        }

        groupedAttempts[attemptId].push(item);
      });

      const latestAttempt = Object.entries(
        groupedAttempts
      ).sort(([, a], [, b]) => {
        const maxA = Math.max(
          ...a.map((item) => toNumber(item.id))
        );

        const maxB = Math.max(
          ...b.map((item) => toNumber(item.id))
        );

        return maxB - maxA;
      })[0];

      if (!latestAttempt) {
        setInterestResult(null);
        return;
      }

      const [, attemptData] = latestAttempt;

      const categoryCounts = {};

      attemptData.forEach((item) => {
        const category = item.careerCategory;

        if (!category) return;

        categoryCounts[category] =
          (categoryCounts[category] || 0) + 1;
      });

      const strongestCategory = Object.entries(
        categoryCounts
      ).sort(([, a], [, b]) => b - a)[0]?.[0];

      const careerMap = {
        Technology: {
          career: "Software Developer",
          icon: "💻",
        },

        Data: {
          career: "Data Analyst",
          icon: "📊",
        },

        Web: {
          career: "Web Developer",
          icon: "🌐",
        },

        "Cyber Security": {
          career: "Cyber Security Specialist",
          icon: "🔐",
        },
      };

      const careerInfo =
        careerMap[strongestCategory] || {
          career:
            strongestCategory || "Not Available",
          icon: "🧠",
        };

      setInterestResult({
        category:
          strongestCategory || "Not Available",

        career: careerInfo.career,

        icon: careerInfo.icon,
      });
    } catch (error) {
      console.error(
        "INTEREST TEST ERROR:",
        error
      );

      setInterestResult(null);
    }
  };

  // ==========================================================
  // LOAD SKILL CAREER RECOMMENDATION
  // ==========================================================

  const loadSkillCareerRecommendation = (
    skills
  ) => {
    try {
      if (!Array.isArray(skills) || skills.length === 0) {
        setSkillCareerResult(null);
        return;
      }

      const bestCareer = getBestCareer(skills);

      if (!bestCareer) {
        setSkillCareerResult(null);
        return;
      }

      setSkillCareerResult(bestCareer);

      // Save latest skill recommendation
      localStorage.setItem(
        "latestSkillCareerRecommendation",
        JSON.stringify(bestCareer)
      );
    } catch (error) {
      console.error(
        "SKILL CAREER RECOMMENDATION ERROR:",
        error
      );

      setSkillCareerResult(null);
    }
  };

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      const userId =
        localStorage.getItem("userId");

      const storedUserName =
        localStorage.getItem("userName") ||
        "Student";

      setUserName(storedUserName);

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // ------------------------------------------------------
        // STUDENT
        // ------------------------------------------------------

        const student =
          await studentService.getByUserId(userId);

        if (!student?.id) {
          setLoading(false);
          return;
        }

        const studentId = student.id;

        // ------------------------------------------------------
        // LOAD SKILLS
        // ------------------------------------------------------

        const skillsPromise =
          skillService.getByStudentId(studentId);

        // ------------------------------------------------------
        // DASHBOARD API
        // ------------------------------------------------------

        const dashboardPromise = axios
          .get(`${DASHBOARD_API}/${studentId}`)
          .then((response) => response.data)
          .catch((error) => {
            console.error(
              "DASHBOARD API ERROR:",
              error
            );

            return null;
          });

        // ------------------------------------------------------
        // PARALLEL LOAD
        // ------------------------------------------------------

        const [
          skillsResponse,
          dashboardResponse,
        ] = await Promise.all([
          skillsPromise.catch((error) => {
            console.error(
              "SKILLS LOAD ERROR:",
              error
            );

            return [];
          }),

          dashboardPromise,
        ]);

        // ------------------------------------------------------
        // SKILLS
        // ------------------------------------------------------

        const skills = Array.isArray(
          skillsResponse
        )
          ? skillsResponse
          : [];

        const directSkillsCount =
          skills.length;

        // ------------------------------------------------------
        // CALCULATE SKILL CAREER
        // ------------------------------------------------------

        loadSkillCareerRecommendation(
          skills
        );

        // ------------------------------------------------------
        // PROFILE COMPLETION
        // ------------------------------------------------------

        const apiSkillsCount = toNumber(
          dashboardResponse?.skillsCount
        );

        const finalProfileCompletion =
          calculateProfileCompletion(
            student
          );

        const finalSkillsCount =
          directSkillsCount > 0
            ? directSkillsCount
            : apiSkillsCount;

        // ------------------------------------------------------
        // STUDENT NAME
        // ------------------------------------------------------

        const finalStudentName =
          dashboardResponse?.studentName ||
          student.fullName ||
          student.studentName ||
          storedUserName ||
          "Student";

        setUserName(finalStudentName);

        // ------------------------------------------------------
        // DASHBOARD STATE
        // ------------------------------------------------------

        setDashboardData({
          studentId,

          studentName:
            finalStudentName,

          profileCompletion:
            finalProfileCompletion,

          skillsCount:
            finalSkillsCount,
        });

        // ------------------------------------------------------
        // OTHER DATA
        // ------------------------------------------------------

        await Promise.all([
          loadLatestPrediction(studentId),

          loadInterestResult(studentId),
        ]);
      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading-card">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // ==========================================================
  // FINAL DATA
  // ==========================================================

  const aiCareer =
    predictionResult?.recommendedCareer || "";

  const aiConfidence =
    predictionResult?.confidence ?? 0;

  const skillCareer =
    skillCareerResult?.career || "";

  const skillMatch =
    skillCareerResult?.score ?? 0;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">

        {/* =====================================================
            NAVBAR
        ====================================================== */}

        <header className="dashboard-navbar">
          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back, {userName}! Let's build your
              career future.
            </p>
          </div>

          <div className="navbar-user">
            <div className="avatar">👤</div>

            <div>
              <h3>{userName}</h3>
              <p>Career Explorer</p>
            </div>
          </div>
        </header>

        <section className="dashboard-content-new">

          {/* ===================================================
              WELCOME CARD
          ==================================================== */}

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
                Complete your profile and take our
                interest assessment to get personalized
                career recommendations powered by AI.
              </p>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  goToPage("/ai-prediction")
                }
              >
                {predictionResult
                  ? "View AI Prediction"
                  : "Generate AI Prediction"}

                <span>→</span>
              </button>
            </div>

            <div className="welcome-visual">
              <div className="ai-circle">
                <div className="ai-inner">✦</div>
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

          {/* ===================================================
              STATS
          ==================================================== */}

          <div className="dashboard-stats">

            {/* PROFILE */}

            <div className="dashboard-stat-card">
              <div className="stat-card-top">

                <div className="stat-card-icon purple">
                  ◉
                </div>

                <span className="stat-status">
                  PROFILE
                </span>
              </div>

              <h3>Profile Completion</h3>

              <div className="progress-wrapper">

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${dashboardData.profileCompletion}%`,
                    }}
                  />

                </div>

                <strong>
                  {dashboardData.profileCompletion}%
                </strong>
              </div>

              <p>
                Complete your profile to improve
                recommendations.
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

              <h3>Skills Added</h3>

              <div className="big-stat">
                {dashboardData.skillsCount}
              </div>

              <p>
                Add your technical and soft skills.
              </p>
            </div>

            {/* INTEREST */}

            <div className="dashboard-stat-card">
              <div className="stat-card-top">

                <div className="stat-card-icon orange">
                  ☑
                </div>

                <span className="stat-status">
                  ASSESSMENT
                </span>
              </div>

              <h3>Interest Test</h3>

              {interestResult ? (
                <>
                  <div className="big-stat interest-completed">
                    ✓ Completed
                  </div>

                  <p>
                    <strong>
                      {interestResult.icon}{" "}
                      {interestResult.career}
                    </strong>

                    <br />

                    Interest:{" "}
                    {interestResult.category}
                  </p>
                </>
              ) : (
                <>
                  <div className="big-stat">
                    Not Started
                  </div>

                  <p>
                    Take the test to discover your
                    interests.
                  </p>
                </>
              )}
            </div>

            {/* AI */}

            <div className="dashboard-stat-card">
              <div className="stat-card-top">

                <div className="stat-card-icon green">
                  ✦
                </div>

                <span className="stat-status">
                  AI
                </span>
              </div>

              <h3>Career Prediction</h3>

              {predictionResult ? (
                <>
                  <div className="big-stat ai-career-text">
                    {aiCareer}
                  </div>

                  <p>
                    AI Confidence:{" "}
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
                    Generate AI prediction to see
                    your career.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ===================================================
              COMPLETE PROFILE
          ==================================================== */}

          <div className="dashboard-grid-bottom">

            <div className="dashboard-panel">

              <div className="panel-heading">
                <div>

                  <h2>
                    Complete Your Profile
                  </h2>

                  <p>
                    A complete profile gives better
                    AI recommendations.
                  </p>
                </div>

                <span className="panel-icon">
                  ✦
                </span>
              </div>

              <div className="profile-tasks">

                <div className="profile-task">

                  <div className="task-icon">
                    01
                  </div>

                  <div className="task-content">

                    <h3>
                      Personal Information
                    </h3>

                    <p>
                      Add your basic profile
                      information.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      goToPage("/profile")
                    }
                  >
                    Complete →
                  </button>
                </div>

                <div className="profile-task">

                  <div className="task-icon">
                    02
                  </div>

                  <div className="task-content">

                    <h3>
                      Academic Details
                    </h3>

                    <p>
                      Add marks, education and
                      academic information.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      goToPage(
                        "/academic-details"
                      )
                    }
                  >
                    Add →
                  </button>
                </div>

                <div className="profile-task">

                  <div className="task-icon">
                    03
                  </div>

                  <div className="task-content">

                    <h3>
                      Your Skills
                    </h3>

                    <p>
                      Add programming and technical
                      skills.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      goToPage("/skills")
                    }
                  >
                    Add →
                  </button>
                </div>

              </div>
            </div>

            {/* =================================================
                AI CAREER ENGINE
            ================================================== */}

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
                    Based on your profile, academic
                    details, skills and assessment,
                    our AI recommends:
                  </p>

                  <div className="locked-prediction">

                    <span className="prediction-robot">
                      🤖
                    </span>

                    <div>

                      <strong>
                        {aiCareer}
                      </strong>

                      <small>
                        AI Confidence:{" "}
                        {aiConfidence}%
                      </small>

                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Your personalized AI career
                    prediction will appear here after
                    generating your AI prediction.
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
                        Generate your AI prediction
                        first.
                      </small>

                    </div>
                  </div>

                  <button
                    className="secondary-dashboard-button"
                    onClick={() =>
                      goToPage(
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

          {/* ===================================================
              YOUR CAREER JOURNEY
          ==================================================== */}

          <div className="next-section">

            <div className="next-heading">

              <h2>
                Your Career Journey
              </h2>

              <p>
                Follow these steps to discover the
                career that matches your skills and
                interests.
              </p>

            </div>

            <div className="journey-grid">

              {/* =================================================
                  STEP 1
              ================================================== */}

              <div
                className={`journey-card ${
                  dashboardData.profileCompletion >= 100
                    ? "completed-step"
                    : "active-step"
                }`}
              >

                <div className="journey-number">
                  1
                </div>

                <h3>
                  Complete Profile
                </h3>

                <p>
                  {dashboardData.profileCompletion >=
                  100
                    ? "✓ Profile completed"
                    : `${dashboardData.profileCompletion}% profile completed`}
                </p>

              </div>

              <div className="journey-line" />

              {/* =================================================
                  STEP 2 - DYNAMIC SKILLS
              ================================================== */}

              <div
                className={`journey-card ${
                  dashboardData.skillsCount > 0
                    ? "completed-step"
                    : ""
                }`}
              >

                <div className="journey-number">
                  2
                </div>

                <h3>
                  Add Skills
                </h3>

                {skillCareerResult ? (
                  <div className="journey-skill-result">

                    <p>
                      Current Best Match
                    </p>

                    <strong>
                      {skillCareer}
                    </strong>

                    <span>
                      Skill Match:{" "}
                      {skillMatch}%
                    </span>

                  </div>
                ) : (
                  <p>
                    Add your technical skills to
                    discover suitable careers.
                  </p>
                )}

              </div>

              <div className="journey-line" />

              {/* =================================================
                  STEP 3
              ================================================== */}

              <div
                className={`journey-card ${
                  interestResult
                    ? "completed-step"
                    : ""
                }`}
              >

                <div className="journey-number">
                  3
                </div>

                <h3>
                  Interest Test
                </h3>

                <p>
                  {interestResult
                    ? `✓ ${interestResult.career}`
                    : "Discover your interests."}
                </p>

              </div>

              <div className="journey-line" />

              {/* =================================================
                  STEP 4
              ================================================== */}

              <div
                className={`journey-card ${
                  predictionResult
                    ? "completed-step"
                    : ""
                }`}
              >

                <div className="journey-number">
                  4
                </div>

                <h3>
                  AI Prediction
                </h3>

                <p>
                  {predictionResult
                    ? predictionResult.recommendedCareer
                    : "Get your ideal career."}
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