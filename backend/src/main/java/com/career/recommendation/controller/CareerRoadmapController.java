package com.career.recommendation.controller;

import com.career.recommendation.model.CareerRoadmap;
import com.career.recommendation.service.CareerRoadmapService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-roadmap")
public class CareerRoadmapController {

    private final CareerRoadmapService careerRoadmapService;

    public CareerRoadmapController(
            CareerRoadmapService careerRoadmapService
    ) {

        this.careerRoadmapService =
                careerRoadmapService;
    }

    // ==========================================
    // GET ROADMAP
    // ==========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CareerRoadmap>>
    getByStudentId(
            @PathVariable Long studentId
    ) {

        System.out.println(
                "GET ROADMAP REQUEST: "
                        + studentId
        );

        List<CareerRoadmap> roadmap =
                careerRoadmapService
                        .getByStudentId(studentId);

        return ResponseEntity.ok(roadmap);
    }

    // ==========================================
    // DELETE ROADMAP
    // ==========================================

    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<?> deleteByStudentId(
            @PathVariable Long studentId
    ) {

        try {

            System.out.println(
                    "DELETE ROADMAP REQUEST: "
                            + studentId
            );

            careerRoadmapService
                    .deleteByStudentId(studentId);

            return ResponseEntity.ok(
                    "Roadmap deleted successfully."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Roadmap delete failed: "
                                    + e.getMessage()
                    );
        }
    }

    // ==========================================
    // GENERATE ROADMAP
    // ==========================================

    @PostMapping("/generate/{studentId}")
    public ResponseEntity<?> generateRoadmap(
            @PathVariable Long studentId
    ) {

        try {

            System.out.println(
                    "================================"
            );

            System.out.println(
                    "GENERATE ROADMAP REQUEST: "
                            + studentId
            );

            System.out.println(
                    "================================"
            );

            List<CareerRoadmap> roadmap =
                    careerRoadmapService
                            .generateRoadmap(
                                    studentId
                            );

            System.out.println(
                    "Generated Steps: "
                            + roadmap.size()
            );

            return ResponseEntity.ok(
                    roadmap
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Roadmap generation failed: "
                                    + e.getMessage()
                    );
        }
    }
}