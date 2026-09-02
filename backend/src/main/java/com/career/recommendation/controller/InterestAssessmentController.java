package com.career.recommendation.controller;

import com.career.recommendation.model.InterestAssessment;
import com.career.recommendation.service.InterestAssessmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interest-assessments")
@CrossOrigin(origins = "http://localhost:5173")
public class InterestAssessmentController {

    private final InterestAssessmentService service;

    public InterestAssessmentController(
            InterestAssessmentService service) {

        this.service = service;
    }

    // =====================================================
    // GET ALL HISTORY
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<InterestAssessment>>
    getByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getByStudentId(
                        studentId
                )
        );
    }

    // =====================================================
    // GET LATEST ATTEMPT
    // =====================================================

    @GetMapping("/student/{studentId}/latest")
    public ResponseEntity<List<InterestAssessment>>
    getLatestAttempt(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getLatestAttempt(
                        studentId
                )
        );
    }

    // =====================================================
    // GET PARTICULAR ATTEMPT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/attempt/{attemptId}"
    )
    public ResponseEntity<List<InterestAssessment>>
    getByAttempt(
            @PathVariable Long studentId,
            @PathVariable String attemptId) {

        return ResponseEntity.ok(
                service.getByAttempt(
                        studentId,
                        attemptId
                )
        );
    }

    // =====================================================
    // SAVE COMPLETE TEST
    // =====================================================

    @PostMapping("/student/{studentId}/all")
    public ResponseEntity<List<InterestAssessment>>
    saveAll(
            @PathVariable Long studentId,
            @RequestBody List<InterestAssessment> assessments) {

        if (assessments == null ||
                assessments.isEmpty()) {

            return ResponseEntity.badRequest()
                    .build();
        }

        // =================================================
        // ALWAYS SET STUDENT ID FROM URL
        // =================================================

        for (InterestAssessment assessment :
                assessments) {

            if (assessment == null) {

                continue;
            }

            // Prevent client from modifying existing row

            assessment.setId(null);

            // Server decides student

            assessment.setStudentId(
                    studentId
            );
        }

        List<InterestAssessment> saved =
                service.saveAll(
                        assessments
                );

        return ResponseEntity.ok(
                saved
        );
    }

    // =====================================================
    // DELETE HISTORY
    // =====================================================

    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<String>
    deleteByStudentId(
            @PathVariable Long studentId) {

        service.deleteByStudentId(
                studentId
        );

        return ResponseEntity.ok(
                "Interest assessment deleted successfully"
        );
    }
}