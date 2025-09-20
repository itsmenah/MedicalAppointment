package com.example.MedicalAppointment.config;

import com.example.MedicalAppointment.entity.Role;
import com.example.MedicalAppointment.entity.User;
import com.example.MedicalAppointment.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.findByEmail("admin@medcare.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@medcare.com");
            admin.setPassword("admin123");
            admin.setRole(Role.ADMIN);
            userRepo.save(admin);
            System.out.println("Admin user created: admin@medcare.com / admin123");
        }
    }
}