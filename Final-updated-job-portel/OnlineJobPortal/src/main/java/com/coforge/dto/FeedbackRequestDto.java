package com.coforge.dto;

import lombok.Data;

@Data
public class FeedbackRequestDto {
	
	private Long recruiterId;
	private Long freelancerId;
	private Integer rating;
	private String comment;
	
}
