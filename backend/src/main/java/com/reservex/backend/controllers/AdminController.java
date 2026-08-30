package com.reservex.backend.controllers;

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
@PreAuthorize("hasRole('Organizer')")
public class AdminController {

    private final StallService stallService;
    private final ReservationService reservationService;

    @GetMapping("/stalls")
    public ResponseEntity<List<StallDto>> getAllStalls() {
        return ResponseEntity.ok(
                stallService.getAllStallsWithAvailability()
        );
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDto>> getAllReservations() {
        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }
}