package com.coforge.dto;

import lombok.Data;

@Data
public class BookmarkFreelancerRequest {

    private Long recruiterId;
    private Long freelancerId;
    private Long skillId; // optional
}