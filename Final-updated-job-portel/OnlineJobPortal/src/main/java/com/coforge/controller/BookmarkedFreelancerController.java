package com.coforge.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coforge.dto.BookmarkFreelancerRequest;
import com.coforge.entity.BookmarkedFreelancer;
import com.coforge.service.BookmarkedFreelancerService;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:4200"})
@RestController
@RequestMapping("/api/bookmark")
public class BookmarkedFreelancerController {

    @Autowired
    private BookmarkedFreelancerService service;

    // ✅ Recruiter bookmarks freelancer
    @PostMapping("/freelancer")
    public BookmarkedFreelancer bookmarkFreelancer(
            @RequestBody BookmarkFreelancerRequest request) {

        return service.bookmarkFreelancer(
                request.getRecruiterId(),
                request.getFreelancerId(),
                request.getSkillId()
        );
    }

    // ✅ Get all bookmarked freelancers by recruiter
    @GetMapping("/freelancer/recruiter/{id}")
    public List<BookmarkedFreelancer> getBookmarks(@PathVariable Long id) {
        return service.getBookmarksByRecruiter(id);
    }
}
