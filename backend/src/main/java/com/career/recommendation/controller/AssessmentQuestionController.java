package com.career.recommendation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.career.recommendation.model.AssessmentQuestion;
import com.career.recommendation.service.AssessmentQuestionService;

@RestController
@RequestMapping("/api/assessment-questions")
public class AssessmentQuestionController {

    private final AssessmentQuestionService service;


    // =============================================
    // CONSTRUCTOR
    // =============================================

    public AssessmentQuestionController(
            AssessmentQuestionService service
    ) {

        this.service = service;
    }


    // =============================================
    // GET QUESTIONS BY STUDENT SKILLS
    // =============================================

    @PostMapping("/student/{studentId}")
    public ResponseEntity<List<AssessmentQuestion>>
    getQuestionsByStudentSkills(

            @PathVariable Long studentId,

            @RequestBody List<String> skillNames
    ) {


        // =============================================
        // VALIDATE STUDENT ID
        // =============================================

        if (studentId == null) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        // =============================================
        // VALIDATE SKILLS
        // =============================================

        if (
                skillNames == null ||
                skillNames.isEmpty()
        ) {

            System.out.println(
                    "No skills received."
            );

            return ResponseEntity.ok(
                    List.of()
            );
        }


        // =============================================
        // DEBUG LOG
        // =============================================

        System.out.println(
                "\n=========================================="
        );

        System.out.println(
                "ASSESSMENT QUESTIONS REQUEST"
        );

        System.out.println(
                "Student ID: " + studentId
        );

        System.out.println(
                "Skills Received: " + skillNames
        );


        // =============================================
        // GET QUESTIONS FROM SERVICE
        // =============================================

        List<AssessmentQuestion> questions =
                service.getQuestionsBySkills(
                        skillNames
                );


        // =============================================
        // DEBUG RESULT
        // =============================================

        System.out.println(
                "Total Questions Found: " +
                questions.size()
        );

        System.out.println(
                "==========================================\n"
        );


        // =============================================
        // RETURN RESPONSE
        // =============================================

        return ResponseEntity.ok(
                questions
        );
    }
}