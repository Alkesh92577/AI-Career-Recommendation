import axios from "axios";

const API_URL =
    "http://10.72.150.168:8080/api/assessment-questions";


// =====================================================
// GET QUESTIONS BY STUDENT SKILLS
// =====================================================

const getByStudentId = async (
    studentId,
    skillNames
) => {

    // ===================================================
    // STUDENT ID VALIDATION
    // ===================================================

    if (!studentId) {

        throw new Error(
            "Student ID is required"
        );

    }


    // ===================================================
    // SKILLS VALIDATION
    // ===================================================

    if (
        !skillNames ||
        skillNames.length === 0
    ) {

        console.warn(
            "No skills found for assessment"
        );

        return [];

    }


    // ===================================================
    // CLEAN SKILLS
    // ===================================================

    const cleanSkills =
        skillNames
            .filter(
                skill =>
                    skill &&
                    skill.trim() !== ""
            )
            .map(
                skill =>
                    skill.trim()
            );


    console.log(
        "Sending Skills To Backend:",
        cleanSkills
    );


    // ===================================================
    // SEND SKILLS TO BACKEND
    // ===================================================

    const response =
        await axios.post(
            `${API_URL}/student/${studentId}`,
            cleanSkills
        );


    // ===================================================
    // BACKEND RESPONSE
    // ===================================================

    console.log(
        "Questions From Backend:",
        response.data
    );


    return response.data;
};


// =====================================================
// EXPORT
// =====================================================

export default {

    getByStudentId

};