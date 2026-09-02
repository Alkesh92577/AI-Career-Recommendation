package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "career_roadmaps")
public class CareerRoadmap {

    // ==========================================
    // ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // STUDENT ID
    // ==========================================

    @Column(name = "student_id", nullable = false)
    private Long studentId;


    // ==========================================
    // CAREER
    // ==========================================

    @Column(name = "career", nullable = false)
    private String career;


    // ==========================================
    // STEP NUMBER
    // ==========================================

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;


    // ==========================================
    // TOPIC
    // ==========================================

    @Column(name = "topic")
    private String topic;


    // ==========================================
    // DESCRIPTION
    // ==========================================

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;


    // ==========================================
    // WHAT TO LEARN
    // ==========================================

    @Column(name = "what_to_learn", columnDefinition = "TEXT")
    private String whatToLearn;


    // ==========================================
    // DURATION
    // ==========================================

    @Column(name = "duration")
    private String duration;


    // ==========================================
    // DIFFICULTY
    // ==========================================

    @Column(name = "difficulty")
    private String difficulty;


    // ==========================================
    // RESOURCES
    // ==========================================

    @Column(name = "resources", columnDefinition = "TEXT")
    private String resources;


    // ==========================================
    // MINI PROJECT
    // ==========================================

    @Column(name = "mini_project", columnDefinition = "TEXT")
    private String miniProject;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CareerRoadmap() {
    }


    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }


    public Long getStudentId() {
        return studentId;
    }


    public String getCareer() {
        return career;
    }


    public Integer getStepNumber() {
        return stepNumber;
    }


    public String getTopic() {
        return topic;
    }


    public String getDescription() {
        return description;
    }


    public String getWhatToLearn() {
        return whatToLearn;
    }


    public String getDuration() {
        return duration;
    }


    public String getDifficulty() {
        return difficulty;
    }


    public String getResources() {
        return resources;
    }


    public String getMiniProject() {
        return miniProject;
    }


    // ==========================================
    // SETTERS
    // ==========================================

    public void setId(Long id) {
        this.id = id;
    }


    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }


    public void setCareer(String career) {
        this.career = career;
    }


    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }


    public void setTopic(String topic) {
        this.topic = topic;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public void setWhatToLearn(String whatToLearn) {
        this.whatToLearn = whatToLearn;
    }


    public void setDuration(String duration) {
        this.duration = duration;
    }


    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }


    public void setResources(String resources) {
        this.resources = resources;
    }


    public void setMiniProject(String miniProject) {
        this.miniProject = miniProject;
    }
}