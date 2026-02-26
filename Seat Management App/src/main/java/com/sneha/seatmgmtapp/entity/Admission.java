package com.sneha.seatmgmtapp.entity;

import com.sneha.seatmgmtapp.enums.AdmissionStatus;
import com.sneha.seatmgmtapp.enums.FeeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

/**
 * Represents an admission record for an applicant.
 * Contains admission number, fee status, and overall admission status.
 */
@Entity
@Table(name = "admissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admission extends BaseEntity {

	/**
	 * System-generated unique admission number.
	 * Format: INST/YEAR/COURSETYPE/PROGRAMCODE/QUOTA/SERIAL
	 * Example: INST/2026/UG/CSE/KCET/0001
	 * Once generated, it is immutable.
	 */
	@Column(name = "admission_number", unique = true)
	private String admissionNumber;

	@Enumerated(EnumType.STRING)
	@JdbcType(value = PostgreSQLEnumJdbcType.class)
	@Column(name = "admission_status", nullable = false)
	@Builder.Default
	private AdmissionStatus admissionStatus = AdmissionStatus.PENDING;

	@Enumerated(EnumType.STRING)
	@JdbcType(value = PostgreSQLEnumJdbcType.class)
	@Column(name = "fee_status", nullable = false)
	@Builder.Default
	private FeeStatus feeStatus = FeeStatus.PENDING;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "applicant_id", nullable = false, unique = true)
	private Applicant applicant;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "quota_id", nullable = false)
	private Quota quota;
}

