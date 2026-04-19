package com.coforge.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coforge.dto.JobDto;
import com.coforge.entity.Freelancer;
import com.coforge.entity.Job;
import com.coforge.entity.Recruiter;
import com.coforge.entity.Skill;
import com.coforge.exceptions.JobNotFoundException;
import com.coforge.repository.FreelancerRepository;
import com.coforge.repository.JobsRepository;
import com.coforge.repository.RecruiterRepository;
import com.coforge.repository.SkillRepository;

@Service
public class JobServiceImpl implements JobserviceInterface {

    private final JobsRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final SkillRepository skillRepository;
    private final FreelancerRepository freelancerRepository;

    public JobServiceImpl(JobsRepository jobRepository,
                          RecruiterRepository recruiterRepository,
                          SkillRepository skillRepository,
                          FreelancerRepository freelancerRepository) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
        this.skillRepository = skillRepository;
        this.freelancerRepository = freelancerRepository;
    }

    // ✅ CREATE JOB USING DTO
    
    public Job createJob(JobDto jobDto) {

        Recruiter recruiter = recruiterRepository.findById(jobDto.getRecruiterId())
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found with id: " + jobDto.getRecruiterId()));

        Job job = new Job();
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setLocation(jobDto.getLocation());
        job.setEmploymentType(jobDto.getEmploymentType());
        job.setBudget(jobDto.getBudget());
        job.setActive(jobDto.isActive());
        job.setPostedDate(LocalDate.now());
        job.setRecruiter(recruiter);

        if (jobDto.getSkillIds() != null && !jobDto.getSkillIds().isEmpty()) {
            Set<Skill> skills = jobDto.getSkillIds().stream()
                    .map(id -> skillRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Skill not found: " + id)))
                    .collect(Collectors.toSet());
            job.setSkills(skills);
        }

        return jobRepository.save(job);
    }

    
    public Job updateJob(Long jobId, JobDto jobDto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));

        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setLocation(jobDto.getLocation());
        job.setEmploymentType(jobDto.getEmploymentType());
        job.setBudget(jobDto.getBudget());
        job.setActive(jobDto.isActive());

        if (jobDto.getSkillIds() != null) {
            Set<Skill> skills = jobDto.getSkillIds().stream()
                    .map(id -> skillRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Skill not found: " + id)))
                    .collect(Collectors.toSet());
            job.setSkills(skills);
        }

        return jobRepository.save(job);
    }

   
    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Job not found"));
    }

    
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    
    public List<Job> getActiveJobs() {
        return jobRepository.findByActive(true);
    }

    public void deleteJob(Long jobId) {
        jobRepository.deleteById(jobId);
    }

    // ✅ Freelancer Job Matching
    public List<Job> getJobsForFreelancer(Long freelancerId) {

        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        List<Long> skillIds = freelancer.getSkills()
                .stream()
                .map(Skill::getSkillId)
                .toList();

        if (skillIds.isEmpty()) return List.of();

        return jobRepository.findDistinctBySkills_SkillIdIn(skillIds);
    }

    // ✅ Recruiter APIs
    public Job createJobForRecruiter(Long recruiterId, Job job) {

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        job.setRecruiter(recruiter);
        job.setPostedDate(LocalDate.now());

        return jobRepository.save(job);
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterRecruiterId(recruiterId);
    }

    public Job updateRecruiterJob(Long recruiterId, Long jobId, Job updatedJob) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("You cannot update this job");
        }

        job.setTitle(updatedJob.getTitle());
        job.setDescription(updatedJob.getDescription());
        job.setLocation(updatedJob.getLocation());

        return jobRepository.save(job);
    }

    public void deleteRecruiterJob(Long recruiterId, Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("You cannot delete this job");
        }

        jobRepository.delete(job);
    }

	@Override
	public Job updateJob(Long jobId, Job job) {
		// TODO Auto-generated method stub
		return null;
	}
}
