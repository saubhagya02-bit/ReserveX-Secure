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

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        try {

            // ASGARDEO TOKEN (Vendor / Organizer portal)
            if (authentication.getPrincipal() instanceof Jwt jwt) {

                String username = jwt.getSubject();
                String email = jwt.getClaimAsString("email");
                String displayName = jwt.getClaimAsString("name");

                log.debug(
                        "Fetching profile for Asgardeo user: {}",
                        username
                );

                // Find existing user or auto-create user
                User user = userRepository.findByUsername(username)
                        .orElseGet(() -> {

                            // Get roles from Asgardeo JWT
                            List<String> roles =
                                    jwt.getClaimAsStringList("roles");

                            // Check whether user is an Organizer/Employee
                            boolean isOrganizer =
                                    roles != null &&
                                            (roles.contains("Organizer")
                                                    || roles.contains("EMPLOYEE"));

                            log.info(
                                    "Auto-creating Asgardeo user: {} with roles: {}",
                                    username,
                                    roles
                            );

                            User newUser = User.builder()
                                    .username(username)
                                    .email(
                                            email != null
                                                    ? email
                                                    : username + "@asgardeo.user"
                                    )
                                    .businessName(
                                            displayName != null
                                                    ? displayName
                                                    : username
                                    )
                                    .password("OIDC_USER")

                                    // Organizer / EMPLOYEE → EMPLOYEE
                                    // Everyone else → VENDOR
                                    .role(
                                            isOrganizer
                                                    ? User.Role.EMPLOYEE
                                                    : User.Role.VENDOR
                                    )
                                    .build();

                            return userRepository.save(newUser);
                        });

                return ResponseEntity.ok(
                        UserProfileDto.fromEntity(user)
                );
            }

            // CUSTOM JWT (Admin portal)
            if (authentication.getPrincipal()
                    instanceof UserPrincipal principal) {

                log.debug(
                        "Fetching profile for admin user: {}",
                        principal.getEmail()
                );

                return ResponseEntity.ok(
                        userService.getMyProfile(principal.getId())
                );
            }

            return ResponseEntity.badRequest()
                    .body(
                            new ErrorMessage(
                                    "Unknown authentication type"
                            )
                    );

        } catch (Exception e) {

            log.error(
                    "Error fetching user profile: {}",
                    e.getMessage()
            );

            return ResponseEntity.badRequest()
                    .body(
                            new ErrorMessage(
                                    e.getMessage()
                            )
                    );
        }
    }

    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        try {

            // CUSTOM JWT (Admin portal)
            if (authentication.getPrincipal()
                    instanceof UserPrincipal principal) {

                UserProfileDto updated =
                        userService.changeMyPassword(
                                principal.getId(),
                                request
                        );

                return ResponseEntity.ok(updated);
            }

            // ASGARDEO TOKEN (Vendor / Organizer portal)
            if (authentication.getPrincipal() instanceof Jwt) {

                return ResponseEntity.badRequest()
                        .body(
                                new ErrorMessage(
                                        "Password management is handled by your identity provider (Asgardeo). "
                                                + "Please visit your Asgardeo account to change your password."
                                )
                        );
            }

            return ResponseEntity.badRequest()
                    .body(
                            new ErrorMessage(
                                    "Unknown authentication type"
                            )
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(
                            new ErrorMessage(
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            log.error(
                    "Error changing password: {}",
                    e.getMessage()
            );

            return ResponseEntity.badRequest()
                    .body(
                            new ErrorMessage(
                                    "Failed to change password"
                            )
                    );
        }
    }

    public record ErrorMessage(String message) {
    }
}