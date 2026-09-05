import api from "./api";

const skillService = {

  // ==========================================
  // GET SKILLS BY STUDENT ID
  // ==========================================

  getByStudentId: async (studentId) => {

    const response = await api.get(
      `/skills/student/${studentId}`
    );

    return response.data;
  },


  // ==========================================
  // ADD SKILL
  // ==========================================

  create: async (skill) => {

    const response = await api.post(
      "/skills",
      skill
    );

    return response.data;
  },


  // ==========================================
  // UPDATE SKILL
  // ==========================================

  update: async (id, skill) => {

    const response = await api.put(
      `/skills/${id}`,
      skill
    );

    return response.data;
  },


  // ==========================================
  // DELETE SKILL
  // ==========================================

  delete: async (id) => {

    await api.delete(
      `/skills/${id}`
    );

  }

};

export default skillService;