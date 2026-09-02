package com.career.recommendation.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.career.recommendation.model.Skill;
import com.career.recommendation.repository.SkillRepository;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;


    // ==========================================
    // GET ALL SKILLS
    // ==========================================

    public List<Skill> getAll() {

        return skillRepository.findAll();
    }


    // ==========================================
    // GET SKILLS BY STUDENT ID
    // ==========================================

    public List<Skill> getByStudentId(Long studentId) {

        return skillRepository.findByStudentId(studentId);
    }


    // ==========================================
    // ADD SKILL
    // ==========================================

    public Skill save(Skill skill) {

        // --------------------------------------
        // NULL CHECK
        // --------------------------------------

        if (skill == null) {

            throw new RuntimeException(
                    "Skill data is required."
            );
        }


        // --------------------------------------
        // STUDENT ID CHECK
        // --------------------------------------

        if (skill.getStudentId() == null) {

            throw new RuntimeException(
                    "Student ID is required."
            );
        }


        // --------------------------------------
        // SKILL NAME CHECK
        // --------------------------------------

        if (skill.getSkillName() == null ||
                skill.getSkillName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Skill name is required."
            );
        }


        // --------------------------------------
        // CLEAN SKILL NAME
        // --------------------------------------

        String skillName =
                skill.getSkillName().trim();

        skill.setSkillName(skillName);


        // --------------------------------------
        // DUPLICATE CHECK
        // --------------------------------------

        boolean alreadyExists =
                skillRepository
                        .existsByStudentIdAndSkillNameIgnoreCase(
                                skill.getStudentId(),
                                skillName
                        );


        if (alreadyExists) {

            throw new RuntimeException(
                    "This skill is already added."
            );
        }


        // --------------------------------------
        // SAVE
        // --------------------------------------

        return skillRepository.save(skill);
    }


    // ==========================================
    // UPDATE SKILL
    // ==========================================

    public Skill update(
            Long id,
            Skill skill) {

        if (skill == null) {

            throw new RuntimeException(
                    "Skill data is required."
            );
        }


        if (skill.getSkillName() == null ||
                skill.getSkillName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Skill name is required."
            );
        }


        // --------------------------------------
        // GET EXISTING
        // --------------------------------------

        Skill existing =
                skillRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found."
                                )
                        );


        String newSkillName =
                skill.getSkillName().trim();


        // --------------------------------------
        // DUPLICATE CHECK
        // --------------------------------------

        boolean duplicate =
                skillRepository
                        .existsByStudentIdAndSkillNameIgnoreCase(
                                existing.getStudentId(),
                                newSkillName
                        );


        /*
         * Agar duplicate kisi doosri row me hai
         * tab error.
         *
         * Agar current row hi same skill hai
         * to allowed.
         */

        if (duplicate &&
                !newSkillName.equalsIgnoreCase(
                        existing.getSkillName()
                )) {

            throw new RuntimeException(
                    "This skill is already added."
            );
        }


        // --------------------------------------
        // UPDATE
        // --------------------------------------

        existing.setSkillName(
                newSkillName
        );

        existing.setLevel(
                skill.getLevel()
        );


        return skillRepository.save(
                existing
        );
    }


    // ==========================================
    // DELETE SKILL
    // ==========================================

    public void delete(Long id) {

        skillRepository.deleteById(id);
    }


    // ==========================================
    // DELETE ALL STUDENT SKILLS
    // ==========================================

    public void deleteByStudentId(
            Long studentId) {

        skillRepository.deleteByStudentId(
                studentId
        );
    }
}