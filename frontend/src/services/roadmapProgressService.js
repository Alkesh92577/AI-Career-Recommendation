import api from "./api";


const roadmapProgressService = {


    // ==========================================
    // GET PROGRESS BY STUDENT
    // ==========================================

    getByStudentId: async (studentId) => {

        const response =
            await api.get(
                `/roadmap-progress/student/${studentId}`
            );

        return response.data;

    },


    // ==========================================
    // UPDATE PROGRESS
    // ==========================================

    updateProgress: async (
        studentId,
        roadmapId,
        completed
    ) => {

        const response =
            await api.post(
                "/roadmap-progress/update",
                {
                    studentId: studentId,

                    roadmapId: roadmapId,

                    completed: completed
                }
            );

        return response.data;

    }

};


export default roadmapProgressService;