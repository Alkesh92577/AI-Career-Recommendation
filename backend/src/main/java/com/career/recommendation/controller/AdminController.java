package com.career.recommendation.controller;

import com.career.recommendation.model.Course;
import com.career.recommendation.model.Student;
import com.career.recommendation.service.CourseService;
import com.career.recommendation.service.StudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final StudentService studentService;
    private final CourseService courseService;


    public AdminController(
            StudentService studentService,
            CourseService courseService) {

        this.studentService =
                studentService;

        this.courseService =
                courseService;
    }


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>>
    dashboard() {

        List<Student> students =
                studentService.getAll();

        List<Course> courses =
                courseService.getAllCourses();


        Map<String, Object> data =
                new HashMap<>();


        data.put(
                "totalStudents",
                students.size()
        );

        data.put(
                "totalCourses",
                courses.size()
        );

        data.put(
                "message",
                "Admin dashboard data"
        );


        return ResponseEntity.ok(data);
    }

}