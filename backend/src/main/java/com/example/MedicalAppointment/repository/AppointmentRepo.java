package com.example.MedicalAppointment.repository;

import com.example.MedicalAppointment.entity.Appointment;
import com.example.MedicalAppointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Long> {

    // Get all appointments by a specific patient
    List<Appointment> findByPatient(User patient);

    // Get all appointments for a specific doctor
    List<Appointment> findByDoctor(User doctor);

    // Optional: Get appointments for a patient on a specific day
    List<Appointment> findByPatientAndAppointmentDate(User patient, LocalDate appointmentDate);

    @Query("SELECT MAX(a.tokenNumber) FROM Appointment a " +
            "WHERE a.doctor.userId = :doctorId " +
            "AND DATE(a.appointmentDate) = :date")
    Integer findMaxTokenByDoctorAndDate(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date
    );

}
