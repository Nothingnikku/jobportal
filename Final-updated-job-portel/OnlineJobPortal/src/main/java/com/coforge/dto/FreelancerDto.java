package com.coforge.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerDto {

    private Long freelancerId;
    private String name;
    private String email;
    private String profileTitle;
    private String experience;
    private Double hourlyRate;
    private String location;
    private boolean available;
    private Set<Long> skillIds;
}