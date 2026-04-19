package com.coforge.service;

import java.util.List;

import com.coforge.dto.JobDto;
import com.coforge.entity.Job;

public interface JobserviceInterface {

    Job createJob(JobDto jobDto);

    Job updateJob(Long jobId, Job job);

    Job getJobById(Long jobId);

    List<Job> getAllJobs();

    List<Job> getActiveJobs();

    void deleteJob(Long jobId);
}