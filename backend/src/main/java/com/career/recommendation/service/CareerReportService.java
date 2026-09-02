package com.career.recommendation.service;

import com.career.recommendation.dto.CareerReport;
import com.career.recommendation.model.Course;
import com.career.recommendation.model.Prediction;
import com.career.recommendation.model.Student;
import com.career.recommendation.model.CareerRoadmap;

import com.career.recommendation.repository.CourseRepository;
import com.career.recommendation.repository.PredictionRepository;
import com.career.recommendation.repository.StudentRepository;
import com.career.recommendation.repository.CareerRoadmapRepository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

@Service
public class CareerReportService {

    private final StudentRepository studentRepository;

    private final PredictionRepository predictionRepository;

    private final CareerRoadmapRepository careerRoadmapRepository;

    private final CourseRepository courseRepository;

    private final JdbcTemplate jdbcTemplate;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CareerReportService(
            StudentRepository studentRepository,
            PredictionRepository predictionRepository,
            CareerRoadmapRepository careerRoadmapRepository,
            CourseRepository courseRepository,
            JdbcTemplate jdbcTemplate) {

        this.studentRepository = studentRepository;

        this.predictionRepository = predictionRepository;

        this.careerRoadmapRepository = careerRoadmapRepository;

        this.courseRepository = courseRepository;

        this.jdbcTemplate = jdbcTemplate;
    }


    // ==========================================
    // GENERATE CAREER REPORT
    // ==========================================

    public CareerReport getCareerReport(
            Long studentId) {

        // ======================================
        // 1. GET STUDENT
        // ======================================

        Student student =
                studentRepository
                        .findById(studentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found with id: "
                                                + studentId
                                )
                        );


        // ======================================
        // CREATE REPORT
        // ======================================

        CareerReport report =
                new CareerReport();


        report.setStudentId(
                student.getId()
        );


        // ======================================
        // STUDENT DETAILS
        // ======================================

        report.setStudentName(
                getStudentName(student)
        );


        report.setEmail(
                getStudentEmail(student)
        );


        // ======================================
        // ACADEMIC DETAILS
        // ======================================

        report.setTenthMarks(
                student.getTenthMarks()
        );


        report.setTwelfthMarks(
                student.getTwelfthMarks()
        );


        report.setGraduationMarks(
                student.getGraduationMarks()
        );


        report.setSemester(
                student.getSemester()
        );


        report.setBacklogs(
                student.getBacklogs()
        );


        // ======================================
        // 2. GET LATEST PREDICTION
        // ======================================

        List<Prediction> predictions =
                predictionRepository
                        .findByStudentIdOrderByCreatedAtDesc(
                                studentId
                        );


        if (!predictions.isEmpty()) {

            Prediction prediction =
                    predictions.get(0);


            report.setRecommendedCareer(
                    prediction.getRecommendedCareer()
            );


            report.setConfidence(
                    prediction.getConfidence()
            );


            report.setPredictionReason(
                    prediction.getReason()
            );

        } else {

            report.setRecommendedCareer(
                    "Not Generated"
            );


            report.setConfidence(
                    0.0
            );


            report.setPredictionReason(
                    "AI prediction has not been generated yet."
            );
        }


        // ======================================
        // 3. GET ROADMAP
        // ======================================

        String career =
                report.getRecommendedCareer();


        List<CareerRoadmap> roadmap =
                new ArrayList<>();


        if (
                career != null &&
                !career.equals("Not Generated")
        ) {

            roadmap =
                    careerRoadmapRepository
                            .findByCareerOrderByStepNumberAsc(
                                    career
                            );
        }


        // ======================================
        // TOTAL ROADMAP STEPS
        // ======================================

        int totalSteps =
                roadmap.size();


        // ======================================
        // COMPLETED ROADMAP STEPS
        // ======================================

        int completedSteps = 0;


        if (
                career != null &&
                !career.equals("Not Generated")
        ) {

            try {

                String sql =
                        """
                        SELECT COUNT(*)
                        FROM roadmap_progress rp
                        INNER JOIN career_roadmaps cr
                        ON rp.roadmap_id = cr.id
                        WHERE rp.student_id = ?
                        AND rp.completed = 1
                        AND cr.career = ?
                        """;


                Integer result =
                        jdbcTemplate.queryForObject(
                                sql,
                                Integer.class,
                                studentId,
                                career
                        );


                if (result != null) {

                    completedSteps =
                            result;

                }

            } catch (Exception error) {

                System.out.println(
                        "ROADMAP PROGRESS READ ERROR: "
                                + error.getMessage()
                );

                completedSteps = 0;
            }
        }


        // ======================================
        // ROADMAP PROGRESS %
        // ======================================

        double roadmapProgress = 0.0;


        if (totalSteps > 0) {

            roadmapProgress =
                    Math.round(
                            (
                                    (double) completedSteps
                                            /
                                    totalSteps
                            ) * 100
                    );
        }


        report.setTotalRoadmapSteps(
                totalSteps
        );


        report.setCompletedRoadmapSteps(
                completedSteps
        );


        report.setRoadmapProgress(
                roadmapProgress
        );


        // ======================================
        // 4. COURSES
        // ======================================

        List<CareerReport.CourseReport>
                courseReports =
                new ArrayList<>();


        if (
                career != null &&
                !career.equals("Not Generated")
        ) {

            List<Course> courses =
                    courseRepository
                            .findByCareer(
                                    career
                            );


            for (
                    Course course :
                    courses
            ) {

                CareerReport.CourseReport
                        courseReport =
                        new CareerReport.CourseReport();


                courseReport.setId(
                        course.getId()
                );


                courseReport.setCourseName(
                        course.getCourseName()
                );


                courseReport.setCourseUrl(
                        course.getCourseUrl()
                );


                courseReport.setDuration(
                        course.getDuration()
                );


                courseReport.setPlatform(
                        course.getPlatform()
                );


                courseReports.add(
                        courseReport
                );
            }
        }


        report.setCourses(
                courseReports
        );


        // ======================================
        // RETURN REPORT
        // ======================================

        return report;
    }


    // ==========================================
    // STUDENT NAME
    // ==========================================

    private String getStudentName(
            Student student) {

        String[] possibleMethods = {
                "getName",
                "getFullName",
                "getFirstName"
        };


        for (
                String methodName :
                possibleMethods
        ) {

            try {

                Method method =
                        student
                                .getClass()
                                .getMethod(
                                        methodName
                                );


                Object value =
                        method.invoke(
                                student
                        );


                if (
                        value != null &&
                        !value.toString()
                                .trim()
                                .isEmpty()
                ) {

                    return value.toString();
                }


            } catch (Exception ignored) {

            }
        }


        return "Student";
    }


    // ==========================================
    // STUDENT EMAIL
    // ==========================================

    private String getStudentEmail(
            Student student) {

        try {

            if (
                    student.getEmail() != null
            ) {

                return student.getEmail();

            }

        } catch (Exception ignored) {

        }


        return "";
    }
}