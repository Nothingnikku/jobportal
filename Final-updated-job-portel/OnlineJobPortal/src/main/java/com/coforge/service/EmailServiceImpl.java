package com.coforge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.Value;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;


    @Override
    public void sendOtpEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
       // message.setFrom(from);
        message.setTo(to);
        message.setSubject("OTP Verification - Job Portal");
        message.setText(
            "Your OTP is: " + code +
            "\nThis OTP is valid for 10 minutes.\n\nDo not share this OTP with anyone."
        );
        System.out.println("OTP Sent"+code);
        mailSender.send(message);
    }
}