package com.coforge.dao;

import java.util.List;

import java.util.Optional;
 
import com.coforge.entity.Recruiter;
 
public interface RecruiterDao {
 
	 Recruiter save(Recruiter recruiter);
 
	    Optional<Recruiter> findById(Long id);
 
	    Optional<Recruiter> findByEmail(String email);
 
	    List<Recruiter> findAll();
 
 
}
 