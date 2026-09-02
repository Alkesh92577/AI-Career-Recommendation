package com.career.recommendation.repository;

import com.career.recommendation.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

    List<Course> findByCareer(String career);

}