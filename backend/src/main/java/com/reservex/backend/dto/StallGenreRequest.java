package com.reservex.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class StallGenreRequest {
    private Integer stallId;
    private List<String> genres;
}