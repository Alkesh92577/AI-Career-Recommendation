package com.career.recommendation.dto;

import java.util.List;

public class AssessmentResultDTO {

    private int score;

    private int totalQuestions;

    private double percentage;

    private String recommendedCareer;

    private List<AssessmentResultItemDTO> results;


    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }


    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }


    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }


    public String getRecommendedCareer() {
        return recommendedCareer;
    }

    public void setRecommendedCareer(String recommendedCareer) {
        this.recommendedCareer = recommendedCareer;
    }


    public List<AssessmentResultItemDTO> getResults() {
        return results;
    }

    public void setResults(
            List<AssessmentResultItemDTO> results) {

        this.results = results;
    }
}