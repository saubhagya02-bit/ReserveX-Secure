package com.reservex.backend.services;

import com.reservex.backend.dto.ChangePasswordRequest;
import com.reservex.backend.dto.UserProfileDto;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Pattern PASSWORD_POLICY = Pattern.compile(
            "^(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileDto getMyProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Safety for older rows: if lastUpdatedAt was not set, treat as never updated.
        if (user.getLastUpdatedAt() == null) {
            user.setLastUpdatedAt(user.getCreatedAt());
        }

        return UserProfileDto.fromEntity(user);
    }

    @Transactional
    public UserProfileDto changeMyPassword(Integer userId, ChangePasswordRequest request) {
        if (request.getNewPassword() == null || request.getConfirmPassword() == null) {
            throw new IllegalArgumentException("New password and confirmation are required");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Optional current password validation (if client provides it)
        if (request.getCurrentPassword() != null && !request.getCurrentPassword().isBlank()) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
        }

        // New password must not be same as current password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        if (!PASSWORD_POLICY.matcher(request.getNewPassword()).matches()) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters and include lowercase, number, and special character"
            );
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // If lastUpdatedAt was never set, initialize it to createdAt first (never-updated state)
        if (user.getLastUpdatedAt() == null) {
            user.setLastUpdatedAt(user.getCreatedAt());
        }
        // Record update time now
        user.setLastUpdatedAt(Instant.now());

        User saved = userRepository.save(user);
        return UserProfileDto.fromEntity(saved);
    }
}

