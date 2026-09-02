import axios from "axios";

const API_URL =
    "http://10.72.150.168:8080/api/skill-assessments";

const skillAssessmentService = {

    // ==========================================
    // GET SAVED ASSESSMENT
    // ==========================================

    getByStudentId: async (studentId) => {

        const response = await axios.get(
            `${API_URL}/student/${studentId}`
        );

        return response.data;
    },


    // ==========================================
    // SAVE ASSESSMENT
    // ==========================================

    save: async (studentId, assessments) => {

        const response = await axios.post(
            `${API_URL}/student/${studentId}`,
            assessments
        );

        return response.data;
    }

};

export default skillAssessmentService;