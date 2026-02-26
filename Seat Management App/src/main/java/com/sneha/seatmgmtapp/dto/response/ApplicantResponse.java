package com.sneha.seatmgmtapp.dto.response;

import com.sneha.seatmgmtapp.enums.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String dateOfBirth;
    private Category category;
    private EntryType entryType;
    private QuotaType quotaType;
    private AdmissionMode admissionMode;
    private String qualifyingExam;
    private Double qualifyingMarks;
    private String allotmentNumber;
    private String guardianName;
    private String guardianPhone;
    private Long programId;
    private String programName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<DocumentChecklistResponse> documents;
    private AdmissionResponse admission;
}

