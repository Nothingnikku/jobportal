package com.coforge.service;

import java.util.List;

import java.util.Optional;

import com.coforge.entity.JobApplication;
import com.coforge.entity.Recruiter;
 
public interface IRecruiterService {
 
	

	    Recruiter save(Recruiter recruiter);
 
	    Recruiter findById(Long id);
 
	    Optional<Recruiter> findByEmail(String email);
 
	    List<Recruiter> findAll();
	    public void deleteById(long recruiterID);
	    Recruiter login(String email, String password);
	    List<JobApplication> getApplicationsByJob(
	            Long recruiterId,
	            Long jobId
	    );
	    
	    
	}
 