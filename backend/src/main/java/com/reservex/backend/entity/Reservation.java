package com.reservex.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // one reservation -> many stalls (via join table)
    @ManyToMany
    @JoinTable(
            name = "reservation_stalls",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "stall_id")
    )
    @Builder.Default
    private Set<Stall> stalls = new HashSet<>();

    @Column(name = "reservation_date", nullable = false, updatable = false)
    private Instant reservationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "qr_code_path")
    private String qrCodePath;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ReservationGenre> reservationGenres = new HashSet<>();

    public enum Status {
        Pending,
        Approved,
        Rejected
    }

    @PrePersist
    protected void onCreate() {
        if (reservationDate == null) reservationDate = Instant.now();
        // You can store a token OR a file path in qr_code_path.
        // If you're storing a token, generate it here:
        if (qrCodePath == null) qrCodePath = UUID.randomUUID().toString();
        if (status == null) status = Status.Approved;
    }

}
