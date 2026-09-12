import api from "./api";

const roadmapProgressService = {
    // ==========================================
    // GET PROGRESS BY STUDENT
    // ==========================================

    getByStudentId: async (studentId) => {
        if (!studentId) {
            throw new Error("Student ID is required");
        }

        const response = await api.get(
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
        if (!studentId) {
            throw new Error("Student ID is required");
        }

        if (!roadmapId) {
            throw new Error("Roadmap ID is required");
        }

        const response = await api.post(
            "/roadmap-progress/update",
            {
                studentId: Number(studentId),
                roadmapId: Number(roadmapId),
                completed: Boolean(completed)
            }
        );

        return response.data;
    }
};

export default roadmapProgressService;