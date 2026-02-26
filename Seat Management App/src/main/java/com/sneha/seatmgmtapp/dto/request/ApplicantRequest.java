package com.sneha.seatmgmtapp.dto.request;

import com.sneha.seatmgmtapp.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantRequest {

    @NotBlank(message = "Applicant name is required")
    private String name;

    private String email;
    private String phone;
    private String dateOfBirth;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Entry type is required")
    private EntryType entryType;

    @NotNull(message = "Quota type is required")
    private QuotaType quotaType;

    private AdmissionMode admissionMode;

    private String qualifyingExam;
    private Double qualifyingMarks;
    private String allotmentNumber;
    private String guardianName;
    private String guardianPhone;

    private Long programId;
}

