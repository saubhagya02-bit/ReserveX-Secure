package com.reservex.backend.controllers;

import com.reservex.backend.dto.ContactRequest;
import com.reservex.backend.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactRequest request) {

        emailService.sendContactUsEmail(request);


        return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
    }
}