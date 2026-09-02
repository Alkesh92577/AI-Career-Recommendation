import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import studentService from "../services/studentService";

function AcademicDetails() {

  const navigate = useNavigate();


  // ==========================================
  // ACADEMIC FORM
  // ==========================================

  const [academic, setAcademic] = useState({

    tenthMarks: "",
    twelfthMarks: "",
    graduationMarks: "",
    semester: "",
    backlogs: ""

  });


  // ==========================================
  // STUDENT ID
  // ==========================================

  const [studentId, setStudentId] = useState(null);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  // ==========================================
  // MESSAGE
  // ==========================================

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");


  // ==========================================
  // MESSAGE TIMER
  // ==========================================

  const messageTimer = useRef(null);


  // ==========================================
  // SHOW MESSAGE FOR 3 SECONDS
  // ==========================================

  const showMessage = (text, type) => {

    // Agar pehle se koi timer chal raha hai
    // to usko clear karo

    if (messageTimer.current) {

      clearTimeout(messageTimer.current);

    }


    // Message show karo

    setMessage(text);

    setMessageType(type);


    // 3 seconds baad automatically hide

    messageTimer.current = setTimeout(() => {

      setMessage("");

      setMessageType("");

      messageTimer.current = null;

    }, 3000);

  };


  // ==========================================
  // CLEAR TIMER WHEN PAGE CLOSES
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
  // LOAD ACADEMIC DETAILS
  // ==========================================

  useEffect(() => {

    const loadAcademicDetails = async () => {

      const userId = getUserId();


      console.log(
        "Academic Details - Logged-in User ID:",
        userId
      );


      // ======================================
      // USER ID CHECK
      // ======================================

      if (!userId) {

        showMessage(
          "User not found. Please login again.",
          "error"
        );

        setLoading(false);

        return;

      }


      try {

        // ====================================
        // GET STUDENT PROFILE
        // ====================================

        const data =
          await studentService.getByUserId(userId);


        console.log(
          "Student Profile:",
          data
        );


        if (data) {

          // ================================
          // SAVE STUDENT ID
          // ================================

          setStudentId(data.id);


          // ================================
          // LOAD ACADEMIC DETAILS
          // ================================

          setAcademic({

            tenthMarks:
              data.tenthMarks ?? "",

            twelfthMarks:
              data.twelfthMarks ?? "",

            graduationMarks:
              data.graduationMarks ?? "",

            semester:
              data.semester ?? "",

            backlogs:
              data.backlogs ?? ""

          });

        }

      } catch (error) {

        console.error(
          "ACADEMIC DETAILS LOAD ERROR:",
          error
        );


        // ==================================
        // PROFILE NOT FOUND
        // ==================================

        if (error.response?.status === 404) {

          showMessage(
            "Complete your profile first.",
            "error"
          );

        } else {

          showMessage(
            "Academic details are not loading.",
            "error"
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadAcademicDetails();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setAcademic((previousAcademic) => ({

      ...previousAcademic,

      [name]: value

    }));

  };


  // ==========================================
  // SAVE ACADEMIC DETAILS
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    setSaving(true);


    // Purana message clear karo

    setMessage("");

    setMessageType("");


    // ========================================
    // GET USER ID
    // ========================================

    const userId = getUserId();


    console.log(
      "Saving Academic Details For User ID:",
      userId
    );


    // ========================================
    // USER ID CHECK
    // ========================================

    if (!userId) {

      showMessage(
        "User ID not found. Please login again..",
        "error"
      );

      setSaving(false);

      return;

    }


    // ========================================
    // STUDENT ID CHECK
    // ========================================

    if (!studentId) {

      showMessage(
        "Student profile not found. Save the profile first..",
        "error"
      );

      setSaving(false);

      return;

    }


    // ========================================
    // PREPARE DATA
    // ========================================

    const academicData = {

      tenthMarks:
        academic.tenthMarks === ""
          ? null
          : Number(academic.tenthMarks),

      twelfthMarks:
        academic.twelfthMarks === ""
          ? null
          : Number(academic.twelfthMarks),

      graduationMarks:
        academic.graduationMarks === ""
          ? null
          : Number(academic.graduationMarks),

      semester:
        academic.semester === ""
          ? null
          : Number(academic.semester),

      backlogs:
        academic.backlogs === ""
          ? null
          : Number(academic.backlogs)

    };


    console.log(
      "Academic Data Sending:",
      academicData
    );


    try {

      // ======================================
      // UPDATE ACADEMIC DETAILS
      // ======================================

      const data =
        await studentService.updateAcademic(
          studentId,
          academicData
        );


      console.log(
        "Academic Backend Response:",
        data
      );


      // ======================================
      // UPDATE FORM WITH RESPONSE
      // ======================================

      setAcademic({

        tenthMarks:
          data.tenthMarks ?? "",

        twelfthMarks:
          data.twelfthMarks ?? "",

        graduationMarks:
          data.graduationMarks ?? "",

        semester:
          data.semester ?? "",

        backlogs:
          data.backlogs ?? ""

      });


      // ======================================
      // SUCCESS MESSAGE
      // ======================================

      showMessage(
        "Academic details successfully saved!",
        "success"
      );


    } catch (error) {

      console.error(
        "ACADEMIC SAVE ERROR:",
        error
      );


      console.error(
        "Backend Response:",
        error.response?.data
      );


      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;


      // ======================================
      // ERROR MESSAGE
      // ======================================

      showMessage(

        backendMessage ||
        "Academic details are not being saved. Please check the backend.",

        "error"

      );


    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading Academic Details...
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
      {/* PAGE HEADER */}
      {/* ==================================== */}

      <div className="page-header">

        <h1>
          Academic Details
        </h1>

        <p>
         Complete your academic information.
        </p>

      </div>


      {/* ==================================== */}
      {/* FORM */}
      {/* ==================================== */}

      <div className="form-card profile-form-card">


        <form onSubmit={handleSubmit}>


          <div className="form-grid">


            {/* ================================= */}
            {/* 10TH */}
            {/* ================================= */}

            <div>

              <label>
                10th Percentage
              </label>


              <input
                type="number"
                name="tenthMarks"
                placeholder="Example: 78"
                min="0"
                max="100"
                step="0.01"
                value={academic.tenthMarks}
                onChange={handleChange}
                required
              />

            </div>


            {/* ================================= */}
            {/* 12TH */}
            {/* ================================= */}

            <div>

              <label>
                12th Percentage
              </label>


              <input
                type="number"
                name="twelfthMarks"
                placeholder="Example: 82"
                min="0"
                max="100"
                step="0.01"
                value={academic.twelfthMarks}
                onChange={handleChange}
                required
              />

            </div>


            {/* ================================= */}
            {/* GRADUATION */}
            {/* ================================= */}

            <div>

              <label>
                Graduation Percentage
              </label>


              <input
                type="number"
                name="graduationMarks"
                placeholder="Example: 75"
                min="0"
                max="100"
                step="0.01"
                value={academic.graduationMarks}
                onChange={handleChange}
                required
              />

            </div>


            {/* ================================= */}
            {/* SEMESTER */}
            {/* ================================= */}

            <div>

              <label>
                Current Semester
              </label>


              <input
                type="number"
                name="semester"
                placeholder="Example: 6"
                min="1"
                max="12"
                value={academic.semester}
                onChange={handleChange}
                required
              />

            </div>


            {/* ================================= */}
            {/* BACKLOGS */}
            {/* ================================= */}

            <div>

              <label>
                Backlogs
              </label>


              <input
                type="number"
                name="backlogs"
                placeholder="Example: 0"
                min="0"
                value={academic.backlogs}
                onChange={handleChange}
                required
              />

            </div>


          </div>


          {/* ================================= */}
          {/* SAVE BUTTON */}
          {/* ================================= */}

          <button
            type="submit"
            className="main-button profile-save-button"
            disabled={saving}
          >

            {saving
              ? "Saving Academic Details..."
              : "Save Academic Details →"}

          </button>


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


        </form>


        {/* ================================= */}
        {/* BACK TO PROFILE */}
        {/* ================================= */}


      </div>

    </div>

  );

}


export default AcademicDetails;