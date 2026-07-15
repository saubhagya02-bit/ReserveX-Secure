package com.reservex.backend.entity;

import jakarta.persistence.*;
import lombok.*;


// 2. updated Entity
@Entity
@Table(name = "reservation_genres")
@IdClass(ReservationGenreId.class) // Binds the composite key class to this entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationGenre {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Id
    @Column(name = "stall_id", nullable = false)
    private Integer stallId;

    @Id
    @Column(name = "genre_name", nullable = false)
    private String genreName;
}