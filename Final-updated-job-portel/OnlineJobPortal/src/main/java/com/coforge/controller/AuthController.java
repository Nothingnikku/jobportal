package com.coforge.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.coforge.dto.LoginReqDto;
import com.coforge.dto.SignupReqDto;
import com.coforge.dto.EmailCodeRequest;
import com.coforge.dto.ResetPasswordRequest;
import com.coforge.service.AuthService;
import com.coforge.service.VerificationService;

import jakarta.validation.Valid;

@CrossOrigin(origins ="http://localhost:3000")
@RestController
@RequestMapping("/authentication")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private VerificationService verificationService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupReqDto request) {
        return new ResponseEntity<>(authService.signup(request),HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginReqDto request) {
        return new ResponseEntity<>(authService.login(request),HttpStatus.OK);
    }

    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestBody EmailCodeRequest request) {

        verificationService.generateAndSendCode(request.getEmail());

        return new ResponseEntity<>(
            "OTP has been sent to your registered email",
            HttpStatus.OK
        );
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody EmailCodeRequest request) {
        boolean ok = verificationService.verifyCode(
            request.getEmail(),
            request.getCode()
        );
        return new ResponseEntity<>(
            ok ? "VERIFIED" : "INVALID",
            HttpStatus.OK
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        String result = authService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
