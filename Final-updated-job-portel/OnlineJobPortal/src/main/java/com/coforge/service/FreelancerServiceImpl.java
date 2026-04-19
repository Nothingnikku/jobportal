package com.coforge.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coforge.entity.Freelancer;
import com.coforge.entity.Skill;
import com.coforge.exceptions.FreelancerNotFoundException;
import com.coforge.repository.FreelancerRepository;
import com.coforge.repository.SkillRepository;
import com.coforge.service.FreelancerService;

@Service
public class FreelancerServiceImpl implements FreelancerService {

    @Autowired
    private FreelancerRepository freelancerRepository;
    
    @Autowired
    SkillRepository skillRepository;

    @Override
    public Freelancer createFreelancer(Freelancer freelancer) {

        //  Fetch full Skill entities
        if (freelancer.getSkills() != null && !freelancer.getSkills().isEmpty()) {

            Set<Skill> fullSkills = freelancer.getSkills().stream()
                    .map(s -> skillRepository.findById(s.getSkillId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Skill not found with id: " + s.getSkillId()
                                    )))
                    .collect(Collectors.toSet());

            freelancer.setSkills(fullSkills);
        }

        return freelancerRepository.save(freelancer);
    }
   
    @Override
    public Freelancer updateFreelancer(Long id, Freelancer freelancer) {
        Freelancer existing = freelancerRepository.findById(id)
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer not found"));

        existing.setName(freelancer.getName());
        existing.setProfileTitle(freelancer.getProfileTitle());
        existing.setExperience(freelancer.getExperience());
        existing.setHourlyRate(freelancer.getHourlyRate());
        existing.setLocation(freelancer.getLocation());
        existing.setAvailable(freelancer.isAvailable());
        existing.setSkills(freelancer.getSkills());

        return freelancerRepository.save(existing);
    }

    @Override
    public Freelancer getFreelancerById(Long id) {
        return freelancerRepository.findById(id)
                .orElseThrow(() -> new FreelancerNotFoundException("Freelancer not found"));
    }

    @Override
    public List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }

    @Override
    public void deleteFreelancer(Long id) {
        freelancerRepository.deleteById(id);
    }

	@Override
	public Freelancer findById(Long freelancerId) {
		// TODO Auto-generated method stub
		return null;
	}
}
