package com.sneha.seatmgmtapp.dto.request;

import com.sneha.seatmgmtapp.enums.CourseType;
import com.sneha.seatmgmtapp.enums.EntryType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramRequest {

    @NotBlank(message = "Program name is required")
    private String name;

    private String code;

    @NotNull(message = "Course type is required")
    private CourseType courseType;

    @NotNull(message = "Entry type is required")
    private EntryType entryType;

    @NotNull(message = "Total intake is required")
    @Min(value = 1, message = "Total intake must be at least 1")
    private Integer totalIntake;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Academic Year ID is required")
    private Long academicYearId;

    private Integer supernumerarySeats;
}

