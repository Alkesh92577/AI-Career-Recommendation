package com.career.recommendation.dto;

import java.util.List;

public class CareerReport {

    // ==========================================
    // STUDENT DETAILS
    // ==========================================

    private Long studentId;
    private String studentName;
    private String email;


    // ==========================================
    // ACADEMIC DETAILS
    // ==========================================

    private Double tenthMarks;
    private Double twelfthMarks;
    private Double graduationMarks;
    private Integer semester;
    private Integer backlogs;


    // ==========================================
    // AI PREDICTION
    // ==========================================

    private String recommendedCareer;
    private Double confidence;
    private String predictionReason;


    // ==========================================
    // ROADMAP PROGRESS
    // ==========================================

    private Integer totalRoadmapSteps;
    private Integer completedRoadmapSteps;
    private Double roadmapProgress;


    // ==========================================
    // COURSES
    // ==========================================

    private List<CourseReport> courses;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public CareerReport() {
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }


    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


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


    public String getRecommendedCareer() {
        return recommendedCareer;
    }

    public void setRecommendedCareer(
            String recommendedCareer) {

        this.recommendedCareer =
                recommendedCareer;
    }


    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(
            Double confidence) {

        this.confidence = confidence;
    }


    public String getPredictionReason() {
        return predictionReason;
    }

    public void setPredictionReason(
            String predictionReason) {

        this.predictionReason =
                predictionReason;
    }


    public Integer getTotalRoadmapSteps() {
        return totalRoadmapSteps;
    }

    public void setTotalRoadmapSteps(
            Integer totalRoadmapSteps) {

        this.totalRoadmapSteps =
                totalRoadmapSteps;
    }


    public Integer getCompletedRoadmapSteps() {
        return completedRoadmapSteps;
    }

    public void setCompletedRoadmapSteps(
            Integer completedRoadmapSteps) {

        this.completedRoadmapSteps =
                completedRoadmapSteps;
    }


    public Double getRoadmapProgress() {
        return roadmapProgress;
    }

    public void setRoadmapProgress(
            Double roadmapProgress) {

        this.roadmapProgress =
                roadmapProgress;
    }


    public List<CourseReport> getCourses() {
        return courses;
    }

    public void setCourses(
            List<CourseReport> courses) {

        this.courses = courses;
    }


    // ==========================================
    // INNER CLASS - COURSE REPORT
    // ==========================================

    public static class CourseReport {

        private Long id;
        private String courseName;
        private String courseUrl;
        private String duration;
        private String platform;


        public CourseReport() {
        }


        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }


        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(
                String courseName) {

            this.courseName =
                    courseName;
        }


        public String getCourseUrl() {
            return courseUrl;
        }

        public void setCourseUrl(
                String courseUrl) {

            this.courseUrl =
                    courseUrl;
        }


        public String getDuration() {
            return duration;
        }

        public void setDuration(
                String duration) {

            this.duration =
                    duration;
        }


        public String getPlatform() {
            return platform;
        }

        public void setPlatform(
                String platform) {

            this.platform =
                    platform;
        }
    }
}