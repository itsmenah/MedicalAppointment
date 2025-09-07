package com.example.MedicalAppointment.repository;

import com.example.MedicalAppointment.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepo extends JpaRepository<Patient, Long> {

    // find patient by linked userId
    Optional<Patient> findByUser_UserId(Long userId);

    // find patient by linked user email
    Optional<Patient> findByUser_Email(String email);

}
