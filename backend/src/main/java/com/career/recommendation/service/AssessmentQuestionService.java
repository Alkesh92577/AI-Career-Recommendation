package com.career.recommendation.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
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

        if (
            skillNames == null ||
            skillNames.isEmpty()
        ) {

            return new ArrayList<>();
        }


        // =================================================
        // CLEAN SKILL NAMES
        // =================================================

        List<String> cleanSkillNames =
                skillNames.stream()

                        .filter(
                            skill ->
                                skill != null &&
                                !skill.trim().isEmpty()
                        )

                        .map(
                            String::trim
                        )

                        .distinct()

                        .toList();


        if (cleanSkillNames.isEmpty()) {

            return new ArrayList<>();
        }


        System.out.println(
            "=========================================="
        );

        System.out.println(
            "STUDENT SKILLS RECEIVED:"
        );

        System.out.println(
            cleanSkillNames
        );


        // =================================================
        // SKILL -> COURSE NAME MAPPING
        // =================================================

        Map<String, String> skillCourseMap =
                new HashMap<>();


        // -------------------------------------------------
        // PROGRAMMING
        // -------------------------------------------------

        // IMPORTANT:
        // Database me Java hai
        // Database me Python hai

        skillCourseMap.put(
            "Java",
            "Java"
        );

        skillCourseMap.put(
            "Python",
            "Python"
        );

        skillCourseMap.put(
            "C",
            "C"
        );

        skillCourseMap.put(
            "C++",
            "C++"
        );

        skillCourseMap.put(
            "JavaScript",
            "JavaScript"
        );


        // -------------------------------------------------
        // WEB DEVELOPMENT
        // -------------------------------------------------

        skillCourseMap.put(
            "HTML",
            "HTML"
        );

        skillCourseMap.put(
            "CSS",
            "CSS"
        );

        skillCourseMap.put(
            "React",
            "React"
        );

        skillCourseMap.put(
            "Node.js",
            "Node.js"
        );


        // -------------------------------------------------
        // DATABASE
        // -------------------------------------------------

        skillCourseMap.put(
            "SQL",
            "SQL"
        );

        skillCourseMap.put(
            "MySQL",
            "MySQL"
        );

        skillCourseMap.put(
            "MongoDB",
            "MongoDB"
        );


        // -------------------------------------------------
        // JAVA BACKEND
        // -------------------------------------------------

        skillCourseMap.put(
            "Spring Boot",
            "Spring Boot"
        );


        // -------------------------------------------------
        // DATA / AI
        // -------------------------------------------------

        skillCourseMap.put(
            "Machine Learning",
            "Machine Learning"
        );

        skillCourseMap.put(
            "Deep Learning",
            "Deep Learning"
        );

        skillCourseMap.put(
            "Data Analysis",
            "Python for Data Analysis"
        );

        skillCourseMap.put(
            "Pandas and NumPy",
            "Pandas and NumPy"
        );

        skillCourseMap.put(
            "Power BI",
            "Power BI"
        );


        // -------------------------------------------------
        // PYTHON SPECIALIZATION
        // -------------------------------------------------

        skillCourseMap.put(
            "Python for Data Analysis",
            "Python for Data Analysis"
        );

        skillCourseMap.put(
            "Python for Data Science",
            "Python for Data Science"
        );


        // -------------------------------------------------
        // DSA
        // -------------------------------------------------

        skillCourseMap.put(
            "Data Structures and Algorithms",
            "Data Structures and Algorithms"
        );


        // -------------------------------------------------
        // CYBER SECURITY
        // -------------------------------------------------

        skillCourseMap.put(
            "Cyber Security Fundamentals",
            "Cyber Security Fundamentals"
        );

        skillCourseMap.put(
            "Ethical Hacking",
            "Ethical Hacking"
        );


        // -------------------------------------------------
        // NETWORKING
        // -------------------------------------------------

        skillCourseMap.put(
            "Networking Basics",
            "Networking Basics"
        );


        // =================================================
        // CONVERT STUDENT SKILLS -> COURSE NAMES
        // =================================================

        Set<String> courseNames =
                new LinkedHashSet<>();


        for (
            String skill :
            cleanSkillNames
        ) {

            String courseName =
                    skillCourseMap.get(skill);


            // ------------------------------------------------
            // MAPPING FOUND
            // ------------------------------------------------

            if (
                courseName != null &&
                !courseName.trim().isEmpty()
            ) {

                courseNames.add(
                    courseName
                );

                System.out.println(
                    "Skill: " +
                    skill +
                    " -> Course: " +
                    courseName
                );

            }


            // ------------------------------------------------
            // NO MAPPING
            // USE EXACT SKILL NAME
            // ------------------------------------------------

            else {

                courseNames.add(
                    skill
                );

                System.out.println(
                    "Skill: " +
                    skill +
                    " -> Exact Course: " +
                    skill
                );

            }

        }


        // =================================================
        // NO COURSE FOUND
        // =================================================

        if (courseNames.isEmpty()) {

            System.out.println(
                "No matching course names found."
            );

            return new ArrayList<>();
        }


        // =================================================
        // PRINT COURSES SEARCHED
        // =================================================

        System.out.println(
            "COURSES SEARCHED:"
        );

        System.out.println(
            courseNames
        );


        // =================================================
        // DATABASE QUERY
        // =================================================

        List<AssessmentQuestion> questions =
                repository.findByCourseNameIn(
                    new ArrayList<>(
                        courseNames
                    )
                );


        // =================================================
        // QUESTIONS FOUND
        // =================================================

        System.out.println(
            "QUESTIONS FOUND: " +
            questions.size()
        );


        // =================================================
        // PRINT QUESTION COURSE NAMES
        // =================================================

        for (
            AssessmentQuestion question :
            questions
        ) {

            System.out.println(
                "Question ID: " +
                question.getId() +
                " | Course: " +
                question.getCourseName()
            );

        }


        // =================================================
        // RANDOM ORDER
        // =================================================

        List<AssessmentQuestion> shuffled =
                new ArrayList<>(
                    questions
                );


        Collections.shuffle(
            shuffled
        );


        System.out.println(
            "=========================================="
        );


        return shuffled;
    }
}