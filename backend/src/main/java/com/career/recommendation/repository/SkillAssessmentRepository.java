package com.career.recommendation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.career.recommendation.model.SkillAssessment;

@Repository
public interface SkillAssessmentRepository
        extends JpaRepository<SkillAssessment, Long> {


    // =====================================================
    // GET ALL ASSESSMENTS OF STUDENT
    // =====================================================

    List<SkillAssessment> findByStudentId(
            Long studentId
    );


    // =====================================================
    // GET CURRENT/LATEST ATTEMPT
    // =====================================================
    //
    // Ek attempt ke saare questions retrieve honge.
    //
    // =====================================================

    List<SkillAssessment> findByStudentIdAndAttemptId(
            Long studentId,
            String attemptId
    );


    // =====================================================
    // GET LATEST ATTEMPT ID
    // =====================================================
    //
    // Current implementation me previous assessment
    // save karne se pehle delete ho raha hai, isliye
    // student ke paas normally ek hi attempt rahega.
    //
    // =====================================================

    SkillAssessment
    findTopByStudentIdOrderByIdDesc(
            Long studentId
    );


    // =====================================================
    // DELETE STUDENT ASSESSMENTS
    // =====================================================

    void deleteByStudentId(
            Long studentId
    );
}