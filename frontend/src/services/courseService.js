import api from "./api";


// ==========================================
// GET ALL COURSES
// ==========================================

const getAllCourses = async () => {

  const response = await api.get(
    "/courses"
  );

  return response.data;

};


// ==========================================
// GET COURSES BY CAREER
// ==========================================

const getCoursesByCareer = async (
  career
) => {

  const response = await api.get(
    `/courses/career/${encodeURIComponent(career)}`
  );

  return response.data;

};


// ==========================================
// GET COURSE BY ID
// ==========================================

const getCourseById = async (
  id
) => {

  const response = await api.get(
    `/courses/${id}`
  );

  return response.data;

};


// ==========================================
// ADD COURSE
// ==========================================

const addCourse = async (
  course
) => {

  const response = await api.post(
    "/courses",
    course
  );

  return response.data;

};


// ==========================================
// EXPORT
// ==========================================

const courseService = {

  getAllCourses,

  getCoursesByCareer,

  getCourseById,

  addCourse

};


export default courseService;