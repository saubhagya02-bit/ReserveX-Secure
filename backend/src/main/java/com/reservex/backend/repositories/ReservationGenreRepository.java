package com.reservex.backend.repositories;

import com.reservex.backend.entity.Reservation;
import com.reservex.backend.entity.ReservationGenre;
import com.reservex.backend.entity.ReservationGenreId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationGenreRepository extends JpaRepository<ReservationGenre, ReservationGenreId> {

    List<ReservationGenre> findByReservation(Reservation reservation);

    void deleteByReservation(Reservation reservation);

    @Modifying
    @Query("DELETE FROM ReservationGenre rg WHERE rg.reservation.id = :reservationId")
    void deleteAllByReservation_Id(@Param("reservationId") Integer reservationId);

    @Modifying
    @Query("DELETE FROM ReservationGenre rg WHERE rg.stallId = :stallId")
    void deleteAllByStallId(@Param("stallId") Integer stallId);

    @Modifying
    @Query("DELETE FROM ReservationGenre rg WHERE rg.reservation.id = :reservationId AND rg.stallId = :stallId")
    void deleteByReservationIdAndStallId(@Param("reservationId") Integer reservationId, @Param("stallId") Integer stallId);
}
