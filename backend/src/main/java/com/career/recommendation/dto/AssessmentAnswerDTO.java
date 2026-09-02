package com.career.recommendation.dto;

public class AssessmentAnswerDTO {

    private Long questionId;

    private String selectedAnswer;


    public AssessmentAnswerDTO() {
    }


    public Long getQuestionId() {
        return questionId;
    }


    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }


    public String getSelectedAnswer() {
        return selectedAnswer;
    }


    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}