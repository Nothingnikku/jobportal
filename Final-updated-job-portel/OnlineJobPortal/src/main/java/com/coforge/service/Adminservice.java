package com.coforge.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coforge.entity.Freelancer;
import com.coforge.entity.Recruiter;
import com.coforge.repository.BookmarkedFreelancerRepository;
import com.coforge.repository.FreelancerRepository;
import com.coforge.repository.RecruiterRepository;

@Service
public class Adminservice {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private BookmarkedFreelancerRepository bookmarkedFreelancerRepository;

    //  Admin sees all recruiters
    public List<Recruiter> getAllRecruiters() {
        return recruiterRepository.findAll();
    }

    //  Admin sees all freelancers
    public List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }


    public Recruiter verifyRecruiter(Long recruiterId) {

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        recruiter.setVerified(true);

        return recruiterRepository.save(recruiter);
    }

    
    public List<Recruiter> getUnverifiedRecruiters() {
        return recruiterRepository.findByVerifiedFalse();
    }

    public List<Freelancer> getUnverifiedFreelancers() {
        return freelancerRepository.findByVerifiedFalse();
    }

    public Freelancer verifyFreelancer(Long freelancerId) {
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        freelancer.setVerified(true);
        return freelancerRepository.save(freelancer);
    }

    public void rejectRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        bookmarkedFreelancerRepository.deleteByBookmarkedBy_RecruiterId(recruiterId);
        recruiterRepository.delete(recruiter);
    }

    public void rejectFreelancer(Long freelancerId) {
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        freelancerRepository.delete(freelancer);
    }

}
