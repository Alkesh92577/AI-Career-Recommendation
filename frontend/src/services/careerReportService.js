import api from "./api";

const careerReportService = {

  // ==========================================
  // GET CAREER REPORT
  // ==========================================

  getCareerReport: async (studentId) => {

    if (!studentId) {

      throw new Error(
        "Student ID is required"
      );

    }

    const response = await api.get(
      `/career-report/${studentId}`
    );

    return response.data;

  }

};

export default careerReportService;