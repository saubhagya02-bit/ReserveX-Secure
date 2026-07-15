package com.reservex.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ReservationStallDto {

    private Integer id;
    private String name;
    private String size;
    private List<String> genres;
}
