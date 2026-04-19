package com.coforge.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "freelancers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long freelancerId;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$",
        message = "Invalid email format"
    )
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Profile title cannot be blank")
    private String profileTitle;

    @NotBlank(message = "Experience cannot be blank")
    private String experience;

    @NotNull(message = "Hourly rate is required")
    @Positive(message = "Hourly rate must be greater than 0")
    private Double hourlyRate;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    private boolean available;

    @Column(nullable = false)
    private boolean verified = false;

    //Freelancer skills
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "freelancer_skills",
        joinColumns = @JoinColumn(name = "freelancer_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

    //Jobs applied by freelancer
    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<JobApplication> applications = new HashSet<>();

    //Feedback received
    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Feedback> feedbacks = new HashSet<>();
}
