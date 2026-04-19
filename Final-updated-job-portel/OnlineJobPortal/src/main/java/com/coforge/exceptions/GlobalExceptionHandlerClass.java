package com.coforge.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.validation.ConstraintViolationException;


@ControllerAdvice
public class GlobalExceptionHandlerClass {


    @ExceptionHandler(UserAlreadyExistsException.class)

    public ResponseEntity<String> handleUserExists(

            UserAlreadyExistsException e){

        return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(InvalidCredentialsException.class)

    public ResponseEntity<String> handleInvalidCredentials(

            InvalidCredentialsException e){

        return new ResponseEntity<>(e.getMessage(),HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(RecruiterNotFoundException.class)

    public ResponseEntity<String>handleRecruiterNotFound(

    		RecruiterNotFoundException e){

        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(FreelancerNotFoundException.class)

    public ResponseEntity<String>handleFreelancerNotFound(FreelancerNotFoundException e){

        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(SkillExperienceNotFoundException.class)

    public ResponseEntity<String>handleSkillExperienceNotFound(SkillExperienceNotFoundException e){

    		    return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    		}
    
    
    @ExceptionHandler(SkillNotFoundException.class)

    public ResponseEntity<String>handleSkillNotFound(SkillNotFoundException e){

        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(JobNotFoundException.class)

    public ResponseEntity<String> handleJobNotFound(JobNotFoundException e){

        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RecruiterNotVerifiedException.class)
    public ResponseEntity<?> handleRecruiterNotVerified(
            RecruiterNotVerifiedException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.FORBIDDEN.value());
        error.put("error", "Recruiter Not Verified");
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(FreelancerNotVerifiedException.class)
    public ResponseEntity<?> handleFreelancerNotVerified(
            FreelancerNotVerifiedException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.FORBIDDEN.value());
        error.put("error", "Freelancer Not Verified");
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> handleConstraintViolation(ConstraintViolationException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return new ResponseEntity<>("Invalid or duplicate data", HttpStatus.BAD_REQUEST);
    }

}
