package com.career.recommendation.service;

import com.career.recommendation.model.Course;
import com.career.recommendation.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(
            CourseRepository courseRepository) {

        this.courseRepository =
                courseRepository;
    }


    // ==========================================
    // GET ALL COURSES
    // ==========================================

    public List<Course> getAllCourses() {

        return courseRepository.findAll();
    }


    // ==========================================
    // GET COURSES BY CAREER
    // ==========================================

    public List<Course> getCoursesByCareer(
            String career) {

        return courseRepository
                .findByCareer(career);
    }


    // ==========================================
    // GET COURSE BY ID
    // ==========================================

    public Course getCourseById(
            Long id) {

        return courseRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Course not found with id: " + id
                        )
                );
    }
}