import api from "./api";


const skillAssessmentService = {

    // ==========================================
    // GET SAVED ASSESSMENT
    // ==========================================

    getByStudentId: async (studentId) => {

        const response = await api.get(
            `/skill-assessments/student/${studentId}`
        );

        return response.data;
    },


    // ==========================================
    // SAVE ASSESSMENT
    // ==========================================

    save: async (
        studentId,
        assessments
    ) => {

        const response = await api.post(
            `/skill-assessments/student/${studentId}`,
            assessments
        );

        return response.data;
    }

};


export default skillAssessmentService;