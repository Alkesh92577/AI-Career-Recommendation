package com.career.recommendation.dto;

import java.util.List;
import java.util.Map;


/**
 * =========================================================
 * PREDICTION REQUEST DTO
 * =========================================================
 */
public class PredictionRequest {

    private Long studentId;

    private String programmingKnowledge;

    private String preferredField;

    private Double tenthMarks;

    private Double twelfthMarks;

    private Double graduationMarks;

    private Integer semester;

    private Integer backlogs;

    private Double skillScore;

    private Double assessmentScore;

    private Double technologyScore;

    private Double dataScore;

    private Double webScore;

    private Double cyberSecurityScore;

    private List<Map<String, Object>> skills;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public PredictionRequest() {
    }


    // =====================================================
    // STUDENT ID
    // =====================================================

    public Long getStudentId() {

        return studentId;
    }

    public void setStudentId(
            Long studentId) {

        this.studentId =
                studentId;
    }


    // =====================================================
    // PROGRAMMING KNOWLEDGE
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
    // PREFERRED FIELD
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
    // 10TH
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
    // 12TH
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
    // GRADUATION
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
    // SEMESTER
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
    // BACKLOGS
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
    // SKILL SCORE
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
    // ASSESSMENT SCORE
    // =====================================================

    public Double getAssessmentScore() {

        return assessmentScore;
    }

    public void setAssessmentScore(
            Double assessmentScore) {

        this.assessmentScore =
                assessmentScore;
    }


    // =====================================================
    // TECHNOLOGY SCORE
    // =====================================================

    public Double getTechnologyScore() {

        return technologyScore;
    }

    public void setTechnologyScore(
            Double technologyScore) {

        this.technologyScore =
                technologyScore;
    }


    // =====================================================
    // DATA SCORE
    // =====================================================

    public Double getDataScore() {

        return dataScore;
    }

    public void setDataScore(
            Double dataScore) {

        this.dataScore =
                dataScore;
    }


    // =====================================================
    // WEB SCORE
    // =====================================================

    public Double getWebScore() {

        return webScore;
    }

    public void setWebScore(
            Double webScore) {

        this.webScore =
                webScore;
    }


    // =====================================================
    // CYBER SECURITY SCORE
    // =====================================================

    public Double getCyberSecurityScore() {

        return cyberSecurityScore;
    }

    public void setCyberSecurityScore(
            Double cyberSecurityScore) {

        this.cyberSecurityScore =
                cyberSecurityScore;
    }


    // =====================================================
    // INDIVIDUAL SKILLS
    // =====================================================

    public List<Map<String, Object>> getSkills() {

        return skills;
    }

    public void setSkills(
            List<Map<String, Object>> skills) {

        this.skills =
                skills;
    }
}