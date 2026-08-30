package com.reservex.backend.controllers;

import com.reservex.backend.config.UserPrincipal;
import com.reservex.backend.dto.ReservationDto;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.UserRepository;
import com.reservex.backend.services.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    // CREATE RESERVATION
    // ONLY VENDORS

    @PreAuthorize("hasRole('Vendor')")
    @PostMapping
    public ResponseEntity<?> createReservation(
            Authentication authentication,
            @RequestBody Map<String, Object> body) {

        try {

            User user = getUserFromAuthentication(authentication);

            if (user == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "User not authenticated"
                                )
                        );
            }

            // Extra database-level protection
            if (user.getRole() != User.Role.VENDOR) {

                log.warn(
                        "Non-vendor user {} attempted to create reservation. Role: {}",
                        user.getUsername(),
                        user.getRole()
                );

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                Map.of(
                                        "message",
                                        "Only vendors can create reservations"
                                )
                        );
            }


            if (body.get("stallIds") != null
                    || body.get("stall_ids") != null) {

                Object stallIdsObject =
                        body.get("stall_ids") != null
                                ? body.get("stall_ids")
                                : body.get("stallIds");

                if (!(stallIdsObject instanceof List<?> rawList)) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    Map.of(
                                            "message",
                                            "stallIds must be a list"
                                    )
                            );
                }

                List<Integer> stallIds;

                try {

                    stallIds = rawList.stream()
                            .map(id ->
                                    id instanceof Number number
                                            ? number.intValue()
                                            : Integer.parseInt(
                                            id.toString()
                                    )
                            )
                            .toList();

                } catch (NumberFormatException e) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    Map.of(
                                            "message",
                                            "Invalid stall ID"
                                    )
                            );
                }

                if (stallIds.isEmpty()) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    Map.of(
                                            "message",
                                            "At least one stall ID is required"
                                    )
                            );
                }

                log.info(
                        "Vendor {} creating reservations for stalls: {}",
                        user.getUsername(),
                        stallIds
                );

                List<ReservationDto> dtos =
                        reservationService.createReservations(
                                user.getId(),
                                stallIds
                        );

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(dtos);
            }

            // SINGLE STALL

            Object stallIdObject = body.get("stallId");

            if (stallIdObject == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "stallId or stallIds is required"
                                )
                        );
            }

            Integer stallId;

            try {

                stallId =
                        stallIdObject instanceof Number number
                                ? number.intValue()
                                : Integer.parseInt(
                                stallIdObject.toString()
                        );

            } catch (NumberFormatException e) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid stall ID"
                                )
                        );
            }

            log.info(
                    "Vendor {} creating reservation for stall: {}",
                    user.getUsername(),
                    stallId
            );

            ReservationDto dto =
                    reservationService.createReservation(
                            user.getId(),
                            stallId
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);

        } catch (IllegalArgumentException e) {

            log.warn(
                    "Invalid reservation request: {}",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            log.error(
                    "Error creating reservation",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "An unexpected error occurred"
                            )
                    );
        }
    }

    // GET MY RESERVATIONS
    // ONLY VENDORS

    @PreAuthorize("hasRole('Vendor')")
    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(
            Authentication authentication) {

        try {

            User user = getUserFromAuthentication(authentication);

            if (user == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "User not authenticated"
                                )
                        );
            }

            // Extra database-level protection
            if (user.getRole() != User.Role.VENDOR) {

                log.warn(
                        "Non-vendor user {} attempted to access reservations. Role: {}",
                        user.getUsername(),
                        user.getRole()
                );

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(
                                Map.of(
                                        "message",
                                        "Only vendors can access their reservations"
                                )
                        );
            }

            log.debug(
                    "Fetching reservations for vendor: {}",
                    user.getUsername()
            );

            List<ReservationDto> reservations =
                    reservationService.getMyReservations(
                            user.getId()
                    );

            return ResponseEntity.ok(reservations);

        } catch (Exception e) {

            log.error(
                    "Error fetching reservations",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to fetch reservations"
                            )
                    );
        }
    }

    // GET USER FROM AUTHENTICATION

    private User getUserFromAuthentication(
            Authentication authentication) {

        if (authentication == null) {
            return null;
        }

        // ASGARDEO JWT
        // Vendor / Organizer

        if (authentication.getPrincipal() instanceof Jwt jwt) {

            String username = jwt.getSubject();
            String email = jwt.getClaimAsString("email");
            String displayName = jwt.getClaimAsString("name");

            List<String> roles =
                    jwt.getClaimAsStringList("roles");

            log.debug(
                    "Asgardeo user: {} roles: {}",
                    username,
                    roles
            );

            // ----------------------------------------------------
            // Determine role from Asgardeo
            // ----------------------------------------------------

            boolean isOrganizer =
                    roles != null &&
                            (
                                    roles.contains("Organizer")
                                            || roles.contains("EMPLOYEE")
                            );

            boolean isVendor =
                    roles != null &&
                            (
                                    roles.contains("Vendor")
                                            || roles.contains("VENDOR")
                            );
            // Reject user without valid role
            if (!isOrganizer && !isVendor) {

                log.warn(
                        "User {} has no valid role. Roles: {}",
                        username,
                        roles
                );

                return null;
            }

            // Find existing user

            return userRepository
                    .findByUsername(username)
                    .orElseGet(() -> {

                        User.Role role =
                                isOrganizer
                                        ? User.Role.EMPLOYEE
                                        : User.Role.VENDOR;

                        log.info(
                                "Creating Asgardeo user {} with role {}",
                                username,
                                role
                        );

                        User newUser =
                                User.builder()
                                        .username(username)
                                        .email(
                                                email != null
                                                        ? email
                                                        : username
                                                        + "@asgardeo.user"
                                        )
                                        .businessName(
                                                displayName != null
                                                        ? displayName
                                                        : username
                                        )
                                        .password("OIDC_USER")
                                        .role(role)
                                        .build();

                        return userRepository.save(newUser);
                    });
        }

        // CUSTOM JWT
        // Admin portal

        if (authentication.getPrincipal()
                instanceof UserPrincipal principal) {

            log.debug(
                    "Custom JWT user: {}",
                    principal.getEmail()
            );

            return userRepository
                    .findById(principal.getId())
                    .orElse(null);
        }

        return null;
    }
}