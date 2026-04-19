package com.coforge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    private int rating;

    @Column(length = 2000)
    private String comment;

    // ✅ Feedback given for a freelancer
    @ManyToOne
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    // ✅ Feedback created by ONE recruiter
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private Recruiter createdBy;
}