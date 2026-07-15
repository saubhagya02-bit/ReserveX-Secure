// Inserts sample data at startup (e.g., admin user / sample stalls) if you coded it that way

package com.reservex.backend.config;

import com.reservex.backend.entity.Stall;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.StallRepository;
import com.reservex.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@bookfair.lk")) {
            seedAdminUser();
        }
    }

    private void seedAdminUser() {
        userRepository.save(User.builder()
                .email("admin@bookfair.lk")
                .password(passwordEncoder.encode("admin123"))
                .businessName("Book Fair Organizer")
                .role(User.Role.EMPLOYEE)
                .build());
    }
}
