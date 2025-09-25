package com.example.MedicalAppointment.service;

import com.example.MedicalAppointment.entity.Doctor;
import com.example.MedicalAppointment.entity.Role;
import com.example.MedicalAppointment.entity.User;
import com.example.MedicalAppointment.repository.DoctorRepo;
import com.example.MedicalAppointment.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepo doctorRepository;

    @Autowired
    private UserRepo userRepository;


    public Doctor createDoctor(Doctor doctor) {
        User user = doctor.getUser();
        user.setRole(Role.DOCTOR); // Force DOCTOR role
        userRepository.save(user);

        // Save doctor details
        doctor.setUser(user);
        return doctorRepository.save(doctor);
    }


    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }


    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Optional<Doctor> getDoctorByUserId(Long userId) {
        return doctorRepository.findByUser_UserId(userId);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
