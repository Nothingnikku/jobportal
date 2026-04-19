package com.coforge.dto;
import com.coforge.entity.Freelancer;
import com.coforge.entity.Job;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationFeedBackDto {  
    private Long applicationId;
    private String coverLetter;
    private String resumeLink;
    private Freelancer freelancer;
    private Job job;
    private String status;
    private int rating;
    private String comment;
}
 
