package com.career.recommendation.controller;

import com.career.recommendation.model.Course;
import com.career.recommendation.service.CourseService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;


    public CourseController(
            CourseService courseService) {

        this.courseService =
                courseService;
    }


    // ==========================================
    // GET ALL COURSES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Course>>
    getAllCourses() {

        return ResponseEntity.ok(
                courseService.getAllCourses()
        );
    }


    // ==========================================
    // GET COURSES BY CAREER
    // ==========================================

    @GetMapping("/career/{career}")
    public ResponseEntity<List<Course>>
    getCoursesByCareer(
            @PathVariable String career) {

        return ResponseEntity.ok(
                courseService
                        .getCoursesByCareer(career)
        );
    }


    // ==========================================
    // GET COURSE BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Course>
    getCourseById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                courseService
                        .getCourseById(id)
        );
    }

}