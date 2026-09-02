package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "skill_assessments")
public class SkillAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // STUDENT ID
    // =====================================================

    @Column(name = "student_id")
    private Long studentId;


    // =====================================================
    // ATTEMPT ID
    // =====================================================
    //
    // Ek complete assessment ke saare questions ka
    // same attemptId hoga.
    //
    // Example:
    //
    // ATTEMPT-A12B34CD
    //
    // =====================================================

    @Column(name = "attempt_id", length = 50)
    private String attemptId;


    // =====================================================
    // SKILL NAME
    // =====================================================

    @Column(name = "skill_name")
    private String skillName;


    // =====================================================
    // QUESTION
    // =====================================================

    @Column(name = "question", length = 1000)
    private String question;


    // =====================================================
    // SELECTED ANSWER
    // =====================================================

    @Column(name = "selected_answer", length = 500)
    private String selectedAnswer;


    // =====================================================
    // CORRECT ANSWER
    // =====================================================

    @Column(name = "correct_answer", length = 500)
    private String correctAnswer;


    // =====================================================
    // SCORE
    // =====================================================

    @Column(name = "score")
    private Integer score;


    // =====================================================
    // GET ID
    // =====================================================

    public Long getId() {
        return id;
    }


    // =====================================================
    // SET ID
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }


    // =====================================================
    // GET STUDENT ID
    // =====================================================

    public Long getStudentId() {
        return studentId;
    }


    // =====================================================
    // SET STUDENT ID
    // =====================================================

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }


    // =====================================================
    // GET ATTEMPT ID
    // =====================================================

    public String getAttemptId() {
        return attemptId;
    }


    // =====================================================
    // SET ATTEMPT ID
    // =====================================================

    public void setAttemptId(String attemptId) {
        this.attemptId = attemptId;
    }


    // =====================================================
    // GET SKILL NAME
    // =====================================================

    public String getSkillName() {
        return skillName;
    }


    // =====================================================
    // SET SKILL NAME
    // =====================================================

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }


    // =====================================================
    // GET QUESTION
    // =====================================================

    public String getQuestion() {
        return question;
    }


    // =====================================================
    // SET QUESTION
    // =====================================================

    public void setQuestion(String question) {
        this.question = question;
    }


    // =====================================================
    // GET SELECTED ANSWER
    // =====================================================

    public String getSelectedAnswer() {
        return selectedAnswer;
    }


    // =====================================================
    // SET SELECTED ANSWER
    // =====================================================

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }


    // =====================================================
    // GET CORRECT ANSWER
    // =====================================================

    public String getCorrectAnswer() {
        return correctAnswer;
    }


    // =====================================================
    // SET CORRECT ANSWER
    // =====================================================

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }


    // =====================================================
    // GET SCORE
    // =====================================================

    public Integer getScore() {
        return score;
    }


    // =====================================================
    // SET SCORE
    // =====================================================

    public void setScore(Integer score) {
        this.score = score;
    }
}