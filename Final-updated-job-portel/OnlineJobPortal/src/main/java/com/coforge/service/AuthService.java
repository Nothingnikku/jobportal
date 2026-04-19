package com.coforge.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coforge.dto.LoginReqDto;
import com.coforge.dto.SignupReqDto;
import com.coforge.entity.*;
import com.coforge.exceptions.InvalidCredentialsException;
import com.coforge.exceptions.FreelancerNotVerifiedException;
import com.coforge.exceptions.RecruiterNotVerifiedException;
import com.coforge.exceptions.UserAlreadyExistsException;
import com.coforge.repository.*;

@Service
public class AuthService implements AuthServiceInterface {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private VerificationService verificationService;

    // Fixed admin credentials (simple validation)
    private static final String ADMIN_EMAIL = "admin@skillbridge.com";
    private static final String ADMIN_PASSWORD = "admin123";

   
    @Override
    @Transactional
    public String signup(SignupReqDto req) {
        if (req.getRole() == Role.ADMIN) {
            throw new InvalidCredentialsException("Admin signup is not allowed");
        }

        if (!verificationService.isVerified(req.getEmail())) {
            throw new InvalidCredentialsException("Email verification required");
        }

        if (ADMIN_EMAIL.equalsIgnoreCase(req.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with email:" + req.getEmail());
        }

        boolean recruiterExists = recruiterRepository.findByEmail(req.getEmail()).isPresent();
        boolean freelancerExists = freelancerRepository.findByEmail(req.getEmail()) != null;
        if (recruiterExists || freelancerExists) {
            throw new UserAlreadyExistsException("User already exists with email:" + req.getEmail());
        }

        // Role-based creation
        if (req.getRole() == Role.RECRUITER) {

            Recruiter recruiter = new Recruiter();
            recruiter.setName(req.getName());
            recruiter.setEmail(req.getEmail());
            recruiter.setPassword(req.getPassword());
            recruiter.setCompany(req.getCompany());

            recruiterRepository.save(recruiter);
        }

        if (req.getRole() == Role.FREELANCER) {

            Freelancer freelancer = new Freelancer();
            freelancer.setName(req.getName());
            freelancer.setEmail(req.getEmail());
            freelancer.setPassword(req.getPassword());
            freelancer.setProfileTitle(req.getProfileTitle());
            freelancer.setExperience(req.getExperience());
            freelancer.setHourlyRate(req.getHourlyRate());
            freelancer.setLocation(req.getLocation());
            freelancer.setAvailable(true);
            freelancer.setVerified(false);

            if (req.getSkillIds() != null && !req.getSkillIds().isEmpty()) {
                freelancer.setSkills(
                        req.getSkillIds().stream()
                                .map(id -> skillRepository.findById(id)
                                        .orElseThrow(() -> new RuntimeException("Skill not found: " + id)))
                                .collect(java.util.stream.Collectors.toSet())
                );
            }

            freelancerRepository.save(freelancer);
        }

        return "Signup successful for role: " + req.getRole();
    }

    // ✅ Login (unchanged – already correct)
    @Override
    public String login(LoginReqDto req) {
        // Fixed admin login (no DB entry required)
        if (ADMIN_EMAIL.equalsIgnoreCase(req.getEmail()) &&
            ADMIN_PASSWORD.equals(req.getPassword())) {
            return "Login Successful. Role: ADMIN";
        }
        Recruiter recruiter = recruiterRepository.findByEmail(req.getEmail()).orElse(null);
        if (recruiter != null) {
            if (!recruiter.isVerified()) {
                throw new RecruiterNotVerifiedException("Recruiter is not verified by admin yet");
            }
            if (!recruiter.getPassword().equals(req.getPassword())) {
                throw new InvalidCredentialsException("Invalid password");
            }
            return "Login Successful. Role: RECRUITER";
        }

        Freelancer freelancer = freelancerRepository.findByEmail(req.getEmail());
        if (freelancer == null) {
            throw new UserAlreadyExistsException("Invalid email");
        }
        if (!freelancer.getPassword().equals(req.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }
        if (!freelancer.isVerified()) {
            throw new FreelancerNotVerifiedException("Freelancer is not verified by admin yet");
        }
        return "Login Successful. Role: FREELANCER";
    }

    public String resetPassword(String email, String code, String newPassword) {
        Recruiter recruiter = recruiterRepository.findByEmail(email).orElse(null);
        if (recruiter != null) {
            recruiter.setPassword(newPassword);
            recruiterRepository.save(recruiter);
            return "Password reset successful (no-code)";
        }

        Freelancer freelancer = freelancerRepository.findByEmail(email);
        if (freelancer != null) {
            freelancer.setPassword(newPassword);
            freelancerRepository.save(freelancer);
            return "Password reset successful (no-code)";
        }

        throw new UserAlreadyExistsException("Invalid email");
    }
}
