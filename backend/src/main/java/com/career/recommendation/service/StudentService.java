package com.career.recommendation.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.career.recommendation.model.Student;
import com.career.recommendation.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;


    // ==========================================
    // GET ALL STUDENTS
    // ==========================================

    public List<Student> getAll() {

        return studentRepository.findAll();
    }


    // ==========================================
    // GET PROFILE BY USER ID
    // ==========================================

    public Optional<Student> getByUserId(Long userId) {

        return studentRepository.findByUserId(userId);
    }


    // ==========================================
    // GET PROFILE BY STUDENT ID
    // ==========================================

    public Optional<Student> getById(Long id) {

        return studentRepository.findById(id);
    }


    // ==========================================
    // CREATE / UPDATE PROFILE
    // ==========================================

    public Student save(Student student) {

        return studentRepository.save(student);
    }


    // ==========================================
    // DELETE PROFILE
    // ==========================================

    public void delete(Long id) {

        studentRepository.deleteById(id);
    }


    // =====================================================
    // UPDATE ACADEMIC DETAILS - NEW
    // =====================================================

    public Optional<Student> updateAcademicDetails(
            Long id,
            Double tenthMarks,
            Double twelfthMarks,
            Double graduationMarks,
            Integer semester,
            Integer backlogs) {

        Optional<Student> optionalStudent =
                studentRepository.findById(id);

        if (optionalStudent.isEmpty()) {

            return Optional.empty();
        }

        Student student = optionalStudent.get();

        student.setTenthMarks(tenthMarks);
        student.setTwelfthMarks(twelfthMarks);
        student.setGraduationMarks(graduationMarks);
        student.setSemester(semester);
        student.setBacklogs(backlogs);

        Student updated =
                studentRepository.save(student);

        return Optional.of(updated);
    }
}