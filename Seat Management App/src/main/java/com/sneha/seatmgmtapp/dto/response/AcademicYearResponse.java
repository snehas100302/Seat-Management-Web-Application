package com.sneha.seatmgmtapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicYearResponse {
    private Long id;
    private Integer startYear;
    private Integer endYear;
    private String label;
    private Boolean isCurrent;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

