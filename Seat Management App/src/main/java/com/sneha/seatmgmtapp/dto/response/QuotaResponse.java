package com.sneha.seatmgmtapp.dto.response;

import com.sneha.seatmgmtapp.enums.QuotaType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotaResponse {
    private Long id;
    private QuotaType quotaType;
    private Integer totalSeats;
    private Integer filledSeats;
    private Integer availableSeats;
    private Long programId;
    private String programName;
}

