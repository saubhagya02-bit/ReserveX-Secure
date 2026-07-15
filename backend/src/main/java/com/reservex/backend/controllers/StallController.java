package com.reservex.backend.controllers;

import com.reservex.backend.dto.CreateStallRequest;
import com.reservex.backend.dto.StallDto;
import com.reservex.backend.dto.UpdateStallRequest;
import com.reservex.backend.services.StallService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
public class StallController {

    private final StallService stallService;

    @GetMapping
    public ResponseEntity<List<StallDto>> getAllStalls() {
        return ResponseEntity.ok(stallService.getAllStallsWithAvailability());
    }

    @GetMapping("/check-name")
    public ResponseEntity<Map<String, Boolean>> checkName(
            @RequestParam String name,
            @RequestParam(required = false) Integer excludeId) {
        boolean taken = excludeId != null
                ? stallService.isNameTakenExcluding(name, excludeId)
                : stallService.isNameTaken(name);
        return ResponseEntity.ok(Map.of("taken", taken));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping
    public ResponseEntity<?> createStall(@Valid @RequestBody CreateStallRequest request) {
        try {
            StallDto dto = stallService.createStall(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStall(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateStallRequest request) {
        try {
            StallDto dto = stallService.updateStall(id, request);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStall(@PathVariable Integer id) {
        try {
            stallService.deleteStall(id);
            return ResponseEntity.ok(Map.of("message", "Stall deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}/unreserve")
    public ResponseEntity<?> unreserveStall(@PathVariable Integer id) {
        try {
            stallService.unreserveStall(id);
            return ResponseEntity.ok(Map.of("message", "Stall unreserved successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}
