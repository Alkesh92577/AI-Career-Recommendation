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

    @Value("${ml.service.url}")
    private String mlServiceUrl;

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

        flaskData.put(
                "technology_score",
                getSafeScore(
                        request.getTechnologyScore()
                )
        );

        flaskData.put(
                "data_score",
                getSafeScore(
                        request.getDataScore()
                )
        );

        flaskData.put(
                "web_score",
                getSafeScore(
                        request.getWebScore()
                )
        );

        flaskData.put(
                "cyber_security_score",
                getSafeScore(
                        request.getCyberSecurityScore()
                )
        );

        // =================================================
        // SKILLS
        // =================================================

        if (request.getSkills() != null) {

            flaskData.put(
                    "skills",
                    request.getSkills()
            );

        } else {

            flaskData.put(
                    "skills",
                    List.of()
            );
        }

        // =================================================
        // DEBUG REQUEST
        // =================================================

        System.out.println(
                "\n===================================="
        );

        System.out.println(
                "🤖 AI CAREER PREDICTION REQUEST"
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
                "\n📤 DATA SENT TO FLASK:"
        );

        System.out.println(
                flaskData
        );

        System.out.println(
                "\n🛠 SKILLS SENT TO FLASK:"
        );

        System.out.println(
                flaskData.get("skills")
        );

        System.out.println(
                "\n📊 CATEGORY SCORES:"
        );

        System.out.println(
                "Technology: "
                        + flaskData.get(
                        "technology_score"
                )
        );

        System.out.println(
                "Data: "
                        + flaskData.get(
                        "data_score"
                )
        );

        System.out.println(
                "Web: "
                        + flaskData.get(
                        "web_score"
                )
        );

        System.out.println(
                "Cyber Security: "
                        + flaskData.get(
                        "cyber_security_score"
                )
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

        ResponseEntity<Map> response;

        try {

            response =
                    restTemplate.postForEntity(
                            mlServiceUrl,
                            entity,
                            Map.class
                    );

            System.out.println(
                    "\n===================================="
            );

            System.out.println(
                    "🤖 FLASK RAW RESPONSE:"
            );

            System.out.println(
                    response.getBody()
            );

            System.out.println(
                    "===================================="
            );

        } catch (Exception e) {

            System.out.println(
                    "\n===================================="
            );

            System.out.println(
                    "❌ ML SERVICE CONNECTION ERROR"
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
        // RESULT
        // =================================================

        Map<String, Object> result =
                response.getBody();

        if (result == null) {

            throw new RuntimeException(
                    "Received an empty response from ML service."
            );
        }

        // =================================================
        // BACKEND CAREER
        // =================================================

        Object backendCareerObject =
                result.get("career");

        if (backendCareerObject == null) {

            backendCareerObject =
                    result.get(
                            "recommendedCareer"
                    );
        }

        String backendCareer =
                backendCareerObject != null
                        ? backendCareerObject.toString()
                        : null;

        // =================================================
        // CATEGORY SCORES
        // =================================================

        double technologyScore =
                getSafeScore(
                        request.getTechnologyScore()
                );

        double dataScore =
                getSafeScore(
                        request.getDataScore()
                );

        double webScore =
                getSafeScore(
                        request.getWebScore()
                );

        double cyberSecurityScore =
                getSafeScore(
                        request.getCyberSecurityScore()
                );

        // =================================================
        // DETERMINE STRONGEST CATEGORY
        // =================================================

        String finalCareer =
                backendCareer;

        String finalSource =
                result.get("predictionSource") != null
                        ? result.get(
                                "predictionSource"
                        ).toString()
                        : "machine_learning_model";

        double finalConfidence =
                result.get("confidence") != null
                        ? toDouble(
                                result.get("confidence")
                        )
                        : 0.0;

        String strongestCategory =
                "technology";

        double strongestScore =
                technologyScore;

        if (dataScore > strongestScore) {

            strongestCategory =
                    "data";

            strongestScore =
                    dataScore;
        }

        if (webScore > strongestScore) {

            strongestCategory =
                    "web";

            strongestScore =
                    webScore;
        }

        if (
                cyberSecurityScore
                        > strongestScore
        ) {

            strongestCategory =
                    "cyber_security";

            strongestScore =
                    cyberSecurityScore;
        }

        // =================================================
        // CATEGORY IS AUTHORITATIVE
        // =================================================

        if (strongestScore > 0) {

            switch (
                    strongestCategory
            ) {

                case "technology":

                    finalCareer =
                            "Software Developer";

                    break;

                case "data":

                    finalCareer =
                            "Data Analyst";

                    break;

                case "web":

                    finalCareer =
                            "Web Developer";

                    break;

                case "cyber_security":

                    finalCareer =
                            "Cyber Security Specialist";

                    break;

                default:

                    break;
            }

            finalSource =
                    "skill_assessment_category";

            finalConfidence =
                    strongestScore;
        }

        // =================================================
        // FINAL DEBUG
        // =================================================

        System.out.println(
                "\n===================================="
        );

        System.out.println(
                "🎯 FINAL SPRING BOOT CAREER"
        );

        System.out.println(
                "===================================="
        );

        System.out.println(
                "Flask Career:"
        );

        System.out.println(
                backendCareer
        );

        System.out.println(
                "\nStrongest Category:"
        );

        System.out.println(
                strongestCategory
        );

        System.out.println(
                "\nStrongest Category Score:"
        );

        System.out.println(
                strongestScore
        );

        System.out.println(
                "\nFINAL CAREER:"
        );

        System.out.println(
                finalCareer
        );

        System.out.println(
                "\nFINAL CONFIDENCE:"
        );

        System.out.println(
                finalConfidence
        );

        System.out.println(
                "\nFINAL SOURCE:"
        );

        System.out.println(
                finalSource
        );

        System.out.println(
                "===================================="
        );

        // =================================================
        // REASON
        // =================================================

        String reason =
                createPredictionReason(
                        finalCareer,
                        finalSource,
                        strongestCategory,
                        strongestScore
                );

        // =================================================
        // SAVE
        // =================================================

        Prediction prediction =
                new Prediction();

        prediction.setStudentId(
                request.getStudentId()
        );

        prediction.setRecommendedCareer(
                finalCareer
        );

        prediction.setConfidence(
                finalConfidence
        );

        prediction.setReason(
                reason
        );

        prediction.setCreatedAt(
                LocalDateTime.now()
        );

        Prediction savedPrediction =
                predictionRepository.save(
                        prediction
                );

        System.out.println(
                "\n===================================="
        );

        System.out.println(
                "💾 PREDICTION SAVED SUCCESSFULLY"
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

        System.out.println(
                "===================================="
        );

        return savedPrediction;
    }

    // =====================================================
    // SAFE SCORE
    // =====================================================

    private Double getSafeScore(
            Double score) {

        if (score == null) {

            return 0.0;
        }

        if (score < 0) {

            return 0.0;
        }

        if (score > 100) {

            return 100.0;
        }

        return score;
    }

    // =====================================================
    // DOUBLE HELPER
    // =====================================================

    private double toDouble(
            Object value) {

        if (value == null) {

            return 0.0;
        }

        try {

            return Double.parseDouble(
                    value.toString()
            );

        } catch (Exception e) {

            return 0.0;
        }
    }

    // =====================================================
    // REASON
    // =====================================================

    private String createPredictionReason(

            String career,

            String source,

            String category,

            double score) {

        StringBuilder reason =
                new StringBuilder();

        reason.append(
                "Career recommendation generated using "
                        + "your profile, skills and Skill "
                        + "Assessment results. "
        );

        if (score > 0) {

            reason.append(
                    "Your strongest Skill Assessment "
                            + "category was "
                            + formatCategoryName(
                            category
                    )
                            + " with a score of "
                            + score
                            + "%. "
            );
        }

        reason.append(
                "Final prediction source: "
                        + source
                        + "."
        );

        return reason.toString();
    }

    // =====================================================
    // FORMAT CATEGORY
    // =====================================================

    private String formatCategoryName(
            String category) {

        if (category == null) {

            return "";
        }

        switch (
                category.toLowerCase()
        ) {

            case "technology":

                return "Technology / Software Development";

            case "data":

                return "Data / Analytics";

            case "web":

                return "Web Development";

            case "cyber_security":

                return "Cyber Security";

            default:

                return category;
        }
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
    // GET LATEST
    // =====================================================

    public Prediction
    getLatestStudentPrediction(
            Long studentId) {

        return predictionRepository
                .findTopByStudentIdOrderByCreatedAtDesc(
                        studentId
                );
    }

    // =====================================================
    // GET ALL
    // =====================================================

    public List<Prediction>
    getAllPredictions() {

        return predictionRepository
                .findAll();
    }
}