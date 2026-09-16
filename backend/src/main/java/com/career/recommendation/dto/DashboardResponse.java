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


    // =====================================================
    // STUDENT ID
    // =====================================================

    public Long getStudentId() {

        return studentId;
    }


    public void setStudentId(Long studentId) {

        this.studentId = studentId;
    }


    // =====================================================
    // STUDENT NAME
    // =====================================================

    public String getStudentName() {

        return studentName;
    }


    public void setStudentName(String studentName) {

        this.studentName = studentName;
    }


    // =====================================================
    // PROFILE COMPLETION
    // =====================================================

    public int getProfileCompletion() {

        return profileCompletion;
    }


    public void setProfileCompletion(
            int profileCompletion
    ) {

        this.profileCompletion =
                profileCompletion;
    }


    // =====================================================
    // SKILLS COUNT
    // =====================================================

    public int getSkillsCount() {

        return skillsCount;
    }


    public void setSkillsCount(int skillsCount) {

        this.skillsCount =
                skillsCount;
    }


    // =====================================================
    // RECOMMENDED CAREER
    // =====================================================

    public String getRecommendedCareer() {

        return recommendedCareer;
    }


    public void setRecommendedCareer(
            String recommendedCareer
    ) {

        this.recommendedCareer =
                recommendedCareer;
    }


    // =====================================================
    // CONFIDENCE
    // =====================================================

    public Double getConfidence() {

        return confidence;
    }


    public void setConfidence(
            Double confidence
    ) {

        this.confidence =
                confidence;
    }


    // =====================================================
    // TOTAL ROADMAP STEPS
    // =====================================================

    public int getTotalRoadmapSteps() {

        return totalRoadmapSteps;
    }


    public void setTotalRoadmapSteps(
            int totalRoadmapSteps
    ) {

        this.totalRoadmapSteps =
                totalRoadmapSteps;
    }


    // =====================================================
    // COMPLETED ROADMAP STEPS
    // =====================================================

    public int getCompletedRoadmapSteps() {

        return completedRoadmapSteps;
    }


    public void setCompletedRoadmapSteps(
            int completedRoadmapSteps
    ) {

        this.completedRoadmapSteps =
                completedRoadmapSteps;
    }


    // =====================================================
    // ROADMAP PROGRESS
    // =====================================================

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