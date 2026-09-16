package com.career.recommendation.config;

import com.career.recommendation.model.Course;
import com.career.recommendation.repository.CourseRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {


    @Bean
    CommandLineRunner initializeCourses(
            CourseRepository courseRepository
    ) {

        return args -> {


            // ==========================================
            // SOFTWARE DEVELOPER
            // ==========================================

            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Software Developer",
                            "Java Programming",
                            "https://www.coursera.org/learn/java-programming",
                            "Beginner to Intermediate",
                            "Coursera"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Software Developer",
                            "Spring Boot Development",
                            "https://spring.io/guides",
                            "Intermediate",
                            "Spring"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Software Developer",
                            "Data Structures and Algorithms",
                            "https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/",
                            "Intermediate",
                            "GeeksforGeeks"
                    )
            );


            // ==========================================
            // WEB DEVELOPER
            // ==========================================

            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Web Developer",
                            "HTML and CSS",
                            "https://developer.mozilla.org/en-US/docs/Learn",
                            "Beginner",
                            "MDN"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Web Developer",
                            "JavaScript Fundamentals",
                            "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
                            "Beginner to Intermediate",
                            "MDN"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Web Developer",
                            "React Development",
                            "https://react.dev/learn",
                            "Intermediate",
                            "React"
                    )
            );


            // ==========================================
            // DATA ANALYST
            // ==========================================

            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Data Analyst",
                            "Python for Data Analysis",
                            "https://www.coursera.org/learn/python-for-applied-data-science-ai",
                            "Beginner",
                            "Coursera"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Data Analyst",
                            "SQL for Data Analysis",
                            "https://www.w3schools.com/sql/",
                            "Beginner to Intermediate",
                            "W3Schools"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Data Analyst",
                            "Excel Data Analysis",
                            "https://support.microsoft.com/en-us/excel",
                            "Beginner",
                            "Microsoft"
                    )
            );


            // ==========================================
            // DATA SCIENTIST
            // ==========================================

            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Data Scientist",
                            "Machine Learning Fundamentals",
                            "https://www.coursera.org/learn/machine-learning",
                            "Intermediate",
                            "Coursera"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Data Scientist",
                            "Python for Data Science",
                            "https://www.kaggle.com/learn",
                            "Beginner to Intermediate",
                            "Kaggle"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Data Scientist",
                            "Statistics for Data Science",
                            "https://www.khanacademy.org/math/statistics-probability",
                            "Intermediate",
                            "Khan Academy"
                    )
            );


            // ==========================================
            // AI / ML ENGINEER
            // ==========================================

            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "AI / ML Engineer",
                            "Machine Learning",
                            "https://developers.google.com/machine-learning",
                            "Intermediate",
                            "Google"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "AI / ML Engineer",
                            "Deep Learning",
                            "https://www.deeplearning.ai/",
                            "Advanced",
                            "DeepLearning.AI"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "AI / ML Engineer",
                            "Python for Machine Learning",
                            "https://www.kaggle.com/learn",
                            "Intermediate",
                            "Kaggle"
                    )
            );


            // ==========================================
            // CYBER SECURITY
            // ==========================================

            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Cyber Security",
                            "Introduction to Cyber Security",
                            "https://www.cisco.com/site/us/en/learn/training-certifications/courses/cybersecurity-essentials.html",
                            "Beginner",
                            "Cisco"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Cyber Security",
                            "Ethical Hacking Basics",
                            "https://www.cybrary.it/",
                            "Intermediate",
                            "Cybrary"
                    )
            );


            addCourseIfNotExists(
                    courseRepository,

                    new Course(
                            "Cyber Security",
                            "Network Security",
                            "https://www.coursera.org/",
                            "Intermediate",
                            "Coursera"
                    )
            );


            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "COURSE DATA INITIALIZATION COMPLETED"
            );

            System.out.println(
                    "TOTAL COURSES: "
                            + courseRepository.count()
            );

            System.out.println(
                    "=========================================="
            );

        };
    }


    // ==========================================
    // ADD ONLY IF COURSE DOES NOT EXIST
    // ==========================================

    private void addCourseIfNotExists(
            CourseRepository courseRepository,
            Course course
    ) {

        if (
                !courseRepository.existsByCourseName(
                        course.getCourseName()
                )
        ) {

            courseRepository.save(
                    course
            );

        }
    }
}