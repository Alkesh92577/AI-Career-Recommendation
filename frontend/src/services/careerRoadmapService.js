import api from "./api";

const careerRoadmapService = {

    // ==========================================
    // GET ROADMAP BY STUDENT ID
    // ==========================================

    getByStudentId: async (studentId) => {

        if (!studentId) {

            throw new Error(
                "Student ID is required"
            );

        }

        const response =
            await api.get(
                `/career-roadmap/student/${studentId}`
            );

        return response.data;
    },


    // ==========================================
    // GENERATE CAREER ROADMAP
    // ==========================================

    generate: async (studentId) => {

        if (!studentId) {

            throw new Error(
                "Student ID is required"
            );

        }

        const response =
            await api.post(
                `/career-roadmap/generate/${studentId}`
            );

        return response.data;
    },


    // ==========================================
    // DELETE CAREER ROADMAP
    // ==========================================

    deleteByStudentId: async (studentId) => {

        if (!studentId) {

            throw new Error(
                "Student ID is required"
            );

        }

        const response =
            await api.delete(
                `/career-roadmap/student/${studentId}`
            );

        return response.data;
    }

};

export default careerRoadmapService;