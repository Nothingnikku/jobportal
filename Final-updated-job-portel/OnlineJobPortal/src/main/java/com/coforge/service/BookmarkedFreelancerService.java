package com.coforge.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coforge.entity.*;
import com.coforge.exceptions.FreelancerNotFoundException;
import com.coforge.exceptions.RecruiterNotFoundException;
import com.coforge.exceptions.SkillNotFoundException;
import com.coforge.repository.*;

@Service
public class BookmarkedFreelancerService {

    @Autowired
    private BookmarkedFreelancerRepository repository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private SkillRepository skillRepository;

    public BookmarkedFreelancer bookmarkFreelancer(
            Long recruiterId,
            Long freelancerId,
            Long skillId) {

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RecruiterNotFoundException("Recruiter not found"));

        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer not found"));

        Skill skill = null;
        if (skillId != null) {
            skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new SkillNotFoundException("Skill not found"));
        }

        BookmarkedFreelancer bookmark = BookmarkedFreelancer.builder()
                .bookmarkedBy(recruiter)
                .freelancer(freelancer)
                .skill(skill)
                .build();

        return repository.save(bookmark);
    }

    public List<BookmarkedFreelancer> getBookmarksByRecruiter(Long recruiterId) {
        return repository.findByBookmarkedBy_RecruiterId(recruiterId);
    }
}