package com.career.recommendation.repository;

import com.career.recommendation.model.Course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository
        extends JpaRepository<Course, Long> {

    // ==========================================
    // FIND COURSES BY CAREER
    // ==========================================

    List<Course> findByCareer(
            String career
    );


    // ==========================================
    // FIND COURSES BY CAREER IGNORING CASE
    // ==========================================

    List<Course> findByCareerIgnoreCase(
            String career
    );


    // ==========================================
    // CHECK COURSE EXISTS BY COURSE NAME
    // ==========================================

    boolean existsByCourseName(
            String courseName
    );

}