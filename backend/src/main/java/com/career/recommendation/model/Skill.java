package com.career.recommendation.model;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // STUDENT ID
    // ==========================================

    @Column(name = "student_id", nullable = false)
    private Long studentId;


    // ==========================================
    // SKILL NAME
    // ==========================================

    @Column(name = "skill_name", nullable = false)
    private String skillName;


    // ==========================================
    // SKILL LEVEL
    // 1 = Beginner
    // 2 = Intermediate
    // 3 = Advanced
    // ==========================================

    @Column(name = "level")
    private Integer level;


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {

        return id;
    }


    public void setId(Long id) {

        this.id = id;
    }


    public Long getStudentId() {

        return studentId;
    }


    public void setStudentId(Long studentId) {

        this.studentId = studentId;
    }


    public String getSkillName() {

        return skillName;
    }


    public void setSkillName(String skillName) {

        this.skillName = skillName;
    }


    public Integer getLevel() {

        return level;
    }


    public void setLevel(Integer level) {

        this.level = level;
    }
}