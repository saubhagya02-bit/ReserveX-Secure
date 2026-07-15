
package com.reservex.backend.controllers;


// Admin endpoints to view all stalls and reservations


import com.reservex.backend.dto.ReservationDto;
import com.reservex.backend.dto.StallDto;
import com.reservex.backend.services.ReservationService;
import com.reservex.backend.services.StallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StallService stallService;
    private final ReservationService reservationService;

    @PreAuthorize("hasRole('EMPLOYEE')") // Only allow users with EMPLOYEE role (admin) to access these endpoints
    @GetMapping("/stalls")
    public ResponseEntity<List<StallDto>> getAllStalls() {
        return ResponseEntity.ok(stallService.getAllStallsWithAvailability());
    }

    @PreAuthorize("hasRole('EMPLOYEE')") // Only allow users with EMPLOYEE role (admin) to access these endpoints
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDto>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }
}
