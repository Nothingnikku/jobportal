package com.coforge.dto;

import com.coforge.entity.Role;
import lombok.Data;

@Data
public class SignupReqDto {

    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;

    // ✅ Recruiter-specific
    private String company;

    // ✅ Freelancer-specific
    private String profileTitle;
    private String experience;
    private Double hourlyRate;
    private String location;

    // ✅ Skills for freelancer signup
    private java.util.Set<Long> skillIds;
}
