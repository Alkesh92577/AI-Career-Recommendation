package com.career.recommendation.service;

import com.career.recommendation.model.CareerRoadmap;
import com.career.recommendation.model.Prediction;
import com.career.recommendation.repository.CareerRoadmapRepository;
import com.career.recommendation.repository.RoadmapProgressRepository;
import com.career.recommendation.repository.PredictionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CareerRoadmapService {

    // =====================================================
    // REPOSITORIES
    // =====================================================

    @Autowired
    private CareerRoadmapRepository careerRoadmapRepository;

    @Autowired
    private RoadmapProgressRepository roadmapProgressRepository;

    @Autowired
    private PredictionRepository predictionRepository;


    // =====================================================
    // GET ROADMAP BY STUDENT
    // =====================================================

    public List<CareerRoadmap> getByStudentId(
            Long studentId
    ) {

        System.out.println(
                "Getting roadmap for student: "
                        + studentId
        );

        return careerRoadmapRepository
                .findByStudentId(studentId);
    }


    // =====================================================
    // DELETE OLD ROADMAP + PROGRESS
    // =====================================================

    @Transactional
    public void deleteByStudentId(
            Long studentId
    ) {

        System.out.println(
                "===================================="
        );

        System.out.println(
                "DELETE OLD ROADMAP"
        );

        System.out.println(
                "Student ID: " + studentId
        );

        System.out.println(
                "===================================="
        );


        // DELETE PROGRESS FIRST
        roadmapProgressRepository
                .deleteByStudentId(studentId);


        System.out.println(
                "Old roadmap progress deleted."
        );


        // DELETE OLD ROADMAP
        careerRoadmapRepository
                .deleteByStudentId(studentId);


        System.out.println(
                "Old roadmap deleted."
        );
    }


    // =====================================================
    // GENERATE NEW ROADMAP
    // =====================================================

    @Transactional
    public List<CareerRoadmap> generateRoadmap(
            Long studentId
    ) {

        System.out.println(
                "===================================="
        );

        System.out.println(
                "GENERATING NEW ROADMAP"
        );

        System.out.println(
                "Student ID: " + studentId
        );

        System.out.println(
                "===================================="
        );


        // =================================================
        // STEP 1
        // DELETE OLD ROADMAP
        // =================================================

        deleteByStudentId(studentId);


        // =================================================
        // STEP 2
        // GET LATEST AI PREDICTION
        // =================================================

        List<Prediction> predictions =
                predictionRepository
                        .findByStudentIdOrderByCreatedAtDesc(
                                studentId
                        );


        if (
                predictions == null ||
                predictions.isEmpty()
        ) {

            throw new RuntimeException(
                    "AI career prediction not found. "
                            + "Please generate career prediction first."
            );
        }


        // =================================================
        // STEP 3
        // LATEST PREDICTION
        // =================================================

        Prediction latestPrediction =
                predictions.get(0);


        String career =
                latestPrediction
                        .getRecommendedCareer();


        if (
                career == null ||
                career.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Recommended career not available."
            );
        }


        career = normalizeCareer(career);


        System.out.println(
                "===================================="
        );

        System.out.println(
                "LATEST AI PREDICTION CAREER"
        );

        System.out.println(
                "Career: " + career
        );

        System.out.println(
                "===================================="
        );


        // =================================================
        // STEP 4
        // CREATE ROADMAP
        // =================================================

        List<CareerRoadmap> roadmap =
                new ArrayList<>();


        // =================================================
        // SOFTWARE DEVELOPER
        // =================================================

        if (
                career.equalsIgnoreCase(
                        "Software Developer"
                )
        ) {

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            1,
                            "Programming Fundamentals",
                            "Learn programming fundamentals and problem solving.",
                            "Java / Python, variables, loops, conditions, functions and OOP.",
                            "2 Weeks",
                            "Beginner",
                            "Java and Python documentation.",
                            "Build a Console Based Student Management System"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            2,
                            "Data Structures & Algorithms",
                            "Learn important data structures and algorithms.",
                            "Arrays, strings, linked list, stack, queue, sorting and searching.",
                            "4 Weeks",
                            "Intermediate",
                            "LeetCode and GeeksForGeeks.",
                            "Build a DSA Practice Application"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            3,
                            "Database & SQL",
                            "Learn relational databases and SQL.",
                            "MySQL, SELECT, INSERT, UPDATE, DELETE, JOIN and relationships.",
                            "2 Weeks",
                            "Intermediate",
                            "MySQL documentation.",
                            "Build a Student Database System"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            4,
                            "Backend Development",
                            "Learn backend development using Spring Boot.",
                            "Spring Boot, REST API, JPA, Hibernate and authentication.",
                            "4 Weeks",
                            "Advanced",
                            "Spring Boot documentation.",
                            "Build a Complete Student Management REST API"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            5,
                            "Full Stack Project",
                            "Combine frontend, backend and database technologies.",
                            "React, Spring Boot, MySQL, REST API and authentication.",
                            "5 Weeks",
                            "Advanced",
                            "React and Spring Boot documentation.",
                            "Build a Complete Student Management Portal"
                    )
            );
        }


        // =================================================
        // DATABASE DEVELOPER ⭐ NEW
        // =================================================

        else if (
                career.equalsIgnoreCase(
                        "Database Developer"
                )
        ) {

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            1,
                            "Database Fundamentals",
                            "Learn the fundamentals of relational databases.",
                            "Database concepts, tables, rows, columns, primary keys, foreign keys and relationships.",
                            "2 Weeks",
                            "Beginner",
                            "MySQL Documentation.",
                            "Build a Student Database"
                    )
            );


            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            2,
                            "SQL Fundamentals",
                            "Learn SQL for creating and managing databases.",
                            "SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY and GROUP BY.",
                            "3 Weeks",
                            "Beginner",
                            "MySQL Documentation.",
                            "Build a Student Records Management System"
                    )
            );


            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            3,
                            "Advanced SQL",
                            "Learn advanced SQL queries and database operations.",
                            "JOIN, subqueries, aggregate functions, views, stored procedures and functions.",
                            "4 Weeks",
                            "Intermediate",
                            "MySQL Documentation.",
                            "Build a Sales Database Analysis System"
                    )
            );


            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            4,
                            "Database Design & Optimization",
                            "Learn how to design efficient and scalable databases.",
                            "Normalization, indexing, constraints, relationships and query optimization.",
                            "4 Weeks",
                            "Advanced",
                            "MySQL Documentation.",
                            "Design and Optimize an E-Commerce Database"
                    )
            );


            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            5,
                            "Database Developer Project",
                            "Build a complete database-driven application.",
                            "MySQL, database design, SQL queries, indexes, procedures and backend integration.",
                            "5 Weeks",
                            "Advanced",
                            "MySQL Documentation and Spring Boot Documentation.",
                            "Build a Complete Hospital or College Database System"
                    )
            );
        }


        // =================================================
        // DATA ANALYST
        // =================================================

        else if (
                career.equalsIgnoreCase(
                        "Data Analyst"
                )
        ) {

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            1,
                            "Excel Fundamentals",
                            "Learn Excel for data analysis.",
                            "Formulas, functions, sorting, filtering and charts.",
                            "2 Weeks",
                            "Beginner",
                            "Microsoft Excel documentation.",
                            "Create a Student Performance Dashboard"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            2,
                            "SQL",
                            "Learn SQL for extracting data.",
                            "SELECT, WHERE, GROUP BY, JOIN, subqueries and aggregate functions.",
                            "3 Weeks",
                            "Intermediate",
                            "MySQL documentation.",
                            "Build a Sales Database Analysis"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            3,
                            "Python for Data Analysis",
                            "Learn Python data analysis libraries.",
                            "Python, Pandas, NumPy and Matplotlib.",
                            "4 Weeks",
                            "Intermediate",
                            "Python and Pandas documentation.",
                            "Analyze a Student Dataset"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            4,
                            "Power BI",
                            "Learn business intelligence and visualization.",
                            "Power BI, dashboards, reports and data visualization.",
                            "3 Weeks",
                            "Intermediate",
                            "Microsoft Power BI documentation.",
                            "Build a Business Intelligence Dashboard"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            5,
                            "Data Analytics Project",
                            "Build an end-to-end analytics project.",
                            "Data cleaning, analysis, visualization and reporting.",
                            "4 Weeks",
                            "Advanced",
                            "Kaggle datasets.",
                            "Build an End-to-End Data Analytics Project"
                    )
            );
        }


        // =================================================
        // WEB DEVELOPER
        // =================================================

        else if (
                career.equalsIgnoreCase(
                        "Web Developer"
                )
        ) {

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            1,
                            "HTML Fundamentals",
                            "Learn how web pages are structured.",
                            "HTML elements, forms, tables, links and semantic HTML.",
                            "1 Week",
                            "Beginner",
                            "MDN Web Docs.",
                            "Build a Personal Portfolio Website"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            2,
                            "CSS & Responsive Design",
                            "Learn modern website styling.",
                            "CSS, Flexbox, Grid, animations and responsive design.",
                            "2 Weeks",
                            "Beginner",
                            "MDN Web Docs.",
                            "Build a Responsive Landing Page"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            3,
                            "JavaScript",
                            "Learn programming for interactive websites.",
                            "Variables, functions, arrays, objects, DOM and APIs.",
                            "3 Weeks",
                            "Intermediate",
                            "MDN JavaScript documentation.",
                            "Build a Weather Application"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            4,
                            "React",
                            "Learn modern frontend development.",
                            "Components, props, state, hooks, routing and API integration.",
                            "4 Weeks",
                            "Advanced",
                            "React documentation.",
                            "Build a React Student Portal"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            5,
                            "Full Stack Web Project",
                            "Build a complete web application.",
                            "React, REST API, Spring Boot and MySQL.",
                            "5 Weeks",
                            "Advanced",
                            "React and Spring Boot documentation.",
                            "Build a Complete Full Stack Web Application"
                    )
            );
        }


        // =================================================
        // CYBER SECURITY
        // =================================================

        else if (
                career.equalsIgnoreCase(
                        "Cyber Security Specialist"
                )
        ) {

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            1,
                            "Computer & Networking Fundamentals",
                            "Understand how computers and networks work.",
                            "TCP/IP, OSI model, IP address, DNS, HTTP and ports.",
                            "3 Weeks",
                            "Beginner",
                            "Cisco Networking documentation.",
                            "Build a Small Network Lab"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            2,
                            "Linux Fundamentals",
                            "Learn Linux commands and administration.",
                            "Linux commands, permissions, processes and shell scripting.",
                            "2 Weeks",
                            "Intermediate",
                            "Linux documentation.",
                            "Build a Linux Administration Lab"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            3,
                            "Cyber Security Fundamentals",
                            "Learn core cyber security concepts.",
                            "CIA triad, authentication, encryption and common attacks.",
                            "3 Weeks",
                            "Intermediate",
                            "OWASP documentation.",
                            "Build a Security Awareness Application"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            4,
                            "Web Security",
                            "Understand common web application vulnerabilities.",
                            "OWASP Top 10, authentication, authorization and secure coding.",
                            "4 Weeks",
                            "Advanced",
                            "OWASP documentation.",
                            "Build a Secure Web Application"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            5,
                            "Cyber Security Project",
                            "Create a practical security project.",
                            "Network monitoring, logging and security analysis.",
                            "5 Weeks",
                            "Advanced",
                            "OWASP and cybersecurity documentation.",
                            "Build a Basic Security Monitoring System"
                    )
            );
        }


        // =================================================
        // FALLBACK
        // =================================================

        else {

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            1,
                            "Career Fundamentals",
                            "Build fundamentals required for your recommended career.",
                            "Learn programming, problem solving and basic computer concepts.",
                            "2 Weeks",
                            "Beginner",
                            "Online documentation and learning resources.",
                            "Build a Basic Career Related Project"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            2,
                            "Core Skills",
                            "Develop the core skills required for this career.",
                            "Learn tools and technologies related to your career.",
                            "3 Weeks",
                            "Intermediate",
                            "Official technology documentation.",
                            "Build a Core Skills Project"
                    )
            );

            roadmap.add(
                    createStep(
                            studentId,
                            career,
                            3,
                            "Practical Project",
                            "Apply your knowledge through a practical project.",
                            "Build, test and document a real-world project.",
                            "4 Weeks",
                            "Advanced",
                            "Official documentation.",
                            "Build a Real World Career Project"
                    )
            );
        }


        // =================================================
        // SAVE ROADMAP
        // =================================================

        List<CareerRoadmap> savedRoadmap =
                careerRoadmapRepository.saveAll(
                        roadmap
                );


        System.out.println(
                "===================================="
        );

        System.out.println(
                "NEW ROADMAP SAVED"
        );

        System.out.println(
                "Career: " + career
        );

        System.out.println(
                "Total Steps: "
                        + savedRoadmap.size()
        );

        System.out.println(
                "===================================="
        );


        return savedRoadmap;
    }


    // =====================================================
    // NORMALIZE CAREER
    // =====================================================

    private String normalizeCareer(
            String career
    ) {

        if (career == null) {
            return "";
        }


        String value =
                career.trim();


        // Database Developer
        if (
                value.equalsIgnoreCase(
                        "Database Developer"
                )
        ) {

            return "Database Developer";
        }


        // Software Developer
        if (
                value.equalsIgnoreCase(
                        "Software Developer"
                )
        ) {

            return "Software Developer";
        }


        // Data Analyst
        if (
                value.equalsIgnoreCase(
                        "Data Analyst"
                )
        ) {

            return "Data Analyst";
        }


        // Web Developer
        if (
                value.equalsIgnoreCase(
                        "Web Developer"
                )
        ) {

            return "Web Developer";
        }


        // Cyber Security
        if (
                value.equalsIgnoreCase(
                        "Cyber Security Specialist"
                )
        ) {

            return "Cyber Security Specialist";
        }


        return value;
    }


    // =====================================================
    // CREATE ROADMAP STEP
    // =====================================================

    private CareerRoadmap createStep(

            Long studentId,

            String career,

            int stepNumber,

            String topic,

            String description,

            String whatToLearn,

            String duration,

            String difficulty,

            String resources,

            String miniProject

    ) {

        CareerRoadmap step =
                new CareerRoadmap();


        step.setStudentId(
                studentId
        );


        // IMPORTANT:
        // Every learning step gets the SAME
        // AI recommended career.

        step.setCareer(
                career
        );


        step.setStepNumber(
                stepNumber
        );


        step.setTopic(
                topic
        );


        step.setDescription(
                description
        );


        step.setWhatToLearn(
                whatToLearn
        );


        step.setDuration(
                duration
        );


        step.setDifficulty(
                difficulty
        );


        step.setResources(
                resources
        );


        step.setMiniProject(
                miniProject
        );


        return step;
    }
}