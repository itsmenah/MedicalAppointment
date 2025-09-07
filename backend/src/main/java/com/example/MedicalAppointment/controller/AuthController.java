package com.example.MedicalAppointment.controller;

import com.example.MedicalAppointment.entity.Role;
import com.example.MedicalAppointment.entity.*;
import com.example.MedicalAppointment.repository.PatientRepo;
import com.example.MedicalAppointment.repository.UserRepo;
import com.example.MedicalAppointment.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class AuthController {

    @Autowired
    private UserRepo userRepository;
    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private DoctorService doctorService;
    @Autowired
    private  PatientService patientService;

    // Home/Login
    @GetMapping("/")
    public String homePage() {
        return "home";  // login page
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        Model model) {
        User user = userRepository.findByEmailAndPassword(email, password);

        if (user == null) {
            model.addAttribute("error", "Invalid username or password");
            return "home";
        }

        if (user.getRole() == Role.PATIENT) {
            List<Appointment> appointments = appointmentService.getAppointmentsByPatient(user.getUserId());
            LocalDateTime now = LocalDateTime.now();

            // Split into current (today & upcoming) vs past
            List<Appointment> currentAppointments = appointments.stream()
                    .filter(appt -> appt.getAppointmentDate().isAfter(now) ||
                            appt.getAppointmentDate().toLocalDate().isEqual(now.toLocalDate()))
                    .collect(Collectors.toList());

            List<Appointment> pastAppointments = appointments.stream()
                    .filter(appt -> appt.getAppointmentDate().isBefore(now.toLocalDate().atStartOfDay()))
                    .collect(Collectors.toList());

            // Add to model for Thymeleaf
            model.addAttribute("currentAppointments", currentAppointments);
            model.addAttribute("pastAppointments", pastAppointments);
            model.addAttribute("user", user);
            model.addAttribute("doctors", doctorService.getAllDoctors());
            return "patient-dashboard"; // loads patient-dashboard.html
        }

        // If role = DOCTOR
        if (user.getRole() == Role.DOCTOR) {
            List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(user.getUserId());
            model.addAttribute("appointments", appointments);
            model.addAttribute("user", user);
            return "doctor-dashboard"; // loads doctor-dashboard.html
        }

        model.addAttribute("error", "Unknown role");
        return "home";
    }

    // Registration form
    @GetMapping("/register")
    public String showRegisterForm() {
        return "register";
    }

    // Handle registration
    @PostMapping("/register")
    public String register(@RequestParam String email,
                           @RequestParam String password,
                           @RequestParam String role,
                           Model model) {

        if (userRepository.findByEmailAndPassword(email, password) != null) {
            model.addAttribute("error", "User already exists!");
            return "register";
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(Role.PATIENT);

        userRepository.save(user);

        model.addAttribute("success", "Account created! Please login.");
        return "home";  // redirect to login
    }

    @PostMapping("/patient/book")
    public String bookAppointment(@RequestParam Long doctorId,
                                  @RequestParam String date,
                                  @RequestParam String time,
                                  @RequestParam Long patientId,
                                  Model model) {
        LocalDateTime appointmentDateTime = LocalDateTime.parse(date + "T" + time);

        Appointment appointment = appointmentService.bookAppointment(patientId, doctorId, appointmentDateTime);

        // Success message
        model.addAttribute("successMessage",
                "Your appointment is successfully booked for " + appointment.getAppointmentDate() +
                        " and your token is " + appointment.getTokenNumber());

        // Reload patient dashboard data
        User user = userRepository.findById(patientId).orElse(null);
        if (user != null) {
            List<Appointment> appointments = appointmentService.getAppointmentsByPatient(user.getUserId());
            LocalDateTime now = LocalDateTime.now();

            List<Appointment> currentAppointments = appointments.stream()
                    .filter(appt -> appt.getAppointmentDate().isAfter(now) ||
                            appt.getAppointmentDate().toLocalDate().isEqual(now.toLocalDate()))
                    .collect(Collectors.toList());

            List<Appointment> pastAppointments = appointments.stream()
                    .filter(appt -> appt.getAppointmentDate().isBefore(now.toLocalDate().atStartOfDay()))
                    .collect(Collectors.toList());

            model.addAttribute("currentAppointments", currentAppointments);
            model.addAttribute("pastAppointments", pastAppointments);
            model.addAttribute("user", user);
            model.addAttribute("doctors", doctorService.getAllDoctors());
        }

        return "patient-dashboard";
    }


}
