import api from "./api";

const studentService = {

  // ==========================================
  // GET PROFILE BY USER ID
  // ==========================================

  getByUserId: async (userId) => {

    const response = await api.get(
      `/students/user/${userId}`
    );

    return response.data;
  },


  // ==========================================
  // CREATE PROFILE
  // ==========================================

  create: async (student) => {

    const response = await api.post(
      "/students",
      student
    );

    return response.data;
  },


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  update: async (id, student) => {

    const response = await api.put(
      `/students/${id}`,
      student
    );

    return response.data;
  },


  // ==========================================
  // UPDATE ACADEMIC DETAILS
  // ==========================================

  updateAcademic: async (
    studentId,
    academicData
  ) => {

    const response = await api.put(
      `/students/${studentId}/academic`,
      academicData
    );

    return response.data;
  }

};

export default studentService;