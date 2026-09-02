import axios from "axios";

const API_URL =
    "http://10.72.150.168:8080/api/interest-assessments";

const interestAssessmentService = {

    // GET ALL
    getByStudentId: async (studentId) => {

        const response =
            await axios.get(
                `${API_URL}/student/${studentId}`
            );

        return response.data;
    },


    // GET LATEST INTEREST TEST
    getLatest: async (studentId) => {

        const response =
            await axios.get(
                `${API_URL}/student/${studentId}/latest`
            );

        return response.data;
    },


    // SAVE COMPLETE TEST
    saveAll: async (
        studentId,
        assessments
    ) => {

        const response =
            await axios.post(
                `${API_URL}/student/${studentId}/all`,
                assessments
            );

        return response.data;
    },


    // DELETE HISTORY
    deleteByStudentId: async (studentId) => {

        const response =
            await axios.delete(
                `${API_URL}/student/${studentId}`
            );

        return response.data;
    }

};

export default interestAssessmentService;