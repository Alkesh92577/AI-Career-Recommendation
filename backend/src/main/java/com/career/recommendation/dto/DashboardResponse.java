package com.career.recommendation.dto;

public class DashboardResponse {

    private Long studentId;

    private String studentName;

    private int profileCompletion;

    private int skillsCount;

    private String recommendedCareer;

    private Double confidence;

    private int totalRoadmapSteps;

    private int completedRoadmapSteps;

    private double roadmapProgress;


    public DashboardResponse() {
    }


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


    public int getProfileCompletion() {
        return profileCompletion;
    }

    public void setProfileCompletion(int profileCompletion) {
        this.profileCompletion = profileCompletion;
    }


    // ==========================================
    // SKILLS COUNT
    // ==========================================

    public int getSkillsCount() {
        return skillsCount;
    }

    public void setSkillsCount(int skillsCount) {
        this.skillsCount = skillsCount;
    }


    public String getRecommendedCareer() {
        return recommendedCareer;
    }

    public void setRecommendedCareer(
            String recommendedCareer
    ) {

        this.recommendedCareer =
                recommendedCareer;
    }


    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(
            Double confidence
    ) {

        this.confidence = confidence;
    }


    public int getTotalRoadmapSteps() {
        return totalRoadmapSteps;
    }

    public void setTotalRoadmapSteps(
            int totalRoadmapSteps
    ) {

        this.totalRoadmapSteps =
                totalRoadmapSteps;
    }


    public int getCompletedRoadmapSteps() {
        return completedRoadmapSteps;
    }

    public void setCompletedRoadmapSteps(
            int completedRoadmapSteps
    ) {

        this.completedRoadmapSteps =
                completedRoadmapSteps;
    }


    public double getRoadmapProgress() {
        return roadmapProgress;
    }

    public void setRoadmapProgress(
            double roadmapProgress
    ) {

        this.roadmapProgress =
                roadmapProgress;
    }
}