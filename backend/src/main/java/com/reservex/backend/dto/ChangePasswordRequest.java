package com.reservex.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank
    private String newPassword;
    @NotBlank
    private String confirmPassword;

    /**
     * Optional. Admin portal UI does not ask for current password.
     * If provided, backend will validate it.
     */
    private String currentPassword;
}

