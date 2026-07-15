package com.reservex.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "no_of_current_bookings", nullable = false)
    private int noOfCurrentBookings = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "last_updated_at", nullable = false)
    private Instant lastUpdatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    public enum Role {
        VENDOR,
        EMPLOYEE
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null)
            createdAt = Instant.now();

        if (lastUpdatedAt == null)
            lastUpdatedAt = createdAt; // if never updated, keep same as createdAt
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdatedAt = Instant.now();

    }
}
