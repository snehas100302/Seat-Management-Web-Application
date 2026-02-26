package com.sneha.seatmgmtapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionRequest {

    @NotBlank(message = "Institution name is required")
    private String name;

    private String code;
    private String address;
    private String contactEmail;
    private String contactPhone;
}

