import axios from "axios";

const API_URL = "http:// 10.72.150.168:8080/api/students";

const studentService = {

  // ==========================================
  // GET PROFILE BY USER ID
  // ==========================================

  getByUserId: async (userId) => {

    const response = await axios.get(
      `${API_URL}/user/${userId}`
    );

    return response.data;
  },


  // ==========================================
  // CREATE PROFILE
  // ==========================================

  create: async (student) => {

    const response = await axios.post(
      API_URL,
      student
    );

    return response.data;
  },


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  update: async (id, student) => {

    const response = await axios.put(
      `${API_URL}/${id}`,
      student
    );

    return response.data;
  },


  // ==========================================
  // UPDATE ACADEMIC DETAILS
  // ==========================================

  updateAcademic: async (studentId, academicData) => {

    const response = await axios.put(
      `${API_URL}/${studentId}/academic`,
      academicData
    );

    return response.data;
  }

};

export default studentService;