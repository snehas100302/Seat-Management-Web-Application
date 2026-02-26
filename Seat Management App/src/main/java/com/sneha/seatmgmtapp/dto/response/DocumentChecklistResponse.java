package com.sneha.seatmgmtapp.dto.response;

import com.sneha.seatmgmtapp.enums.DocumentStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentChecklistResponse {
    private Long id;
    private String documentName;
    private DocumentStatus status;
    private String remarks;
    private Long applicantId;
}

