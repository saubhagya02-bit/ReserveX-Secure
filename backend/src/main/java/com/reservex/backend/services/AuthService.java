// register user (hash password)
// login (validate password)
// issue JWT


package com.reservex.backend.services;

import com.reservex.backend.config.JwtUtil;
import com.reservex.backend.config.UserPrincipal;
import com.reservex.backend.dto.JwtResponse;
import com.reservex.backend.dto.RegisterRequest;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        var user = User.builder()
                .email(request.getEmail())
                // keep username in sync with email for now
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .businessName(request.getBusinessName())
                .role(User.Role.VENDOR)
                .build();
        return userRepository.save(user);
    }

    public JwtResponse login(String email, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        var principal = (UserPrincipal) auth.getPrincipal();
        String token = jwtUtil.generateToken(auth);
        return JwtResponse.builder()
                .token(token)
                .id(principal.getId())
                .email(principal.getEmail())
                .businessName(principal.getBusinessName())
                .role(principal.getRole())
                .noOfCurrentBookings(principal.getNoOfCurrentBookings())
                .build();
    }
}
