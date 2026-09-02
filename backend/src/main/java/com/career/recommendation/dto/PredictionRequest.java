package com.career.recommendation.dto;


public class PredictionRequest {


    // =====================================================
    // STUDENT ID
    // =====================================================

    private Long studentId;


    // =====================================================
    // PROGRAMMING KNOWLEDGE
    // =====================================================

    private String programmingKnowledge;


    // =====================================================
    // PREFERRED CAREER / FIELD
    // =====================================================

    private String preferredField;


    // =====================================================
    // ACADEMIC DETAILS
    // =====================================================

    private Double tenthMarks;

    private Double twelfthMarks;

    private Double graduationMarks;

    private Integer semester;

    private Integer backlogs;


    // =====================================================
    // SKILL SCORE
    // =====================================================

    private Double skillScore;


    // =====================================================
    // SKILL ASSESSMENT SCORE
    // =====================================================

    private Double assessmentScore;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PredictionRequest() {

    }


    // =====================================================
    // STUDENT ID GETTER / SETTER
    // =====================================================

    public Long getStudentId() {

        return studentId;

    }


    public void setStudentId(Long studentId) {

        this.studentId = studentId;

    }


    // =====================================================
    // PROGRAMMING KNOWLEDGE GETTER / SETTER
    // =====================================================

    public String getProgrammingKnowledge() {

        return programmingKnowledge;

    }


    public void setProgrammingKnowledge(
            String programmingKnowledge) {

        this.programmingKnowledge =
                programmingKnowledge;

    }


    // =====================================================
    // PREFERRED FIELD GETTER / SETTER
    // =====================================================

    public String getPreferredField() {

        return preferredField;

    }


    public void setPreferredField(
            String preferredField) {

        this.preferredField =
                preferredField;

    }


    // =====================================================
    // 10TH MARKS GETTER / SETTER
    // =====================================================

    public Double getTenthMarks() {

        return tenthMarks;

    }


    public void setTenthMarks(
            Double tenthMarks) {

        this.tenthMarks =
                tenthMarks;

    }


    // =====================================================
    // 12TH MARKS GETTER / SETTER
    // =====================================================

    public Double getTwelfthMarks() {

        return twelfthMarks;

    }


    public void setTwelfthMarks(
            Double twelfthMarks) {

        this.twelfthMarks =
                twelfthMarks;

    }


    // =====================================================
    // GRADUATION MARKS GETTER / SETTER
    // =====================================================

    public Double getGraduationMarks() {

        return graduationMarks;

    }


    public void setGraduationMarks(
            Double graduationMarks) {

        this.graduationMarks =
                graduationMarks;

    }


    // =====================================================
    // SEMESTER GETTER / SETTER
    // =====================================================

    public Integer getSemester() {

        return semester;

    }


    public void setSemester(
            Integer semester) {

        this.semester =
                semester;

    }


    // =====================================================
    // BACKLOGS GETTER / SETTER
    // =====================================================

    public Integer getBacklogs() {

        return backlogs;

    }


    public void setBacklogs(
            Integer backlogs) {

        this.backlogs =
                backlogs;

    }


    // =====================================================
    // SKILL SCORE GETTER / SETTER
    // =====================================================

    public Double getSkillScore() {

        return skillScore;

    }


    public void setSkillScore(
            Double skillScore) {

        this.skillScore =
                skillScore;

    }




    // =====================================================
    // ASSESSMENT SCORE GETTER / SETTER
    // =====================================================

    public Double getAssessmentScore() {

        return assessmentScore;

    }


    public void setAssessmentScore(
            Double assessmentScore) {

        this.assessmentScore =
                assessmentScore;

    }

}