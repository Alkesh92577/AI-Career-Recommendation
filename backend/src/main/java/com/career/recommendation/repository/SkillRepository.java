package com.career.recommendation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.career.recommendation.model.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSkillNameIgnoreCase(
            Long studentId,
            String skillName
    );

    @Modifying
    @Query("DELETE FROM Skill s WHERE s.studentId = :studentId")
    void deleteByStudentId(
            @Param("studentId") Long studentId
    );
}