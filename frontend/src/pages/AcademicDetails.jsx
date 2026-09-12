import { useEffect, useRef, useState } from "react";
import studentService from "../services/studentService";

function AcademicDetails() {

  // ==========================================
  // DEFAULT ACADEMIC DATA
  // ==========================================

  const emptyAcademic = {
    tenthMarks: "",
    twelfthMarks: "",
    graduationMarks: "",
    semester: "",
    backlogs: ""
  };

  // ==========================================
  // ACADEMIC FORM
  // ==========================================

  const [academic, setAcademic] = useState(emptyAcademic);

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

  // ==========================================
  // MESSAGE TIMER
  // ==========================================

  const messageTimer = useRef(null);

  // ==========================================
  // GET USER ID
  // ==========================================

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // ==========================================
  // USER-SPECIFIC LOCAL STORAGE KEY
  // ==========================================

  const getAcademicStorageKey = (userId) => {
    return `academicDetails_${userId}`;
  };

  // ==========================================
  // SHOW MESSAGE
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
  // CLEANUP TIMER
  // ==========================================

  useEffect(() => {

    return () => {

      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }

    };

  }, []);

  // ==========================================
  // SAVE ACADEMIC DATA LOCALLY
  // ==========================================

  const saveAcademicLocally = (
    userId,
    academicData
  ) => {

    try {

      localStorage.setItem(
        getAcademicStorageKey(userId),
        JSON.stringify(academicData)
      );

      console.log(
        "Academic details saved locally:",
        academicData
      );

    } catch (error) {

      console.error(
        "LOCAL ACADEMIC SAVE ERROR:",
        error
      );

    }
  };

  // ==========================================
  // LOAD ACADEMIC DATA FROM LOCAL STORAGE
  // ==========================================

  const loadAcademicLocally = (userId) => {

    try {

      const saved =
        localStorage.getItem(
          getAcademicStorageKey(userId)
        );

      if (!saved) {
        return null;
      }

      const parsed =
        JSON.parse(saved);

      if (
        !parsed ||
        typeof parsed !== "object"
      ) {

        return null;

      }

      return {

        tenthMarks:
          parsed.tenthMarks ?? "",

        twelfthMarks:
          parsed.twelfthMarks ?? "",

        graduationMarks:
          parsed.graduationMarks ?? "",

        semester:
          parsed.semester ?? "",

        backlogs:
          parsed.backlogs ?? ""

      };

    } catch (error) {

      console.error(
        "LOCAL ACADEMIC LOAD ERROR:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // NORMALIZE BACKEND DATA
  // ==========================================

  const normalizeAcademicData = (data) => {

    return {

      tenthMarks:
        data?.tenthMarks ?? "",

      twelfthMarks:
        data?.twelfthMarks ?? "",

      graduationMarks:
        data?.graduationMarks ?? "",

      semester:
        data?.semester ?? "",

      backlogs:
        data?.backlogs ?? ""

    };

  };

  // ==========================================
  // CHECK WHETHER ACADEMIC DATA EXISTS
  // ==========================================

  const hasAcademicData = (data) => {

    if (!data) {
      return false;
    }

    return (

      data.tenthMarks !== null &&
      data.tenthMarks !== undefined &&

      data.twelfthMarks !== null &&
      data.twelfthMarks !== undefined &&

      data.graduationMarks !== null &&
      data.graduationMarks !== undefined &&

      data.semester !== null &&
      data.semester !== undefined &&

      data.backlogs !== null &&
      data.backlogs !== undefined

    );

  };

  // ==========================================
  // LOAD ACADEMIC DETAILS
  // ==========================================

  useEffect(() => {

    let mounted = true;

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

        if (mounted) {

          showMessage(
            "User not found. Please login again.",
            "error"
          );

          setLoading(false);

        }

        return;
      }

      // ======================================
      // LOAD LOCAL BACKUP FIRST
      // ======================================

      const localAcademic =
        loadAcademicLocally(userId);

      if (
        localAcademic &&
        mounted
      ) {

        console.log(
          "Academic details loaded from local backup:",
          localAcademic
        );

        setAcademic(
          localAcademic
        );
      }

      // ======================================
      // LOAD FROM BACKEND
      // ======================================

      try {

        const data =
          await studentService.getByUserId(
            userId
          );

        console.log(
          "Student Profile From Backend:",
          data
        );

        if (!mounted) {
          return;
        }

        if (data && data.id) {

          // ==================================
          // SAVE STUDENT ID
          // ==================================

          setStudentId(data.id);

          localStorage.setItem(
            "studentId",
            String(data.id)
          );

          // ==================================
          // GET ACADEMIC DATA
          // ==================================

          const backendAcademic =
            normalizeAcademicData(data);

          // ==================================
          // BACKEND DATA EXISTS
          // ==================================

          if (
            hasAcademicData(data)
          ) {

            setAcademic(
              backendAcademic
            );

            // Keep local backup updated
            saveAcademicLocally(
              userId,
              backendAcademic
            );

          }

          // ==================================
          // BACKEND DATA EMPTY BUT LOCAL DATA
          // ==================================

          else if (
            localAcademic
          ) {

            console.log(
              "Backend academic data empty. Using local backup."
            );

            setAcademic(
              localAcademic
            );

          }

        }

      } catch (error) {

        console.error(
          "ACADEMIC DETAILS LOAD ERROR:",
          error
        );

        // ==================================
        // LOCAL BACKUP FALLBACK
        // ==================================

        if (
          localAcademic &&
          mounted
        ) {

          console.log(
            "Backend unavailable. Using local academic backup."
          );

          setAcademic(
            localAcademic
          );

          showMessage(
            "Saved academic details loaded.",
            "success"
          );

        } else if (mounted) {

          if (
            error.response?.status === 404
          ) {

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

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };

    loadAcademicDetails();

    return () => {
      mounted = false;
    };

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

    setMessage("");
    setMessageType("");

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
        "User ID not found. Please login again.",
        "error"
      );

      setSaving(false);

      return;
    }

    // ========================================
    // STUDENT ID
    // ========================================

    let currentStudentId =
      studentId;

    // ========================================
    // IF STATE DOES NOT HAVE STUDENT ID,
    // GET IT FROM LOCAL STORAGE
    // ========================================

    if (!currentStudentId) {

      const savedStudentId =
        localStorage.getItem(
          "studentId"
        );

      if (savedStudentId) {

        currentStudentId =
          Number(savedStudentId);

        setStudentId(
          currentStudentId
        );

      }

    }

    // ========================================
    // STILL NO STUDENT ID
    // ========================================

    if (!currentStudentId) {

      showMessage(
        "Student profile not found. Save the profile first.",
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
      // SAVE TO BACKEND / MYSQL
      // ======================================

      const data =
        await studentService.updateAcademic(
          currentStudentId,
          academicData
        );

      console.log(
        "Academic Backend Response:",
        data
      );

      // ======================================
      // USE BACKEND RESPONSE
      // ======================================

      const updatedAcademic =
        normalizeAcademicData(data);

      setAcademic(
        updatedAcademic
      );

      // ======================================
      // SAVE LOCAL BACKUP
      // ======================================

      saveAcademicLocally(
        userId,
        updatedAcademic
      );

      // ======================================
      // SAVE STUDENT ID
      // ======================================

      if (data?.id) {

        setStudentId(
          data.id
        );

        localStorage.setItem(
          "studentId",
          String(data.id)
        );

      }

      // ======================================
      // SUCCESS
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

      // ======================================
      // BACKEND FAIL
      // SAVE LOCAL BACKUP
      // ======================================

      saveAcademicLocally(
        userId,
        academic
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      showMessage(

        backendMessage ||
        "Internet/backend problem. Academic details have been saved locally.",

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

      {/* PAGE HEADER */}

      <div className="page-header">

        <h1>
          Academic Details
        </h1>

        <p>
          Complete your academic information.
        </p>

      </div>

      {/* FORM */}

      <div className="form-card profile-form-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* 10TH */}

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

            {/* 12TH */}

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

            {/* GRADUATION */}

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

            {/* SEMESTER */}

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

            {/* BACKLOGS */}

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

          {/* SAVE BUTTON */}

          <button
            type="submit"
            className="main-button profile-save-button"
            disabled={saving}
          >

            {saving
              ? "Saving Academic Details..."
              : "Save Academic Details →"
            }

          </button>

          {/* MESSAGE */}

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

      </div>

    </div>

  );

}

export default AcademicDetails;