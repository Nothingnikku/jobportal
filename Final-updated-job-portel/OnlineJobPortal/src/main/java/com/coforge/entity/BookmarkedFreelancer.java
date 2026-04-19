package com.coforge.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "bookmarked_freelancers")
@Entity
public class BookmarkedFreelancer {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;
 
    @ManyToOne
    @JoinColumn(name = "freelancer_id")
    private Freelancer freelancer;
 
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private Recruiter bookmarkedBy;
}
