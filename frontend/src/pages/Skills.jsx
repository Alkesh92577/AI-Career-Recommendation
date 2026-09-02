import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import studentService from "../services/studentService";
import skillService from "../services/skillService";


function Skills() {

  const navigate = useNavigate();


  // ==========================================
  // SKILL FORM
  // ==========================================

  const [skill, setSkill] = useState({

    skillName: "",
    level: ""

  });


  // ==========================================
  // SKILLS LIST
  // ==========================================

  const [skills, setSkills] = useState([]);


  // ==========================================
  // STUDENT ID
  // ==========================================

  const [studentId, setStudentId] = useState(null);


  // ==========================================
  // LOADING / SAVING
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  // ==========================================
  // MESSAGE
  // ==========================================

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const messageTimer = useRef(null);


  // ==========================================
  // SHOW MESSAGE FOR 3 SECONDS
  // ==========================================

  const showMessage = (text, type) => {

    if (messageTimer.current) {

      clearTimeout(messageTimer.current);

    }


    setMessage(text);

    setMessageType(type);


    messageTimer.current = setTimeout(() => {

      setMessage("");

      setMessageType("");

      messageTimer.current = null;

    }, 3000);

  };


  // ==========================================
  // CLEAR TIMER
  // ==========================================

  useEffect(() => {

    return () => {

      if (messageTimer.current) {

        clearTimeout(messageTimer.current);

      }

    };

  }, []);


  // ==========================================
  // GET USER ID
  // ==========================================

  const getUserId = () => {

    return localStorage.getItem("userId");

  };


  // ==========================================
  // NORMALIZE SKILL NAME
  //
  // Java
  // java
  // JAVA
  //
  // Teeno ko same maana jayega.
  // ==========================================

  const normalizeSkillName = (skillName) => {

    if (!skillName) {

      return "";

    }


    return String(skillName)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  };


  // ==========================================
  // LOAD STUDENT + SKILLS
  // ==========================================

  useEffect(() => {

    const loadSkills = async () => {

      const userId = getUserId();


      console.log(
        "Skills - User ID:",
        userId
      );


      // ======================================
      // USER ID CHECK
      // ======================================

      if (!userId) {

        showMessage(
          "User ID not found. Please login again.",
          "error"
        );

        setLoading(false);

        return;

      }


      try {

        // ====================================
        // GET STUDENT PROFILE
        // ====================================

        const student =
          await studentService.getByUserId(
            userId
          );


        console.log(
          "Student Profile:",
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


        // ====================================
        // SAVE STUDENT ID
        // ====================================

        setStudentId(
          student.id
        );


        console.log(
          "Student ID:",
          student.id
        );


        // ====================================
        // GET STUDENT SKILLS
        // ====================================

        const data =
          await skillService.getByStudentId(
            student.id
          );


        console.log(
          "Skills From Backend:",
          data
        );


        // ====================================
        // REMOVE DUPLICATES FROM DISPLAY
        //
        // Agar database me purani duplicate
        // rows hain to frontend me same skill
        // baar-baar show nahi hogi.
        //
        // Lekin database duplicates ko manually
        // delete karna phir bhi better hai.
        // ====================================

        const uniqueSkills = [];

        const skillNames = new Set();


        data.forEach((item) => {

          const normalized =
            normalizeSkillName(
              item.skillName
            );


          if (
            normalized &&
            !skillNames.has(normalized)
          ) {

            skillNames.add(
              normalized
            );

            uniqueSkills.push(
              item
            );

          }

        });


        setSkills(
          uniqueSkills
        );


      } catch (error) {

        console.error(
          "SKILLS LOAD ERROR:",
          error
        );


        if (
          error.response?.status === 404
        ) {

          showMessage(
            "Complete your profile first.",
            "error"
          );

        } else {

          showMessage(
            "Skills are not loading.",
            "error"
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadSkills();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setSkill(
      (previousSkill) => ({

        ...previousSkill,

        [name]: value

      })
    );

  };


  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleAddSkill = async (e) => {

    e.preventDefault();


    // ========================================
    // STUDENT ID CHECK
    // ========================================

    if (!studentId) {

      showMessage(
        "Student profile not found.",
        "error"
      );

      return;

    }


    // ========================================
    // VALIDATION
    // ========================================

    if (
      !skill.skillName ||
      skill.skillName.trim() === "" ||
      !skill.level
    ) {

      showMessage(
        "Select skill and level.",
        "error"
      );

      return;

    }


    // ========================================
    // NORMALIZED SKILL NAME
    // ========================================

    const selectedSkillName =
      normalizeSkillName(
        skill.skillName
      );


    // ========================================
    // FRONTEND DUPLICATE CHECK
    //
    // Same student ke liye:
    //
    // Java
    // java
    // JAVA
    //
    // duplicate maana jayega.
    // ========================================

    const alreadyExists =
      skills.some(
        (item) =>
          normalizeSkillName(
            item.skillName
          ) === selectedSkillName
      );


    if (alreadyExists) {

      showMessage(
        `${skill.skillName} It has already been added. A skill can be added only once.`,
        "error"
      );

      return;

    }


    // ========================================
    // START SAVING
    // ========================================

    setSaving(true);


    // ========================================
    // PREPARE DATA
    // ========================================

    const skillData = {

      studentId:
        Number(studentId),

      skillName:
        skill.skillName.trim(),

      level:
        Number(skill.level)

    };


    console.log(
      "Skill Data Sending:",
      skillData
    );


    try {

      // ======================================
      // SAVE SKILL TO BACKEND
      // ======================================

      const data =
        await skillService.create(
          skillData
        );


      console.log(
        "Skill Response:",
        data
      );


      // ======================================
      // EXTRA DUPLICATE SAFETY
      //
      // Backend se save hone ke baad bhi
      // display list me duplicate nahi aayega.
      // ======================================

      setSkills(
        (previousSkills) => {

          const exists =
            previousSkills.some(
              (item) =>
                normalizeSkillName(
                  item.skillName
                ) ===
                normalizeSkillName(
                  data.skillName
                )
            );


          if (exists) {

            return previousSkills;

          }


          return [

            ...previousSkills,

            data

          ];

        }
      );


      // ======================================
      // CLEAR FORM
      // ======================================

      setSkill({

        skillName: "",

        level: ""

      });


      // ======================================
      // SUCCESS MESSAGE
      // ======================================

      showMessage(
        "Skill successfully added!",
        "success"
      );


    } catch (error) {

      console.error(
        "ADD SKILL ERROR:",
        error
      );


      console.error(
        "Backend Response:",
        error.response?.data
      );


      // ======================================
      // GET BACKEND ERROR MESSAGE
      // ======================================

      const backendMessage =
        error.response?.data?.message;


      showMessage(

        backendMessage ||
        "The skill isn't getting added.",

        "error"

      );


    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // DELETE SKILL
  // ==========================================

  const handleDelete = async (id) => {

    try {

      await skillService.delete(id);


      setSkills(
        (previousSkills) =>
          previousSkills.filter(
            (item) =>
              item.id !== id
          )
      );


      showMessage(
        "Skill successfully deleted!",
        "success"
      );


    } catch (error) {

      console.error(
        "DELETE SKILL ERROR:",
        error
      );


      const backendMessage =
        error.response?.data?.message;


      showMessage(

        backendMessage ||
        "The skill isn't getting deleted.",

        "error"

      );

    }

  };


  // ==========================================
  // CONVERT LEVEL TO TEXT
  // ==========================================

  const getLevelText = (level) => {

    if (
      Number(level) === 1
    ) {

      return "Beginner";

    }


    if (
      Number(level) === 2
    ) {

      return "Intermediate";

    }


    if (
      Number(level) === 3
    ) {

      return "Advanced";

    }


    return "Unknown";

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading Skills...
          </h2>

        </div>

      </div>

    );

  }


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
          My Skills
        </h1>

        <p>
          Add your technical skills and
          knowledge level.
        </p>

      </div>


      {/* ==================================== */}
      {/* ADD SKILL FORM */}
      {/* ==================================== */}

      <div className="form-card">

        <form
          onSubmit={handleAddSkill}
        >

          <div className="form-grid">


            {/* ================================= */}
            {/* SKILL NAME */}
            {/* ================================= */}

            <div>

              <label>
                Skill Name
              </label>


              <select
                name="skillName"
                value={skill.skillName}
                onChange={handleChange}
              >

                <option value="">
                  Select Skill
                </option>


                <option value="Java">
                  Java
                </option>


                <option value="Python">
                  Python
                </option>


                <option value="C">
                  C
                </option>


                <option value="C++">
                  C++
                </option>


                <option value="JavaScript">
                  JavaScript
                </option>


                <option value="HTML">
                  HTML
                </option>


                <option value="CSS">
                  CSS
                </option>


                <option value="React">
                  React
                </option>


                <option value="SQL">
                  SQL
                </option>


                <option value="MySQL">
                  MySQL
                </option>


                <option value="MongoDB">
                  MongoDB
                </option>


                <option value="Spring Boot">
                  Spring Boot
                </option>


                <option value="Node.js">
                  Node.js
                </option>


                <option value="Machine Learning">
                  Machine Learning
                </option>


                <option value="Data Analysis">
                  Data Analysis
                </option>

              </select>

            </div>


            {/* ================================= */}
            {/* LEVEL */}
            {/* ================================= */}

            <div>

              <label>
                Skill Level
              </label>


              <select
                name="level"
                value={skill.level}
                onChange={handleChange}
              >

                <option value="">
                  Select Level
                </option>


                <option value="1">
                  Beginner
                </option>


                <option value="2">
                  Intermediate
                </option>


                <option value="3">
                  Advanced
                </option>

              </select>

            </div>


          </div>


          {/* ================================= */}
          {/* ADD BUTTON */}
          {/* ================================= */}

          <button
            type="submit"
            className="main-button profile-save-button"
            disabled={saving}
          >

            {saving
              ? "Adding Skill..."
              : "Add Skill +"}

          </button>


        </form>


        {/* ================================= */}
        {/* MESSAGE */}
        {/* ================================= */}

        {message && (

          <p
            className={
              messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >

            {message}

          </p>

        )}

      </div>


      {/* ==================================== */}
      {/* SKILLS LIST */}
      {/* ==================================== */}

      <div className="form-card">

        <h2>
          Your Skills
        </h2>


        {skills.length === 0 ? (

          <p>
            No skills have been added yet.
          </p>

        ) : (

          <div>

            {skills.map(
              (item) => (

                <div
                  key={item.id}
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    padding:
                      "15px",
                    marginTop:
                      "10px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #ddd"
                  }}
                >


                  {/* ================================= */}
                  {/* SKILL INFO */}
                  {/* ================================= */}

                  <div>

                    <strong>
                      {item.skillName}
                    </strong>

                    <br />

                    <span>
                      Level:{" "}
                      {getLevelText(
                        item.level
                      )}
                    </span>

                  </div>


                  {/* ================================= */}
                  {/* DELETE */}
                  {/* ================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        item.id
                      )
                    }
                    style={{
                      padding:
                        "8px 15px",
                      border:
                        "none",
                      borderRadius:
                        "8px",
                      background:
                        "#dc3545",
                      color:
                        "white",
                      cursor:
                        "pointer"
                    }}
                  >

                    Delete

                  </button>


                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ==================================== */}
      {/* NAVIGATION */}
      {/* ==================================== */}

      <div
        style={{
          display:
            "flex",
          gap:
            "15px",
          marginTop:
            "20px"
        }}
      >

      </div>


    </div>

  );

}


export default Skills;