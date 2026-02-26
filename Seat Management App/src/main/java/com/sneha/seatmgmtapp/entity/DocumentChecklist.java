package com.sneha.seatmgmtapp.entity;

import com.sneha.seatmgmtapp.enums.DocumentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

/**
 * Tracks individual document submission and verification status for an applicant.
 */
@Entity
@Table(name = "document_checklists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentChecklist extends BaseEntity {

	@NotBlank(message = "Document name is required")
	@Column(name = "document_name", nullable = false)
	private String documentName;

	@Enumerated(EnumType.STRING)
	@JdbcType(value = PostgreSQLEnumJdbcType.class)
	@Column(name = "status", nullable = false)
	@Builder.Default
	private DocumentStatus status = DocumentStatus.PENDING;

	@Column(name = "remarks", length = 500)
	private String remarks;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "applicant_id", nullable = false)
	private Applicant applicant;
}

