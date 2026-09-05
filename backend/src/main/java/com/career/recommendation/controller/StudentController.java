package com.career.recommendation.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.career.recommendation.model.Student;
import com.career.recommendation.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;


    // ==========================================
    // GET PROFILE BY USER ID
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<Student> getByUserId(
            @PathVariable Long userId) {

        Optional<Student> student =
                studentService.getByUserId(userId);

        if (student.isPresent()) {

            return ResponseEntity.ok(student.get());

        }

        return ResponseEntity.notFound().build();
    }


    // ==========================================
    // GET PROFILE BY STUDENT ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(
            @PathVariable Long id) {

        Optional<Student> student =
                studentService.getById(id);

        if (student.isPresent()) {

            return ResponseEntity.ok(student.get());

        }

        return ResponseEntity.notFound().build();
    }


    // ==========================================
    // CREATE PROFILE
    // ==========================================

    @PostMapping
    public ResponseEntity<Student> create(
            @RequestBody Student student) {

        Student saved =
                studentService.save(student);

        return ResponseEntity.ok(saved);
    }


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(
            @PathVariable Long id,
            @RequestBody Student student) {

        Optional<Student> existing =
                studentService.getById(id);

        if (existing.isEmpty()) {

            return ResponseEntity.notFound().build();
        }

        student.setId(id);

        Student updated =
                studentService.save(student);

        return ResponseEntity.ok(updated);
    }


    // =====================================================
    // UPDATE ACADEMIC DETAILS - NEW API
    // =====================================================

    @PutMapping("/{id}/academic")
    public ResponseEntity<Student> updateAcademicDetails(

            @PathVariable Long id,

            @RequestBody AcademicRequest request) {


        Optional<Student> updated =
                studentService.updateAcademicDetails(
                        id,
                        request.getTenthMarks(),
                        request.getTwelfthMarks(),
                        request.getGraduationMarks(),
                        request.getSemester(),
                        request.getBacklogs()
                );


        if (updated.isPresent()) {

            return ResponseEntity.ok(updated.get());

        }


        return ResponseEntity.notFound().build();
    }


    // =====================================================
    // ACADEMIC REQUEST DTO - NEW
    // =====================================================

    public static class AcademicRequest {

        private Double tenthMarks;

        private Double twelfthMarks;

        private Double graduationMarks;

        private Integer semester;

        private Integer backlogs;


        // -------------------------------
        // Tenth Marks
        // -------------------------------

        public Double getTenthMarks() {

            return tenthMarks;
        }

        public void setTenthMarks(Double tenthMarks) {

            this.tenthMarks = tenthMarks;
        }


        // -------------------------------
        // Twelfth Marks
        // -------------------------------

        public Double getTwelfthMarks() {

            return twelfthMarks;
        }

        public void setTwelfthMarks(Double twelfthMarks) {

            this.twelfthMarks = twelfthMarks;
        }


        // -------------------------------
        // Graduation Marks
        // -------------------------------

        public Double getGraduationMarks() {

            return graduationMarks;
        }

        public void setGraduationMarks(
                Double graduationMarks) {

            this.graduationMarks = graduationMarks;
        }


        // -------------------------------
        // Semester
        // -------------------------------

        public Integer getSemester() {

            return semester;
        }

        public void setSemester(Integer semester) {

            this.semester = semester;
        }


        // -------------------------------
        // Backlogs
        // -------------------------------

        public Integer getBacklogs() {

            return backlogs;
        }

        public void setBacklogs(Integer backlogs) {

            this.backlogs = backlogs;
        }
    }
}