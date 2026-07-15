package com.reservex.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    @JsonAlias("username") // backward compatibility with older clients
    private String email;

    @NotBlank
    private String password;
}
