package com.career.recommendation.controller;

import com.career.recommendation.dto.DashboardResponse;
import com.career.recommendation.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DashboardController(
            DashboardService dashboardService
    ) {

        this.dashboardService =
                dashboardService;
    }


    // =====================================================
    // GET DASHBOARD
    // =====================================================

    @GetMapping("/{studentId}")
    public ResponseEntity<DashboardResponse> getDashboard(
            @PathVariable Long studentId
    ) {

        DashboardResponse response =
                dashboardService.getDashboard(
                        studentId
                );


        return ResponseEntity.ok(
                response
        );
    }
}