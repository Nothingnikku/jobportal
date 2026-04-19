package com.coforge.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.coforge.dto.JobDto;
import com.coforge.entity.Job;
import com.coforge.service.JobServiceImpl;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController
@RequestMapping("/api/jobs")
public class JobsController {

    private final JobServiceImpl jobService;

    public JobsController(JobServiceImpl jobService) {
        this.jobService = jobService;
    }

    // ✅ CREATE JOB USING DTO
    @PostMapping
    public Job createJob(@RequestBody JobDto jobDto) {
        return jobService.createJob(jobDto);
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/active")
    public List<Job> getActiveJobs() {
        return jobService.getActiveJobs();
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody JobDto jobDto) {
        return jobService.updateJob(id, jobDto);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
    }

    // ✅ Freelancer matched jobs
    @GetMapping("/freelancer/{freelancerId}")
    public List<Job> getJobsForFreelancer(@PathVariable Long freelancerId) {
        return jobService.getJobsForFreelancer(freelancerId);
    }

    // ✅ Recruiter APIs
    @PostMapping("/recruiter/{recruiterId}")
    public Job postJobByRecruiter(@PathVariable Long recruiterId, @RequestBody Job job) {
        return jobService.createJobForRecruiter(recruiterId, job);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public List<Job> getJobsByRecruiter(@PathVariable Long recruiterId) {
        return jobService.getJobsByRecruiter(recruiterId);
    }
}
