package com.coforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coforge.entity.Freelancer;
@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {

    List<Freelancer> findByAvailable(boolean available);

    Freelancer findByEmail(String email);

    List<Freelancer> findByVerifiedFalse();
}
