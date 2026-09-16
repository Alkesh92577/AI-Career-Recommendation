package com.career.recommendation.controller;

import com.career.recommendation.model.RoadmapProgress;
import com.career.recommendation.service.RoadmapProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roadmap-progress")
@CrossOrigin
public class RoadmapProgressController {
    @Autowired private RoadmapProgressService service;
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RoadmapProgress>> getByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.getByStudentId(studentId));
    }
    @PostMapping("/update")
    public ResponseEntity<RoadmapProgress> updateProgress(@RequestBody RoadmapProgress request) {
        if (request == null || request.getStudentId() == null || request.getRoadmapId() == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(service.updateProgress(request.getStudentId(), request.getRoadmapId(), request.getCompleted()));
    }
}
