package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "assessment_questions")
public class AssessmentQuestion {

    @Id
    @GeneratedValue(
            strategy =
            GenerationType.IDENTITY
    )
    private Long id;


    @Column(name = "career_field")
    private String careerField;


    @Column(name = "course_name")
    private String courseName;


    @Column(name = "question_text")
    private String questionText;


    @Column(name = "option_a")
    private String optionA;


    @Column(name = "option_b")
    private String optionB;


    @Column(name = "option_c")
    private String optionC;


    @Column(name = "option_d")
    private String optionD;


    @Column(name = "correct_answer")
    private String correctAnswer;


    @Column(
            name = "explanation",
            length = 2000
    )
    private String explanation;


    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

    public Long getId() {

        return id;
    }


    public void setId(
            Long id) {

        this.id = id;
    }


    public String getCareerField() {

        return careerField;
    }


    public void setCareerField(
            String careerField) {

        this.careerField =
                careerField;
    }


    public String getCourseName() {

        return courseName;
    }


    public void setCourseName(
            String courseName) {

        this.courseName =
                courseName;
    }


    public String getQuestionText() {

        return questionText;
    }


    public void setQuestionText(
            String questionText) {

        this.questionText =
                questionText;
    }


    public String getOptionA() {

        return optionA;
    }


    public void setOptionA(
            String optionA) {

        this.optionA =
                optionA;
    }


    public String getOptionB() {

        return optionB;
    }


    public void setOptionB(
            String optionB) {

        this.optionB =
                optionB;
    }


    public String getOptionC() {

        return optionC;
    }


    public void setOptionC(
            String optionC) {

        this.optionC =
                optionC;
    }


    public String getOptionD() {

        return optionD;
    }


    public void setOptionD(
            String optionD) {

        this.optionD =
                optionD;
    }


    public String getCorrectAnswer() {

        return correctAnswer;
    }


    public void setCorrectAnswer(
            String correctAnswer) {

        this.correctAnswer =
                correctAnswer;
    }


    public String getExplanation() {

        return explanation;
    }


    public void setExplanation(
            String explanation) {

        this.explanation =
                explanation;
    }

}