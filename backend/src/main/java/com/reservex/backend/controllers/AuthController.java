// Register/login endpoints
// Returns JWT (token) after login


package com.reservex.backend.controllers;

import com.reservex.backend.dto.JwtResponse;
import com.reservex.backend.dto.LoginRequest;
import com.reservex.backend.dto.RegisterRequest;
import com.reservex.backend.entity.User;
import com.reservex.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new RegisterResponse(user.getId(), user.getEmail(), user.getBusinessName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMessage("Invalid credentials"));
        }
    }

    public record RegisterResponse(Integer id, String email, String businessName) {}
    public record ErrorMessage(String message) {}
}
