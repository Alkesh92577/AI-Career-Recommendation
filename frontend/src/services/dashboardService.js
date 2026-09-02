import axios from "axios";

const API_URL =
  "http://10.72.150.168:8080/api/dashboard";


const dashboardService = {

  // ==========================================
  // GET DASHBOARD
  // ==========================================

  getDashboard: async (studentId) => {

    const response =
      await axios.get(
        `${API_URL}/${studentId}`
      );

    return response.data;
  }

};


export default dashboardService;