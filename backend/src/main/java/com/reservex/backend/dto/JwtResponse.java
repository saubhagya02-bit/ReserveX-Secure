package com.reservex.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private Integer id;
    private String email;
    private String role;
    private String businessName;
    private Integer noOfCurrentBookings;
}
