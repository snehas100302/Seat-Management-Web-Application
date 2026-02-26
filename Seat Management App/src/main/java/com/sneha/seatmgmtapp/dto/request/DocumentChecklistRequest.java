package com.sneha.seatmgmtapp.dto.request;

import com.sneha.seatmgmtapp.enums.DocumentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentChecklistRequest {

    @NotBlank(message = "Document name is required")
    private String documentName;

    private DocumentStatus status;
    private String remarks;

    @NotNull(message = "Applicant ID is required")
    private Long applicantId;
}

