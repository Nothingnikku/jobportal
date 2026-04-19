package com.coforge.repository;
 
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coforge.entity.Freelancer;
import com.coforge.entity.JobApplication;
import com.coforge.entity.Job;
 @Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>{
      
	JobApplication findByJobAndFreelancer(Job jobs, Freelancer freelancer);

	List<JobApplication> findByJobJobIdAndJobRecruiterRecruiterId(Long jobId, Long recruiterId);
	
	}
 
 