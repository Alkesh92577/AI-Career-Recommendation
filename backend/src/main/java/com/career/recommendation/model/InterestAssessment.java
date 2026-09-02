package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "interest_assessments")
public class InterestAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // STUDENT ID
    // =====================================================

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    // =====================================================
    // ATTEMPT ID
    // =====================================================

    @Column(name = "attempt_id", nullable = false)
    private String attemptId;

    // =====================================================
    // QUESTION
    // =====================================================

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;

    // =====================================================
    // SELECTED ANSWER
    // =====================================================

    @Column(name = "selected_answer", columnDefinition = "TEXT")
    private String selectedAnswer;

    // =====================================================
    // INTEREST SCORE
    //
    // Kept for database compatibility.
    // Prediction system does NOT use this field.
    // =====================================================

    @Column(name = "interest_score")
    private Integer interestScore;

    // =====================================================
    // CAREER CATEGORY
    // =====================================================

    @Column(name = "career_category")
    private String careerCategory;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public InterestAssessment() {
    }

    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(String attemptId) {
        this.attemptId = attemptId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public Integer getInterestScore() {
        return interestScore;
    }

    public void setInterestScore(Integer interestScore) {
        this.interestScore = interestScore;
    }

    public String getCareerCategory() {
        return careerCategory;
    }

    public void setCareerCategory(String careerCategory) {
        this.careerCategory = careerCategory;
    }
}