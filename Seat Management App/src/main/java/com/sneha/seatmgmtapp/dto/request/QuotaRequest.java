package com.sneha.seatmgmtapp.dto.request;

import com.sneha.seatmgmtapp.enums.QuotaType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotaRequest {

    @NotNull(message = "Quota type is required")
    private QuotaType quotaType;

    @NotNull(message = "Total seats is required")
    @Min(value = 0, message = "Total seats must be non-negative")
    private Integer totalSeats;

    @NotNull(message = "Program ID is required")
    private Long programId;
}

