package com.coforge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookmarkId;

    // ✅ Owning side — MUST be named "recruiter"
    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    // ✅ Job being bookmarked
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

	public void setSkill(Skill skill) {
		// TODO Auto-generated method stub
		
	}

	public void setFreelancer(Freelancer freelancer) {
		// TODO Auto-generated method stub
		
	}
}