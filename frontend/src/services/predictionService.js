import axios from "axios";

const API_URL =
  "http://10.72.150.168:8080/api/predictions";

const predictionService = {

  predict: async (data) => {

    const response =
      await axios.post(
        `${API_URL}/predict`,
        data
      );

    return response.data;
  },


  getByStudentId: async (studentId) => {

    const response =
      await axios.get(
        `${API_URL}/student/${studentId}`
      );

    return response.data;
  },


  getAll: async () => {

    const response =
      await axios.get(API_URL);

    return response.data;
  }

};

export default predictionService;