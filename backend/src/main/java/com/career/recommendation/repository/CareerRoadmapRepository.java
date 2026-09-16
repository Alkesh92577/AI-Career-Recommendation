package com.career.recommendation.repository;

import com.career.recommendation.model.CareerRoadmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRoadmapRepository
        extends JpaRepository<CareerRoadmap, Long> {

    // ==========================================
    // GET ROADMAP BY STUDENT
    // ==========================================

    List<CareerRoadmap> findByStudentId(
            Long studentId
    );

    // ==========================================
    // GET ROADMAP BY CAREER
    // ==========================================

    List<CareerRoadmap>
    findByCareerOrderByStepNumberAsc(
            String career
    );

    // ==========================================
    // DELETE ROADMAP BY STUDENT
    // ==========================================

    long deleteByStudentId(
            Long studentId
    );
}