import { useEffect, useRef, useState } from "react";
import studentService from "../services/studentService";

function Profile() {

  // ==========================================
  // PROFILE STATE
  // ==========================================

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    programmingKnowledge: "",
    preferredField: "",
    education: "",
    experience: ""
  });


  // ==========================================
  // STUDENT ID
  // ==========================================

  const [studentId, setStudentId] =
    useState(null);


  // ==========================================
  // LOADING / SAVING
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // MESSAGE
  // ==========================================

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");


  // ==========================================
  // MESSAGE TIMER
  // ==========================================

  const messageTimer =
    useRef(null);


  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  const showMessage = (
    text,
    type
  ) => {

    if (
      messageTimer.current
    ) {

      clearTimeout(
        messageTimer.current
      );

    }

    setMessage(text);
    setMessageType(type);

    messageTimer.current =
      setTimeout(() => {

        setMessage("");
        setMessageType("");

        messageTimer.current =
          null;

      }, 3000);

  };


  // ==========================================
  // CLEAR TIMER
  // ==========================================

  useEffect(() => {

    return () => {

      if (
        messageTimer.current
      ) {

        clearTimeout(
          messageTimer.current
        );

      }

    };

  }, []);


  // ==========================================
  // GET USER ID
  // ==========================================

  const getUserId = () => {

    return localStorage.getItem(
      "userId"
    );

  };


  // ==========================================
  // CHECK FIELD FILLED
  // ==========================================

  const isFieldFilled = (
    value
  ) => {

    if (
      value === null ||
      value === undefined
    ) {

      return false;

    }

    if (
      typeof value === "string"
    ) {

      return (
        value.trim() !== ""
      );

    }

    return true;

  };


  // ==========================================
  // PROFILE COMPLETION CALCULATOR
  // ==========================================

  const calculateCompletion = (
    profileData
  ) => {

    const fields = [

      profileData.fullName,

      profileData.email,

      profileData.programmingKnowledge,

      profileData.preferredField,

      profileData.education,

      profileData.experience

    ];


    const completed =
      fields.filter(
        (field) =>
          isFieldFilled(field)
      ).length;


    return Math.round(
      (
        completed /
        fields.length
      ) * 100
    );

  };


  // ==========================================
  // SAVE PROFILE COMPLETION
  // ==========================================

  const saveCompletion = (
    profileData
  ) => {

    const calculatedCompletion =
      calculateCompletion(
        profileData
      );

    localStorage.setItem(
      "profileCompletion",
      String(
        calculatedCompletion
      )
    );

    window.dispatchEvent(
      new Event(
        "profileUpdated"
      )
    );

    return calculatedCompletion;

  };


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {

    const loadProfile =
      async () => {

        const userId =
          getUserId();


        if (
          !userId
        ) {

          showMessage(
            "User session not found. Please login again.",
            "error"
          );

          setLoading(false);

          return;

        }


        try {

          const data =
            await studentService.getByUserId(
              userId
            );


          if (
            data
          ) {

            setStudentId(
              data.id
            );


            localStorage.setItem(
              "studentId",
              data.id
            );


            const loadedProfile = {

              fullName:
                data.fullName || "",

              email:
                data.email || "",

              programmingKnowledge:
                data.programmingKnowledge || "",

              preferredField:
                data.preferredField || "",

              education:
                data.education || "",

              experience:
                data.experience ??
                ""

            };


            setProfile(
              loadedProfile
            );


            saveCompletion(
              loadedProfile
            );

          }

        } catch (
          error
        ) {

          console.error(
            "Profile GET Error:",
            error
          );


          if (
            error.response?.status ===
            404
          ) {

            const newProfile = {

              fullName:
                localStorage.getItem(
                  "userName"
                ) || "",

              email:
                localStorage.getItem(
                  "userEmail"
                ) || "",

              programmingKnowledge:
                "",

              preferredField:
                "",

              education:
                "",

              experience:
                ""

            };


            setProfile(
              newProfile
            );


            saveCompletion(
              newProfile
            );

          } else {

            showMessage(
              "The profile is not loading.",
              "error"
            );

          }

        } finally {

          setLoading(false);

        }

      };


    loadProfile();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    e
  ) => {

    const {
      name,
      value
    } = e.target;


    setProfile(
      (
        previousProfile
      ) => ({

        ...previousProfile,

        [name]:
          value

      })
    );

  };


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit =
    async (
      e
    ) => {

      e.preventDefault();

      setSaving(true);

      setMessage("");
      setMessageType("");


      const userId =
        getUserId();


      if (
        !userId
      ) {

        showMessage(
          "User not found. Please login again.",
          "error"
        );

        setSaving(false);

        return;

      }


      const studentData = {

        userId:
          Number(userId),

        fullName:
          profile.fullName.trim(),

        email:
          profile.email.trim(),

        programmingKnowledge:
          profile.programmingKnowledge,

        preferredField:
          profile.preferredField,

        education:
          profile.education.trim(),

        experience:
          profile.experience === ""
            ? null
            : Number(
                profile.experience
              )

      };


      try {

        let data;


        // ======================================
        // UPDATE PROFILE
        // ======================================

        if (
          studentId
        ) {

          data =
            await studentService.update(
              studentId,
              studentData
            );

        }


        // ======================================
        // CREATE PROFILE
        // ======================================

        else {

          data =
            await studentService.create(
              studentData
            );

        }


        // ======================================
        // SAVE STUDENT ID
        // ======================================

        setStudentId(
          data.id
        );


        localStorage.setItem(
          "studentId",
          data.id
        );


        // ======================================
        // UPDATED PROFILE
        // ======================================

        const updatedProfile = {

          fullName:
            data.fullName || "",

          email:
            data.email || "",

          programmingKnowledge:
            data.programmingKnowledge || "",

          preferredField:
            data.preferredField || "",

          education:
            data.education || "",

          experience:
            data.experience ??
            ""

        };


        // ======================================
        // UPDATE STATE
        // ======================================

        setProfile(
          updatedProfile
        );


        // ======================================
        // UPDATE LOCAL USER DATA
        // ======================================

        localStorage.setItem(
          "userName",
          updatedProfile.fullName
        );


        localStorage.setItem(
          "userEmail",
          updatedProfile.email
        );


        // ======================================
        // UPDATE COMPLETION
        // ======================================

        const newCompletion =
          saveCompletion(
            updatedProfile
          );


        // ======================================
        // SUCCESS MESSAGE
        // ======================================

        showMessage(
          `Profile successfully saved! Completion: ${newCompletion}%`,
          "success"
        );

      } catch (
        error
      ) {

        console.error(
          "PROFILE SAVE ERROR:",
          error
        );


        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error;


        showMessage(
          backendMessage ||
          "The profile is not saving. Check the backend.",
          "error"
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================
  // CURRENT COMPLETION
  // ==========================================

  const completion =
    calculateCompletion(
      profile
    );


  // ==========================================
  // KEEP LOCAL STORAGE UPDATED
  // ==========================================

  useEffect(() => {

    saveCompletion(
      profile
    );

  }, [
    completion
  ]);


  // ==========================================
  // LOADING
  // ==========================================

  if (
    loading
  ) {

    return (

      <div className="page-container">

        <div className="form-card">

          <h2>
            Loading Profile...
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
          My Profile
        </h1>

        <p>
          Complete your profile and career information.
        </p>

      </div>


      {/* PROFILE COMPLETION */}

      <div className="profile-completion-card">

        <div>

          <h2>
            Profile Completion
          </h2>

          <p>
            Complete your profile so we can provide better career recommendations.
          </p>

        </div>

        <div className="completion-circle">

          <span>
            {completion}%
          </span>

        </div>

      </div>


      {/* PROFILE FORM */}

      <div className="form-card profile-form-card">

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-grid">


            {/* FULL NAME */}

            <div>

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={
                  profile.fullName
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* EMAIL */}

            <div>

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={
                  profile.email
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* PROGRAMMING KNOWLEDGE */}

            <div>

              <label>
                Programming Knowledge
              </label>

              <select
                name="programmingKnowledge"
                value={
                  profile.programmingKnowledge
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select Level
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </div>


            {/* CAREER FIELD */}

            <div>

              <label>
                Preferred Career Field
              </label>

              <select
                name="preferredField"
                value={
                  profile.preferredField
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select Career
                </option>

                <option value="Software Developer">
                  Software Developer
                </option>

                <option value="Data Analyst">
                  Data Analyst
                </option>

                <option value="Web Developer">
                  Web Developer
                </option>

                <option value="Data Scientist">
                  Data Scientist
                </option>

                <option value="AI Engineer">
                  AI Engineer
                </option>

                <option value="Cyber Security">
                  Cyber Security
                </option>

              </select>

            </div>


            {/* EDUCATION */}

            <div>

              <label>
                Education
              </label>

              <input
                type="text"
                name="education"
                placeholder="Example: B.Tech CSE"
                value={
                  profile.education
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* EXPERIENCE */}

            <div>

              <label>
                Experience (Years)
              </label>

              <input
                type="number"
                name="experience"
                placeholder="Example: 1"
                min="0"
                value={
                  profile.experience
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>


          {/* SAVE BUTTON */}

          <button
            type="submit"
            className="main-button profile-save-button"
            disabled={
              saving
            }
          >

            {saving
              ? "Saving Profile..."
              : "Save Profile →"}

          </button>


          {/* MESSAGE */}

          {message && (

            <p
              className={
                messageType ===
                "success"
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

export default Profile;