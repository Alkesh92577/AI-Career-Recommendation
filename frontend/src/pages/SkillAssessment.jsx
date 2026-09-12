import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import studentService from "../services/studentService";
import skillAssessmentService from "../services/skillAssessmentService";
import assessmentQuestionService from "../services/assessmentQuestionService";
import skillService from "../services/skillService";

function SkillAssessment() {

  const navigate = useNavigate();


  // =========================================================
  // QUESTIONS
  // =========================================================

  const [questions, setQuestions] = useState([]);


  // =========================================================
  // ANSWERS
  // =========================================================

  const [answers, setAnswers] = useState({});


  // =========================================================
  // STUDENT ID
  // =========================================================

  const [studentId, setStudentId] = useState(null);


  // =========================================================
  // STUDENT SKILLS
  // =========================================================

  const [studentSkills, setStudentSkills] = useState([]);


  // =========================================================
  // SCORE
  // =========================================================

  const [score, setScore] = useState(null);


  // =========================================================
  // RESULT DATA
  // =========================================================

  const [resultData, setResultData] = useState([]);


  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(true);


  // =========================================================
  // SAVING
  // =========================================================

  const [saving, setSaving] = useState(false);


  // =========================================================
  // MESSAGE
  // =========================================================

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");


  // =========================================================
  // GET USER ID
  // =========================================================

  const getUserId = () => {

    return localStorage.getItem("userId");

  };


  // =========================================================
  // SHOW MESSAGE
  // =========================================================

  const showMessage = (text, type) => {

    setMessage(text);

    setMessageType(type);

    setTimeout(() => {

      setMessage("");

      setMessageType("");

    }, 3000);

  };


  // =========================================================
  // NORMALIZE NAME
  // =========================================================

  const normalizeName = (value) => {

    if (!value) {
      return "";
    }

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  };


  // =========================================================
  // GET STUDENT SKILL NAME
  // =========================================================

  const getStudentSkillName = (skill) => {

    if (!skill) {
      return "";
    }

    return (
      skill.skillName ||
      skill.name ||
      skill.skill ||
      ""
    );

  };


  // =========================================================
  // GET QUESTION COURSE NAME
  // =========================================================

  const getQuestionCourseName = (question) => {

    if (!question) {
      return "";
    }

    return (
      question.courseName ||
      question.skillName ||
      question.skill ||
      ""
    );

  };


  // =========================================================
  // IMPORTANT:
  // SKILL -> POSSIBLE COURSE NAMES
  //
  // Java:
  // Java
  // Java Programming
  //
  // Python:
  // Python
  // Python Programming
  //
  // Isse database me agar kisi jagah
  // Java ya Java Programming ho,
  // dono support honge.
  // =========================================================

  const getPossibleCourseNames = (skillName) => {

    const normalized =
      normalizeName(skillName);


    const map = {

      "java": [
        "Java",
        "Java Programming"
      ],

      "python": [
        "Python",
        "Python Programming"
      ],

      "c": [
        "C"
      ],

      "c++": [
        "C++"
      ],

      "javascript": [
        "JavaScript"
      ],

      "html": [
        "HTML"
      ],

      "css": [
        "CSS"
      ],

      "react": [
        "React"
      ],

      "node.js": [
        "Node.js"
      ],

      "sql": [
        "SQL"
      ],

      "mysql": [
        "MySQL"
      ],

      "mongodb": [
        "MongoDB"
      ],

      "spring boot": [
        "Spring Boot"
      ],

      "machine learning": [
        "Machine Learning"
      ],

      "deep learning": [
        "Deep Learning"
      ],

      "data analysis": [
        "Data Analysis",
        "Python for Data Analysis"
      ],

      "pandas and numpy": [
        "Pandas and NumPy"
      ],

      "power bi": [
        "Power BI"
      ],

      "python for data analysis": [
        "Python for Data Analysis"
      ],

      "python for data science": [
        "Python for Data Science"
      ],

      "data structures and algorithms": [
        "Data Structures and Algorithms"
      ],

      "cyber security fundamentals": [
        "Cyber Security Fundamentals"
      ],

      "ethical hacking": [
        "Ethical Hacking"
      ],

      "networking basics": [
        "Networking Basics"
      ]

    };


    return (
      map[normalized] ||
      [skillName]
    );

  };


  // =========================================================
  // CHECK QUESTION BELONGS TO STUDENT SKILL
  // =========================================================

  const questionBelongsToStudentSkill = (
    question,
    studentSkillNames
  ) => {

    const questionCourse =
      normalizeName(
        getQuestionCourseName(question)
      );


    if (!questionCourse) {
      return false;
    }


    return studentSkillNames.some(
      skillName => {

        const possibleCourses =
          getPossibleCourseNames(
            skillName
          );


        return possibleCourses.some(
          courseName =>
            normalizeName(courseName) ===
            questionCourse
        );

      }
    );

  };


  // =========================================================
  // GET PROGRAMMING LEVEL
  // =========================================================

  const getProgrammingLevel = (percentage) => {

    const value =
      Number(percentage || 0);


    if (value >= 80) {

      return "Advanced";

    }


    if (value >= 50) {

      return "Intermediate";

    }


    return "Beginner";

  };


  // =========================================================
  // GET CAREER FIELD FROM COURSE
  //
  // Agar database me careerField nahi hai,
  // frontend automatically career suggest karega.
  // =========================================================

  const getCareerFieldFromCourse = (courseName) => {

    const course =
      normalizeName(courseName);


    const careerMap = {

      "java":
        "Software Developer",

      "java programming":
        "Software Developer",

      "python":
        "Python Developer",

      "python programming":
        "Python Developer",

      "c":
        "Software Developer",

      "c++":
        "Software Developer",

      "javascript":
        "Web Developer",

      "html":
        "Web Developer",

      "css":
        "Web Developer",

      "react":
        "Frontend Developer",

      "node.js":
        "Backend Developer",

      "sql":
        "Data Analyst",

      "mysql":
        "Database Developer",

      "mongodb":
        "Backend Developer",

      "spring boot":
        "Java Backend Developer",

      "machine learning":
        "Machine Learning Engineer",

      "deep learning":
        "AI / ML Engineer",

      "data analysis":
        "Data Analyst",

      "python for data analysis":
        "Data Analyst",

      "pandas and numpy":
        "Data Analyst",

      "power bi":
        "Data Analyst",

      "python for data science":
        "Data Scientist",

      "data structures and algorithms":
        "Software Developer",

      "cyber security fundamentals":
        "Cyber Security Specialist",

      "ethical hacking":
        "Cyber Security Specialist",

      "networking basics":
        "Network Engineer"

    };


    return (
      careerMap[course] ||
      "Software Developer"
    );

  };


  // =========================================================
  // ASSESSMENT CATEGORY
  // =========================================================

  const getAssessmentCategory = (courseName, careerField) => {
    const course = normalizeName(courseName);
    const career = normalizeName(careerField);

    const cyberCourses = [
      "cyber security fundamentals",
      "ethical hacking",
      "networking basics",
      "networking",
      "cyber security",
      "cybersecurity",
      "nmap"
    ];

    if (
      cyberCourses.some((name) => course.includes(name)) ||
      career.includes("cyber security") ||
      career.includes("cybersecurity")
    ) {
      return "cyber_security";
    }

    const webCourses = [
      "html",
      "css",
      "javascript",
      "react",
      "node.js",
      "nodejs",
      "web development",
      "frontend",
      "backend"
    ];

    if (
      webCourses.some((name) => course.includes(name)) ||
      career.includes("web developer") ||
      career.includes("frontend developer") ||
      career.includes("backend developer")
    ) {
      return "web";
    }

    const dataCourses = [
      "sql",
      "mysql",
      "data analysis",
      "python for data analysis",
      "python for data science",
      "pandas and numpy",
      "power bi",
      "machine learning",
      "deep learning",
      "data science",
      "data scientist"
    ];

    if (
      dataCourses.some((name) => course.includes(name)) ||
      career.includes("data analyst") ||
      career.includes("data scientist") ||
      career.includes("machine learning") ||
      career.includes("ai / ml")
    ) {
      return "data";
    }

    return "technology";
  };

  const calculateCategoryScores = (courseResults) => {
    const categories = {
      technology: { correct: 0, total: 0 },
      data: { correct: 0, total: 0 },
      web: { correct: 0, total: 0 },
      cyber_security: { correct: 0, total: 0 }
    };

    (courseResults || []).forEach((course) => {
      const category = getAssessmentCategory(
        course.courseName,
        course.careerField || getCareerFieldFromCourse(course.courseName)
      );

      if (!categories[category]) return;

      categories[category].correct += Number(course.correct || 0);
      categories[category].total += Number(course.total || 0);
    });

    return {
      technology_score:
        categories.technology.total > 0
          ? Math.round(
              (categories.technology.correct /
                categories.technology.total) * 100
            )
          : 0,

      data_score:
        categories.data.total > 0
          ? Math.round(
              (categories.data.correct /
                categories.data.total) * 100
            )
          : 0,

      web_score:
        categories.web.total > 0
          ? Math.round(
              (categories.web.correct /
                categories.web.total) * 100
            )
          : 0,

      cyber_security_score:
        categories.cyber_security.total > 0
          ? Math.round(
              (categories.cyber_security.correct /
                categories.cyber_security.total) * 100
            )
          : 0
    };
  };

  // =========================================================
  // SAVE LATEST ASSESSMENT RESULT
  // =========================================================

  const saveLatestAssessmentResult = ({
    totalScore,
    totalQuestions,
    percentage,
    courseResults,
    strongestCareer,
    categoryScores
  }) => {

    const programmingLevel =
      getProgrammingLevel(
        percentage
      );


    const latestAssessment = {

      studentId:
        studentId,

      score:
        totalScore,

      totalQuestions:
        totalQuestions,

      percentage:
        percentage,

      programmingLevel:
        programmingLevel,

      preferredCareer:
        strongestCareer?.careerField ||
        "",

      strongestCareer:
        strongestCareer?.careerField ||
        "",

      strongestCourse:
        strongestCareer?.courseName ||
        "",

      courseResults:
        courseResults || [],

      categoryScores:
        categoryScores || {
          technology_score: 0,
          data_score: 0,
          web_score: 0,
          cyber_security_score: 0
        },

      technology_score:
        categoryScores?.technology_score || 0,

      data_score:
        categoryScores?.data_score || 0,

      web_score:
        categoryScores?.web_score || 0,

      cyber_security_score:
        categoryScores?.cyber_security_score || 0,

      completedAt:
        new Date().toISOString()

    };


    localStorage.setItem(
      "latestSkillAssessmentResult",
      JSON.stringify(
        latestAssessment
      )
    );


    console.log(
      "LATEST RESULT SAVED:",
      latestAssessment
    );

  };


  // =========================================================
  // LOAD ASSESSMENT
  // =========================================================

  useEffect(() => {

    const loadAssessment = async () => {

      const userId =
        getUserId();


      // =====================================================
      // USER ID CHECK
      // =====================================================

      if (!userId) {

        showMessage(
          "User ID not found. Please login again..",
          "error"
        );

        setLoading(false);

        return;

      }


      try {

        setAnswers({});

        setScore(null);

        setResultData([]);


        // ===================================================
        // GET STUDENT
        // ===================================================

        const student =
          await studentService.getByUserId(
            userId
          );


        console.log(
          "STUDENT:",
          student
        );


        if (
          !student ||
          !student.id
        ) {

          showMessage(
            "Complete your profile first.",
            "error"
          );

          setLoading(false);

          return;

        }


        setStudentId(
          student.id
        );


        // ===================================================
        // GET STUDENT SKILLS
        // ===================================================

        const skills =
          await skillService.getByStudentId(
            student.id
          );


        console.log(
          "STUDENT SKILLS:",
          skills
        );


        if (
          !Array.isArray(skills) ||
          skills.length === 0
        ) {

          setStudentSkills([]);

          setQuestions([]);

          showMessage(
            "First, add skills on the skills page.",
            "error"
          );

          setLoading(false);

          return;

        }


        setStudentSkills(
          skills
        );


        // ===================================================
        // GET SKILL NAMES
        // ===================================================

        const skillNames = [
          ...new Set(

            skills
              .map(
                skill =>
                  getStudentSkillName(
                    skill
                  )
              )
              .map(
                name =>
                  String(name).trim()
              )
              .filter(
                name =>
                  name !== ""
              )

          )
        ];


        console.log(
          "STUDENT SKILL NAMES:",
          skillNames
        );


        if (
          skillNames.length === 0
        ) {

          setQuestions([]);

          showMessage(
            "Could not find the student skills name.",
            "error"
          );

          setLoading(false);

          return;

        }


        // ===================================================
        // GET QUESTIONS
        // ===================================================

        const questionData =
          await assessmentQuestionService
            .getByStudentId(
              student.id,
              skillNames
            );


        console.log(
          "QUESTIONS FROM BACKEND:",
          questionData
        );


        if (
          !Array.isArray(questionData) ||
          questionData.length === 0
        ) {

          setQuestions([]);

          showMessage(
            "No questions were found for your added skills.",
            "error"
          );

          setLoading(false);

          return;

        }


        // ===================================================
        // FILTER QUESTIONS
        // ===================================================

        const filteredQuestions =
          questionData.filter(
            question =>
              questionBelongsToStudentSkill(
                question,
                skillNames
              )
          );


        console.log(
          "FILTERED QUESTIONS:",
          filteredQuestions
        );


        console.log(
          "FILTERED QUESTION COUNT:",
          filteredQuestions.length
        );


        // ===================================================
        // SHOW AVAILABLE COURSES
        // ===================================================

        const availableCourses = [
          ...new Set(

            filteredQuestions
              .map(
                question =>
                  getQuestionCourseName(
                    question
                  )
              )
              .filter(
                name =>
                  name &&
                  name.trim() !== ""
              )

          )
        ];


        console.log(
          "AVAILABLE QUESTION COURSES:",
          availableCourses
        );


        // ===================================================
        // NO QUESTIONS
        // ===================================================

        if (
          filteredQuestions.length === 0
        ) {

          setQuestions([]);

          showMessage(
            "Matching questions for the added skills were not found.",
            "error"
          );

          setLoading(false);

          return;

        }


        // ===================================================
        // SHUFFLE
        // ===================================================

        const shuffledQuestions =
          [...filteredQuestions].sort(
            () =>
              Math.random() - 0.5
          );


        // ===================================================
        // SET QUESTIONS
        // ===================================================

        setQuestions(
          shuffledQuestions
        );


        console.log(
          "FINAL QUESTIONS:",
          shuffledQuestions
        );


      } catch (error) {

        console.error(
          "ASSESSMENT LOAD ERROR:",
          error
        );


        console.error(
          "SERVER RESPONSE:",
          error.response?.data
        );


        setQuestions([]);

        setAnswers({});


        showMessage(
          "The questions are not loading..",
          "error"
        );

      } finally {

        setLoading(false);

      }

    };


    loadAssessment();

  }, []);


  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleAnswer = (
    questionId,
    answer
  ) => {

    if (
      score !== null
    ) {

      return;

    }


    setAnswers(
      previousAnswers => ({

        ...previousAnswers,

        [questionId]:
          answer

      })
    );

  };


  // =========================================================
  // QUESTION TEXT
  // =========================================================

  const getQuestionText = (
    question
  ) => {

    return (
      question.questionText ||
      question.question ||
      ""
    );

  };


  // =========================================================
  // OPTIONS
  // =========================================================

  const getOptions = (
    question
  ) => {

    return [

      question.optionA,

      question.optionB,

      question.optionC,

      question.optionD

    ].filter(
      option =>
        option !== null &&
        option !== undefined &&
        option !== ""
    );

  };


  // =========================================================
  // COURSE NAME
  // =========================================================

  const getCourseName = (
    question
  ) => {

    return (
      question.courseName ||
      question.skillName ||
      question.skill ||
      "General"
    );

  };


  // =========================================================
  // CAREER FIELD
  // =========================================================

  const getCareerField = (
    question
  ) => {

    return (
      question.careerField ||
      getCareerFieldFromCourse(
        getCourseName(question)
      )
    );

  };


  // =========================================================
  // CORRECT ANSWER
  // =========================================================

  const isCorrectAnswer = (
    question,
    selectedAnswer
  ) => {

    if (!selectedAnswer) {

      return false;

    }


    const correct =
      question.correctAnswer;


    if (!correct) {

      return false;

    }


    const options =
      getOptions(question);


    const correctValue =
      String(correct)
        .trim()
        .toUpperCase();


    if (
      ["A", "B", "C", "D"]
        .includes(correctValue)
    ) {

      const index =
        correctValue.charCodeAt(0) -
        65;


      return (
        options[index] ===
        selectedAnswer
      );

    }


    return (
      String(correct)
        .trim()
        .toLowerCase() ===
      String(selectedAnswer)
        .trim()
        .toLowerCase()
    );

  };


  // =========================================================
  // CORRECT ANSWER TEXT
  // =========================================================

  const getCorrectAnswerText = (
    question
  ) => {

    const correct =
      question.correctAnswer;


    if (!correct) {

      return "";

    }


    const options =
      getOptions(question);


    const correctValue =
      String(correct)
        .trim()
        .toUpperCase();


    if (
      ["A", "B", "C", "D"]
        .includes(correctValue)
    ) {

      const index =
        correctValue.charCodeAt(0) -
        65;


      return (
        options[index] ||
        correct
      );

    }


    return correct;

  };


  // =========================================================
  // SUBMIT ASSESSMENT
  // =========================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();


    // =====================================================
    // CHECK UNANSWERED
    // =====================================================

    const unanswered =
      questions.filter(
        question =>
          !answers[
            question.id
          ]
      );


    if (
      unanswered.length > 0
    ) {

      showMessage(
        "Please select answers for all the questions.",
        "error"
      );

      return;

    }


    if (!studentId) {

      showMessage(
        "Student profile not found.",
        "error"
      );

      return;

    }


    setSaving(true);


    try {

      // ===================================================
      // SCORE
      // ===================================================

      let totalScore = 0;


      // ===================================================
      // COURSE MAP
      // ===================================================

      const courseMap = {};


      // ===================================================
      // QUESTION RESULTS
      // ===================================================

      const assessmentData =
        questions.map(
          question => {

            const selectedAnswer =
              answers[
                question.id
              ];


            const correct =
              isCorrectAnswer(
                question,
                selectedAnswer
              );


            const questionScore =
              correct
                ? 1
                : 0;


            totalScore +=
              questionScore;


            // =============================================
            // COURSE
            // =============================================

            const courseName =
              getCourseName(
                question
              );


            const careerField =
              getCareerField(
                question
              );


            if (
              !courseMap[
                courseName
              ]
            ) {

              courseMap[
                courseName
              ] = {

                courseName:
                  courseName,

                careerField:
                  careerField,

                total:
                  0,

                correct:
                  0,

                percentage:
                  0

              };

            }


            courseMap[
              courseName
            ].total++;


            if (correct) {

              courseMap[
                courseName
              ].correct++;

            }


            return {

              skillName:
                courseName,

              question:
                getQuestionText(
                  question
                ),

              selectedAnswer:
                selectedAnswer,

              correctAnswer:
                getCorrectAnswerText(
                  question
                ),

              score:
                questionScore

            };

          }
        );


      // ===================================================
      // COURSE RESULTS
      // ===================================================

      const courseResults =
        Object.values(
          courseMap
        ).map(
          course => ({

            ...course,

            percentage:
              course.total > 0
                ? Math.round(
                    (
                      course.correct /
                      course.total
                    ) * 100
                  )
                : 0

          })
        );


      console.log(
        "COURSE RESULTS:",
        courseResults
      );

      // ===================================================
      // CATEGORY-WISE SCORES
      // ===================================================

      const categoryScores =
        calculateCategoryScores(courseResults);

      console.log(
        "CATEGORY SCORES:",
        categoryScores
      );

      localStorage.setItem(
        "latestSkillAssessmentCategoryScores",
        JSON.stringify(categoryScores)
      );


      // ===================================================
      // STRONGEST COURSE
      // ===================================================

      let strongestCourse =
        null;


      if (
        courseResults.length > 0
      ) {

        strongestCourse =
          [
            ...courseResults
          ].sort(
            (a, b) => {

              if (
                b.percentage !==
                a.percentage
              ) {

                return (
                  b.percentage -
                  a.percentage
                );

              }


              return (
                b.correct -
                a.correct
              );

            }
          )[0];

      }


      // ===================================================
      // FINAL PERCENTAGE
      // ===================================================

      const percentage =
        questions.length > 0
          ? Math.round(
              (
                totalScore /
                questions.length
              ) * 100
            )
          : 0;


      // ===================================================
      // PROGRAMMING LEVEL
      // ===================================================

      const programmingLevel =
        getProgrammingLevel(
          percentage
        );


      // ===================================================
      // SAVE DATABASE
      // ===================================================

      await skillAssessmentService.save(
        studentId,
        assessmentData
      );


      // ===================================================
      // SAVE LOCAL RESULT
      // ===================================================

      saveLatestAssessmentResult({

        totalScore:
          totalScore,

        totalQuestions:
          questions.length,

        percentage:
          percentage,

        courseResults:
          courseResults,

        strongestCareer:
          strongestCourse,

        categoryScores:
          categoryScores

      });


      // ===================================================
      // SET RESULT
      // ===================================================

      setScore(
        totalScore
      );


      setResultData(
        courseResults
      );


      console.log(
        "STRONGEST CAREER:",
        strongestCourse
      );


      showMessage(
        "Assessment successfully completed!",
        "success"
      );


    } catch (error) {

      console.error(
        "ASSESSMENT SUBMIT ERROR:",
        error
      );


      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );


      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;


      showMessage(
        backendMessage ||
        "The assessment is not submitting.",
        "error"
      );

    } finally {

      setSaving(false);

    }

  };


  // =========================================================
  // RETAKE
  // =========================================================

  const handleRetake = () => {

    setAnswers({});

    setScore(null);

    setResultData([]);


    localStorage.removeItem(
      "latestSkillAssessmentResult"
    );

    localStorage.removeItem(
      "latestSkillAssessmentCategoryScores"
    );


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="page-container">
        <div className="form-card">

          <h2>
            Loading Skill Assessment...
          </h2>

        </div>

      </div>

    );

  }


  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (
    !loading &&
    questions.length === 0
  ) {

    return (

      <div
        className="page-container"
        style={{
          padding: "30px"
        }}
      >

        <div
          className="form-card"
          style={{
            padding: "30px"
          }}
        >

          <h1>
            Skill Assessment
          </h1>


          <p
            style={{
              fontSize: "18px",
              color: "#666",
              marginTop: "15px"
            }}
          >

           Questions are not available for your added skills.
          </p>


          {studentSkills.length > 0 && (

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f5f7ff",
                borderRadius: "12px"
              }}
            >

              <strong>
                Your Added Skills:
              </strong>


              <div
                style={{
                  marginTop: "10px"
                }}
              >

                {studentSkills.map(
                  (skill, index) => (

                    <span
                      key={
                        skill.id ||
                        index
                      }
                      style={{
                        display:
                          "inline-block",
                        margin:
                          "5px",
                        padding:
                          "7px 12px",
                        background:
                          "#e8edff",
                        borderRadius:
                          "20px"
                      }}
                    >

                      {getStudentSkillName(
                        skill
                      )}

                    </span>

                  )
                )}

              </div>

            </div>

          )}


          <button
            className="main-button"
            style={{
              marginTop: "20px"
            }}
            onClick={() =>
              navigate("/skills")
            }
          >

            Go To Skills

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // PERCENTAGE
  // =========================================================

  const percentage =
    score !== null &&
    questions.length > 0

      ? Math.round(
          (
            score /
            questions.length
          ) * 100
        )

      : 0;


  // =========================================================
  // PROGRAMMING LEVEL
  // =========================================================

  const programmingLevel =
    getProgrammingLevel(
      percentage
    );


  // =========================================================
  // STRONGEST CAREER
  // =========================================================

  let strongestCareer =
    null;


  if (
    resultData.length > 0
  ) {

    strongestCareer =
      [
        ...resultData
      ].sort(
        (a, b) => {

          if (
            b.percentage !==
            a.percentage
          ) {

            return (
              b.percentage -
              a.percentage
            );

          }


          return (
            b.correct -
            a.correct
          );

        }
      )[0];

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="page-container"
      style={{
        padding: "30px"
      }}
    >


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="page-header">

        <h1>
          Skill Assessment
        </h1>

        <p>
          Only questions related to your added skills will be displayed here.
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
          style={{
            marginBottom: "20px"
          }}
        >

          {message}

        </div>

      )}


      {/* ================================================= */}
      {/* STUDENT SKILLS */}
      {/* ================================================= */}

      {studentSkills.length > 0 && (

        <div
          style={{
            background:
              "#f5f7ff",
            padding:
              "20px",
            borderRadius:
              "15px",
            marginBottom:
              "25px"
          }}
        >

          <h3>
            Your Added Skills
          </h3>


          <div
            style={{
              display:
                "flex",
              flexWrap:
                "wrap",
              gap:
                "10px",
              marginTop:
                "12px"
            }}
          >

            {studentSkills.map(
              (
                skill,
                index
              ) => (

                <span
                  key={
                    skill.id ||
                    index
                  }
                  style={{
                    background:
                      "#e8edff",
                    padding:
                      "8px 15px",
                    borderRadius:
                      "20px",
                    fontWeight:
                      "600"
                  }}
                >

                  {getStudentSkillName(
                    skill
                  )}

                </span>

              )
            )}

          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* RESULT */}
      {/* ================================================= */}

      {score !== null && (

        <div
          style={{
            background:
              "#ffffff",
            borderRadius:
              "20px",
            padding:
              "30px",
            marginBottom:
              "30px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.08)",
            textAlign:
              "center"
          }}
        >

          <h1>
            🎉 Assessment Completed
          </h1>


          <div
            style={{
              fontSize:
                "55px",
              fontWeight:
                "800",
              marginTop:
                "15px"
            }}
          >

            {score}/
            {questions.length}

          </div>


          <h2>
            Score: {percentage}%
          </h2>


          {/* PROGRAMMING LEVEL */}

          <div
            style={{
              marginTop:
                "20px",
              padding:
                "18px",
              borderRadius:
                "14px",
              background:
                "#f5f7ff"
            }}
          >

            <h3>
              💻 Programming Level
            </h3>


            <div
              style={{
                fontSize:
                  "24px",
                fontWeight:
                  "700",
                marginTop:
                  "8px"
              }}
            >

              {programmingLevel}

            </div>

          </div>


          {/* ================================================= */}
          {/* SKILL WISE RESULT */}
          {/* ================================================= */}

          <div
            style={{
              marginTop:
                "25px",
              textAlign:
                "left"
            }}
          >

            <h2>
              Skill-wise Result
            </h2>


            {resultData.map(
              (
                course,
                index
              ) => (

                <div
                  key={
                    course.courseName
                  }
                  style={{
                    padding:
                      "18px",
                    marginTop:
                      "12px",
                    borderRadius:
                      "12px",
                    background:
                      "#f7f8ff",
                    border:
                      "1px solid #e5e7eb"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center"
                    }}
                  >

                    <div>

                      <strong>
                        {index + 1}.
                        {" "}
                        {course.courseName}
                      </strong>


                      <div
                        style={{
                          marginTop:
                            "5px",
                          color:
                            "#172554",
                          fontWeight:
                            "600"
                        }}
                      >

                        🎯{" "}
                        {course.careerField ||
                          getCareerFieldFromCourse(
                            course.courseName
                          )}

                      </div>

                    </div>


                    <strong
                      style={{
                        fontSize:
                          "20px"
                      }}
                    >

                      {course.correct}/
                      {course.total}

                    </strong>

                  </div>


                  <div
                    style={{
                      marginTop:
                        "10px",
                      fontWeight:
                        "600"
                    }}
                  >

                    {course.percentage}%

                  </div>

                </div>

              )
            )}

          </div>


          {/* ================================================= */}
          {/* STRONGEST CAREER */}
          {/* ================================================= */}

          {strongestCareer && (

            <div
              style={{
                marginTop:
                  "30px",
                padding:
                  "30px",
                borderRadius:
                  "16px",
                background:
                  "#eef2ff"
              }}
            >

              <h2>
                🎯 Your Strongest Career Field
              </h2>


              <div
                style={{
                  fontSize:
                    "30px",
                  fontWeight:
                    "800",
                  marginTop:
                    "12px",
                  color:
                    "#172554"
                }}
              >

                🚀{" "}
                {strongestCareer.careerField ||
                  getCareerFieldFromCourse(
                    strongestCareer.courseName
                  )}

              </div>


              <p
                style={{
                  marginTop:
                    "10px",
                  fontSize:
                    "16px"
                }}
              >

                Based on your highest
                assessment performance.

              </p>

            </div>

          )}


          {/* RETAKE */}

          <button
            className="main-button"
            style={{
              marginTop:
                "25px"
            }}
            onClick={
              handleRetake
            }
          >

            Retake Assessment

          </button>

        </div>

      )}


      {/* ================================================= */}
      {/* QUESTIONS */}
      {/* ================================================= */}

      {score === null && (

        <div className="form-card">

          <form
            onSubmit={
              handleSubmit
            }
          >

            {questions.map(
              (
                question,
                index
              ) => {

                const options =
                  getOptions(
                    question
                  );


                const selectedAnswer =
                  answers[
                    question.id
                  ];


                return (

                  <div
                    key={
                      question.id
                    }
                    style={{
                      marginBottom:
                        "30px",
                      padding:
                        "20px",
                      borderRadius:
                        "14px",
                      background:
                        "#f8f9ff",
                      border:
                        "1px solid #e5e7eb"
                    }}
                  >

                    <h3
                      style={{
                        fontSize:
                          "22px",
                        lineHeight:
                          "1.5"
                      }}
                    >

                      {index + 1}.
                      {" "}
                      {getQuestionText(
                        question
                      )}

                    </h3>


                    <p
                      style={{
                        marginTop:
                          "10px",
                        fontWeight:
                          "600",
                        color:
                          "#172554"
                      }}
                    >

                      Skill:
                      {" "}
                      {getCourseName(
                        question
                      )}

                    </p>


                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap:
                          "12px",
                        marginTop:
                          "20px"
                      }}
                    >

                      {options.map(
                        option => (

                          <label
                            key={
                              option
                            }
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              padding:
                                "16px",
                              cursor:
                                "pointer",
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "12px",
                              background:
                                "#fff"
                            }}
                          >

                            <input
                              type="radio"
                              name={
                                `question-${question.id}`
                              }
                              value={
                                option
                              }
                              checked={
                                selectedAnswer ===
                                option
                              }
                              onChange={() =>
                                handleAnswer(
                                  question.id,
                                  option
                                )
                              }
                              style={{
                                width:
                                  "18px",
                                height:
                                  "18px"
                              }}
                            />


                            <span
                              style={{
                                marginLeft:
                                  "10px",
                                fontSize:
                                  "18px"
                              }}
                            >

                              {option}

                            </span>

                          </label>

                        )
                      )}

                    </div>

                  </div>

                );

              }
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="main-button profile-save-button"
              disabled={
                saving
              }
            >

              {saving
                ? "Checking Answers..."
                : "Submit Assessment →"}

            </button>

          </form>

        </div>

      )}


      {/* ================================================= */}
      {/* ANSWER REVIEW */}
      {/* ================================================= */}

      {score !== null && (

        <div
          className="form-card"
          style={{
            marginTop:
              "30px"
          }}
        >

          <h2>
            Answer Review
          </h2>


          <p
            style={{
              color:
                "#666",
              marginBottom:
                "25px"
            }}
          >

            Green = Correct Answer
            <br />
            Red = Your Wrong Answer

          </p>


          {questions.map(
            (
              question,
              index
            ) => {

              const selectedAnswer =
                answers[
                  question.id
                ];


              const correct =
                isCorrectAnswer(
                  question,
                  selectedAnswer
                );


              const correctAnswer =
                getCorrectAnswerText(
                  question
                );


              return (

                <div
                  key={
                    question.id
                  }
                  style={{
                    marginBottom:
                      "25px",
                    padding:
                      "20px",
                    borderRadius:
                      "14px",
                    background:
                      "#f8f9ff",
                    border:
                      "1px solid #e5e7eb"
                  }}
                >

                  <h3>

                    {index + 1}.
                    {" "}
                    {getQuestionText(
                      question
                    )}

                  </h3>


                  <p
                    style={{
                      marginTop:
                        "8px",
                      color:
                        "#555"
                    }}
                  >

                    Skill:
                    {" "}
                    {getCourseName(
                      question
                    )}

                  </p>


                  <div
                    style={{
                      marginTop:
                        "15px",
                      padding:
                        "14px",
                      borderRadius:
                        "10px",
                      background:
                        correct
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        correct
                          ? "#166534"
                          : "#991b1b",
                      fontWeight:
                        "600"
                    }}
                  >

                    {correct
                      ? "✓ Correct Answer: "
                      : "✗ Your Answer: "}

                    {selectedAnswer}

                  </div>


                  {!correct && (

                    <div
                      style={{
                        marginTop:
                          "10px",
                        padding:
                          "14px",
                        borderRadius:
                          "10px",
                        background:
                          "#dcfce7",
                        color:
                          "#166534",
                        fontWeight:
                          "600"
                      }}
                    >

                      ✓ Correct Answer:
                      {" "}

                      {correctAnswer}

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

}


export default SkillAssessment;