package com.career.recommendation.service;

import com.career.recommendation.model.InterestAssessment;
import com.career.recommendation.repository.InterestAssessmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InterestAssessmentService {

    private final InterestAssessmentRepository repository;

    public InterestAssessmentService(
            InterestAssessmentRepository repository) {

        this.repository = repository;
    }

    // =====================================================
    // GET ALL STUDENT ASSESSMENTS
    // =====================================================

    public List<InterestAssessment> getByStudentId(
            Long studentId) {

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }

        return repository.findByStudentId(studentId);
    }

    // =====================================================
    // GET PARTICULAR ATTEMPT
    // =====================================================

    public List<InterestAssessment> getByAttempt(
            Long studentId,
            String attemptId) {

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }

        if (attemptId == null ||
                attemptId.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Attempt ID is required"
            );
        }

        return repository.findByStudentIdAndAttemptId(
                studentId,
                attemptId
        );
    }

    // =====================================================
    // GET LATEST INTEREST TEST
    // =====================================================

    public List<InterestAssessment> getLatestAttempt(
            Long studentId) {

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }

        List<InterestAssessment> latestRows =
                repository.findTop10ByStudentIdOrderByIdDesc(
                        studentId
                );

        if (latestRows == null ||
                latestRows.isEmpty()) {

            return List.of();
        }

        // =================================================
        // Latest row ka attempt ID
        // =================================================

        String latestAttemptId =
                latestRows.get(0).getAttemptId();

        // =================================================
        // Same attempt ki complete rows
        // =================================================

        return repository.findByStudentIdAndAttemptId(
                studentId,
                latestAttemptId
        );
    }

    // =====================================================
    // SAVE COMPLETE TEST
    // =====================================================

    @Transactional
    public List<InterestAssessment> saveAll(
            List<InterestAssessment> assessments) {

        if (assessments == null ||
                assessments.isEmpty()) {

            throw new IllegalArgumentException(
                    "Interest assessment data cannot be empty"
            );
        }

        // =================================================
        // STUDENT ID
        // =================================================

        Long studentId =
                assessments.get(0).getStudentId();

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }

        // =================================================
        // ONE NEW ATTEMPT ID
        // =================================================

        String attemptId =
                "ATTEMPT-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        // =================================================
        // VALIDATE ANSWERS
        // =================================================

        for (InterestAssessment assessment :
                assessments) {

            if (assessment == null) {

                throw new IllegalArgumentException(
                        "Invalid interest assessment"
                );
            }

            // Always use student ID from first record

            if (assessment.getStudentId() == null) {

                assessment.setStudentId(
                        studentId
                );
            }

            if (!studentId.equals(
                    assessment.getStudentId())) {

                throw new IllegalArgumentException(
                        "All answers must belong to same student"
                );
            }

            // New row

            assessment.setId(null);

            // Same attempt for all questions

            assessment.setAttemptId(
                    attemptId
            );
        }

        // =================================================
        // SAVE
        // =================================================

        return repository.saveAll(
                assessments
        );
    }

    // =====================================================
    // DELETE ALL HISTORY
    // =====================================================

    @Transactional
    public void deleteByStudentId(
            Long studentId) {

        if (studentId == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }

        repository.deleteByStudentId(
                studentId
        );
    }
}