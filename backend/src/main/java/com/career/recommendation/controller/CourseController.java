package com.career.recommendation.controller;

import com.career.recommendation.model.Course;
import com.career.recommendation.service.CourseService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

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
                        .getCoursesByCareer(
                                career
                        )
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
                        .getCourseById(
                                id
                        )
        );
    }


    // ==========================================
    // ADD COURSE
    // ==========================================

    @PostMapping
    public ResponseEntity<Course>
    addCourse(
            @RequestBody Course course) {

        return ResponseEntity.ok(
                courseService
                        .addCourse(
                                course
                        )
        );
    }


    // ==========================================
    // DELETE COURSE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteCourse(
            @PathVariable Long id) {

        courseService.deleteCourse(
                id
        );


        return ResponseEntity.noContent()
                .build();
    }

}