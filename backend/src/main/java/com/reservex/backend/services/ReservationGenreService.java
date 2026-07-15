package com.reservex.backend.services;

import com.reservex.backend.dto.StallGenreRequest;
import com.reservex.backend.entity.Reservation;
import com.reservex.backend.entity.ReservationGenre;
import com.reservex.backend.entity.User;
import com.reservex.backend.repositories.ReservationGenreRepository;
import com.reservex.backend.repositories.ReservationRepository;
import com.reservex.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationGenreService {

    private final ReservationGenreRepository genreRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    /**
     * All genre operations are associated with the latest reservation of the user.
     * This matches the {@code reservation_id} foreign key in the reservation_genres
     * table.
     */
    private Reservation getLatestReservationForUser(User user) {
        return reservationRepository.findTopByUserOrderByReservationDateDesc(user)
                .orElseThrow(() -> new IllegalStateException("No reservations found for user"));
    }

    // @Transactional
    // public ReservationGenre addGenre(Integer userId, String genreName) {
    // User user = userRepository.findById(userId)
    // .orElseThrow(() -> new IllegalArgumentException("User not found"));
    // Reservation reservation = getLatestReservationForUser(user);
    // ReservationGenre genre = new ReservationGenre(reservation, genreName.trim());
    // return genreRepository.save(genre);
    // }

    @Transactional(readOnly = true)
    public List<String> getGenresByUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Reservation reservation = getLatestReservationForUser(user);
        return genreRepository.findByReservation(reservation).stream()
                .map(ReservationGenre::getGenreName)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public void setGenresPerStall(Integer userId, List<StallGenreRequest> requests) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Reservation reservation = getLatestReservationForUser(user);

        // Clear old genres
        // orphanRemoval
        reservation.getReservationGenres().clear();
        reservationRepository.saveAndFlush(reservation);

        // Save the new genres attached to stalls
        if (requests != null) {
            for (StallGenreRequest req : requests) {
                if (req.getGenres() != null) {
                    for (String genreName : req.getGenres()) {
                        if (genreName != null && !genreName.isBlank()) {
                            ReservationGenre genre = new ReservationGenre(
                                    reservation,
                                    req.getStallId(),
                                    genreName.trim());
                            reservation.getReservationGenres().add(genre);
                        }
                    }
                }
            }
            reservationRepository.saveAndFlush(reservation); // Save parent again to cascade new children
        }
    }

}
