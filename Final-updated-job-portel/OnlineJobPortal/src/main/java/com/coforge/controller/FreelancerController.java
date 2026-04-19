package com.coforge.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coforge.entity.Freelancer;
import com.coforge.service.FreelancerService;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController
@RequestMapping("/api/freelancers")
public class FreelancerController {

    @Autowired
    private FreelancerService freelancerService;

    @PostMapping
    public Freelancer createFreelancer(@RequestBody Freelancer freelancer) {
        return freelancerService.createFreelancer(freelancer);
    }

    @GetMapping
    public List<Freelancer> getAllFreelancers() {
        return freelancerService.getAllFreelancers();
    }

    @GetMapping("/{id}")
    public Freelancer getFreelancerById(@PathVariable Long id) {
        return freelancerService.getFreelancerById(id);
    }

    @PutMapping("/{id}")
    public Freelancer updateFreelancer(
            @PathVariable Long id,
            @RequestBody Freelancer freelancer) {
        return freelancerService.updateFreelancer(id, freelancer);
    }

    @DeleteMapping("/{id}")
    public void deleteFreelancer(@PathVariable Long id) {
        freelancerService.deleteFreelancer(id);
    }
}
