package com.career.recommendation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="roadmap_progress", uniqueConstraints=@UniqueConstraint(name="uk_roadmap_progress_student_roadmap", columnNames={"student_id","roadmap_id"}))
public class RoadmapProgress {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="student_id", nullable=false) private Long studentId;
    @Column(name="roadmap_id", nullable=false) private Long roadmapId;
    @Column(nullable=false) private Boolean completed=false;
    private LocalDateTime completedAt;
    public Long getId(){return id;} public Long getStudentId(){return studentId;} public Long getRoadmapId(){return roadmapId;} public Boolean getCompleted(){return completed;} public LocalDateTime getCompletedAt(){return completedAt;}
    public void setId(Long v){id=v;} public void setStudentId(Long v){studentId=v;} public void setRoadmapId(Long v){roadmapId=v;} public void setCompleted(Boolean v){completed=v;} public void setCompletedAt(LocalDateTime v){completedAt=v;}
}
