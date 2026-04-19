package com.coforge.dto;

import java.time.LocalDate;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobDto {

    private Long jobId;
    private String title;
    private String description;
    private String location;
    private String employmentType;
    private Double budget;
    private LocalDate postedDate;
    private boolean active;
    private Long recruiterId;
    private Set<Long> skillIds;
}