package com.sneha.seatmgmtapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
    private Long id;
    private String name;
    private String code;
    private Long campusId;
    private String campusName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

