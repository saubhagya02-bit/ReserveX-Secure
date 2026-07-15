package com.reservex.backend.dto;

import com.reservex.backend.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserProfileDto {
    private Integer id;
    private String businessName;
    private String email;
    private String username;
    private String role;
    private Integer noOfCurrentBookings;
    private Instant createdAt;
    private Instant lastUpdatedAt;

    public static UserProfileDto fromEntity(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .businessName(user.getBusinessName())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .noOfCurrentBookings(user.getNoOfCurrentBookings())
                .createdAt(user.getCreatedAt())
                .lastUpdatedAt(user.getLastUpdatedAt())
                .build();
    }
}

