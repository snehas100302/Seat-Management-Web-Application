package com.sneha.seatmgmtapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionResponse {
    private Long id;
    private String name;
    private String code;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<CampusResponse> campuses;
}

