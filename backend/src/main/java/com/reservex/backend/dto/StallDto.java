package com.reservex.backend.dto;

import com.reservex.backend.entity.Stall;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StallDto {

    private Integer id;
    private String name;
    private String size;
    private int gridCol;
    private int gridRow;

    private boolean reserved;

    private boolean Confirmed; // Since Jackson removes "is" prefix for boolean fields, we can name it
                               // "Confirmed" to have the getter as "isConfirmed()"
    private Double price;
    private String description;


    public static StallDto fromEntity(Stall stall) {
        return StallDto.builder()
                .id(stall.getId())
                .name(stall.getName())
                .size(stall.getSize().name())
                .gridCol(stall.getGridCol())
                .gridRow(stall.getGridRow())

                .reserved(reserved)

                .Confirmed(Boolean.TRUE.equals(stall.getIsConfirmed()))
                .price(stall.getPrice())
                .description(stall.getDescription())

                .build();
    }
}
