package com.career.recommendation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.career.recommendation.model.SkillAssessment;
import com.career.recommendation.service.SkillAssessmentService;

@RestController
@RequestMapping("/api/skill-assessments")
@CrossOrigin(origins = "http://localhost:5173")
public class SkillAssessmentController {

    private final SkillAssessmentService service;

    public SkillAssessmentController(
            SkillAssessmentService service) {

        this.service = service;
    }


    // =====================================================
    // GET STUDENT ASSESSMENTS
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SkillAssessment>> getByStudentId(
            @PathVariable Long studentId) {

        if (studentId == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                service.getByStudentId(studentId)
        );
    }


    // =====================================================
    // SAVE CURRENT ASSESSMENT
    // =====================================================

    @PostMapping("/student/{studentId}")
    public ResponseEntity<List<SkillAssessment>> save(
            @PathVariable Long studentId,
            @RequestBody List<SkillAssessment> assessments) {

        try {

            if (studentId == null) {
                return ResponseEntity.badRequest().build();
            }

            if (assessments == null ||
                    assessments.isEmpty()) {

                return ResponseEntity.badRequest().build();
            }

            List<SkillAssessment> saved =
                    service.saveAssessment(
                            studentId,
                            assessments
                    );

            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}