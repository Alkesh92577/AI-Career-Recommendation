package com.career.recommendation.service;

import com.career.recommendation.model.RoadmapProgress;
import com.career.recommendation.repository.RoadmapProgressRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoadmapProgressService {


    @Autowired
    private RoadmapProgressRepository repository;


    // ==========================================
    // GET PROGRESS
    // ==========================================

    public List<RoadmapProgress>
    getByStudentId(Long studentId) {

        return repository
                .findByStudentId(
                        studentId
                );

    }


    // ==========================================
    // UPDATE PROGRESS
    // ==========================================

    public RoadmapProgress updateProgress(

            Long studentId,

            Long roadmapId,

            Boolean completed

    ) {


        List<RoadmapProgress> existing =
                repository
                        .findByStudentId(
                                studentId
                        );


        RoadmapProgress progress =
                existing
                        .stream()
                        .filter(
                                p ->
                                    p.getRoadmapId()
                                        .equals(
                                            roadmapId
                                        )
                        )
                        .findFirst()
                        .orElse(null);


        // ======================================
        // CREATE NEW
        // ======================================

        if (progress == null) {

            progress =
                    new RoadmapProgress();

            progress.setStudentId(
                    studentId
            );

            progress.setRoadmapId(
                    roadmapId
            );

        }


        // ======================================
        // STATUS
        // ======================================

        progress.setCompleted(
                completed
        );


        // ======================================
        // COMPLETED DATE
        // ======================================

        if (
                Boolean.TRUE.equals(
                        completed
                )
        ) {

            progress.setCompletedAt(
                    LocalDateTime.now()
            );

        } else {

            progress.setCompletedAt(
                    null
            );

        }


        return repository.save(
                progress
        );

    }

}