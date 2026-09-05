package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String career;

    @Column(name = "course_name", length = 255)
    private String courseName;

    @Column(name = "course_url", length = 255)
    private String courseUrl;

    @Column(length = 255)
    private String duration;

    @Column(length = 255)
    private String platform;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Course() {
    }


    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public String getCareer() {
        return career;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getCourseUrl() {
        return courseUrl;
    }

    public String getDuration() {
        return duration;
    }

    public String getPlatform() {
        return platform;
    }


    // ==========================================
    // SETTERS
    // ==========================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setCareer(String career) {
        this.career = career;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setCourseUrl(String courseUrl) {
        this.courseUrl = courseUrl;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }
    
}