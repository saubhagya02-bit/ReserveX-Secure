package com.reservex.backend.controllers;

import com.reservex.backend.config.UserPrincipal;
import com.reservex.backend.dto.ChangePasswordRequest;
import com.reservex.backend.dto.UserProfileDto;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.UserRepository;
import com.reservex.backend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    // -------------------------------------------------------
    // GET /api/users/me — Get current user profile
    // -------------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        try {
            // ASGARDEO TOKEN (vendor portal)
            if (authentication.getPrincipal() instanceof Jwt jwt) {
                String username = jwt.getSubject();
                String email = jwt.getClaimAsString("email");
                String displayName = jwt.getClaimAsString("name");

                log.debug("Fetching profile for Asgardeo user: {}", username);

                // Find or auto-create user in your DB
                User user = userRepository.findByUsername(username)
                        .orElseGet(() -> {
                            log.info("Auto-creating user from Asgardeo token: {}", username);
                            User newUser = User.builder()
                                    .username(username)
                                    .email(email != null ? email : username + "@asgardeo.user")
                                    .businessName(displayName != null ? displayName : username)
                                    .password("OIDC_USER") // Asgardeo handles password
                                    .role(User.Role.VENDOR)
                                    .build();
                            return userRepository.save(newUser);
                        });

                return ResponseEntity.ok(UserProfileDto.fromEntity(user));
            }

            // CUSTOM JWT (admin portal)
            if (authentication.getPrincipal() instanceof UserPrincipal principal) {
                log.debug("Fetching profile for admin user: {}", principal.getEmail());
                return ResponseEntity.ok(userService.getMyProfile(principal.getId()));
            }

            return ResponseEntity.badRequest()
                    .body(new ErrorMessage("Unknown authentication type"));

        } catch (Exception e) {
            log.error("Error fetching user profile: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorMessage(e.getMessage()));
        }
    }

    // -------------------------------------------------------
    // POST /api/users/me/password — Change password
    // Only for admin portal users — Asgardeo users use Asgardeo to change password
    // -------------------------------------------------------
    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            // CUSTOM JWT (admin portal) — password change allowed
            if (authentication.getPrincipal() instanceof UserPrincipal principal) {
                UserProfileDto updated = userService.changeMyPassword(
                        principal.getId(), request);
                return ResponseEntity.ok(updated);
            }

            // ASGARDEO TOKEN (vendor portal) — not allowed here
            if (authentication.getPrincipal() instanceof Jwt) {
                return ResponseEntity.badRequest()
                        .body(new ErrorMessage(
                                "Password management is handled by your identity provider (Asgardeo). " +
                                        "Please visit your Asgardeo account to change your password."));
            }

            return ResponseEntity.badRequest()
                    .body(new ErrorMessage("Unknown authentication type"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorMessage(e.getMessage()));
        } catch (Exception e) {
            log.error("Error changing password: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorMessage("Failed to change password"));
        }
    }

    public record ErrorMessage(String message) {}
}