package com.reservex.backend.repositories;

import com.reservex.backend.entity.Reservation;
import com.reservex.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    List<Reservation> findByUserOrderByReservationDateDesc(User user);

    int countByUser(User user);

    Optional<Reservation> findTopByUserOrderByReservationDateDesc(User user);

    Optional<Reservation> findByQrCodePath(String qrCodeToken);

    @Query("""
            SELECT DISTINCT r
            FROM Reservation r
            JOIN FETCH r.user u
            LEFT JOIN FETCH r.stalls s
            LEFT JOIN FETCH r.reservationGenres rg
            """)
    List<Reservation> findAllWithDetails();

    @Query("""
            SELECT DISTINCT r
            FROM Reservation r
            JOIN FETCH r.user u
            LEFT JOIN FETCH r.stalls s
            LEFT JOIN FETCH r.reservationGenres rg
            WHERE r.user = :user
            ORDER BY r.reservationDate DESC
            """)
    List<Reservation> findByUserWithDetailsOrderByReservationDateDesc(@Param("user") User user);

    /**
     * Used to check whether a given stall is already attached to any reservation.
     */
    boolean existsByStalls_Id(Integer stallId);

    /**
     * Find all reservations that contain the given stall.
     */
    List<Reservation> findByStalls_Id(Integer stallId);
}
