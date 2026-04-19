package com.coforge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import com.coforge.dto.JobApplicationDto;
import com.coforge.dto.JobApplicationFeedBackDto;
import com.coforge.entity.Freelancer;
import com.coforge.entity.Job;
import com.coforge.entity.JobApplication;
import com.coforge.service.FreelancerService;
import com.coforge.service.JobApplicationService;
//import com.coforge.service.JobService;
import com.coforge.service.JobServiceImpl;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController
@RequestMapping("/jobapplication")
public class JobApplicationController {

    private static final String UPLOAD_DIR = "uploads/resumes";

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private JobServiceImpl jobService;   

    @Autowired
    private FreelancerService freelancerService;

    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public JobApplication applyToJob(
            @RequestParam Long jobId,
            @RequestParam Long freelancerId,
            @RequestParam String coverLetter,
            @RequestPart(value = "resume", required = false) MultipartFile resume
    ) {

        Job job = jobService.getJobById(jobId);
        Freelancer freelancer = freelancerService.getFreelancerById(freelancerId);

        String resumeLink = null;
        if (resume != null && !resume.isEmpty()) {
            resumeLink = saveResume(resume);
        }
        return jobApplicationService.applyToJob(
                job,
                coverLetter,
                resumeLink,
                freelancer
        );
    }

    @PutMapping("/update")
    public JobApplication updateJobApplication(@RequestBody JobApplicationDto dto) {

        Job job = jobService.getJobById(dto.getJobId());
        Freelancer freelancer = freelancerService.getFreelancerById(dto.getFreelancerId());

        return jobApplicationService.updateJobApplication(
                job,
                dto.getCoverLetter(),
                dto.getResumeLink(),
                freelancer
        );
    }

    @DeleteMapping("/remove")
    public String remove(@RequestBody JobApplicationDto dto) {

        Job job = jobService.getJobById(dto.getJobId());
        Freelancer freelancer = freelancerService.getFreelancerById(dto.getFreelancerId());

        jobApplicationService.remove(job, freelancer);
        return "Job Application removed successfully";
    }

    @GetMapping("/{id}")
    public JobApplication findById(@PathVariable Long id) {
        return jobApplicationService.findById(id);
    }

    @GetMapping
//    public java.util.List<JobApplication> findAll() {
    public java.util.List<JobApplicationFeedBackDto> findAll() {
    	System.out.println("calling");
//        return jobApplicationService.findAll();
    	System.out.println(jobApplicationService.findAllWithFeedBack());
        return jobApplicationService.findAllWithFeedBack();
    }

    @PutMapping("/{id}/status")
    public JobApplication updateStatus(@PathVariable Long id, @RequestParam String status) {
        return jobApplicationService.updateStatus(id, status);
    }

    private String saveResume(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String original = file.getOriginalFilename() == null ? "resume" : file.getOriginalFilename();
            String safeName = UUID.randomUUID() + "_" + original.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path target = uploadPath.resolve(safeName);
            Files.copy(file.getInputStream(), target);
            return "/uploads/resumes/" + safeName;
        } catch (Exception e) {
            throw new RuntimeException("Resume upload failed");
        }
    }
}
