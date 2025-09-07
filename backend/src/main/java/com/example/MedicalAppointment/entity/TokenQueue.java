package com.example.MedicalAppointment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "token_queue")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private User patient;

    private Integer tokenNumber;

    private LocalDateTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private TokenStatus status;


}
