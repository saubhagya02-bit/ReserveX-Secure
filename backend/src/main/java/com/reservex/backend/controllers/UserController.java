package com.reservex.backend.controllers;

import com.reservex.backend.config.UserPrincipal;
import com.reservex.backend.dto.ChangePasswordRequest;
import com.reservex.backend.dto.UserProfileDto;
import com.reservex.backend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            return ResponseEntity.ok(userService.getMyProfile(principal.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            UserProfileDto updated = userService.changeMyPassword(principal.getId(), request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorMessage(e.getMessage()));
        }
    }

    public record ErrorMessage(String message) {}
}

