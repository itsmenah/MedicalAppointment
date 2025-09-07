package com.example.MedicalAppointment.config;

import com.example.MedicalAppointment.entity.*;
import com.example.MedicalAppointment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private DoctorRepo doctorRepo;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepo.count() > 0) {
            return;
        }

        // Create sample users
        User doctor1 = new User();
        doctor1.setName("Dr. Sarah Johnson");
        doctor1.setEmail("doctor@medcare.com");
        doctor1.setPassword("password123");
        doctor1.setRole(Role.DOCTOR);
        doctor1 = userRepo.save(doctor1);

        User doctor2 = new User();
        doctor2.setName("Dr. Michael Chen");
        doctor2.setEmail("doctor2@medcare.com");
        doctor2.setPassword("password123");
        doctor2.setRole(Role.DOCTOR);
        doctor2 = userRepo.save(doctor2);

        User patient1 = new User();
        patient1.setName("John Smith");
        patient1.setEmail("patient@medcare.com");
        patient1.setPassword("password123");
        patient1.setRole(Role.PATIENT);
        userRepo.save(patient1);

        // Create doctor profiles
        Doctor doctorProfile1 = new Doctor();
        doctorProfile1.setDoctorId(doctor1.getUserId());
        doctorProfile1.setUser(doctor1);
        doctorProfile1.setSpecialization("Cardiology");
        doctorProfile1.setAvailableFrom(LocalTime.of(9, 0));
        doctorProfile1.setAvailableTo(LocalTime.of(17, 0));
        doctorRepo.save(doctorProfile1);

        Doctor doctorProfile2 = new Doctor();
        doctorProfile2.setDoctorId(doctor2.getUserId());
        doctorProfile2.setUser(doctor2);
        doctorProfile2.setSpecialization("Dermatology");
        doctorProfile2.setAvailableFrom(LocalTime.of(10, 0));
        doctorProfile2.setAvailableTo(LocalTime.of(18, 0));
        doctorRepo.save(doctorProfile2);

        System.out.println("Sample data initialized successfully!");
    }
}