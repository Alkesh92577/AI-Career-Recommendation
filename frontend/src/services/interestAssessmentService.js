import api from "./api";


const interestAssessmentService = {

    // ==========================================
    // GET ALL INTEREST ASSESSMENTS
    // ==========================================

    getByStudentId: async (studentId) => {

        const response =
            await api.get(
                `/interest-assessments/student/${studentId}`
            );

        return response.data;
    },


    // ==========================================
    // GET LATEST INTEREST TEST
    // ==========================================

    getLatest: async (studentId) => {

        const response =
            await api.get(
                `/interest-assessments/student/${studentId}/latest`
            );

        return response.data;
    },


    // ==========================================
    // SAVE COMPLETE TEST
    // ==========================================

    saveAll: async (
        studentId,
        assessments
    ) => {

        const response =
            await api.post(
                `/interest-assessments/student/${studentId}/all`,
                assessments
            );

        return response.data;
    },


    // ==========================================
    // DELETE HISTORY
    // ==========================================

    deleteByStudentId: async (studentId) => {

        const response =
            await api.delete(
                `/interest-assessments/student/${studentId}`
            );

        return response.data;
    }

};


export default interestAssessmentService;