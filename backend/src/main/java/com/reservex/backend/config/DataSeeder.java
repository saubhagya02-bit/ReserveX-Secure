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

    private void seedStalls() {
        List<Stall> stalls = List.of(
                stall("A1", Stall.StallSize.SMALL,1, 1 ),
                stall("B1", Stall.StallSize.SMALL, 2, 1),
                stall("C1", Stall.StallSize.MEDIUM,  3, 1),
                stall("D1", Stall.StallSize.MEDIUM,  4, 1),
                stall("E1", Stall.StallSize.LARGE,  1, 2),
                stall("F1", Stall.StallSize.LARGE, 2, 2),
                stall("G1", Stall.StallSize.SMALL, 3, 2),
                stall("H2", Stall.StallSize.MEDIUM,  4, 2),
                stall("I3", Stall.StallSize.LARGE, 1, 3)
        );
        stallRepository.saveAll(stalls);
    }

    private Stall stall(String name, Stall.StallSize size,int gridCol, int gridRow) {
        return Stall.builder().name(name).size(size).gridCol(gridCol)
                .gridRow(gridRow).build();
    }

    private void seedAdminUser() {
        userRepository.save(User.builder()
                .email("admin@bookfair.lk")
                .username("admin@bookfair.lk")
                .password(passwordEncoder.encode("admin123"))
                .businessName("Book Fair Organizer")
                .role(User.Role.EMPLOYEE)
                .build());
    }
}
