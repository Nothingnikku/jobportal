package com.coforge.controller;

import java.util.List;

 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.coforge.entity.JobApplication;
import com.coforge.entity.Recruiter;

import com.coforge.service.IRecruiterService;
 
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController

@RequestMapping("/api/recruiters")

public class RecruiterController {
 
    @Autowired

    private IRecruiterService recruiterService;
 
    

    @PostMapping("/register")

    public ResponseEntity<Recruiter> register(@RequestBody Recruiter recruiter) {

        Recruiter saved = recruiterService.save(recruiter);

        return ResponseEntity.ok(saved);

    }
 
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Recruiter recruiter) {

        Recruiter loggedIn =
                recruiterService.login(
                    recruiter.getEmail(),
                    recruiter.getPassword()
                );

        return ResponseEntity.ok(loggedIn);
    }
   
  

    @GetMapping("/{id}")

    public ResponseEntity<Recruiter> getRecruiterById(@RequestParam Long id) {
    	return new ResponseEntity<>(recruiterService.findById(id),HttpStatus.OK);

 
        

    }
 
    

    @GetMapping

    public List<Recruiter> getAllRecruiters() {

        return recruiterService.findAll();

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecruiter(@PathVariable Long id) {
        recruiterService.deleteById(id);
        return ResponseEntity.ok("Recruiter deleted successfully");
    }
    @GetMapping("/{recruiterId}/job/{jobId}/applications")
    public ResponseEntity<List<JobApplication>> getApplicationsForJob(
            @PathVariable Long recruiterId,
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                recruiterService.getApplicationsByJob(recruiterId, jobId)
        );
    }

}
 
