import axios from "axios";

const API_URL = "http://10.72.150.168:8080/api/skills";

const skillService = {


  // ==========================================
  // GET SKILLS BY STUDENT ID
  // ==========================================

  getByStudentId: async (studentId) => {

    const response = await axios.get(
      `${API_URL}/student/${studentId}`
    );

    return response.data;
  },


  // ==========================================
  // ADD SKILL
  // ==========================================

  create: async (skill) => {

    const response = await axios.post(
      API_URL,
      skill
    );

    return response.data;
  },


  // ==========================================
  // UPDATE SKILL
  // ==========================================

  update: async (id, skill) => {

    const response = await axios.put(
      `${API_URL}/${id}`,
      skill
    );

    return response.data;
  },


  // ==========================================
  // DELETE SKILL
  // ==========================================

  delete: async (id) => {

    await axios.delete(
      `${API_URL}/${id}`
    );

  }

};


export default skillService;