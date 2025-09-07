package com.example.MedicalAppointment.repository;


import com.example.MedicalAppointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    // Find user by email or username
    Optional<User> findByEmail(String email);

    // Optional: find all doctors
    List<User> findByRole(String role);

    User findByEmailAndPassword(String email, String password);
}
