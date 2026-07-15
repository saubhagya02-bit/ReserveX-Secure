package com.reservex.backend.dto;

import com.reservex.backend.entity.Stall;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateStallRequest {

    @NotBlank(message = "Stall name is required")
    private String name;

    @NotNull(message = "Size is required")
    private Stall.StallSize size;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @Min(value = 1, message = "Grid column must be at least 1")
    private int gridCol = 0;
    
    @Min(value = 1, message = "Grid row must be at least 1")
    private int gridRow = 0;
}
