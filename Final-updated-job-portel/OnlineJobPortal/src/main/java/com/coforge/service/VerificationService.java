package com.coforge.service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificationService {

    private static final int EXPIRY_MINUTES = 10;
    private final Map<String, CodeEntry> codes = new ConcurrentHashMap<>();
    private final Map<String, Boolean> verified = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @Autowired
    private EmailService emailService;

    // ✅ generate + send OTP
    public void generateAndSendCode(String email) {

        String code = String.format("%06d", random.nextInt(1_000_000));

        codes.put(
            email.toLowerCase(),
            new CodeEntry(code, Instant.now().plusSeconds(EXPIRY_MINUTES * 60L))
        );

        verified.remove(email.toLowerCase());

        // ✅ SEND OTP VIA MAIL
        emailService.sendOtpEmail(email, code);
    }

    public boolean verifyCode(String email, String code) {
        CodeEntry entry = codes.get(email.toLowerCase());
        if (entry == null || Instant.now().isAfter(entry.expiry)) {
            return false;
        }
        if (!entry.code.equals(code)) {
            return false;
        }
        verified.put(email.toLowerCase(), true);
        return true;
    }

    public boolean isVerified(String email) {
        return verified.getOrDefault(email.toLowerCase(), false);
    }

    private static class CodeEntry {
        private final String code;
        private final Instant expiry;

        private CodeEntry(String code, Instant expiry) {
            this.code = code;
            this.expiry = expiry;
        }
    }
}