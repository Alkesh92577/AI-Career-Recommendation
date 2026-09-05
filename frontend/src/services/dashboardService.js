import api from "./api";


const dashboardService = {

  // ==========================================
  // GET DASHBOARD
  // ==========================================

  getDashboard: async (studentId) => {

    const response =
      await api.get(
        `/dashboard/${studentId}`
      );

    return response.data;
  }

};


export default dashboardService;