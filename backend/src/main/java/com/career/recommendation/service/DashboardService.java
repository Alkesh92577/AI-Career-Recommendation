package com.career.recommendation.service;

import com.career.recommendation.dto.DashboardResponse;
import com.career.recommendation.model.CareerRoadmap;
import com.career.recommendation.model.Prediction;
import com.career.recommendation.model.RoadmapProgress;
import com.career.recommendation.model.Student;

import com.career.recommendation.repository.CareerRoadmapRepository;
import com.career.recommendation.repository.PredictionRepository;
import com.career.recommendation.repository.RoadmapProgressRepository;
import com.career.recommendation.repository.SkillRepository;
import com.career.recommendation.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    // =====================================================
    // REPOSITORIES
    // =====================================================

    private final StudentRepository studentRepository;

    private final PredictionRepository predictionRepository;

    private final CareerRoadmapRepository careerRoadmapRepository;

    private final RoadmapProgressRepository roadmapProgressRepository;

    private final SkillRepository skillRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DashboardService(
            StudentRepository studentRepository,
            PredictionRepository predictionRepository,
            CareerRoadmapRepository careerRoadmapRepository,
            RoadmapProgressRepository roadmapProgressRepository,
            SkillRepository skillRepository
    ) {

        this.studentRepository = studentRepository;

        this.predictionRepository = predictionRepository;

        this.careerRoadmapRepository = careerRoadmapRepository;

        this.roadmapProgressRepository = roadmapProgressRepository;

        this.skillRepository = skillRepository;
    }


    // =====================================================
    // HELPER METHOD
    // CHECK STRING IS FILLED
    // =====================================================

    private boolean isFilled(String value) {

        return value != null &&
                !value.trim().isEmpty();
    }


    // =====================================================
    // PROFILE COMPLETION
    //
    // SAME AS Profile.jsx
    //
    // TOTAL = 6 FIELDS
    //
    // 1. fullName
    // 2. email
    // 3. programmingKnowledge
    // 4. preferredField
    // 5. education
    // 6. experience
    // =====================================================

    private int calculateProfileCompletion(Student student) {

        int completedFields = 0;

        int totalFields = 6;


        // =================================================
        // 1. FULL NAME
        // =================================================

        if (isFilled(student.getFullName())) {

            completedFields++;
        }


        // =================================================
        // 2. EMAIL
        // =================================================

        if (isFilled(student.getEmail())) {

            completedFields++;
        }


        // =================================================
        // 3. PROGRAMMING KNOWLEDGE
        // =================================================

        if (isFilled(student.getProgrammingKnowledge())) {

            completedFields++;
        }


        // =================================================
        // 4. PREFERRED CAREER FIELD
        // =================================================

        if (isFilled(student.getPreferredField())) {

            completedFields++;
        }


        // =================================================
        // 5. EDUCATION
        // =================================================

        if (isFilled(student.getEducation())) {

            completedFields++;
        }


        // =================================================
        // 6. EXPERIENCE
        //
        // 0 years is also a valid value.
        // =================================================

        if (student.getExperience() != null) {

            completedFields++;
        }


        // =================================================
        // CALCULATE %
        // =================================================

        int completion =
                (int) Math.round(
                        ((double) completedFields / totalFields) * 100
                );


        return Math.min(
                100,
                Math.max(0, completion)
        );
    }


    // =====================================================
    // GET DASHBOARD
    // =====================================================

    public DashboardResponse getDashboard(Long studentId) {

        // =================================================
        // 1. GET STUDENT
        // =================================================

        Student student =
                studentRepository
                        .findById(studentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found with id: "
                                                + studentId
                                )
                        );


        // =================================================
        // 2. CREATE RESPONSE
        // =================================================

        DashboardResponse response =
                new DashboardResponse();


        response.setStudentId(
                student.getId()
        );


        // =================================================
        // 3. STUDENT NAME
        // =================================================

        String name = "Student";


        if (isFilled(student.getFullName())) {

            name = student.getFullName();
        }


        response.setStudentName(name);


        // =================================================
        // 4. PROFILE COMPLETION
        // =================================================
        //
        // IMPORTANT:
        //
        // Dashboard aur Profile.jsx dono same
        // 6 fields use karenge.
        //
        // Academic details / skills / phone /
        // address yahan count nahi honge.
        //
        // =================================================

        int profileCompletion =
                calculateProfileCompletion(student);


        response.setProfileCompletion(
                profileCompletion
        );


        // =================================================
        // DEBUG
        // =================================================

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "DASHBOARD PROFILE COMPLETION"
        );

        System.out.println(
                "Student ID: " + studentId
        );

        System.out.println(
                "Full Name: " + student.getFullName()
        );

        System.out.println(
                "Email: " + student.getEmail()
        );

        System.out.println(
                "Programming Knowledge: "
                        + student.getProgrammingKnowledge()
        );

        System.out.println(
                "Preferred Field: "
                        + student.getPreferredField()
        );

        System.out.println(
                "Education: "
                        + student.getEducation()
        );

        System.out.println(
                "Experience: "
                        + student.getExperience()
        );

        System.out.println(
                "Profile Completion: "
                        + profileCompletion
                        + "%"
        );

        System.out.println(
                "=========================================="
        );


        // =================================================
        // 5. SKILLS COUNT
        // =================================================

        int skillsCount = 0;


        try {

            skillsCount =
                    skillRepository
                            .findByStudentId(studentId)
                            .size();

        } catch (Exception e) {

            System.out.println(
                    "Error while counting skills: "
                            + e.getMessage()
            );
        }


        response.setSkillsCount(
                skillsCount
        );


        // =================================================
        // 6. LATEST AI PREDICTION
        // =================================================

        List<Prediction> predictions =
                predictionRepository
                        .findByStudentIdOrderByCreatedAtDesc(
                                studentId
                        );


        String career = "Not Generated";

        Double confidence = 0.0;


        if (
                predictions != null &&
                !predictions.isEmpty()
        ) {

            Prediction prediction =
                    predictions.get(0);


            if (
                    prediction.getRecommendedCareer() != null &&
                    !prediction
                            .getRecommendedCareer()
                            .trim()
                            .isEmpty()
            ) {

                career =
                        prediction
                                .getRecommendedCareer();
            }


            if (
                    prediction.getConfidence() != null
            ) {

                confidence =
                        prediction.getConfidence();
            }
        }


        response.setRecommendedCareer(
                career
        );

        response.setConfidence(
                confidence
        );


        // =================================================
        // 7. CAREER ROADMAP
        // =================================================

        int totalSteps = 0;

        int completedSteps = 0;


        if (
                !career.equals("Not Generated")
        ) {

            List<CareerRoadmap> roadmap =
                    careerRoadmapRepository
                            .findByCareerOrderByStepNumberAsc(
                                    career
                            );


            if (roadmap != null) {

                totalSteps =
                        roadmap.size();
            }


            // =============================================
            // GET ROADMAP PROGRESS
            // =============================================

            List<RoadmapProgress> progressList =
                    roadmapProgressRepository
                            .findByStudentId(
                                    studentId
                            );


            // =============================================
            // COUNT COMPLETED STEPS
            // =============================================

            if (
                    progressList != null &&
                    roadmap != null
            ) {

                for (
                        RoadmapProgress progress :
                        progressList
                ) {

                    if (
                            Boolean.TRUE.equals(
                                    progress.getCompleted()
                            )
                    ) {

                        boolean roadmapExists = false;


                        for (
                                CareerRoadmap step :
                                roadmap
                        ) {

                            if (
                                    step.getId()
                                            .equals(
                                                    progress.getRoadmapId()
                                            )
                            ) {

                                roadmapExists = true;

                                break;
                            }
                        }


                        if (roadmapExists) {

                            completedSteps++;
                        }
                    }
                }
            }
        }


        // =================================================
        // 8. ROADMAP PROGRESS %
        // =================================================

        double roadmapProgress = 0.0;


        if (totalSteps > 0) {

            roadmapProgress =
                    Math.round(
                            (
                                    (
                                            (double)
                                                    completedSteps
                                                    /
                                                    totalSteps
                                    ) * 100
                            )
                    );
        }


        response.setTotalRoadmapSteps(
                totalSteps
        );

        response.setCompletedRoadmapSteps(
                completedSteps
        );

        response.setRoadmapProgress(
                roadmapProgress
        );


        // =================================================
        // 9. RETURN
        // =================================================

        return response;
    }
}