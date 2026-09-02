import axios from "axios";

const API_URL = "http://10.72.150.168:8080/api/courses";


// ==========================================
// GET ALL COURSES
// ==========================================

const getAllCourses = async () => {

  const response = await axios.get(API_URL);

  return response.data;
};


// ==========================================
// GET COURSES BY CAREER
// ==========================================

const getCoursesByCareer = async (career) => {

  const response = await axios.get(
    `${API_URL}/career/${encodeURIComponent(career)}`
  );

  return response.data;
};


// ==========================================
// GET COURSE BY ID
// ==========================================

const getCourseById = async (id) => {

  const response = await axios.get(
    `${API_URL}/${id}`
  );

  return response.data;
};


// ==========================================
// EXPORT
// ==========================================

const courseService = {

  getAllCourses,

  getCoursesByCareer,

  getCourseById

};

export default courseService;