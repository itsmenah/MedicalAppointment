package com.example.MedicalAppointment.controller;

import com.example.MedicalAppointment.entity.User;
import com.example.MedicalAppointment.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    @Autowired
    private UserRepo userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmailAndPassword(email, password);
        
        if (user == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.badRequest().body(error);
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed");
            return ResponseEntity.badRequest().body(error);
        }
    }
}