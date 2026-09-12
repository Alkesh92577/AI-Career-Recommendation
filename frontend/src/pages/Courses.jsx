import { useEffect, useState } from "react";
import courseService from "../services/courseService";

function Courses() {


  // ==========================================
  // COURSES
  // ==========================================

  const [courses, setCourses] =
    useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // ERROR
  // ==========================================

  const [error, setError] =
    useState("");


  // ==========================================
  // SELECTED CAREER
  // ==========================================

  const [selectedCareer, setSelectedCareer] =
    useState("All");


  // ==========================================
  // CAREER LIST
  // ==========================================

  const careers = [

    "All",

    "Software Developer",

    "Data Analyst",

    "Web Developer",

    "Data Scientist",

    "AI / ML Engineer",

    "Cyber Security"

  ];


  // ==========================================
  // LOAD COURSES
  // ==========================================

  useEffect(() => {


    const loadCourses =
      async () => {


        try {


          setLoading(true);

          setError("");


          const data =
            await courseService
              .getAllCourses();


          console.log(
            "COURSES API RESPONSE:",
            data
          );


          if (Array.isArray(data)) {

            setCourses(data);

          } else {

            console.error(
              "Invalid courses response:",
              data
            );

            setCourses([]);

          }


        } catch (error) {


          console.error(
            "COURSES LOAD ERROR:",
            error
          );


          setError(

            error.response?.data?.message ||

            error.message ||

            "Courses are not loading."

          );


          setCourses([]);


        } finally {


          setLoading(false);


        }


      };


    loadCourses();


  }, []);


  // ==========================================
  // FILTER COURSES
  // ==========================================

  const filteredCourses =

    selectedCareer === "All"

      ? courses

      : courses.filter(
          (course) =>

            course.career?.trim()
              .toLowerCase() ===

            selectedCareer
              .trim()
              .toLowerCase()
        );


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {


    return (

      <div className="page-container">
        <div className="form-card">

          <h2>
            📚 Loading Courses...
          </h2>

          <p>
            Please wait while courses are loading.
          </p>

        </div>

      </div>

    );


  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="page-container">


      {/* HEADER */}

      <div className="page-header">

        <h1>
          📚 Recommended Courses
        </h1>


        <p>
          Check out courses and learning resources relevant to your career.
        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div
          className="error-message"
          style={{
            marginBottom: "20px"
          }}
        >

          {error}

        </div>

      )}


      {/* SELECT CAREER */}

      <div
        className="form-card"
        style={{
          marginBottom: "25px"
        }}
      >

        <h2>
          🎯 Select Career
        </h2>


        <div
          style={{

            display: "flex",

            flexWrap: "wrap",

            gap: "10px",

            marginTop: "15px"

          }}
        >

          {careers.map(

            (career) => (

              <button

                key={career}

                type="button"

                onClick={() =>
                  setSelectedCareer(career)
                }

                style={{

                  padding:
                    "10px 18px",

                  borderRadius:
                    "10px",

                  border:
                    "none",

                  cursor:
                    "pointer",

                  fontWeight:
                    "600",

                  background:

                    selectedCareer === career

                      ? "linear-gradient(90deg,#4f46e5,#9333ea)"

                      : "#e5e7eb",

                  color:

                    selectedCareer === career

                      ? "white"

                      : "#111827"

                }}

              >

                {career}

              </button>

            )

          )}

        </div>

      </div>


      {/* COURSE COUNT */}

      <div
        className="form-card"
        style={{
          marginBottom: "25px"
        }}
      >

        <h2>
          📖 Available Courses
        </h2>


        <p>

          {filteredCourses.length}{" "}

          {filteredCourses.length === 1
            ? "course"
            : "courses"}

          {selectedCareer !== "All" &&
            ` for ${selectedCareer}`}

        </p>

      </div>


      {/* NO COURSES */}

      {filteredCourses.length === 0 ? (


        <div className="form-card">

          <h2>
            😔 No Courses Found
          </h2>


          <p>

            {courses.length === 0

              ? "No courses are currently available in the database."

              : `No courses found for ${selectedCareer}.`

            }

          </p>

        </div>


      ) : (


        <div

          style={{

            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",

            gap:
              "20px"

          }}

        >


          {filteredCourses.map(

            (course) => (


              <div

                key={course.id}

                className="form-card"

                style={{

                  margin:
                    0,

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "space-between"

                }}

              >


                <div>


                  <div

                    style={{

                      fontSize:
                        "40px",

                      marginBottom:
                        "10px"

                    }}

                  >

                    📚

                  </div>


                  <h2>

                    {course.courseName ||
                      "Course"}

                  </h2>


                  {course.career && (

                    <p>

                      🎯{" "}

                      <strong>
                        Career:
                      </strong>{" "}

                      {course.career}

                    </p>

                  )}


                  {course.platform && (

                    <p>

                      🏢{" "}

                      <strong>
                        Platform:
                      </strong>{" "}

                      {course.platform}

                    </p>

                  )}


                  {course.duration && (

                    <p>

                      ⏱️{" "}

                      <strong>
                        Duration:
                      </strong>{" "}

                      {course.duration}

                    </p>

                  )}


                </div>


                {course.courseUrl && (

                  <div
                    style={{
                      marginTop:
                        "20px"
                    }}
                  >

                    <a

                      href={
                        course.courseUrl
                      }

                      target="_blank"

                      rel="noopener noreferrer"

                      className="main-button"

                      style={{

                        display:
                          "inline-block",

                        textDecoration:
                          "none",

                        textAlign:
                          "center",

                        width:
                          "100%",

                        boxSizing:
                          "border-box"

                      }}

                    >

                      🚀 Start Course

                    </a>

                  </div>

                )}


              </div>

            )

          )}


        </div>

      )}


    </div>

  );


}


export default Courses;