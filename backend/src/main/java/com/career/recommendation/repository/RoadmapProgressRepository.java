package com.career.recommendation.repository;

import com.career.recommendation.model.RoadmapProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RoadmapProgressRepository extends JpaRepository<RoadmapProgress, Long> {
    List<RoadmapProgress> findByStudentId(Long studentId);
    Optional<RoadmapProgress> findByStudentIdAndRoadmapId(Long studentId, Long roadmapId);
    @Modifying
    @Query("DELETE FROM RoadmapProgress r WHERE r.studentId = :studentId")
    void deleteByStudentId(@Param("studentId") Long studentId);
}
