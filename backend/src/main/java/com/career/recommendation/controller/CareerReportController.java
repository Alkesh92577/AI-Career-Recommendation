package com.career.recommendation.controller;

import com.career.recommendation.dto.CareerReport;
import com.career.recommendation.service.CareerReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/career-report")
public class CareerReportController {

    private final CareerReportService careerReportService;

    public CareerReportController(
            CareerReportService careerReportService) {

        this.careerReportService =
                careerReportService;
    }


    // ==========================================
    // GET CAREER REPORT BY STUDENT ID
    // ==========================================

    @GetMapping("/{studentId}")
    public ResponseEntity<CareerReport> getCareerReport(
            @PathVariable Long studentId) {

        CareerReport report =
                careerReportService
                        .getCareerReport(studentId);

        return ResponseEntity.ok(report);
    }
}