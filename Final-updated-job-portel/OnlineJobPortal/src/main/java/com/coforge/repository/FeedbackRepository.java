package com.coforge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.coforge.entity.Feedback;
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long>{
    List<Feedback> findByFreelancer_FreelancerId(Long freelancerId);
}
