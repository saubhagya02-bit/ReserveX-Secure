package com.reservex.backend.dto;

import com.reservex.backend.entity.Reservation;
import com.reservex.backend.entity.ReservationGenre;
import com.reservex.backend.entity.Stall;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class ReservationDto {

    private Integer id;
    private String qrCodeToken;
    private Instant reservationDate;
    private String status;
    private List<ReservationStallDto> stalls;
    @JsonProperty("businessName")
    private String businessName;

    public static ReservationDto fromEntity(Reservation r) {
        List<ReservationGenre> reservationGenres = r.getReservationGenres() != null
                ? new java.util.ArrayList<>(r.getReservationGenres())
                : List.of();

        List<ReservationStallDto> stallDtos = r.getStalls().stream()
                .map(s -> toStallDto(s, reservationGenres))
                .collect(Collectors.toList());

        return ReservationDto.builder()
                .id(r.getId())
                .qrCodeToken(r.getQrCodePath())
                .reservationDate(r.getReservationDate())
                .status(r.getStatus().name())
                .businessName(r.getUser() != null ? r.getUser().getBusinessName() : null)
                .stalls(stallDtos)
                .build();
    }

    private static ReservationStallDto toStallDto(Stall s, List<ReservationGenre> genres) {
        List<String> stallGenres = genres.stream()
                .filter(g -> g.getStallId() != null && g.getStallId().equals(s.getId()))
                .map(ReservationGenre::getGenreName)
                .collect(Collectors.toList());

        return ReservationStallDto.builder()
                .id(s.getId())
                .name(s.getName())
                .size(s.getSize().name())
                .genres(stallGenres)
                .build();
    }
}
