package com.coforge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coforge.dto.FeedbackRequestDto;
import com.coforge.entity.Feedback;
import com.coforge.service.FeedbackService;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/add")
    public Feedback addFeedback(@RequestBody FeedbackRequestDto request) {
        return feedbackService.addFeedback(
                request.getRecruiterId(),
                request.getFreelancerId(),
                request.getRating(),
                request.getComment()
        );
    }

    @GetMapping("/freelancer/{id}")
    public java.util.List<Feedback> getFeedbackForFreelancer(@PathVariable Long id) {
        return feedbackService.getFeedbackForFreelancer(id);
    }
}
