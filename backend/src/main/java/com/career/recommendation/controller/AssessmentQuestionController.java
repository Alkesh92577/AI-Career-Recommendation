package com.career.recommendation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.career.recommendation.model.AssessmentQuestion;
import com.career.recommendation.service.AssessmentQuestionService;

@RestController
@RequestMapping("/api/assessment-questions")
@CrossOrigin(origins = "http://localhost:5173")
public class AssessmentQuestionController {


    private final AssessmentQuestionService service;


    public AssessmentQuestionController(
            AssessmentQuestionService service) {

        this.service = service;
    }


    // =====================================================
    // GET QUESTIONS BY STUDENT SKILLS
    // =====================================================

    @PostMapping("/student/{studentId}")
    public ResponseEntity<List<AssessmentQuestion>>
    getQuestionsByStudentSkills(

            @PathVariable Long studentId,

            @RequestBody List<String> skillNames) {


        // =================================================
        // STUDENT ID CHECK
        // =================================================

        if (studentId == null) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        // =================================================
        // SKILLS CHECK
        // =================================================

        if (
            skillNames == null ||
            skillNames.isEmpty()
        ) {

            return ResponseEntity.ok(
                List.of()
            );
        }


        System.out.println(
            "================================"
        );

        System.out.println(
            "Student ID: " +
            studentId
        );

        System.out.println(
            "Skills: " +
            skillNames
        );


        // =================================================
        // GET QUESTIONS
        // =================================================

        List<AssessmentQuestion> questions =
                service.getQuestionsBySkills(
                    skillNames
                );


        System.out.println(
            "Questions Found: " +
            questions.size()
        );

        System.out.println(
            "================================"
        );


        return ResponseEntity.ok(
            questions
        );
    }
}