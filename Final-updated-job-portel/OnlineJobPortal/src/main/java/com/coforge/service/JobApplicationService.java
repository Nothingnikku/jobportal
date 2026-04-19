package com.coforge.service;

import java.util.List;

import com.coforge.dto.JobApplicationFeedBackDto;
import com.coforge.entity.Freelancer;
import com.coforge.entity.Job;
import com.coforge.entity.JobApplication;

public interface JobApplicationService {

    JobApplication applyToJob(Job job, String coverLetter, String resumeLink, Freelancer freelancer);

    JobApplication updateJobApplication(Job job, String coverLetter, String resumeLink, Freelancer freelancer);

    JobApplication updateStatus(Long applicationId, String status);

    void remove(Job job, Freelancer freelancer);

    JobApplication findById(Long id);

    java.util.List<JobApplication> findAll();

	List<JobApplicationFeedBackDto> findAllWithFeedBack();
}
