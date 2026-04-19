package com.coforge.service;

import java.util.List;

import com.coforge.dto.FreelancerDto;
import com.coforge.entity.Freelancer;

public interface FreelancerService {

    Freelancer createFreelancer(Freelancer freelancer);

    Freelancer updateFreelancer(Long id, Freelancer freelancer);

    Freelancer getFreelancerById(Long id);

    List<Freelancer> getAllFreelancers();

    void deleteFreelancer(Long id);

	Freelancer findById(Long freelancerId);
}