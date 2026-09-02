package com.career.recommendation.repository;

import com.career.recommendation.model.InterestAssessment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterestAssessmentRepository
        extends JpaRepository<InterestAssessment, Long> {

    // =====================================================
    // GET ALL ASSESSMENTS OF STUDENT
    // =====================================================

    List<InterestAssessment> findByStudentId(
            Long studentId
    );

    // =====================================================
    // GET PARTICULAR ATTEMPT
    // =====================================================

    List<InterestAssessment> findByStudentIdAndAttemptId(
            Long studentId,
            String attemptId
    );

    // =====================================================
    // GET LATEST ASSESSMENT
    // =====================================================

    List<InterestAssessment>
    findTop10ByStudentIdOrderByIdDesc(
            Long studentId
    );

    // =====================================================
    // DELETE STUDENT HISTORY
    // =====================================================

    void deleteByStudentId(
            Long studentId
    );
}