package com.coforge.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    private String title;

    @Column(length = 2000)
    private String description;

    private String location;

    private String employmentType; // FullTime / PartTime / Freelance

    private Double budget;

    private LocalDate postedDate;

    private boolean active;

    
    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    

@ManyToMany(fetch = FetchType.EAGER)
@JoinTable(
    name = "job_skills",
    joinColumns = @JoinColumn(name = "job_id"),
    inverseJoinColumns = @JoinColumn(
        name = "skill_id",
        referencedColumnName = "skill_id"
    )
)

        		
    private Set<Skill> skills = new HashSet<>();

   
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<JobApplication> applications = new HashSet<>();
}
