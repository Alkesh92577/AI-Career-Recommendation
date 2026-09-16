package com.career.recommendation.service;

import com.career.recommendation.model.Course;
import com.career.recommendation.repository.CourseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CourseService(
            CourseRepository courseRepository
    ) {

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
            String career
    ) {

        // ======================================
        // IF CAREER IS EMPTY
        // ======================================

        if (
                career == null ||
                career.trim().isEmpty()
        ) {

            return courseRepository.findAll();
        }


        // ======================================
        // FIND BY CAREER
        // ======================================

        return courseRepository
                .findByCareerIgnoreCase(
                        career.trim()
                );
    }


    // ==========================================
    // GET COURSE BY ID
    // ==========================================

    public Course getCourseById(
            Long id
    ) {

        return courseRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Course not found with id: "
                                                + id
                                )
                );
    }


    // ==========================================
    // ADD COURSE
    // ==========================================

    public Course addCourse(
            Course course
    ) {

        return courseRepository.save(
                course
        );
    }


    // ==========================================
    // DELETE COURSE
    // ==========================================

    public void deleteCourse(
            Long id
    ) {

        if (
                !courseRepository.existsById(
                        id
                )
        ) {

            throw new RuntimeException(
                    "Course not found with id: "
                            + id
            );
        }


        courseRepository.deleteById(
                id
        );
    }

}