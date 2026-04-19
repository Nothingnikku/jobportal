package com.coforge.service;

import java.util.List;

import java.util.Optional;

import org.hibernate.type.descriptor.java.PrimitiveByteArrayJavaType;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.coforge.entity.JobApplication;
import com.coforge.entity.Recruiter;
import com.coforge.exceptions.InvalidCredentialsException;
import com.coforge.exceptions.RecruiterNotFoundException;
import com.coforge.exceptions.RecruiterNotVerifiedException;
import com.coforge.repository.BookmarkedFreelancerRepository;
import com.coforge.repository.JobApplicationRepository;
import com.coforge.repository.RecruiterRepository;

import jakarta.transaction.Transactional;

@Service

public class RecruiterServiceImpl implements IRecruiterService{
 
 
   @Autowired

    private RecruiterRepository recruiterRepository;
 @Autowired
 private BookmarkedFreelancerRepository bookmarkedFreelancerRepository;
 @Autowired JobApplicationRepository jobApplicationRepository;
    

    @Override
    public Recruiter save(Recruiter recruiter) {

        
        recruiter.setVerified(false);

        return recruiterRepository.save(recruiter);
    }
    @Override

    public Recruiter findById(Long id) {

        return recruiterRepository.findById(id).orElseThrow(()->new RecruiterNotFoundException("Recruiter not found with" +id));

    }
 
    @Override

    public Optional<Recruiter> findByEmail(String email) {

        return recruiterRepository.findByEmail(email);

    }
 
    @Override

    public List<Recruiter> findAll() {

        return recruiterRepository.findAll();

    }
    	@Transactional
    	@Override
	public void deleteById(long recruiterID) {
		// TODO Auto-generated method stub

        Recruiter recruiter = recruiterRepository.findById(recruiterID)
                .orElseThrow(() ->
                        new RecruiterNotFoundException("Recruiter not found"));

        
        bookmarkedFreelancerRepository
                .deleteByBookmarkedBy_RecruiterId(recruiterID);

        
        recruiterRepository.delete(recruiter);

        
	}
    	@Override
    	public Recruiter login(String email, String password) {

    	    Recruiter recruiter = recruiterRepository.findByEmail(email)
    	            .orElseThrow(() ->
    	                    new RecruiterNotFoundException("Invalid email"));

    	    
    	    if (!recruiter.isVerified()) {
    	        throw new RecruiterNotVerifiedException(
    	            "Recruiter is not verified by admin yet"
    	        );
    	    }

    	    
    	    if (!recruiter.getPassword().equals(password)) {
    	        throw new InvalidCredentialsException("Invalid password");
    	    }

    	    return recruiter;
    	}
		@Override
		public List<JobApplication> getApplicationsByJob(Long recruiterId, Long jobId) {


   

    return jobApplicationRepository
            .findByJobJobIdAndJobRecruiterRecruiterId(
                    jobId,
                    recruiterId
            );

		}


}
 
