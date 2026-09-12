import api from "./api";

const predictionService = {

    // ==========================================
    // PREDICT CAREER
    // ==========================================

    predict: async (data) => {

        if (!data) {

            throw new Error(
                "Prediction data is required."
            );
        }

        if (!data.studentId) {

            throw new Error(
                "Student ID is required for prediction."
            );
        }

        console.log(
            "\n===================================="
        );

        console.log(
            "📤 SENDING PREDICTION DATA"
        );

        console.log(
            "===================================="
        );

        console.log(
            JSON.stringify(
                data,
                null,
                2
            )
        );

        const response =
            await api.post(
                "/predictions/predict",
                data
            );

        console.log(
            "\n===================================="
        );

        console.log(
            "🤖 PREDICTION API RESPONSE"
        );

        console.log(
            "===================================="
        );

        console.log(
            JSON.stringify(
                response.data,
                null,
                2
            )
        );

        console.log(
            "===================================="
        );

        return response.data;
    },


    // ==========================================
    // GET PREDICTIONS BY STUDENT ID
    // ==========================================

    getByStudentId: async (
        studentId
    ) => {

        if (!studentId) {

            throw new Error(
                "Student ID is required."
            );
        }

        const response =
            await api.get(
                `/predictions/student/${studentId}`
            );

        return response.data;
    },


    // ==========================================
    // GET ALL PREDICTIONS
    // ==========================================

    getAll: async () => {

        const response =
            await api.get(
                "/predictions"
            );

        return response.data;
    }

};


export default predictionService;