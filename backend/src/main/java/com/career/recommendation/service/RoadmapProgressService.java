package com.career.recommendation.service;

import com.career.recommendation.model.RoadmapProgress;
import com.career.recommendation.repository.RoadmapProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoadmapProgressService {
    @Autowired private RoadmapProgressRepository repository;
    public List<RoadmapProgress> getByStudentId(Long studentId) {
        if (studentId == null) throw new IllegalArgumentException("Student ID is required");
        return repository.findByStudentId(studentId);
    }
    public RoadmapProgress updateProgress(Long studentId, Long roadmapId, Boolean completed) {
        if (studentId == null) throw new IllegalArgumentException("Student ID is required");
        if (roadmapId == null) throw new IllegalArgumentException("Roadmap ID is required");
        boolean done = Boolean.TRUE.equals(completed);
        RoadmapProgress progress = repository.findByStudentIdAndRoadmapId(studentId, roadmapId).orElseGet(() -> {
            RoadmapProgress p = new RoadmapProgress();
            p.setStudentId(studentId); p.setRoadmapId(roadmapId); return p;
        });
        progress.setCompleted(done);
        progress.setCompletedAt(done ? LocalDateTime.now() : null);
        return repository.save(progress);
    }
}
