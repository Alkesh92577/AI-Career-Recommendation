package com.career.recommendation.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.career.recommendation.model.SkillAssessment;
import com.career.recommendation.repository.SkillAssessmentRepository;

@Service
public class SkillAssessmentService {

    private final SkillAssessmentRepository repository;

    public SkillAssessmentService(
            SkillAssessmentRepository repository) {

        this.repository = repository;
    }


    // =====================================================
    // GET STUDENT ASSESSMENTS
    // =====================================================

    public List<SkillAssessment> getByStudentId(
            Long studentId) {

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }

        return repository.findByStudentId(studentId);
    }


    // =====================================================
    // SAVE CURRENT ASSESSMENT
    // =====================================================
    //
    // Ek complete test ke saare questions ko
    // SAME attemptId milega.
    //
    // Example:
    //
    // ATTEMPT-AB12CD34
    //
    // Q1 -> ATTEMPT-AB12CD34
    // Q2 -> ATTEMPT-AB12CD34
    // Q3 -> ATTEMPT-AB12CD34
    //
    // Isse current test ke saare answers ko
    // ek hi attempt ke roop me identify kar sakte hain.
    //
    // =====================================================

    @Transactional
    public List<SkillAssessment> saveAssessment(
            Long studentId,
            List<SkillAssessment> assessments) {

        // =================================================
        // VALIDATION
        // =================================================

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }


        if (assessments == null ||
                assessments.isEmpty()) {

            throw new IllegalArgumentException(
                    "Assessment data cannot be empty"
            );
        }


        // =================================================
        // CREATE NEW ATTEMPT ID
        // =================================================

        String attemptId =
                "ATTEMPT-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();


        // =================================================
        // DELETE PREVIOUS CURRENT RESULT
        // =================================================
        //
        // IMPORTANT:
        //
        // Abhi tumhare project me previous assessment
        // delete karna already implemented hai.
        //
        // Isko filhaal rakha ja raha hai taaki
        // Prediction me old attempts mix na hon.
        //
        // =================================================

        repository.deleteByStudentId(studentId);


        // =================================================
        // SET STUDENT + ATTEMPT ID
        // =================================================

        for (SkillAssessment assessment : assessments) {

            if (assessment == null) {

                throw new IllegalArgumentException(
                        "Invalid assessment data"
                );
            }


            // New database row
            assessment.setId(null);


            // Correct student
            assessment.setStudentId(studentId);


            // Same attempt ID for complete test
            assessment.setAttemptId(attemptId);
        }


        // =================================================
        // SAVE CURRENT ASSESSMENT
        // =================================================

        return repository.saveAll(assessments);
    }
}