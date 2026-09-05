package com.career.recommendation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.career.recommendation.model.Skill;
import com.career.recommendation.service.SkillService;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;


    // ==========================================
    // GET SKILLS BY STUDENT ID
    // ==========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Skill>> getByStudentId(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                skillService.getByStudentId(studentId)
        );
    }


    // ==========================================
    // ADD SKILL
    // ==========================================

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Skill skill) {

        try {

            Skill saved =
                    skillService.save(skill);

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==========================================
    // UPDATE SKILL
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Skill skill) {

        try {

            Skill updated =
                    skillService.update(
                            id,
                            skill
                    );

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==========================================
    // DELETE SKILL
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id) {

        try {

            skillService.delete(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    "The skill isn't getting deleted."
                            )
                    );
        }
    }
}