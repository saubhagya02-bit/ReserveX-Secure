package com.reservex.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationGenreId implements Serializable {
    private Integer reservation;
    private Integer stallId;
    private String genreName;
}