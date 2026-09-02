import axios from "axios";


const API_URL =
    "http://10.72.150.168:8080/api/roadmap-progress";


const roadmapProgressService = {


    // ==========================================
    // GET PROGRESS BY STUDENT
    // ==========================================

    getByStudentId: async (studentId) => {

        const response =
            await axios.get(
                `${API_URL}/student/${studentId}`
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
            await axios.post(
                `${API_URL}/update`,
                {
                    studentId:
                        studentId,

                    roadmapId:
                        roadmapId,

                    completed:
                        completed
                }
            );

        return response.data;

    }

};


export default roadmapProgressService;