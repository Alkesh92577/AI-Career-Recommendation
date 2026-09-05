package com.career.recommendation.service;

import com.career.recommendation.dto.PredictionRequest;
import com.career.recommendation.model.Prediction;
import com.career.recommendation.repository.PredictionRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;

    private final RestTemplate restTemplate;


    // =====================================================
    // ML SERVICE URL
    // =====================================================

    @Value("${ml.service.url}")
    private String mlServiceUrl;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

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


        // =================================================
        // VALIDATE REQUEST
        // =================================================

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
        // CREATE ML REQUEST DATA
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
                "\n===================================="
        );

        System.out.println(
                "AI CAREER PREDICTION REQUEST"
        );

        System.out.println(
                "===================================="
        );

        System.out.println(
                "ML SERVICE URL:"
        );

        System.out.println(
                mlServiceUrl
        );

        System.out.println(
                "\nDATA SENT TO ML SERVICE:"
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


        // =================================================
        // HTTP ENTITY
        // =================================================

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(
                        flaskData,
                        headers
                );


        // =================================================
        // CALL ML SERVICE
        // =================================================

        ResponseEntity<Map> response;

        try {

            response =
                    restTemplate.postForEntity(
                            mlServiceUrl,
                            entity,
                            Map.class
                    );

        } catch (Exception e) {

            System.out.println(
                    "\n===================================="
            );

            System.out.println(
                    "ML SERVICE CONNECTION ERROR"
            );

            System.out.println(
                    "===================================="
            );

            System.out.println(
                    e.getMessage()
            );

            throw new RuntimeException(
                    "Unable to connect to AI/ML service: "
                            + e.getMessage()
            );
        }


        // =================================================
        // DEBUG RESPONSE
        // =================================================

        System.out.println(
                "\n===================================="
        );

        System.out.println(
                "ML SERVICE RESPONSE"
        );

        System.out.println(
                "===================================="
        );

        System.out.println(
                response.getBody()
        );

        System.out.println(
                "===================================="
        );


        // =================================================
        // GET RESPONSE
        // =================================================

        Map<String, Object> result =
                response.getBody();


        if (result == null) {

            throw new RuntimeException(
                    "Received an empty response from ML service."
            );
        }


        // =================================================
        // GET CAREER
        // =================================================

        Object careerObject =
                result.get("career");


        if (careerObject == null) {

            throw new RuntimeException(
                    "Career was not found in ML service response."
            );
        }


        String career =
                careerObject.toString();


        // =================================================
        // GET CONFIDENCE
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
        // CREATE REASON
        // =================================================

        String reason =
                "Career recommendation generated using AI/ML "
                        + "model based on programming knowledge, "
                        + "preferred field, academic performance, "
                        + "skills and assessment score.";


        // =================================================
        // CREATE PREDICTION ENTITY
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
        // SAVE PREDICTION IN MYSQL
        // =================================================

        Prediction savedPrediction =
                predictionRepository.save(
                        prediction
                );


        // =================================================
        // SUCCESS DEBUG
        // =================================================

        System.out.println(
                "\n===================================="
        );

        System.out.println(
                "PREDICTION SAVED SUCCESSFULLY"
        );

        System.out.println(
                "===================================="
        );

        System.out.println(
                "Prediction ID: "
                        + savedPrediction.getId()
        );

        System.out.println(
                "Career: "
                        + savedPrediction
                        .getRecommendedCareer()
        );

        System.out.println(
                "Confidence: "
                        + savedPrediction
                        .getConfidence()
        );


        return savedPrediction;
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
    // GET LATEST STUDENT PREDICTION
    // =====================================================

    public Prediction getLatestStudentPrediction(
            Long studentId) {

        return predictionRepository
                .findTopByStudentIdOrderByCreatedAtDesc(
                        studentId
                );
    }


    // =====================================================
    // GET ALL PREDICTIONS
    // =====================================================

    public List<Prediction>
    getAllPredictions() {

        return predictionRepository
                .findAll();
    }
}