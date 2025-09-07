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
public class PatientService {

    @Autowired
    private PatientRepo patientRepository;

    @Autowired
    private UserRepo userRepository;


    public Patient createPatient(Patient patient) {
        User user = patient.getUser();
        user.setRole(Role.PATIENT); // Force PATIENT role
        userRepository.save(user);

        patient.setUser(user);
        return patientRepository.save(patient);
    }


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }


    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }


    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByUser_Email(email);
    }


    public Optional<Patient> updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id).map(existingPatient -> {
            // Update fields
            existingPatient.setAge(updatedPatient.getAge());
            existingPatient.setGender(updatedPatient.getGender());
            existingPatient.setPhone(updatedPatient.getPhone());
            existingPatient.setAddress(updatedPatient.getAddress());

            // Update user details also
            User existingUser = existingPatient.getUser();
            User updatedUser = updatedPatient.getUser();

            if (updatedUser != null) {
                existingUser.setName(updatedUser.getName());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setPassword(updatedUser.getPassword());
            }

            userRepository.save(existingUser);
            return patientRepository.save(existingPatient);
        });
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
