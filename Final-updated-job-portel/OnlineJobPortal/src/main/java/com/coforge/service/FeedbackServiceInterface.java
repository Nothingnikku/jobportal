package com.coforge.service;

import com.coforge.entity.Feedback;

public interface FeedbackServiceInterface { 
	Feedback addFeedback(Long recruiterId, Long freelancerId, Integer rating, String comment);
    java.util.List<Feedback> getFeedbackForFreelancer(Long freelancerId);
}
