package com.coforge.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationDto {
 
    
    private Long jobId;
 
    
    private Long freelancerId;
 
    private String coverLetter;

    private String resumeLink;
}
 
