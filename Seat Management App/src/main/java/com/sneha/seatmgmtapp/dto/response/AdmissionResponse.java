package com.sneha.seatmgmtapp.dto.response;

import com.sneha.seatmgmtapp.enums.AdmissionStatus;
import com.sneha.seatmgmtapp.enums.FeeStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionResponse {
    private Long id;
    private String admissionNumber;
    private AdmissionStatus admissionStatus;
    private FeeStatus feeStatus;
    private Long applicantId;
    private String applicantName;
    private Long quotaId;
    private String quotaType;
    private String programName;
    private LocalDateTime createdAt;
}

