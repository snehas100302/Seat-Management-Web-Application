package com.sneha.seatmgmtapp.dto.response;

import com.sneha.seatmgmtapp.enums.CourseType;
import com.sneha.seatmgmtapp.enums.EntryType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramResponse {
    private Long id;
    private String name;
    private String code;
    private CourseType courseType;
    private EntryType entryType;
    private Integer totalIntake;
    private Integer supernumerarySeats;
    private Long departmentId;
    private String departmentName;
    private Long academicYearId;
    private String academicYearLabel;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<QuotaResponse> quotas;
}

