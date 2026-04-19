package com.coforge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coforge.entity.Feedback;
import com.coforge.entity.Freelancer;
import com.coforge.entity.Recruiter;
import com.coforge.exceptions.FreelancerNotFoundException;
import com.coforge.exceptions.RecruiterNotFoundException;
import com.coforge.repository.FeedbackRepository;
import com.coforge.repository.FreelancerRepository;
import com.coforge.repository.RecruiterRepository;

@Service
public class FeedbackService implements FeedbackServiceInterface {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Override
    public Feedback addFeedback(Long recruiterId,
                                Long freelancerId,
                                Integer rating,
                                String comment) {

        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RecruiterNotFoundException(
                        "Recruiter not found with id: " + recruiterId));

        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new FreelancerNotFoundException(
                        "Freelancer not found with id: " + freelancerId));

        Feedback feedback = new Feedback();
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setCreatedBy(recruiter);
        feedback.setFreelancer(freelancer);

        return feedbackRepository.save(feedback);
    }

    @Override
    public java.util.List<Feedback> getFeedbackForFreelancer(Long freelancerId) {
        return feedbackRepository.findByFreelancer_FreelancerId(freelancerId);
    }
}
