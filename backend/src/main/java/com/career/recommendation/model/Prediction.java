package com.career.recommendation.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    private Long studentId;


    private String recommendedCareer;


    private Double confidence;


    @Column(length = 1000)
    private String reason;


    private LocalDateTime createdAt;


    public Prediction() {
    }


    public Long getId() {

        return id;
    }


    public void setId(
            Long id) {

        this.id = id;
    }


    public Long getStudentId() {

        return studentId;
    }


    public void setStudentId(
            Long studentId) {

        this.studentId = studentId;
    }


    public String getRecommendedCareer() {

        return recommendedCareer;
    }


    public void setRecommendedCareer(
            String recommendedCareer) {

        this.recommendedCareer =
                recommendedCareer;
    }


    public Double getConfidence() {

        return confidence;
    }


    public void setConfidence(
            Double confidence) {

        this.confidence =
                confidence;
    }


    public String getReason() {

        return reason;
    }


    public void setReason(
            String reason) {

        this.reason =
                reason;
    }


    public LocalDateTime getCreatedAt() {

        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt =
                createdAt;
    }
}