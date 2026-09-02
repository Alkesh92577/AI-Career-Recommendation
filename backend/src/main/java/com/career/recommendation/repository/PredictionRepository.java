package com.career.recommendation.repository;

import com.career.recommendation.model.Prediction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository
        extends JpaRepository<Prediction, Long> {

    List<Prediction>
    findByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );


    Prediction
    findTopByStudentIdOrderByCreatedAtDesc(
            Long studentId
    );
}