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


        try {

            /*
             * IMPORTANT:
             *
             * Student model me field fullName hai.
             *
             * Isliye getName() nahi,
             * getFullName() use karna hai.
             */

            if (
                    student.getFullName() != null &&
                    !student.getFullName().isBlank()
            ) {

                name =
                        student.getFullName();
            }

        } catch (Exception ignored) {
        }


        response.setStudentName(name);


        // =================================================
        // 4. PROFILE COMPLETION
        // =================================================

        int completedProfileFields = 0;

        int totalProfileFields = 7;


        // NAME

        try {

            if (
                    student.getFullName() != null &&
                    !student.getFullName().isBlank()
            ) {

                completedProfileFields++;
            }

        } catch (Exception ignored) {
        }


        // EMAIL

        try {

            if (
                    student.getEmail() != null &&
                    !student.getEmail().isBlank()
            ) {

                completedProfileFields++;
            }

        } catch (Exception ignored) {
        }


        // 10th MARKS

        if (
                student.getTenthMarks() != null
        ) {

            completedProfileFields++;
        }


        // 12th MARKS

        if (
                student.getTwelfthMarks() != null
        ) {

            completedProfileFields++;
        }


        // GRADUATION MARKS

        if (
                student.getGraduationMarks() != null
        ) {

            completedProfileFields++;
        }


        // SEMESTER

        if (
                student.getSemester() != null
        ) {

            completedProfileFields++;
        }


        // BACKLOGS

        if (
                student.getBacklogs() != null
        ) {

            completedProfileFields++;
        }


        int profileCompletion = 0;


        if (
                totalProfileFields > 0
        ) {

            profileCompletion =
                    (int) Math.round(
                            (
                                    (double)
                                            completedProfileFields
                                            /
                                            totalProfileFields
                            ) * 100
                    );
        }


        response.setProfileCompletion(
                profileCompletion
        );


        // =================================================
        // 5. SKILLS COUNT
        // =================================================

        // ==========================================
// SKILLS COUNT
// ==========================================

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


        String career =
                "Not Generated";


        Double confidence =
                0.0;


        if (
                predictions != null &&
                !predictions.isEmpty()
        ) {

            Prediction prediction =
                    predictions.get(0);


            if (
                    prediction.getRecommendedCareer()
                            != null
            ) {

                career =
                        prediction.getRecommendedCareer();
            }


            if (
                    prediction.getConfidence()
                            != null
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
                !career.equals(
                        "Not Generated"
                )
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
            // GET STUDENT ROADMAP PROGRESS
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

                        boolean roadmapExists =
                                false;


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

                                roadmapExists =
                                        true;

                                break;
                            }
                        }


                        if (
                                roadmapExists
                        ) {

                            completedSteps++;
                        }
                    }
                }
            }
        }


        // =================================================
        // 8. ROADMAP PROGRESS %
        // =================================================

        double roadmapProgress =
                0.0;


        if (
                totalSteps > 0
        ) {

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
        // 9. RETURN RESPONSE
        // =================================================

        return response;
    }
}