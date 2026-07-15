package com.reservex.backend.repositories;

import com.reservex.backend.entity.Stall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StallRepository extends JpaRepository<Stall, Integer> {

    List<Stall> findAllByOrderByNameAsc();

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer excludeId);

    boolean existsByGridRowAndGridCol(int gridRow, int gridCol);

    boolean existsByGridRowAndGridColAndIdNot(int gridRow, int gridCol, Integer excludeId);
}
