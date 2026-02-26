package com.sneha.seatmgmtapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampusRequest {

	@NotBlank(message = "Campus name is required")
	private String name;

	private String code;

	private String address;

	@NotNull(message = "Institution ID is required")
	private Long institutionId;
}

