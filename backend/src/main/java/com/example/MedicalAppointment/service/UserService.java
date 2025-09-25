package com.example.MedicalAppointment.service;

import com.example.MedicalAppointment.entity.Patient;
import com.example.MedicalAppointment.entity.Role;
import com.example.MedicalAppointment.entity.User;
import com.example.MedicalAppointment.repository.PatientRepo;
import com.example.MedicalAppointment.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PatientRepo patientRepository;

    @Autowired
    private com.example.MedicalAppointment.repository.DoctorRepo doctorRepository;

    @Autowired
    private com.example.MedicalAppointment.repository.AppointmentRepo appointmentRepository;


    public User registerUser(User user) {
        // (Optional) Encrypt password before saving
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        
        // Auto-create patient record if role is PATIENT
        if (savedUser.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patientRepository.save(patient);
        }
        
        return savedUser;
    }


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public List<User> getAllDoctors() {
        return userRepository.findByRole("DOCTOR");
    }


    public List<User> getAllPatients() {
        return userRepository.findByRole("PATIENT");
    }


    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        // Update password only if provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(user);
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }


    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
