package com.sneha.seatmgmtapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Represents an academic year (e.g., 2025-2026).
 */
@Entity
@Table(name = "academic_years")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicYear extends BaseEntity {

	@NotNull(message = "Start year is required")
	@Column(name = "start_year", nullable = false)
	private Integer startYear;

	@NotNull(message = "End year is required")
	@Column(name = "end_year", nullable = false)
	private Integer endYear;

	@Column(name = "is_current", nullable = false)
	@Builder.Default
	private Boolean isCurrent = false;

	/**
	 * Returns display label like "2025-2026"
	 */
	public String getLabel() {
		return startYear + "-" + endYear;
	}
}

