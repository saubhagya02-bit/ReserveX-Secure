// Reserve stall(s) endpoint
// "My reservations" endpoint
// Supports BOTH Asgardeo OIDC tokens (vendor portal) and custom JWT (admin portal)

package com.reservex.backend.controllers;

import com.reservex.backend.config.UserPrincipal;
import com.reservex.backend.dto.ReservationDto;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.UserRepository;
import com.reservex.backend.services.ReservationGenreService;
import com.reservex.backend.services.ReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final ReservationGenreService genreService;
    private final UserRepository userRepository;

    // -------------------------------------------------------
    // POST /api/reservations — Create reservation
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> createReservation(
            Authentication authentication,
            @RequestBody Map<String, Object> body) {
        try {
            // Get user from either Asgardeo token or custom JWT
            User user = getUserFromAuthentication(authentication);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User not authenticated"));
            }

            // Handle list of stall IDs
            if (body.get("stallIds") != null || body.get("stall_ids") != null) {
                @SuppressWarnings("unchecked")
                List<?> rawList = (List<?>) (body.get("stall_ids") != null
                        ? body.get("stall_ids")
                        : body.get("stallIds"));

                List<Integer> stallIds = rawList.stream()
                        .map(id -> id instanceof Number n
                                ? n.intValue()
                                : Integer.parseInt(id.toString()))
                        .toList();

                log.info("Creating reservations for user: {} stallIds: {}",
                        user.getUsername(), stallIds);

                List<ReservationDto> dtos = reservationService
                        .createReservations(user.getId(), stallIds);

                return ResponseEntity.status(HttpStatus.CREATED).body(dtos);
            }

            // Handle single stall ID
            Object stallIdObj = body.get("stallId");
            if (stallIdObj == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "stallId or stallIds is required"));
            }

            Integer stallId = stallIdObj instanceof Number n
                    ? n.intValue()
                    : Integer.parseInt(stallIdObj.toString());

            log.info("Creating reservation for user: {} stallId: {}",
                    user.getUsername(), stallId);

            ReservationDto dto = reservationService
                    .createReservation(user.getId(), stallId);

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred"));
        }
    }

    // -------------------------------------------------------
    // GET /api/reservations/my — Get current user's reservations
    // -------------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User not authenticated"));
            }

            log.debug("Fetching reservations for user: {}", user.getUsername());

            List<ReservationDto> reservations = reservationService
                    .getMyReservations(user.getId());

            return ResponseEntity.ok(reservations);

        } catch (Exception e) {
            log.error("Error fetching reservations: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch reservations"));
        }
    }

    // -------------------------------------------------------
    // Helper — Get User from either Asgardeo or custom JWT
    // -------------------------------------------------------
    private User getUserFromAuthentication(Authentication authentication) {
        if (authentication == null) return null;

        // ASGARDEO TOKEN (vendor portal)
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            String username = jwt.getSubject();
            String email = jwt.getClaimAsString("email");
            String displayName = jwt.getClaimAsString("name");

            // Find existing user or create new one on first login
            return userRepository.findByUsername(username)
                    .orElseGet(() -> {
                        log.info("Auto-creating user from Asgardeo token: {}", username);
                        User newUser = User.builder()
                                .username(username)
                                .email(email != null ? email : username + "@asgardeo.user")
                                .businessName(displayName != null ? displayName : username)
                                .password("OIDC_USER") // no password — Asgardeo handles auth
                                .role(User.Role.VENDOR)
                                .build();
                        return userRepository.save(newUser);
                    });
        }

        // CUSTOM JWT (admin portal)
        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            return userRepository.findById(principal.getId())
                    .orElse(null);
        }

        return null;
    }
}