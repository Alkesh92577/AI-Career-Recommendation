package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    @Column(name = "programming_knowledge")
    private String programmingKnowledge;

    @Column(name = "preferred_field")
    private String preferredField;

    private String education;

    private Integer experience;


    // =====================================================
    // ACADEMIC DETAILS - NEW FIELDS
    // =====================================================

    @Column(name = "tenth_marks")
    private Double tenthMarks;

    @Column(name = "twelfth_marks")
    private Double twelfthMarks;

    @Column(name = "graduation_marks")
    private Double graduationMarks;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "backlogs")
    private Integer backlogs;


    // =====================================================
    // Getters and Setters - EXISTING
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getProgrammingKnowledge() {
        return programmingKnowledge;
    }

    public void setProgrammingKnowledge(String programmingKnowledge) {
        this.programmingKnowledge = programmingKnowledge;
    }


    public String getPreferredField() {
        return preferredField;
    }

    public void setPreferredField(String preferredField) {
        this.preferredField = preferredField;
    }


    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }


    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }


    // =====================================================
    // Getters and Setters - ACADEMIC DETAILS
    // =====================================================

    public Double getTenthMarks() {
        return tenthMarks;
    }

    public void setTenthMarks(Double tenthMarks) {
        this.tenthMarks = tenthMarks;
    }


    public Double getTwelfthMarks() {
        return twelfthMarks;
    }

    public void setTwelfthMarks(Double twelfthMarks) {
        this.twelfthMarks = twelfthMarks;
    }


    public Double getGraduationMarks() {
        return graduationMarks;
    }

    public void setGraduationMarks(Double graduationMarks) {
        this.graduationMarks = graduationMarks;
    }


    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }


    public Integer getBacklogs() {
        return backlogs;
    }

    public void setBacklogs(Integer backlogs) {
        this.backlogs = backlogs;
    }
}