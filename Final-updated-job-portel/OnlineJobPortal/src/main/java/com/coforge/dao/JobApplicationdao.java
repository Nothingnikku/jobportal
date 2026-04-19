package com.coforge.dao;
 
import org.springframework.beans.factory.annotation.Autowired;
 
import com.coforge.entity.JobApplication;
import com.coforge.repository.JobApplicationRepository;
 
public class JobApplicationdao implements JobApplicationinterfacedao {
 
	
	@Autowired
	JobApplicationRepository jobApplicationRepository;
 
	
	public JobApplication save(JobApplication application) {
		return jobApplicationRepository.save(application);
	}
 
	public void remove(JobApplication application) {
		 jobApplicationRepository.delete(application);
		
	}
 
 
	public JobApplication update(JobApplication application) {
		
		return jobApplicationRepository.save(application);
	}
    
	
	
}
 
 