import api from "./api";


const predictionService = {

  // ==========================================
  // PREDICT CAREER
  // ==========================================

  predict: async (data) => {

    const response =
      await api.post(
        "/predictions/predict",
        data
      );

    return response.data;
  },


  // ==========================================
  // GET PREDICTIONS BY STUDENT ID
  // ==========================================

  getByStudentId: async (studentId) => {

    const response =
      await api.get(
        `/predictions/student/${studentId}`
      );

    return response.data;
  },


  // ==========================================
  // GET ALL PREDICTIONS
  // ==========================================

  getAll: async () => {

    const response =
      await api.get(
        "/predictions"
      );

    return response.data;
  }

};


export default predictionService;