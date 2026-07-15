package com.reservex.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "stalls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stall_id")
    private Integer id;

    @Column(name = "stall_name", nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;

    private Double price;

    @Column(name = "gridCol")
    private int gridCol;

    @Column(name = "gridRow")
    private int gridRow;

    @Column(name = "is_Confirmed")
    private Boolean isConfirmed;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany(mappedBy = "stalls") // to navigate Stall → Reservations.
    private Set<Reservation> reservations = new HashSet<>();

    public enum StallSize {
        small,
        medium,
        large
    }
}
