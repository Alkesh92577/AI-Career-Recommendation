import api from "./api";


// =====================================================
// GET QUESTIONS BY STUDENT SKILLS
// =====================================================

const getByStudentId = async (
  studentId,
  skillNames
) => {

  // ==========================================
  // STUDENT ID VALIDATION
  // ==========================================

  if (!studentId) {

    throw new Error(
      "Student ID is required"
    );

  }


  // ==========================================
  // SKILLS VALIDATION
  // ==========================================

  if (
    !Array.isArray(skillNames) ||
    skillNames.length === 0
  ) {

    console.warn(
      "No skills found for assessment"
    );

    return [];

  }


  // ==========================================
  // CLEAN SKILLS
  // ==========================================

  const cleanSkills =
    skillNames
      .filter(
        (skill) =>
          skill !== null &&
          skill !== undefined &&
          String(skill).trim() !== ""
      )
      .map(
        (skill) =>
          String(skill).trim()
      );


  console.log(
    "================================"
  );

  console.log(
    "ASSESSMENT REQUEST"
  );

  console.log(
    "Student ID:",
    studentId
  );

  console.log(
    "Skills:",
    cleanSkills
  );


  // ==========================================
  // SEND REQUEST TO BACKEND
  // ==========================================

  const response =
    await api.post(
      `/assessment-questions/student/${studentId}`,
      cleanSkills
    );


  console.log(
    "Assessment API Response:",
    response.data
  );

  console.log(
    "Questions Count:",
    Array.isArray(response.data)
      ? response.data.length
      : 0
  );

  console.log(
    "================================"
  );


  return response.data;

};


// =====================================================
// EXPORT
// =====================================================

export default {

  getByStudentId

};