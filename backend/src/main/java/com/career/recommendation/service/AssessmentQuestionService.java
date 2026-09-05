package com.career.recommendation.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.career.recommendation.model.AssessmentQuestion;
import com.career.recommendation.repository.AssessmentQuestionRepository;

@Service
public class AssessmentQuestionService {

    private final AssessmentQuestionRepository repository;

    public AssessmentQuestionService(
            AssessmentQuestionRepository repository) {

        this.repository = repository;
    }


    // =====================================================
    // GET QUESTIONS BY STUDENT SKILLS
    // =====================================================

    public List<AssessmentQuestion> getQuestionsBySkills(
            List<String> skillNames) {


        // =================================================
        // VALIDATION
        // =================================================

        if (skillNames == null || skillNames.isEmpty()) {

            System.out.println("No skills received.");

            return new ArrayList<>();
        }


        // =================================================
        // CLEAN SKILLS
        // =================================================

        List<String> cleanSkills = skillNames
                .stream()
                .filter(skill ->
                        skill != null &&
                        !skill.trim().isEmpty()
                )
                .map(skill ->
                        skill.trim()
                                .toLowerCase(Locale.ROOT)
                )
                .distinct()
                .toList();


        if (cleanSkills.isEmpty()) {

            return new ArrayList<>();
        }


        // =================================================
        // DEBUG
        // =================================================

        System.out.println();
        System.out.println("==========================================");
        System.out.println("ASSESSMENT QUESTION SERVICE");
        System.out.println("==========================================");

        System.out.println("SKILLS RECEIVED:");
        System.out.println(cleanSkills);


        // =================================================
        // SKILL -> COURSE MAPPING
        // =================================================

        Map<String, String> skillCourseMap =
                new HashMap<>();


        // =================================================
        // PROGRAMMING LANGUAGES
        // =================================================

        skillCourseMap.put("java", "java");

        skillCourseMap.put("python", "python");

        skillCourseMap.put("c", "c");

        skillCourseMap.put("c++", "c++");

        skillCourseMap.put("javascript", "javascript");


        // =================================================
        // WEB DEVELOPMENT
        // =================================================

        skillCourseMap.put("html", "html");

        skillCourseMap.put("css", "css");

        skillCourseMap.put("react", "react");

        skillCourseMap.put("node.js", "node.js");

        skillCourseMap.put("nodejs", "node.js");


        // =================================================
        // DATABASE
        // =================================================

        skillCourseMap.put("sql", "sql");

        skillCourseMap.put("mysql", "mysql");

        skillCourseMap.put("mongodb", "mongodb");


        // =================================================
        // JAVA / BACKEND
        // =================================================

        skillCourseMap.put("spring boot", "spring boot");

        skillCourseMap.put(
                "data structures and algorithms",
                "data structures and algorithms"
        );


        // =================================================
        // DATA ANALYSIS
        // =================================================

        skillCourseMap.put(
                "data analysis",
                "data analysis"
        );

        skillCourseMap.put(
                "python for data analysis",
                "python for data analysis"
        );

        skillCourseMap.put(
                "pandas and numpy",
                "pandas and numpy"
        );

        skillCourseMap.put(
                "power bi",
                "power bi"
        );


        // =================================================
        // DATA SCIENCE / AI
        // =================================================

        skillCourseMap.put(
                "python for data science",
                "python for data science"
        );

        skillCourseMap.put(
                "machine learning",
                "machine learning"
        );

        skillCourseMap.put(
                "deep learning",
                "deep learning"
        );


        // =================================================
        // CYBER SECURITY
        // =================================================

        skillCourseMap.put(
                "cyber security fundamentals",
                "cyber security fundamentals"
        );

        skillCourseMap.put(
                "ethical hacking",
                "ethical hacking"
        );

        skillCourseMap.put(
                "networking basics",
                "networking basics"
        );


        // =================================================
        // CREATE COURSE NAME LIST
        // =================================================

        Set<String> courseNames =
                new LinkedHashSet<>();


        for (String skill : cleanSkills) {

            String normalizedSkill =
                    skill.trim()
                            .toLowerCase(Locale.ROOT);


            String mappedCourse =
                    skillCourseMap.get(normalizedSkill);


            // Mapping available
            if (mappedCourse != null) {

                courseNames.add(
                        mappedCourse
                                .trim()
                                .toLowerCase(Locale.ROOT)
                );

                System.out.println(
                        "Skill Mapping: " +
                        normalizedSkill +
                        " -> " +
                        mappedCourse
                );
            }

            // No mapping
            else {

                courseNames.add(
                        normalizedSkill
                );

                System.out.println(
                        "Direct Skill Match: " +
                        normalizedSkill
                );
            }
        }


        // =================================================
        // PRINT COURSE NAMES
        // =================================================

        System.out.println();
        System.out.println("COURSES TO SEARCH:");

        System.out.println(courseNames);


        // =================================================
        // GET ALL QUESTIONS FROM DATABASE
        // =================================================

        List<AssessmentQuestion> allQuestions =
                repository.findAll();


        System.out.println();
        System.out.println(
                "TOTAL QUESTIONS IN DATABASE: " +
                allQuestions.size()
        );


        // =================================================
        // FILTER QUESTIONS
        // =================================================

        List<AssessmentQuestion> matchedQuestions =
                allQuestions
                        .stream()

                        .filter(question -> {

                            if (
                                    question.getCourseName() == null ||
                                    question.getCourseName().trim().isEmpty()
                            ) {

                                return false;
                            }


                            String databaseCourseName =
                                    question
                                            .getCourseName()
                                            .trim()
                                            .toLowerCase(
                                                    Locale.ROOT
                                            );


                            return courseNames.contains(
                                    databaseCourseName
                            );
                        })

                        .toList();


        // =================================================
        // DEBUG RESULT
        // =================================================

        System.out.println();
        System.out.println(
                "MATCHED QUESTIONS: " +
                matchedQuestions.size()
        );


        for (
                AssessmentQuestion question :
                matchedQuestions
        ) {

            System.out.println(

                    "ID: " +
                    question.getId() +

                    " | Course: " +
                    question.getCourseName() +

                    " | Question: " +
                    question.getQuestionText()
            );
        }


        // =================================================
        // CREATE MUTABLE LIST
        // =================================================

        List<AssessmentQuestion> shuffledQuestions =
                new ArrayList<>(
                        matchedQuestions
                );


        // =================================================
        // RANDOMIZE QUESTIONS
        // =================================================

        Collections.shuffle(
                shuffledQuestions
        );


        System.out.println();
        System.out.println("FINAL QUESTIONS:");

        System.out.println(
                shuffledQuestions.size()
        );

        System.out.println("==========================================");
        System.out.println();


        return shuffledQuestions;
    }
}