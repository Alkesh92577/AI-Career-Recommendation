package com.career.recommendation.dto;

import java.util.List;

public class AssessmentQuestionDTO {

    private Long id;

    private String careerField;

    private String courseName;

    private String question;

    private List<String> options;


    public AssessmentQuestionDTO() {
    }


    public AssessmentQuestionDTO(
            Long id,
            String careerField,
            String courseName,
            String question,
            List<String> options) {

        this.id = id;
        this.careerField = careerField;
        this.courseName = courseName;
        this.question = question;
        this.options = options;
    }


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


    public String getQuestion() {

        return question;
    }


    public void setQuestion(
            String question) {

        this.question =
                question;
    }


    public List<String> getOptions() {

        return options;
    }


    public void setOptions(
            List<String> options) {

        this.options =
                options;
    }

}