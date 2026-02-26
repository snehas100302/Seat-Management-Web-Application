package com.sneha.seatmgmtapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampusResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private Long institutionId;
    private String institutionName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

