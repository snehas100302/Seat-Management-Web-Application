package com.sneha.seatmgmtapp.entity;

import com.sneha.seatmgmtapp.enums.QuotaType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

/**
 * Represents a quota allocation within a program.
 * Total seats across all quotas for a program must equal the program's totalIntake.
 */
@Entity
@Table(name = "quotas", uniqueConstraints = {
		@UniqueConstraint(columnNames = {"program_id", "quota_type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quota extends BaseEntity {

	@NotNull(message = "Quota type is required")
	@Enumerated(EnumType.STRING)
	@JdbcType(value = PostgreSQLEnumJdbcType.class)
	@Column(name = "quota_type", nullable = false)
	private QuotaType quotaType;

	@NotNull(message = "Total seats is required")
	@Min(value = 0, message = "Total seats must be non-negative")
	@Column(name = "total_seats", nullable = false)
	private Integer totalSeats;

	@Column(name = "filled_seats", nullable = false)
	@Builder.Default
	private Integer filledSeats = 0;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "program_id", nullable = false)
	private Program program;

	/**
	 * Returns the number of available seats in this quota.
	 */
	public Integer getAvailableSeats() {
		return totalSeats - filledSeats;
	}

	/**
	 * Checks if the quota is full.
	 */
	public boolean isFull() {
		return filledSeats >= totalSeats;
	}
}

