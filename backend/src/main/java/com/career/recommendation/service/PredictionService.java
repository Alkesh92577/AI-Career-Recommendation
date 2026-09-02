package com.career.recommendation.service;

import com.career.recommendation.dto.PredictionRequest;
import com.career.recommendation.model.Prediction;
import com.career.recommendation.repository.PredictionRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;

    private final RestTemplate restTemplate;

    private final String FLASK_URL =
            "http://localhost:5000/predict";


    public PredictionService(
            PredictionRepository predictionRepository) {

        this.predictionRepository =
                predictionRepository;

        this.restTemplate =
                new RestTemplate();
    }


    // =====================================================
    // PREDICT
    // =====================================================

    public Prediction predict(
            PredictionRequest request) {


        if (request == null) {

            throw new IllegalArgumentException(
                    "Prediction request cannot be null"
            );
        }


        if (request.getStudentId() == null) {

            throw new IllegalArgumentException(
                    "Student ID is required"
            );
        }


        // =================================================
        // FLASK DATA
        // =================================================

        Map<String, Object> flaskData =
                new HashMap<>();


        flaskData.put(
                "programming_level",
                request.getProgrammingKnowledge()
        );


        flaskData.put(
                "preferred_field",
                request.getPreferredField()
        );


        flaskData.put(
                "tenth_marks",
                request.getTenthMarks()
        );


        flaskData.put(
                "twelfth_marks",
                request.getTwelfthMarks()
        );


        flaskData.put(
                "graduation_marks",
                request.getGraduationMarks()
        );


        flaskData.put(
                "semester",
                request.getSemester()
        );


        flaskData.put(
                "backlogs",
                request.getBacklogs()
        );


        flaskData.put(
                "skill_score",
                request.getSkillScore()
        );


        flaskData.put(
                "assessment_score",
                request.getAssessmentScore()
        );


        // =================================================
        // DEBUG
        // =================================================

        System.out.println(
                "===================================="
        );

        System.out.println(
                "DATA SENT TO FLASK ML"
        );

        System.out.println(
                "===================================="
        );

        System.out.println(
                flaskData
        );


        // =================================================
        // HEADERS
        // =================================================

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );


        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(
                        flaskData,
                        headers
                );


        // =================================================
        // CALL FLASK
        // =================================================

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        FLASK_URL,
                        entity,
                        Map.class
                );


        System.out.println(
                "===================================="
        );

        System.out.println(
                "FLASK RESPONSE"
        );

        System.out.println(
                response.getBody()
        );

        System.out.println(
                "===================================="
        );


        Map<String, Object> result =
                response.getBody();


        if (result == null) {

            throw new RuntimeException(
                    "Received an empty response from Flask.."
            );
        }


        // =================================================
        // CAREER
        // =================================================

        Object careerObject =
                result.get("career");


        if (careerObject == null) {

            throw new RuntimeException(
                    "Didn't find a career in Flask-Response.."
            );
        }


        String career =
                careerObject.toString();


        // =================================================
        // CONFIDENCE
        // =================================================

        Double confidence = null;


        Object confidenceObject =
                result.get("confidence");


        if (confidenceObject != null) {

            confidence =
                    Double.valueOf(
                            confidenceObject.toString()
                    );
        }


        // =================================================
        // REASON
        // =================================================

        String reason =
                "Career recommendation generated using AI/ML model based on profile, academic performance, skills and assessment score.";


        // =================================================
        // CREATE PREDICTION
        // =================================================

        Prediction prediction =
                new Prediction();


        prediction.setStudentId(
                request.getStudentId()
        );


        prediction.setRecommendedCareer(
                career
        );


        prediction.setConfidence(
                confidence
        );


        prediction.setReason(
                reason
        );


        prediction.setCreatedAt(
                LocalDateTime.now()
        );


        // =================================================
        // SAVE MYSQL
        // =================================================

        return predictionRepository.save(
                prediction
        );

    }


    // =====================================================
    // GET STUDENT PREDICTIONS
    // =====================================================

    public List<Prediction>
    getStudentPredictions(
            Long studentId) {

        return predictionRepository
                .findByStudentIdOrderByCreatedAtDesc(
                        studentId
                );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    public List<Prediction>
    getAllPredictions() {

        return predictionRepository.findAll();

    }

}