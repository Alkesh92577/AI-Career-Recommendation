package com.career.recommendation.controller;

import com.career.recommendation.model.RoadmapProgress;
import com.career.recommendation.service.RoadmapProgressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap-progress")
public class RoadmapProgressController {


    @Autowired
    private RoadmapProgressService
            roadmapProgressService;


    // ==========================================
    // GET PROGRESS
    // ==========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudentId(
            @PathVariable Long studentId
    ) {

        try {

            List<RoadmapProgress> progress =
                    roadmapProgressService
                            .getByStudentId(
                                    studentId
                            );


            return ResponseEntity.ok(
                    progress
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Progress load failed: "
                                    + e.getMessage()
                    );

        }

    }


    // ==========================================
    // UPDATE PROGRESS
    // ==========================================

    @PostMapping("/update")
    public ResponseEntity<?> updateProgress(
            @RequestBody RoadmapProgress request
    ) {

        try {

            RoadmapProgress saved =
                    roadmapProgressService
                            .updateProgress(
                                    request.getStudentId(),
                                    request.getRoadmapId(),
                                    request.getCompleted()
                            );


            return ResponseEntity.ok(
                    saved
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Progress update failed: "
                                    + e.getMessage()
                    );

        }

    }

}