package com.sneha.seatmgmtapp.dto.request;

import com.sneha.seatmgmtapp.enums.QuotaType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Request to allocate a seat for an applicant.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatAllocationRequest {

    @NotNull(message = "Applicant ID is required")
    private Long applicantId;

    @NotNull(message = "Program ID is required")
    private Long programId;

    @NotNull(message = "Quota type is required")
    private QuotaType quotaType;

    /**
     * Required for government flow (KCET/COMEDK).
     */
    private String allotmentNumber;
}

