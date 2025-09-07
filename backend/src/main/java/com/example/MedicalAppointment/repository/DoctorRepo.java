package com.example.MedicalAppointment.repository;


import com.example.MedicalAppointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepo extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findById(Long id);

}
