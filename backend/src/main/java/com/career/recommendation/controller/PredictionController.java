package com.career.recommendation.controller;

import com.career.recommendation.dto.PredictionRequest;
import com.career.recommendation.model.Prediction;
import com.career.recommendation.service.PredictionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;


    public PredictionController(
            PredictionService predictionService) {

        this.predictionService =
                predictionService;
    }


    // =====================================================
    // PREDICT
    // =====================================================

    @PostMapping("/predict")
    public ResponseEntity<Prediction> predict(
            @RequestBody PredictionRequest request) {

        return ResponseEntity.ok(
                predictionService.predict(request)
        );
    }


    // =====================================================
    // STUDENT PREDICTIONS
    // =====================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Prediction>>
    getStudentPredictions(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                predictionService
                        .getStudentPredictions(studentId)
        );
    }


    // =====================================================
    // ALL PREDICTIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Prediction>>
    getAllPredictions() {

        return ResponseEntity.ok(
                predictionService
                        .getAllPredictions()
        );
    }

}