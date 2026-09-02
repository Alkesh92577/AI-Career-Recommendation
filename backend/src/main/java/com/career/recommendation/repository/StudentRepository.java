package com.career.recommendation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.career.recommendation.model.Student;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Optional<Student> findByUserId(Long userId);
}