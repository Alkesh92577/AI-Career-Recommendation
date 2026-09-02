import axios from "axios";

const API_URL = "http://10.72.150.168:8080/api/career-report";

const careerReportService = {

  // ==========================================
  // GET CAREER REPORT
  // ==========================================

  getCareerReport: async (studentId) => {

    const response = await axios.get(
      `${API_URL}/${studentId}`
    );

    return response.data;
  }

};

export default careerReportService;