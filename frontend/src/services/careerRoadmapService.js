import axios from "axios";

const API_URL =
    "http://10.72.150.168:8080/api/career-roadmap";

const careerRoadmapService = {

    getByStudentId: async (studentId) => {

        const response =
            await axios.get(
                `${API_URL}/student/${studentId}`
            );

        return response.data;
    },

    generate: async (studentId) => {

        const response =
            await axios.post(
                `${API_URL}/generate/${studentId}`
            );

        return response.data;
    },

    deleteByStudentId: async (studentId) => {

        const response =
            await axios.delete(
                `${API_URL}/student/${studentId}`
            );

        return response.data;
    }

};

export default careerRoadmapService;