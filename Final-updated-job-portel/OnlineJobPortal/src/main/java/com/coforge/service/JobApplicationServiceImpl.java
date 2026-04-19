package com.coforge.service;

import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coforge.dto.JobApplicationFeedBackDto;
import com.coforge.entity.Feedback;
import com.coforge.entity.Freelancer;
import com.coforge.entity.Job;
import com.coforge.entity.JobApplication;
import com.coforge.exceptions.JobApplicationNotFoundException;
import com.coforge.repository.JobApplicationRepository;
import com.coforge.service.JobApplicationServiceImpl;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private FeedbackService feedbackService;
    
    @Override
    public JobApplication applyToJob(Job job, String coverLetter, String resumeLink, Freelancer freelancer) {
        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setFreelancer(freelancer);
        app.setCoverLetter(coverLetter);
        app.setResumeLink(resumeLink);
        app.setStatus("APPLIED");
        return jobApplicationRepository.save(app);
    }

    @Override
    public JobApplication updateJobApplication(Job job, String coverLetter, String resumeLink, Freelancer freelancer) {
        JobApplication app = jobApplicationRepository
                .findByJobAndFreelancer(job, freelancer);
               //.orElseThrow(() -> new RuntimeException("Application not found"));

        app.setCoverLetter(coverLetter);
        app.setResumeLink(resumeLink);
        return jobApplicationRepository.save(app);
    }

    @Override
    public void remove(Job job, Freelancer freelancer) {
        JobApplication app = jobApplicationRepository
                .findByJobAndFreelancer(job, freelancer);//orElseThrow(() -> new RuntimeException("Application not found"));

        jobApplicationRepository.delete(app);
    }

    @Override
    public JobApplication findById(Long id) {
        return jobApplicationRepository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException("Application not found"));
    }

    @Override
    public java.util.List<JobApplication> findAll() {
        return jobApplicationRepository.findAll();
    }

    @Override
    public java.util.List<JobApplicationFeedBackDto> findAllWithFeedBack() {
    	java.util.List<JobApplicationFeedBackDto> applications = jobApplicationRepository.findAll().stream().map((j)->convertApplicationToDto(j) ).collect(Collectors.toList());
    	
    	return applications;
    }
    
    private JobApplicationFeedBackDto convertApplicationToDto(JobApplication j) {
    	java.util.List<Feedback> feedback = feedbackService.getFeedbackForFreelancer(j.getFreelancer().getFreelancerId());
    	Feedback f = new Feedback();
    	if(feedback.size()>0) {
    		f = feedback.get(0);
    	}
    	System.out.println(f+"-"+feedback);
    	return new JobApplicationFeedBackDto(j.getApplicationId(),j.getCoverLetter(),j.getResumeLink(),j.getFreelancer(),j.getJob(),j.getStatus(),f.getRating(),f.getComment());
    }

    @Override
    public JobApplication updateStatus(Long applicationId, String status) {
        JobApplication app = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new JobApplicationNotFoundException("Application not found"));
        app.setStatus(status);
        return jobApplicationRepository.save(app);
    }
}
