package com.reservex.backend.controllers;

import com.reservex.backend.config.UserPrincipal;
import com.reservex.backend.dto.ReservationDto;
import com.reservex.backend.services.ReservationGenreService;
import com.reservex.backend.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationGenreService genreService;


    // Reserve stall(s)
    @PostMapping
    public ResponseEntity<?> createReservation(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {

        try {

            // Frontend sends stall_ids (snake_case); also accept stallIds
            Object stallIdsObj = body.get("stall_ids") != null
                    ? body.get("stall_ids")
                    : body.get("stallIds");


            // Multiple stall reservation
            if (stallIdsObj != null) {

                @SuppressWarnings("unchecked")
                List<?> rawList = (List<?>) stallIdsObj;

                List<Integer> stallIds = rawList.stream()
                        .map(id -> id instanceof Number n
                                ? n.intValue()
                                : Integer.parseInt(id.toString()))
                        .toList();


                List<ReservationDto> dtos =
                        reservationService.createReservations(
                                principal.getId(),
                                stallIds
                        );

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(dtos);
            }


            // Single stall reservation
            Object stallIdObj = body.get("stallId");

            if (stallIdObj == null) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "stallId or stallIds is required"
                        ));
            }


            Integer stallId = stallIdObj instanceof Number n
                    ? n.intValue()
                    : Integer.parseInt(stallIdObj.toString());


            ReservationDto dto =
                    reservationService.createReservation(
                            principal.getId(),
                            stallId
                    );


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);


        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }



    // "My reservations" endpoint
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDto>> getMyReservations(
            @AuthenticationPrincipal UserPrincipal principal) {

        return ResponseEntity.ok(
                reservationService.getMyReservations(principal.getId())
        );
    }
}