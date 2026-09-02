package com.career.recommendation.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_progress")
public class RoadmapProgress {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    @Column(
            name = "student_id",
            nullable = false
    )
    private Long studentId;


    @Column(
            name = "roadmap_id",
            nullable = false
    )
    private Long roadmapId;


    @Column(
            name = "completed"
    )
    private Boolean completed = false;


    @Column(
            name = "completed_at"
    )
    private LocalDateTime completedAt;


    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }


    public Long getStudentId() {
        return studentId;
    }


    public Long getRoadmapId() {
        return roadmapId;
    }


    public Boolean getCompleted() {
        return completed;
    }


    public LocalDateTime getCompletedAt() {
        return completedAt;
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


    public void setRoadmapId(Long roadmapId) {
        this.roadmapId = roadmapId;
    }


    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }


    public void setCompletedAt(
            LocalDateTime completedAt
    ) {

        this.completedAt =
                completedAt;

    }

}